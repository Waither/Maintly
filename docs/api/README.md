# API Documentation

## Swagger UI

Interactive API documentation available at:
**http://localhost:8000/api/doc**

OpenAPI JSON specification:
**http://localhost:8000/api/doc.json**

## Authentication

All API endpoints (except `/api/login`, `/api/register`) require JWT Bearer token:

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@maintly.com", "password": "admin123"}'

# Response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { "id": 1, "email": "admin@maintly.com" }
}

# Use token in requests
curl -X GET http://localhost:8000/api/equipment \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## API Modules

### 1. Authentication (`/api`)
- `POST /api/login` - User login
- `POST /api/register` - User registration

### 2. Users (`/api/users`)
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user (admin/manager)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### 3. Roles (`/api/roles`)
- `GET /api/roles` - List all roles
- `GET /api/roles/select` - Simplified list for dropdowns
- `GET /api/roles/{id}` - Get role details
- `POST /api/roles` - Create role (admin)
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role

### 4. Equipment (`/api/equipment`)
- `GET /api/equipment` - List equipment
- `GET /api/equipment/{id}` - Get equipment details
- `POST /api/equipment` - Create equipment (admin/manager)
- `PUT /api/equipment/{id}` - Update equipment (admin/manager)
- `PATCH /api/equipment/{id}` - Partial update (admin/manager)
- `DELETE /api/equipment/{id}` - Soft delete (admin/manager)
- `POST /api/equipment/{id}/tags` - Assign tag (admin/manager)
- `DELETE /api/equipment/{equipmentId}/tags/{tagId}` - Remove tag

### 5. Tags (`/api/tags`)
- `GET /api/tags` - List tags (filter by tag_group_id)
- `POST /api/tags` - Create tag (admin/manager)
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

### 6. Tag Groups (`/api/tag-groups`)
- `GET /api/tag-groups` - List tag groups
- `POST /api/tag-groups` - Create group (admin/manager)
- `PUT /api/tag-groups/{id}` - Update group
- `DELETE /api/tag-groups/{id}` - Delete group

### 7. Custom Fields (`/api/equipment-custom-fields`)
- `GET /api/equipment-custom-fields` - List custom fields
- `POST /api/equipment-custom-fields` - Create field (admin/manager)
- `DELETE /api/equipment-custom-fields/{id}` - Delete field
- `POST /api/equipment-custom-fields/values` - Set value for equipment

### 8. Translations (`/api/translations`)
- `GET /api/translations/{locale}` - Get translations (pl, en, de)

### 9. Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Dashboard statistics

## Permissions

Role-based access control:

| Role | User Management | Equipment CRUD | View Equipment | View WorkOrders |
|------|----------------|----------------|----------------|-----------------|
| **admin** | ✅ All | ✅ Full | ✅ All | ✅ All |
| **manager** | ✅ Create/Edit technician, provider, reporter | ✅ Full | ✅ All | ✅ All |
| **technician** | ❌ | ❌ | ✅ All | ✅ All |
| **provider** | ❌ | ❌ | ✅ All | ✅ Only own |
| **reporter** | ❌ | ❌ | ✅ All | ✅ All (read-only) |

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "code": 400,
  "message": "validation.field_required"
}
```

## Rate Limiting

Login endpoint has rate limiting:
- **5 attempts per 15 minutes** per IP address

## CORS

Configured for development:
- Allowed origins: `http://localhost:*`
- Allowed methods: GET, POST, PUT, PATCH, DELETE
- Allowed headers: Content-Type, Authorization

## Testing API

### Postman Collection
*(Coming soon)*

### cURL Examples

```bash
# List equipment
curl -X GET http://localhost:8000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create equipment
curl -X POST http://localhost:8000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prasa hydrauliczna H-500",
    "costCenter": 489330,
    "parentEquipmentId": null
  }'

# Assign tag to equipment
curl -X POST http://localhost:8000/api/equipment/1/tags \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tagId": 5}'
```
