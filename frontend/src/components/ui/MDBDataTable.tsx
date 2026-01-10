/**
 * MDB DataTable Component
 * Reusable wrapper for MDBDatatable with default settings and customizable options
 */

import { useMemo } from 'react';
import { MDBDatatable, MDBIcon } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

// Column definition type
export interface DataTableColumn {
    label: string;
    field: string;
    sort?: boolean;
    width?: number;
}

// Row type with index signature for MDBDatatable compatibility
export type DataTableRow = Record<string, unknown>;

// Props for no found message customization
export interface NoFoundConfig {
    icon?: string;
    iconColor?: string;
    title: string;
    subtitle?: string;
}

// Props for loading message customization  
export interface LoadingConfig {
    text?: string;
}

// Main component props
export interface MDBDataTableProps {
    columns: DataTableColumn[];
    rows: DataTableRow[];
    loading?: boolean;
    
    // Search & pagination
    search?: boolean;
    entries?: number;
    entriesOptions?: number[];
    
    // Styling
    hover?: boolean;
    striped?: boolean;
    fixedHeader?: boolean;
    maxHeight?: string;
    bordered?: boolean;
    sm?: boolean;
    
    // Events
    onRowClick?: (row: DataTableRow) => void;
    
    // Customization
    noFoundMessage?: React.ReactNode | NoFoundConfig;
    loadingMessage?: React.ReactNode | LoadingConfig;
    
    // Additional MDBDatatable props
    fullPagination?: boolean;
    className?: string;
}

// Default no found message component
const DefaultNoFoundMessage = ({ config }: { config: NoFoundConfig }) => (
    <div className="text-center py-5">
        <MDBIcon 
            icon={config.icon || 'inbox'} 
            size="3x" 
            className={`mb-3 ${config.iconColor || 'text-muted'}`} 
        />
        <p className="text-muted mb-0 fw-semibold">{config.title}</p>
        {config.subtitle && (
            <small className="text-muted">{config.subtitle}</small>
        )}
    </div>
);

// Default loading message component
const DefaultLoadingMessage = ({ text }: { text: string }) => (
    <div className="d-flex align-items-center justify-content-center py-5">
        <span className="spinner-border spinner-border-sm me-2" />
        {text}
    </div>
);

export function MDBDataTable({
    columns,
    rows,
    loading = false,
    search = true,
    entries = 10,
    entriesOptions = [5, 10, 25, 50],
    hover = true,
    striped = true,
    fixedHeader = true,
    maxHeight = '600px',
    bordered = false,
    sm = false,
    onRowClick,
    noFoundMessage,
    loadingMessage,
    fullPagination = true,
    className = '',
}: MDBDataTableProps) {
    const { t } = useTranslation();

    // Prepare data structure for MDBDatatable
    const datatableData = useMemo(() => ({
        columns,
        rows,
    }), [columns, rows]);

    // Resolve loading message
    const resolvedLoadingMessage = useMemo((): React.ReactNode => {
        if (!loadingMessage) {
            return <DefaultLoadingMessage text={t('common.loading', { defaultValue: 'Ładowanie...' })} />;
        }
        if (typeof loadingMessage === 'object' && loadingMessage !== null && 'text' in loadingMessage) {
            const config = loadingMessage as LoadingConfig;
            return <DefaultLoadingMessage text={config.text || t('common.loading', { defaultValue: 'Ładowanie...' })} />;
        }
        return loadingMessage as React.ReactNode;
    }, [loadingMessage, t]);

    // Resolve no found message
    const resolvedNoFoundMessage = useMemo((): React.ReactNode => {
        if (!noFoundMessage) {
            return (
                <DefaultNoFoundMessage 
                    config={{
                        icon: 'inbox',
                        title: t('common.noData', { defaultValue: 'Brak danych do wyświetlenia' }),
                    }}
                />
            );
        }
        if (typeof noFoundMessage === 'object' && noFoundMessage !== null && 'title' in noFoundMessage) {
            return <DefaultNoFoundMessage config={noFoundMessage as NoFoundConfig} />;
        }
        return noFoundMessage as React.ReactNode;
    }, [noFoundMessage, t]);

    // Type-safe row click handler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRowClick = onRowClick 
        ? (row: any) => onRowClick(row as DataTableRow)
        : undefined;

    return (
        <MDBDatatable
            data={datatableData}
            search={search}
            entries={entries}
            entriesOptions={entriesOptions}
            isLoading={loading}
            loadingMessage={resolvedLoadingMessage}
            noFoundMessage={resolvedNoFoundMessage}
            hover={hover}
            striped={striped}
            fixedHeader={fixedHeader}
            maxHeight={maxHeight}
            bordered={bordered}
            sm={sm}
            onRowClick={handleRowClick}
            fullPagination={fullPagination}
            className={className}
            rowsText={t('common.rowsPerPage', { defaultValue: 'Wierszy na stronę' })}
            ofText={t('common.of', { defaultValue: 'z' })}
            allText={t('common.all', { defaultValue: 'Wszystkie' })}
        />
    );
}
