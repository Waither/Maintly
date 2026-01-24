/**
 * Auth Context
 * Provides current user data and role-based permissions
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient, { getAuthToken, removeAuthToken } from '../lib/axios';

// Role hierarchy - lower number = more permissions
export type UserRole = 'admin' | 'manager' | 'technician' | 'provider' | 'reporter';

export const ROLE_LEVELS: Record<UserRole, number> = {
    admin: 1,
    manager: 2,
    technician: 3,
    provider: 4,
    reporter: 5,
};

export interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    fullName?: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastLoginAt?: string;
}

export interface Permissions {
    // Navigation permissions
    canAccessUsers: boolean;
    canAccessAuditLogs: boolean;
    canAccessReports: boolean;
    canAccessEquipment: boolean;
    canAccessWorkOrders: boolean;
    
    // CRUD permissions
    canManageUsers: boolean;
    canManageEquipment: boolean;
    canManageWorkOrders: boolean;
    canDeleteWorkOrders: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    permissions: Permissions;
    hasRole: (requiredRole: UserRole) => boolean;
    hasMinRole: (minRole: UserRole) => boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const defaultPermissions: Permissions = {
    canAccessUsers: false,
    canAccessAuditLogs: false,
    canAccessReports: false,
    canAccessEquipment: false,
    canAccessWorkOrders: false,
    canManageUsers: false,
    canManageEquipment: false,
    canManageWorkOrders: false,
    canDeleteWorkOrders: false,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * Calculate permissions based on user role
 */
const calculatePermissions = (role: UserRole | null): Permissions => {
    if (!role) return defaultPermissions;

    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isTechnician = role === 'technician';
    const isProvider = role === 'provider';
    // Reporter has most limited access

    return {
        // Navigation - who can see what in sidebar
        canAccessUsers: isAdmin || isManager,
        canAccessAuditLogs: isAdmin,
        canAccessReports: isAdmin || isManager || isTechnician,
        canAccessEquipment: true, // Everyone can view equipment
        canAccessWorkOrders: true, // Everyone can view work orders

        // User management
        canManageUsers: isAdmin || isManager,

        // Equipment CRUD - admin/manager only
        canManageEquipment: isAdmin || isManager,

        // Work orders
        canManageWorkOrders: isAdmin || isManager || isTechnician || isProvider,
        canDeleteWorkOrders: isAdmin || isManager,
    };
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);

    const fetchUser = useCallback(async () => {
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setPermissions(defaultPermissions);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/me');
            const data = response.data?.data || response.data;
            
            const userData: AuthUser = {
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role as UserRole,
                fullName: data.fullName || `${data.firstName} ${data.lastName}`,
                phone: data.phone,
                isActive: data.isActive,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                lastLoginAt: data.lastLoginAt,
            };
            
            setUser(userData);
            setPermissions(calculatePermissions(userData.role));
        } catch (err) {
            console.error('Failed to fetch user:', err);
            // Token might be invalid
            removeAuthToken();
            setUser(null);
            setPermissions(defaultPermissions);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const hasRole = useCallback((requiredRole: UserRole): boolean => {
        return user?.role === requiredRole;
    }, [user]);

    const hasMinRole = useCallback((minRole: UserRole): boolean => {
        if (!user?.role) return false;
        return ROLE_LEVELS[user.role] <= ROLE_LEVELS[minRole];
    }, [user]);

    const logout = useCallback(() => {
        removeAuthToken();
        setUser(null);
        setPermissions(defaultPermissions);
        window.location.href = '/login';
    }, []);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            permissions,
            hasRole,
            hasMinRole,
            refreshUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
