/**
 * Data Table Component
 * Reusable table with sorting, pagination, and actions
 */

import { MDBTable, MDBTableHead, MDBTableBody, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { TableColumn } from '../../types';

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    emptyIcon?: string;
    onRowClick?: (item: T) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (column: string, order: 'asc' | 'desc') => void;
    actions?: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string | number;
    striped?: boolean;
    hover?: boolean;
    small?: boolean;
}

export function DataTable<T>({ 
    columns, 
    data, 
    loading = false,
    emptyMessage,
    emptyIcon,
    onRowClick,
    sortBy,
    sortOrder = 'asc',
    onSort,
    actions,
    keyExtractor,
    striped = true,
    hover = true,
    small = false
}: DataTableProps<T>) {
    const { t } = useTranslation();

    const handleSort = (columnKey: string) => {
        if (onSort) {
            const newOrder = sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc';
            onSort(columnKey, newOrder);
        }
    };

    const renderSortIcon = (columnKey: string) => {
        if (sortBy !== columnKey) {
            return <MDBIcon icon="sort" className="ms-1 text-muted opacity-50" />;
        }
        return (
            <MDBIcon 
                icon={sortOrder === 'asc' ? 'sort-up' : 'sort-down'} 
                className="ms-1 text-primary"
            />
        );
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (data.length === 0) {
        return (
            <EmptyState 
                icon={emptyIcon || 'inbox'}
                title={emptyMessage || t('common.noData', { defaultValue: 'Brak danych' })}
            />
        );
    }

    return (
        <div className="table-responsive">
            <MDBTable 
                striped={striped} 
                hover={hover} 
                small={small}
                className="mb-0"
            >
                <MDBTableHead className="bg-light">
                    <tr>
                        {columns.map((column) => (
                            <th 
                                key={String(column.key)}
                                style={{ 
                                    width: column.width,
                                    cursor: column.sortable ? 'pointer' : 'default',
                                    whiteSpace: 'nowrap'
                                }}
                                onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
                                className={column.sortable ? 'user-select-none' : ''}
                            >
                                {column.label}
                                {column.sortable && renderSortIcon(String(column.key))}
                            </th>
                        ))}
                        {actions && (
                            <th style={{ width: '120px' }} className="text-center">
                                {t('common.actions', { defaultValue: 'Akcje' })}
                            </th>
                        )}
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {data.map((item) => (
                        <tr 
                            key={keyExtractor(item)}
                            onClick={onRowClick ? () => onRowClick(item) : undefined}
                            style={onRowClick ? { cursor: 'pointer' } : undefined}
                        >
                            {columns.map((column) => (
                                <td key={String(column.key)} className="align-middle">
                                    {column.render 
                                        ? column.render(item) 
                                        : String((item as any)[column.key] ?? '')
                                    }
                                </td>
                            ))}
                            {actions && (
                                <td className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                                    {actions(item)}
                                </td>
                            )}
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </div>
    );
}

// Pagination Component
interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export const Pagination = ({ page, totalPages, onPageChange, loading = false }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
        // Always show first page
        pages.push(1);
        
        if (page > 3) {
            pages.push('...');
        }
        
        // Show pages around current
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }
        
        if (page < totalPages - 2) {
            pages.push('...');
        }
        
        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    return (
        <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 || loading ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1 || loading}
                    >
                        <MDBIcon icon="chevron-left" />
                    </button>
                </li>
                
                {pages.map((p, index) => (
                    <li 
                        key={index} 
                        className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}
                    >
                        <button 
                            className="page-link"
                            onClick={() => typeof p === 'number' && onPageChange(p)}
                            disabled={p === '...' || loading}
                        >
                            {p}
                        </button>
                    </li>
                ))}
                
                <li className={`page-item ${page === totalPages || loading ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages || loading}
                    >
                        <MDBIcon icon="chevron-right" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

// Table Actions Buttons
interface TableActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const TableActions = ({ onView, onEdit, onDelete }: TableActionsProps) => {
    return (
        <div className="d-flex gap-1 justify-content-center">
            {onView && (
                <MDBBtn color="info" size="sm" floating onClick={onView} title="Podgląd">
                    <MDBIcon icon="eye" />
                </MDBBtn>
            )}
            {onEdit && (
                <MDBBtn color="primary" size="sm" floating onClick={onEdit} title="Edytuj">
                    <MDBIcon icon="edit" />
                </MDBBtn>
            )}
            {onDelete && (
                <MDBBtn color="danger" size="sm" floating onClick={onDelete} title="Usuń">
                    <MDBIcon icon="trash" />
                </MDBBtn>
            )}
        </div>
    );
};
