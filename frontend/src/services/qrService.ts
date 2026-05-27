/**
 * QR Service
 * Resolves EQ- / WO- codes to entity redirect URLs via backend API.
 */

import apiClient from '../lib/axios';

export interface QrResolveResult {
    type: 'equipment' | 'work_order';
    id: number;
    code: string;
    name?: string;
    title?: string;
    url: string;
}

export const resolveCode = async (code: string): Promise<QrResolveResult> => {
    const response = await apiClient.get<QrResolveResult>('/qr/resolve', {
        params: { code },
    });
    return response.data;
};
