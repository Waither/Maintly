/**
 * Services Index
 * Central export for all API services
 */

export * as dashboardService from './dashboardService';
export * as workOrderService from './workOrderService';
export * as equipmentService from './equipmentService';
export * as userService from './userService';
export * as notificationService from './notificationService';
export * as reportService from './reportService';
export * as auditLogService from './auditLogService';

// Default exports for convenience
export { default as dashboardApi } from './dashboardService';
export { default as workOrderApi } from './workOrderService';
export { default as equipmentApi } from './equipmentService';
export { default as userApi } from './userService';
export { default as notificationApi } from './notificationService';
export { default as reportApi } from './reportService';
export { default as auditLogApi } from './auditLogService';
