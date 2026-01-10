/**
 * User Types
 */

import { BaseEntity } from './common';

export interface UserRole {
    id: number;
    name: string;
    description?: string;
}

export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    isActive: boolean;
    roles: UserRole[];
    lastLoginAt?: string;
}

export interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password?: string;
    isActive: boolean;
    roles: number[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}
