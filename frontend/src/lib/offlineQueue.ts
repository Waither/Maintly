export interface OfflineQueueItem {
    id: number;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers: Record<string, string>;
    body: string | null;
    createdAt: string;
}

const OFFLINE_DB_NAME = 'maintly-offline-db';
const OFFLINE_DB_VERSION = 1;
const OFFLINE_QUEUE_STORE = 'requestQueue';
const LAST_SYNC_AT_KEY = 'offline_queue_last_sync_at';
const LAST_SYNC_ERROR_KEY = 'offline_queue_last_sync_error';
let onlineSyncListenerAttached = false;
let periodicSyncIntervalId: number | null = null;
let isSyncInProgress = false;

const normalizeBearerToken = (tokenOrHeader?: string | null): string | null => {
    if (!tokenOrHeader || typeof tokenOrHeader !== 'string') {
        return null;
    }

    const trimmed = tokenOrHeader.trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.toLowerCase().startsWith('bearer ') ? trimmed.slice(7).trim() : trimmed;
};

const getApiBaseUrl = (): string => {
    const fallback = 'http://localhost:8000/api';
    const raw = import.meta.env.VITE_API_URL;

    if (!raw || typeof raw !== 'string') {
        return fallback;
    }

    const trimmed = raw.trim().replace(/\/+$/, '');

    if (trimmed.startsWith('/')) {
        const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const isLocalPreviewPort = ['4173', '4174', '5173', '5174'].includes(window.location.port);
        if (isLocalHost && isLocalPreviewPort) {
            return `http://${window.location.hostname}:8000${trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`}`;
        }

        const sameOriginBase = `${window.location.origin}${trimmed}`;
        return sameOriginBase.endsWith('/api') ? sameOriginBase : `${sameOriginBase}/api`;
    }

    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const toApiUrl = (rawUrl: string): string => {
    const apiBase = getApiBaseUrl();
    const joinApiBase = (pathWithQuery: string): string => {
        const clean = pathWithQuery.replace(/^\/+/, '');
        return clean ? `${apiBase}/${clean}` : apiBase;
    };
    const trimmed = rawUrl.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const parsed = new URL(trimmed);
        const pathWithQuery = `${parsed.pathname}${parsed.search}`;

        if (pathWithQuery.startsWith('/api/')) {
            // Keep only path/query and rebase on configured API host.
            return joinApiBase(pathWithQuery.replace(/^\/api\/?/, ''));
        }

        if (pathWithQuery === '/api') {
            return apiBase;
        }

        return joinApiBase(pathWithQuery);
    }

    if (trimmed.startsWith('/api/')) {
        return joinApiBase(trimmed.replace(/^\/api\/?/, ''));
    }

    if (trimmed === '/api') {
        return apiBase;
    }

    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return joinApiBase(cleanPath);
};

const openOfflineDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);

        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(OFFLINE_QUEUE_STORE)) {
                db.createObjectStore(OFFLINE_QUEUE_STORE, { keyPath: 'id' });
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};

const getQueuedRequests = async (): Promise<OfflineQueueItem[]> => {
    const db = await openOfflineDb();

    const items = await new Promise<OfflineQueueItem[]>((resolve, reject) => {
        const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readonly');
        const store = tx.objectStore(OFFLINE_QUEUE_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []) as OfflineQueueItem[]);
        req.onerror = () => reject(req.error);
    });

    db.close();
    return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const getQueuedRequestCount = async (): Promise<number> => {
    const queued = await getQueuedRequests();
    return queued.length;
};

export const getQueuedRequestSnapshot = async (): Promise<OfflineQueueItem[]> => {
    return getQueuedRequests();
};

const removeQueuedRequest = async (id: number): Promise<void> => {
    const db = await openOfflineDb();

    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
        tx.objectStore(OFFLINE_QUEUE_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });

    db.close();
};

export const syncQueuedRequestsFallback = async (): Promise<void> => {
    if (!navigator.onLine || isSyncInProgress) {
        return;
    }

    isSyncInProgress = true;

    try {
        const queued = await getQueuedRequests();

        for (const item of queued) {
            try {
                let normalizedBody = item.body;

                // Backward compatibility for previously double-stringified payloads.
                if (typeof normalizedBody === 'string' && normalizedBody.startsWith('"{')) {
                    try {
                        const parsed = JSON.parse(normalizedBody);
                        if (typeof parsed === 'string') {
                            normalizedBody = parsed;
                        }
                    } catch {
                        // Keep original body if parsing fails.
                    }
                }

                const headers = { ...(item.headers || {}) };
                const tokenFromStorage = normalizeBearerToken(localStorage.getItem('auth_token'));
                const hasAuthorization = Boolean(headers.Authorization || headers.authorization);

                if (!hasAuthorization && tokenFromStorage) {
                    headers.Authorization = `Bearer ${tokenFromStorage}`;
                }

                const response = await fetch(toApiUrl(item.url), {
                    method: item.method,
                    headers,
                    body: normalizedBody,
                });

                if (response.ok) {
                    await removeQueuedRequest(item.id);
                    localStorage.setItem(LAST_SYNC_AT_KEY, new Date().toISOString());
                    localStorage.removeItem(LAST_SYNC_ERROR_KEY);
                } else {
                    let responseBody = '';
                    try {
                        responseBody = await response.text();
                    } catch {
                        responseBody = '';
                    }

                    const errorSnapshot = {
                        at: new Date().toISOString(),
                        status: response.status,
                        statusText: response.statusText,
                        url: toApiUrl(item.url),
                        method: item.method,
                        queueItemId: item.id,
                        responseBody: responseBody.slice(0, 1500),
                    };

                    localStorage.setItem(LAST_SYNC_ERROR_KEY, JSON.stringify(errorSnapshot));
                    console.error('Offline queue sync failed:', errorSnapshot);
                    break;
                }
            } catch {
                const errorSnapshot = {
                    at: new Date().toISOString(),
                    status: null,
                    statusText: 'network_error',
                    url: toApiUrl(item.url),
                    method: item.method,
                    queueItemId: item.id,
                    responseBody: null,
                };
                localStorage.setItem(LAST_SYNC_ERROR_KEY, JSON.stringify(errorSnapshot));
                console.error('Offline queue sync network error:', errorSnapshot);
                break;
            }
        }
    } finally {
        isSyncInProgress = false;
    }
};

export const ensureOfflineQueueAutoSync = (): void => {
    if (onlineSyncListenerAttached) {
        return;
    }

    const triggerSync = () => {
        syncQueuedRequestsFallback().catch(() => {
            // Silent fallback: SW sync or next online event will retry.
        });
    };

    window.addEventListener('online', triggerSync);

    // Some browsers/devtools transitions may skip online event in edge cases.
    window.addEventListener('focus', triggerSync);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            triggerSync();
        }
    });

    if (periodicSyncIntervalId === null) {
        periodicSyncIntervalId = window.setInterval(() => {
            triggerSync();
        }, 10000);
    }

    // Run once on startup in case queue already exists.
    triggerSync();

    onlineSyncListenerAttached = true;
};

export const getOfflineQueueLastSyncAt = (): string | null => {
    return localStorage.getItem(LAST_SYNC_AT_KEY);
};

export interface OfflineQueueSyncErrorSnapshot {
    at: string;
    status: number | null;
    statusText: string;
    url: string;
    method: string;
    queueItemId: number;
    responseBody: string | null;
}

export const getOfflineQueueLastSyncError = (): OfflineQueueSyncErrorSnapshot | null => {
    const raw = localStorage.getItem(LAST_SYNC_ERROR_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as OfflineQueueSyncErrorSnapshot;
    } catch {
        return null;
    }
};

export const queueApiMutationFallback = async (
    rawUrl: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body: unknown,
    token?: string | null,
): Promise<void> => {
    const normalizedToken = normalizeBearerToken(token);

    const queueItem: OfflineQueueItem = {
        id: Date.now() + Math.random(),
        url: toApiUrl(rawUrl),
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(normalizedToken ? { Authorization: `Bearer ${normalizedToken}` } : {}),
        },
        body: body == null ? null : (typeof body === 'string' ? body : JSON.stringify(body)),
        createdAt: new Date().toISOString(),
    };

    const db = await openOfflineDb();

    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
        tx.objectStore(OFFLINE_QUEUE_STORE).add(queueItem);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });

    db.close();

    // Best effort: ask SW to sync immediately when it controls the page.
    if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SYNC_NOW' });
    }

    // Page-level fallback replay in case SW does not process sync events.
    ensureOfflineQueueAutoSync();
};

export const queueApiMutationFromAxios = async (
    url: string,
    method: string,
    data: unknown,
    authHeader?: string,
): Promise<void> => {
    const normalizedMethod = method.toUpperCase();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(normalizedMethod)) {
        return;
    }

    let normalizedData = data;

    // Axios may provide already-stringified JSON or even double-encoded JSON string.
    if (typeof normalizedData === 'string') {
        try {
            const parsed = JSON.parse(normalizedData);
            normalizedData = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
        } catch {
            // Keep original value if not valid JSON.
        }
    }

    await queueApiMutationFallback(
        url,
        normalizedMethod as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        normalizedData,
        authHeader || null,
    );
};
