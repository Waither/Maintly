import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ToastProvider } from '../components/ui';
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
 * 
 * - /login - public route
 * - / and all other routes - protected (require auth token)
 */
function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
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
                        
                        {/* Work Orders */}
                        <Route path="/work-orders" element={<WorkOrderList />} />
                        <Route path="/work-orders/new" element={<WorkOrderForm />} />
                        <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
                        <Route path="/work-orders/:id/edit" element={<WorkOrderForm />} />
                        
                        {/* Equipment */}
                        <Route path="/equipment" element={<EquipmentList />} />
                        <Route path="/equipment/new" element={<EquipmentForm />} />
                        <Route path="/equipment/:id" element={<EquipmentDetail />} />
                        <Route path="/equipment/:id/edit" element={<EquipmentForm />} />
                        
                        {/* Users */}
                        <Route path="/users" element={<UserList />} />
                        <Route path="/users/new" element={<UserForm />} />
                        <Route path="/users/:id" element={<UserDetail />} />
                        <Route path="/users/:id/edit" element={<UserForm />} />
                        
                        {/* Reports */}
                        <Route path="/reports" element={<ReportList />} />
                        
                        {/* Audit Logs */}
                        <Route path="/audit-logs" element={<AuditLogList />} />
                        
                        {/* Profile */}
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    
                    {/* Fallback - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
