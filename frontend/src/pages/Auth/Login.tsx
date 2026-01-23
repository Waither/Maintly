import { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import apiClient, { setAuthToken, getAuthToken } from '../../lib/axios';
import { useAuth } from '../../contexts';

/**
 * Login Page
 * Simple login form with JWT authentication
 * Redirects to dashboard if user is already logged in
 * Returns to original location after successful login
 */
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUser, user } = useAuth();

    // Get return URL from:
    // 1. Router state (ProtectedRoute redirect)
    // 2. sessionStorage (401 interceptor)
    // 3. Default to dashboard
    const returnUrl = (location.state as any)?.from?.pathname 
        || sessionStorage.getItem('returnUrl') 
        || '/';

    // Check if user is already logged in (both token AND user loaded)
    const token = getAuthToken();
    if (token && user) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/login', {
                email,
                password
            });

            console.log('Login response:', response.data);

            // Save token to localStorage
            setAuthToken(response.data.token);

            // Refresh user data in AuthContext
            await refreshUser();

            // Clear return URL from sessionStorage
            sessionStorage.removeItem('returnUrl');

            // Redirect to original location or dashboard
            navigate(returnUrl, { replace: true });

        }
        catch (err: any) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || 'Nieprawidłowy login lub hasło');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <MDBContainer style={{ maxWidth: '400px' }}>
                <MDBCard>
                    <MDBCardBody className="p-5">
                        <h2 className="text-center mb-4">Maintly</h2>
                        <p className="text-center text-muted mb-4">Zaloguj się do systemu</p>

                        <form onSubmit={handleLogin}>
                            <MDBInput
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mb-4"
                            />

                            <MDBInput
                                type="password"
                                label="Hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mb-4"
                            />

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <MDBBtn
                                type="submit"
                                color="primary"
                                className="w-100"
                                disabled={loading}
                            >
                                {loading ? 'Logowanie...' : 'Zaloguj się'}
                            </MDBBtn>
                        </form>

                        <div className="text-center mt-3">
                            <small className="text-muted">
                                Demo: admin@maintly.com / password
                            </small>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
    );
};
