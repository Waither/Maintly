import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ToastProvider } from '../components/ui';
import { AuthProvider } from '../contexts';
import { 
    Dashboard, 
    Login, 
    WorkOrderList, 
    WorkOrderDetail, 
    WorkOrderForm,
    EquipmentList,
    EquipmentForm,
    EquipmentDetail,
    UserList,
    UserForm,
    UserDetail,
    ReportList,
    AuditLogList,
    Profile
} from '../pages';
import '../styles/sidebar.css';

/**
 * Main Application Component
 * SPA with React Router and JWT Authentication
 * Role-based access control via AuthContext
 * 
 * - /login - public route
 * - / and all other routes - protected (require auth token)
 * - Some routes require specific permissions
 */
function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Public route - Login */}
                        <Route path="/login" element={<Login />} />
                        
                        {/* Protected routes - require authentication */}
                        <Route element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/" element={<Dashboard />} />
                            
                            {/* Work Orders - everyone can access */}
                            <Route path="/work-orders" element={<WorkOrderList />} />
                            <Route path="/work-orders/new" element={<WorkOrderForm />} />
                            <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
                            <Route path="/work-orders/:id/edit" element={<WorkOrderForm />} />
                            
                            {/* Equipment - everyone can view */}
                            <Route path="/equipment" element={<EquipmentList />} />
                            <Route path="/equipment/new" element={
                                <ProtectedRoute requiredPermission="canManageEquipment">
                                    <EquipmentForm />
                                </ProtectedRoute>
                            } />
                            <Route path="/equipment/:id" element={<EquipmentDetail />} />
                            <Route path="/equipment/:id/edit" element={
                                <ProtectedRoute requiredPermission="canManageEquipment">
                                    <EquipmentForm />
                                </ProtectedRoute>
                            } />
                            
                            {/* Users - admin/manager only */}
                            <Route path="/users" element={
                                <ProtectedRoute requiredPermission="canAccessUsers">
                                    <UserList />
                                </ProtectedRoute>
                            } />
                            <Route path="/users/new" element={
                                <ProtectedRoute requiredPermission="canManageUsers">
                                    <UserForm />
                                </ProtectedRoute>
                            } />
                            <Route path="/users/:id" element={
                                <ProtectedRoute requiredPermission="canAccessUsers">
                                    <UserDetail />
                                </ProtectedRoute>
                            } />
                            <Route path="/users/:id/edit" element={
                                <ProtectedRoute requiredPermission="canManageUsers">
                                    <UserForm />
                                </ProtectedRoute>
                            } />
                            
                            {/* Reports - admin/manager/technician */}
                            <Route path="/reports" element={
                                <ProtectedRoute requiredPermission="canAccessReports">
                                    <ReportList />
                                </ProtectedRoute>
                            } />
                            
                            {/* Audit Logs - admin only */}
                            <Route path="/audit-logs" element={
                                <ProtectedRoute requiredPermission="canAccessAuditLogs">
                                    <AuditLogList />
                                </ProtectedRoute>
                            } />
                            
                            {/* Profile - everyone */}
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        
                        {/* Fallback - redirect to dashboard */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
