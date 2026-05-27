import apiClient from '../lib/axios';
import {
  PreventiveMaintenancePlan,
  PreventiveMaintenancePlanCreatePayload,
  PreventiveMaintenanceRunDueResult,
} from '../types/preventive';

const BASE_URL = '/preventive-plans';

export const getPlans = async (): Promise<PreventiveMaintenancePlan[]> => {
  const response = await apiClient.get(BASE_URL);
  return response.data?.data || response.data || [];
};

export const createPlan = async (
  payload: PreventiveMaintenancePlanCreatePayload,
): Promise<PreventiveMaintenancePlan> => {
  const response = await apiClient.post(BASE_URL, payload);
  return response.data?.data || response.data;
};

export const updatePlan = async (
  id: number,
  payload: Partial<PreventiveMaintenancePlanCreatePayload>,
): Promise<PreventiveMaintenancePlan> => {
  const response = await apiClient.patch(`${BASE_URL}/${id}`, payload);
  return response.data?.data || response.data;
};

export const deletePlan = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

export const generatePlanWorkOrder = async (id: number): Promise<void> => {
  await apiClient.post(`${BASE_URL}/${id}/generate`);
};

export const runDuePlans = async (): Promise<PreventiveMaintenanceRunDueResult> => {
  const response = await apiClient.post(`${BASE_URL}/run-due`);
  return response.data?.data || response.data;
};

export default {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  generatePlanWorkOrder,
  runDuePlans,
};
