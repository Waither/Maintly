import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../../lib/axios';
import { useAuth, type Permissions } from '../../contexts';
import { MDBIcon } from 'mdb-react-ui-kit';

/**
 * Protected Route Component
 * Redirects to /login if user is not authenticated
 * Checks role-based permissions for specific routes
 * 
 * Usage:
 * <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 * <Route path="/users" element={<ProtectedRoute requiredPermission="canAccessUsers"><UserList /></ProtectedRoute>} />
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: keyof Permissions;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
    const token = getAuthToken();
    const location = useLocation();
    const { loading, permissions, user } = useAuth();
    
    // Not authenticated
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Still loading user data
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <MDBIcon icon="spinner" spin size="3x" className="text-primary mb-3" />
                    <p className="text-muted">Ładowanie...</p>
                </div>
            </div>
        );
    }

    // Check permission if required
    if (requiredPermission && !permissions[requiredPermission]) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                    <MDBIcon icon="ban" size="4x" className="text-danger mb-3" />
                    <h4>Brak dostępu</h4>
                    <p className="text-muted">Nie masz uprawnień do tej strony.</p>
                    <a href="/" className="btn btn-primary">Wróć do pulpitu</a>
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
};
