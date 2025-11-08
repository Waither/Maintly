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

### 8. Work Orders (`/api/work-orders`)
**Statuses (admin only CRUD):**
- `GET /api/work-orders/statuses` - List statuses (all users)
- `POST /api/work-orders/statuses` - Create status (admin only)
- `PUT /api/work-orders/statuses/{id}` - Update status (admin only)
- `DELETE /api/work-orders/statuses/{id}` - Delete status (admin only)

**Priorities (admin only CRUD):**
- `GET /api/work-orders/priorities` - List priorities (all users)
- `POST /api/work-orders/priorities` - Create priority (admin only)
- `PUT /api/work-orders/priorities/{id}` - Update priority (admin only)
- `DELETE /api/work-orders/priorities/{id}` - Delete priority (admin only)

**Work Orders:**
- `GET /api/work-orders` - List work orders (provider: only own)
- `GET /api/work-orders/{id}` - Get work order details
- `POST /api/work-orders` - Create work order (admin/manager/technician/provider)
- `PUT /api/work-orders/{id}` - Update work order
- `PATCH /api/work-orders/{id}` - Partial update
- `DELETE /api/work-orders/{id}` - Delete work order (admin/manager)
- `POST /api/work-orders/{id}/assign` - Assign user to work order
- `POST /api/work-orders/{id}/activities` - Add activity log entry

### 9. Translations (`/api/translations`)
- `GET /api/translations/{locale}` - Get translations (pl, en, de)

### 10. Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Dashboard statistics

## Permissions

Role-based access control:

| Role | User Management | Equipment CRUD | View Equipment | WorkOrder Create | WorkOrder Edit | WorkOrder Delete | WorkOrder View | Add Activity | Status/Priority CRUD |
|------|----------------|----------------|----------------|------------------|----------------|------------------|----------------|--------------|----------------------|
| **admin** | ✅ All | ✅ Full | ✅ All | ✅ | ✅ All | ✅ | ✅ All | ✅ All | ✅ Full |
| **manager** | ✅ Create/Edit tech/prov/rep | ✅ Full | ✅ All | ✅ | ✅ All | ✅ | ✅ All | ✅ All | ❌ View only |
| **technician** | ❌ | ❌ | ✅ All | ✅ | ✅ All | ❌ | ✅ All | ✅ All | ❌ View only |
| **provider** | ❌ | ❌ | ✅ All | ✅ | ✅ Own only | ❌ | ✅ Own only | ✅ Own only | ❌ View only |
| **reporter** | ❌ | ❌ | ✅ All | ✅ | ❌ | ❌ | ✅ All (read-only) | ❌ | ❌ View only |

**Notes:**
- **Reporter**: Can create work orders (incident reporting) but CANNOT edit or add activities
- **Technician**: Full access to all work orders (create, edit all), can add activities, cannot delete
- **Provider**: Can only view/edit work orders they created, can add activities to own work orders
- **Status/Priority**: Only admin can create/edit/delete, all users can view
- **Activities**: Requires WORKORDER_EDIT permission (reporter cannot add)

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
