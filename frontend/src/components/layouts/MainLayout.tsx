/**
 * Main Layout Component
 * Layout with Sidebar and TopNavbar
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { notificationService } from '../../services';

export const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

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
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

            {/* Main content area */}
            <div 
                className="flex-grow-1"
                style={{
                    marginLeft: sidebarCollapsed ? '70px' : '250px',
                    transition: 'margin-left 0.3s ease',
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa',
                }}
            >
                {/* Top Navbar */}
                <TopNavbar 
                    sidebarCollapsed={sidebarCollapsed} 
                    unreadNotifications={unreadNotifications}
                />

                {/* Page Content */}
                <main 
                    className="p-4"
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

