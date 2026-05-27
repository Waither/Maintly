export interface PreventiveMaintenancePlanRef {
  id: number;
  name: string;
}

export interface PreventiveMaintenancePlan {
  id: number;
  title: string;
  description: string;
  intervalDays: number;
  isActive: boolean;
  nextDueAt: string | null;
  lastGeneratedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  equipment: PreventiveMaintenancePlanRef;
  priority: PreventiveMaintenancePlanRef;
  createdBy: PreventiveMaintenancePlanRef;
}

export interface PreventiveMaintenancePlanCreatePayload {
  title: string;
  description?: string;
  intervalDays: number;
  isActive?: boolean;
  equipmentId: number;
  priorityId: number;
  nextDueAt?: string;
}

export interface PreventiveMaintenanceRunDueResult {
  generated: number;
  plans: Array<{
    id: number;
    title: string;
    workOrderId: number;
    nextDueAt: string | null;
  }>;
}
