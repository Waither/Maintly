/**
 * Sidebar Component
 * Main navigation sidebar with menu items
 * Responsive - overlay on mobile, fixed on desktop
 */

import { NavLink, useLocation } from 'react-router-dom';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

interface MenuItem {
    path: string;
    icon: string;
    label: string;
    adminOnly?: boolean;
}

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle, isMobile = false, isOpen = false, onClose }: SidebarProps) => {
    const { t } = useTranslation();
    const location = useLocation();

    const menuItems: MenuItem[] = [
        { 
            path: '/', 
            icon: 'tachometer-alt', 
            label: t('nav.dashboard', { defaultValue: 'Dashboard' }) 
        },
        { 
            path: '/work-orders', 
            icon: 'clipboard-list', 
            label: t('nav.workOrders', { defaultValue: 'Work Orders' }) 
        },
        { 
            path: '/equipment', 
            icon: 'cogs', 
            label: t('nav.equipment', { defaultValue: 'Equipment' }) 
        },
        { 
            path: '/reports', 
            icon: 'file-alt', 
            label: t('nav.reports', { defaultValue: 'Reports' }) 
        },
        { 
            path: '/users', 
            icon: 'users', 
            label: t('nav.users', { defaultValue: 'Users' }),
            adminOnly: true
        },
        { 
            path: '/audit-logs', 
            icon: 'history', 
            label: t('nav.auditLogs', { defaultValue: 'Audit Logs' }),
            adminOnly: true
        },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleNavClick = () => {
        // Close sidebar on mobile after navigation
        if (isMobile && onClose) {
            onClose();
        }
    };

    // Determine visibility and width
    const getSidebarStyle = (): React.CSSProperties => {
        if (isMobile) {
            return {
                width: '280px',
                minHeight: '100vh',
                position: 'fixed',
                top: 0,
                left: isOpen ? 0 : '-300px',
                zIndex: 1000,
                transition: 'left 0.3s ease',
                boxShadow: isOpen ? '2px 0 10px rgba(0,0,0,0.3)' : 'none',
            };
        }
        return {
            width: isCollapsed ? '70px' : '250px',
            minHeight: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            transition: 'width 0.3s ease',
        };
    };

    return (
        <aside 
            className={`sidebar bg-dark text-white d-flex flex-column ${isCollapsed && !isMobile ? 'collapsed' : ''}`}
            style={getSidebarStyle()}
        >
            {/* Logo / Brand */}
            <div 
                className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary"
                style={{ height: '60px' }}
            >
                {(!isCollapsed || isMobile) && (
                    <h4 className="mb-0 text-primary fw-bold">
                        <MDBIcon icon="tools" className="me-2" />
                        Maintly
                    </h4>
                )}
                {/* Desktop toggle button */}
                {!isMobile && (
                    <div className='p-2' onClick={onToggle} style={{ cursor: 'pointer' }} title={isCollapsed ? 'Rozwiń' : 'Zwiń'}>
                        <MDBIcon icon={isCollapsed ? 'chevron-right' : 'chevron-left'} />
                    </div>
                )}
                {/* Mobile close button */}
                {isMobile && (
                    <div className='p-2' onClick={onClose} style={{ cursor: 'pointer' }}>
                        <MDBIcon icon="times" size="lg" />
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow-1 py-3">
                <ul className="nav flex-column">
                    {menuItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <NavLink
                                to={item.path}
                                onClick={handleNavClick}
                                className={`nav-link d-flex align-items-center gap-3 px-3 py-2 mx-2 rounded ${
                                    isActive(item.path) 
                                        ? 'bg-primary text-white' 
                                        : 'text-white-50 hover-bg-dark'
                                }`}
                                style={{
                                    transition: 'all 0.2s ease',
                                }}
                                title={isCollapsed && !isMobile ? item.label : undefined}
                            >
                                <MDBIcon 
                                    icon={item.icon} 
                                    className="fa-fw"
                                    style={{ fontSize: '1.1rem' }}
                                />
                                {(!isCollapsed || isMobile) && (
                                    <span>{item.label}</span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {(!isCollapsed || isMobile) && (
                <div className="p-3 border-top border-secondary text-center">
                    <small className="text-white-50">
                        &copy; {new Date().getFullYear()} Maintly
                    </small>
                </div>
            )}
        </aside>
    );
};
