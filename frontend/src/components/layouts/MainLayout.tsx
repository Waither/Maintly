/**
 * Main Layout Component
 * Layout with Sidebar and TopNavbar
 * Responsive - sidebar hidden on mobile, shown as overlay
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { notificationService } from '../../services';

export const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile overlay
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 992;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load unread notifications count
    useEffect(() => {
        const loadUnreadCount = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadNotifications(count);
            } catch (error) {
                console.error('Failed to load notification count:', error);
            }
        };

        loadUnreadCount();
        
        // Poll every 60 seconds
        const interval = setInterval(loadUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // Calculate margin for desktop
    const getContentMargin = () => {
        if (isMobile) return '0';
        return sidebarCollapsed ? '70px' : '250px';
    };

    return (
        <div className="d-flex">
            {/* Mobile overlay backdrop */}
            {isMobile && sidebarOpen && (
                <div 
                    className="sidebar-backdrop"
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                    }}
                />
            )}

            {/* Sidebar */}
            <Sidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={toggleSidebar}
                isMobile={isMobile}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            {/* Main content area */}
            <div 
                className="flex-grow-1 main-content"
                style={{
                    marginLeft: getContentMargin(),
                    transition: 'margin-left 0.3s ease',
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa',
                    width: '100%',
                }}
            >
                {/* Top Navbar */}
                <TopNavbar 
                    sidebarCollapsed={sidebarCollapsed} 
                    unreadNotifications={unreadNotifications}
                    onMenuToggle={toggleSidebar}
                    isMobile={isMobile}
                />

                {/* Page Content */}
                <main 
                    className="p-2 p-md-4"
                    style={{ 
                        marginTop: '60px',
                        minHeight: 'calc(100vh - 60px)'
                    }}
                >
                    <MDBContainer fluid className="p-0">
                        <Outlet />
                    </MDBContainer>
                </main>
            </div>
        </div>
    );
};

