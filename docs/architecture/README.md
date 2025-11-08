# Maintly CMMS - Architecture

## Tech Stack

### Backend
- **Framework**: Symfony 7.x
- **Language**: PHP 8.4
- **Database**: MySQL 8.0
- **ORM**: Doctrine
- **API**: RESTful JSON API
- **Authentication**: JWT (LexikJWTAuthenticationBundle)
- **Documentation**: OpenAPI 3.0 / Swagger (NelmioApiDocBundle)
- **Pattern**: CQRS (Command Query Responsibility Segregation)

### Frontend
- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Library**: *(TBD)*

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Development**: Docker with hot reload

## Architecture Patterns

### CQRS (Command Query Responsibility Segregation)

Separation of read and write operations:

```
Commands (Write)          Queries (Read)
     ↓                         ↓
  Handler                   Handler
     ↓                         ↓
  Repository               Repository
     ↓                         ↓
  Database                  Database
```

#### Commands
- Create, Update, Delete operations
- Located in: `backend/src/Application/Command/`
- Example: `CreateEquipmentCommand` + `CreateEquipmentHandler`

#### Queries
- Read operations (GET)
- Located in: `backend/src/Application/Query/`
- Example: `GetAllEquipmentQuery` + `GetAllEquipmentHandler`

### Folder Structure

```
backend/
├── src/
│   ├── Application/
│   │   ├── Command/        # Write operations
│   │   │   ├── Equipment/
│   │   │   ├── Tag/
│   │   │   └── WorkOrder/
│   │   └── Query/          # Read operations
│   │       ├── Equipment/
│   │       ├── Tag/
│   │       └── WorkOrder/
│   ├── Controller/         # API endpoints
│   ├── Entity/             # Doctrine entities
│   ├── Repository/         # Database queries
│   ├── Security/
│   │   └── Voter/          # Authorization logic
│   ├── Service/            # Business logic
│   └── EventListener/      # Event handlers
├── config/                 # Symfony configuration
├── migrations/             # Database migrations
├── public/                 # Entry point
└── tests/                  # Unit/Integration tests

frontend/
├── src/
│   ├── components/         # Vue components
│   ├── views/              # Page views
│   ├── stores/             # Pinia stores
│   ├── router/             # Vue Router
│   ├── services/           # API services
│   └── types/              # TypeScript types
└── public/                 # Static assets
```

## Security

### Authentication
- **JWT Tokens**: Generated on login, stored in localStorage
- **Token Expiration**: 1 hour (configurable)
- **Refresh Tokens**: *(Coming soon)*

### Authorization
- **Voters**: Custom authorization logic per resource
  - `UserManagementVoter` - User CRUD permissions
  - `EquipmentVoter` - Equipment CRUD permissions
  - *(WorkOrderVoter - Coming soon)*

### Role Hierarchy
```
admin (level 1)
  ├── manager (level 2)
  │   ├── technician (level 3)
  │   ├── provider (level 4)
  │   └── reporter (level 5)
```

### Security Features
- **Password Hashing**: bcrypt
- **CORS**: Configured for local development
- **Rate Limiting**: Login endpoint (5 attempts / 15 min)
- **Soft Deletes**: Sensitive data not permanently deleted
- **Input Validation**: Symfony Validator

## API Design

### RESTful Principles
- **Resources**: `/api/equipment`, `/api/work-orders`
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500
- **Content-Type**: `application/json`

### Response Format
```json
{
  "status": "success|error",
  "code": 200,
  "message": "optional.translation.key",
  "data": { ... }
}
```

### Error Handling
- Centralized error handling via `ApiExceptionListener`
- Translatable error messages
- Consistent error structure

## Database Design

### Key Concepts

1. **Soft Deletes**: `deleted_at` timestamp
2. **Audit Trail**: `created_by`, `updated_by`, `created_at`, `updated_at`
3. **Auto-Generated IDs**: 
   - Equipment: `EQ-{6 digits}`
   - WorkOrder: `WO-{8 hex}`
4. **Hierarchical Data**: Self-referencing foreign keys (equipment parent)
5. **EAV Pattern**: `equipment_custom_fields` + `equipment_custom_values`

### Relationships
- **1:N** - User → Equipment (created_by)
- **N:M** - Equipment ↔ Tags (equipment_tags pivot)
- **Self-Reference** - Equipment → Equipment (parent)

## Development Workflow

### Docker Commands
```bash
# Start containers
docker-compose up -d

# Backend shell
docker exec -it maintly-backend bash

# Run migrations
docker exec maintly-backend php bin/console doctrine:migrations:migrate

# Clear cache
docker exec maintly-backend php bin/console cache:clear

# Generate migration
docker exec maintly-backend php bin/console doctrine:migrations:diff
```

### Code Quality
```bash
# PHPStan (static analysis)
cd backend
.\scripts\stan.ps1

# PHP CS Fixer (code style)
.\scripts\fix.ps1

# All checks
.\scripts\all.ps1
```

## Deployment

### Environment Variables
```env
# Backend (.env)
DATABASE_URL=mysql://user:password@host:3306/maintly
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
APP_ENV=prod
```

### Production Checklist
- [ ] Set `APP_ENV=prod`
- [ ] Generate JWT keys
- [ ] Configure database credentials
- [ ] Set strong `APP_SECRET`
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up backup strategy
- [ ] Configure logging
- [ ] Set up monitoring

## Performance Optimization

### Database
- Indexes on foreign keys
- Query result caching
- Connection pooling

### API
- Pagination on list endpoints
- Response caching (HTTP Cache headers)
- Lazy loading for collections

### Frontend
- Code splitting
- Asset optimization
- Service Worker (PWA)

## Testing Strategy

### Backend
- **Unit Tests**: Business logic, Services
- **Integration Tests**: API endpoints, Database
- **Functional Tests**: Complete user flows

### Frontend
- **Unit Tests**: Components, Stores
- **E2E Tests**: Cypress *(planned)*

## CI/CD

*(Coming soon)*

- Automated testing on PR
- Code quality checks
- Automated deployment
