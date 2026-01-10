/**
 * Page Header Component
 * Header with title, breadcrumbs, and actions
 */

import { Link } from 'react-router-dom';
import { MDBBreadcrumb, MDBBreadcrumbItem, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    backLink?: string;
}

export const PageHeader = ({ 
    title, 
    subtitle, 
    breadcrumbs,
    actions,
    backLink
}: PageHeaderProps) => {
    return (
        <div className="mb-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <MDBBreadcrumb className="mb-2">
                    {breadcrumbs.map((item, index) => (
                        <MDBBreadcrumbItem 
                            key={index}
                            active={index === breadcrumbs.length - 1}
                        >
                            {item.path && index !== breadcrumbs.length - 1 ? (
                                <Link to={item.path} className="text-decoration-none">
                                    {item.label}
                                </Link>
                            ) : (
                                item.label
                            )}
                        </MDBBreadcrumbItem>
                    ))}
                </MDBBreadcrumb>
            )}

            {/* Title Row */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    {backLink && (
                        <Link to={backLink}>
                            <MDBBtn color="light" size="sm" className="px-3">
                                <MDBIcon icon="arrow-left" />
                            </MDBBtn>
                        </Link>
                    )}
                    <div>
                        <h2 className="mb-0 fw-bold">{title}</h2>
                        {subtitle && (
                            <p className="text-muted mb-0 mt-1">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {actions && (
                    <div className="d-flex gap-2 flex-wrap">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};
