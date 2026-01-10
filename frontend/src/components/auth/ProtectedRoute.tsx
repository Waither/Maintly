import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../../lib/axios';

/**
 * Protected Route Component
 * Redirects to /login if user is not authenticated
 * Saves the original location to return after login
 * 
 * Usage:
 * <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = getAuthToken();
    const location = useLocation();
    
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
};
