/**
 * Report Service
 * API calls for report generation and management
 */

import apiClient from '../lib/axios';
import { Report, ReportGenerateRequest, ReportFilters, PaginatedResponse } from '../types';

const BASE_URL = '/reports';

/**
 * Get all reports for current user
 */
export const getReports = async (
    page: number = 1, 
    limit: number = 10, 
    filters?: ReportFilters
): Promise<PaginatedResponse<Report>> => {
    const params = { page, limit, ...filters };
    const response = await apiClient.get(BASE_URL, { params });
    
    // Backend may return various formats
    const raw = response.data;
    const apiData = raw?.data ?? raw;

    const reports =
        Array.isArray(apiData) ? apiData :
        Array.isArray(apiData?.reports) ? apiData.reports :
        Array.isArray(apiData?.data) ? apiData.data :
        [];

    const pagination = apiData?.pagination || { page, limit, total: reports.length, totalPages: 1 };
    
    return {
        data: Array.isArray(reports) ? reports : [],
        pagination: {
            page: pagination.currentPage || pagination.page || page,
            limit: pagination.itemsPerPage || pagination.limit || limit,
            total: pagination.totalItems || pagination.total || 0,
            totalPages: pagination.totalPages || 1,
        }
    };
};

/**
 * Get single report by ID
 */
export const getReport = async (id: number): Promise<Report> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
};

/**
 * Generate new report (async)
 */
export const generateReport = async (data: ReportGenerateRequest): Promise<Report> => {
    const response = await apiClient.post(`${BASE_URL}/generate`, data);
    return response.data.data || response.data;
};

/**
 * Download report file
 */
export const downloadReport = async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`${BASE_URL}/${id}/download`, {
        responseType: 'blob'
    });
    return response.data;
};

/**
 * Download report with automatic file save
 */
export const downloadReportFile = async (id: number, fileName: string): Promise<void> => {
    const blob = await downloadReport(id);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Delete report
 */
export const deleteReport = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Get available report types
 */
export const getReportTypes = async (): Promise<Array<{ value: string; label: string }>> => {
    // Backend supports: maintenance, equipment, users
    return [
        { value: 'maintenance', label: 'Raport konserwacji' },
        { value: 'equipment', label: 'Raport sprzętu' },
        { value: 'users', label: 'Raport użytkowników' },
    ];
};

/**
 * Get available report formats
 */
export const getReportFormats = async (): Promise<Array<{ value: string; label: string }>> => {
    return [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'csv', label: 'CSV' },
    ];
};

export default {
    getReports,
    getReport,
    generateReport,
    downloadReport,
    downloadReportFile,
    deleteReport,
    getReportTypes,
    getReportFormats,
};
