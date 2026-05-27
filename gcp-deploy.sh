#!/usr/bin/env bash

set -Eeuo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

fail() {
  echo "[ERROR] $*" >&2
  exit 1
}

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  fail "Nie znaleziono Docker Compose (docker compose ani docker-compose)."
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$SCRIPT_DIR}"
BRANCH="${BRANCH:-main}"
REMOTE="${REMOTE:-origin}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"

if [[ -n "${COMPOSE_FILE:-}" ]]; then
  COMPOSE_ARGS="-f ${COMPOSE_FILE}"
elif [[ -f "$APP_DIR/docker-compose.prod.yml" ]]; then
  COMPOSE_ARGS="-f docker-compose.prod.yml"
else
  COMPOSE_ARGS="-f docker-compose.yml"
fi

log "Deployment startuje w katalogu: $APP_DIR"
cd "$APP_DIR"

[[ -d .git ]] || fail "Katalog $APP_DIR nie jest repozytorium git."

log "Pobieram najnowsze zmiany z $REMOTE/$BRANCH"
git fetch "$REMOTE" "$BRANCH"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  log "Przełączam branch: $CURRENT_BRANCH -> $BRANCH"
  git checkout "$BRANCH"
fi

log "Aktualizuję kod (git pull --ff-only)"
git pull --ff-only "$REMOTE" "$BRANCH"

log "Buduję i uruchamiam kontenery"
$DC $COMPOSE_ARGS up -d --build --remove-orphans

if [[ "$RUN_MIGRATIONS" == "true" ]]; then
  log "Uruchamiam migracje bazy danych"
  $DC $COMPOSE_ARGS exec -T backend php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

  log "Czyszczę i rozgrzewam cache Symfony (prod)"
  $DC $COMPOSE_ARGS exec -T backend php bin/console cache:clear --env=prod --no-warmup
  $DC $COMPOSE_ARGS exec -T backend php bin/console cache:warmup --env=prod
fi

log "Status usług"
$DC $COMPOSE_ARGS ps

log "Deployment zakończony pomyślnie"
git --no-pager log -1 --pretty='format:Wdrożony commit: %h %s (%ci)'
echo