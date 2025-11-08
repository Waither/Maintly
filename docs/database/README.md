# Database Schema Documentation

## Overview
Maintly CMMS database schema with complete entity relationship diagram.

## Viewing the Diagram

### Online (Recommended)
1. Copy content from `schema.puml`
2. Visit https://www.plantuml.com/plantuml/uml/
3. Paste and view

### VS Code
1. Install extension: **PlantUML** by jebbs
2. Open `schema.puml`
3. Press `Alt+D` to preview

### Export to Image
```bash
# Install PlantUML (requires Java)
java -jar plantuml.jar schema.puml

# Or use online converter
# https://www.plantuml.com/plantuml/
```

## Database Modules

### 1. User Management
- `users` - System users
- `user_roles` - Roles: admin, manager, technician, provider, reporter

### 2. Equipment Module
- `equipment` - Equipment registry with hierarchy
- `tags` / `tag_groups` - Categorization system
- `equipment_tags` - N:M Equipment ↔ Tags
- `equipment_custom_fields` - Global custom field definitions
- `equipment_custom_values` - Per-equipment custom values (EAV pattern)
- `equipment_files` - File attachments

### 3. Work Order Module
- `work_orders` - Maintenance work orders
- `work_order_statuses` - Status dictionary (open, in_progress, completed, etc.)
- `work_order_priorities` - Priority levels (low, medium, high, critical)
- `work_order_assignments` - N:M Users assigned to work orders
- `work_order_tags` - N:M Tags for work orders
- `work_order_activities` - Activity log / subtasks
- `work_order_files` - File attachments

### 4. Translations
- `translations` - Multi-language support (pl, en, de)

## Key Features

### Auto-Generated Identifiers
- **Equipment**: `qr_code_data` → `EQ-{6 digits}` (auto-generated on insert)
- **WorkOrder**: `unique_code` → `WO-{8 hex}` (auto-generated on insert)

### Soft Deletes
Tables with `deleted_at` column:
- equipment
- equipment_custom_fields
- equipment_files
- work_orders
- work_order_activities
- work_order_files

### Hierarchical Structures
- **Equipment**: Self-referencing `parent_equipment_id` for equipment hierarchy

### Time Tracking
- **Equipment**: `direct_work_time` + `total_work_time` (minutes)
- **WorkOrder Activities**: `time_spent` (minutes per activity)

## Database Migrations

Located in: `backend/migrations/`

Current migrations:
- `Version20251108180517.php` - Equipment module tables
- *(WorkOrder migration pending)*

### Run Migrations
```bash
# From main directory
docker exec maintly-backend php bin/console doctrine:migrations:migrate

# Or from backend directory
php bin/console doctrine:migrations:migrate
```

### Generate New Migration
```bash
docker exec maintly-backend php bin/console doctrine:migrations:diff
```

## Entity Files

Backend entities location: `backend/src/Entity/`

### Equipment Module
- Equipment.php
- Tag.php
- TagGroup.php
- EquipmentTag.php
- EquipmentCustomField.php
- EquipmentCustomValue.php
- EquipmentFile.php

### WorkOrder Module
- WorkOrder.php
- WorkOrderStatus.php
- WorkOrderPriority.php
- WorkOrderAssignment.php
- WorkOrderTag.php
- WorkOrderActivity.php
- WorkOrderFile.php

## DBML Alternative

For those who prefer DBML, see: `schema.dbml`

Use at: https://dbdiagram.io/d
