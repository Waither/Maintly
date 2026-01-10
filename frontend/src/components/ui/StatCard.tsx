/**
 * Stat Card Component
 * Display statistics in a card format
 */

import { MDBCard, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit';

type CardColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    color?: CardColor;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    onClick?: () => void;
    loading?: boolean;
}

export const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    trend,
    subtitle,
    onClick,
    loading = false
}: StatCardProps) => {
    const colorClasses: Record<CardColor, { bg: string; text: string; iconBg: string }> = {
        primary: { bg: 'bg-primary', text: 'text-primary', iconBg: 'bg-primary bg-opacity-10' },
        secondary: { bg: 'bg-secondary', text: 'text-secondary', iconBg: 'bg-secondary bg-opacity-10' },
        success: { bg: 'bg-success', text: 'text-success', iconBg: 'bg-success bg-opacity-10' },
        danger: { bg: 'bg-danger', text: 'text-danger', iconBg: 'bg-danger bg-opacity-10' },
        warning: { bg: 'bg-warning', text: 'text-warning', iconBg: 'bg-warning bg-opacity-10' },
        info: { bg: 'bg-info', text: 'text-info', iconBg: 'bg-info bg-opacity-10' },
    };

    const colors = colorClasses[color];

    return (
        <MDBCard 
            className={`h-100 border-0 shadow-sm ${onClick ? 'cursor-pointer hover-shadow' : ''}`}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer', transition: 'box-shadow 0.3s' } : undefined}
        >
            <MDBCardBody className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <p className="text-muted text-uppercase small mb-1 fw-semibold">
                            {title}
                        </p>
                        {loading ? (
                            <div className="placeholder-glow">
                                <span className="placeholder col-6 placeholder-lg"></span>
                            </div>
                        ) : (
                            <h3 className={`mb-0 fw-bold ${colors.text}`}>
                                {typeof value === 'number' ? value.toLocaleString('pl-PL') : value}
                            </h3>
                        )}
                        {subtitle && (
                            <small className="text-muted">{subtitle}</small>
                        )}
                        {trend && (
                            <div className="mt-2">
                                <small className={trend.isPositive ? 'text-success' : 'text-danger'}>
                                    <MDBIcon 
                                        icon={trend.isPositive ? 'arrow-up' : 'arrow-down'} 
                                        className="me-1"
                                    />
                                    {Math.abs(trend.value)}%
                                </small>
                                <small className="text-muted ms-1">vs poprzedni okres</small>
                            </div>
                        )}
                    </div>
                    <div 
                        className={`${colors.iconBg} rounded-circle p-3 d-flex align-items-center justify-content-center`}
                        style={{ width: '56px', height: '56px' }}
                    >
                        <MDBIcon 
                            icon={icon} 
                            size="lg" 
                            className={colors.text}
                        />
                    </div>
                </div>
            </MDBCardBody>
        </MDBCard>
    );
};

// Compact version for smaller displays
export const StatCardCompact = ({ 
    title, 
    value, 
    icon, 
    color = 'primary' 
}: Omit<StatCardProps, 'trend' | 'subtitle' | 'onClick'>) => {
    return (
        <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm">
            <div 
                className={`bg-${color} bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center`}
                style={{ width: '40px', height: '40px' }}
            >
                <MDBIcon icon={icon} className={`text-${color}`} />
            </div>
            <div>
                <p className="text-muted small mb-0">{title}</p>
                <h5 className={`mb-0 fw-bold text-${color}`}>{value}</h5>
            </div>
        </div>
    );
};
