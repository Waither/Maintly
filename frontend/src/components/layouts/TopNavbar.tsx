/**
 * Top Navbar Component
 * Minimal navbar with profile dropdown and notifications
 */

import { useNavigate } from 'react-router-dom';
import { 
    MDBNavbar, 
    MDBContainer, 
    MDBIcon, 
    MDBDropdown, 
    MDBDropdownToggle, 
    MDBDropdownMenu, 
    MDBDropdownItem,
    MDBBadge
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { removeAuthToken } from '../../lib/axios';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface TopNavbarProps {
    sidebarCollapsed: boolean;
    unreadNotifications?: number;
}

export const TopNavbar = ({ sidebarCollapsed, unreadNotifications = 0 }: TopNavbarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        removeAuthToken();
        navigate('/login');
    };

    // Mock user data - will be replaced with context
    const user = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@maintly.com',
        avatar: null as string | null,
    };

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    return (
        <MDBNavbar 
            light 
            bgColor="white" 
            className="shadow-sm py-2"
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                left: sidebarCollapsed ? '70px' : '250px',
                zIndex: 999,
                transition: 'left 0.3s ease',
                height: '60px',
            }}
        >
            <MDBContainer fluid className="d-flex justify-content-end align-items-center gap-3">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Notifications */}
                <button 
                    className="btn btn-link text-dark position-relative p-2"
                    onClick={() => navigate('/notifications')}
                    title={t('nav.notifications', { defaultValue: 'Powiadomienia' })}
                >
                    <MDBIcon far icon="bell" size="lg" />
                    {unreadNotifications > 0 && (
                        <MDBBadge 
                            color="danger" 
                            notification 
                            pill
                            className="position-absolute"
                            style={{ top: '0', right: '0' }}
                        >
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                        </MDBBadge>
                    )}
                </button>

                {/* Profile Dropdown */}
                <MDBDropdown>
                    <MDBDropdownToggle 
                        tag="button" 
                        className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
                        style={{ textDecoration: 'none' }}
                    >
                        {/* Avatar */}
                        {user.avatar ? (
                            <img 
                                src={user.avatar} 
                                alt={`${user.firstName} ${user.lastName}`}
                                className="rounded-circle"
                                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div 
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px', fontSize: '14px', fontWeight: 600 }}
                            >
                                {initials}
                            </div>
                        )}
                        <div className="d-none d-md-block text-start">
                            <div className="fw-semibold" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>
                                {user.email}
                            </div>
                        </div>
                        <MDBIcon icon="chevron-down" size="sm" className="text-muted" />
                    </MDBDropdownToggle>

                    <MDBDropdownMenu end>
                        <MDBDropdownItem 
                            link 
                            onClick={() => navigate('/profile')}
                            className="d-flex align-items-center gap-2"
                        >
                            <MDBIcon far icon="user" />
                            {t('nav.profile', { defaultValue: 'Mój profil' })}
                        </MDBDropdownItem>
                        <MDBDropdownItem 
                            link
                            onClick={() => navigate('/settings')}
                            className="d-flex align-items-center gap-2"
                        >
                            <MDBIcon icon="cog" />
                            {t('nav.settings', { defaultValue: 'Ustawienia' })}
                        </MDBDropdownItem>
                        <MDBDropdownItem divider />
                        <MDBDropdownItem 
                            link
                            onClick={handleLogout}
                            className="d-flex align-items-center gap-2 text-danger"
                        >
                            <MDBIcon icon="sign-out-alt" />
                            {t('auth.logout', { defaultValue: 'Wyloguj' })}
                        </MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </MDBContainer>
        </MDBNavbar>
    );
};
