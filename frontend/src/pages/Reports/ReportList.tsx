/**
 * Reports List Page
 * View and generate reports with MDBDataTable
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon, 
    MDBRow,
    MDBCol,
    MDBBadge,
    MDBSelect,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    StatusBadge,
    DeleteConfirmModal,
    useToast,
    MDBDataTable
} from '../../components/ui';
import { reportService } from '../../services';
import { Report, ReportType, ReportFormat } from '../../types';

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    name: string;
    type: React.ReactNode;
    format: React.ReactNode;
    status: React.ReactNode;
    generatedBy: string;
    generatedAt: string;
    fileSize: string;
    actions: React.ReactNode;
    _original: Report;
    [key: string]: unknown;
}

interface SelectData {
    text: string;
    value: string;
    defaultSelected?: boolean;
}

// Generate Report Form Data
interface GenerateFormData {
    name: string;
    type: ReportType;
    format: ReportFormat;
    startDate: string;
    endDate: string;
}

const initialGenerateForm: GenerateFormData = {
    name: '',
    type: 'maintenance',
    format: 'pdf',
    startDate: '',
    endDate: '',
};

export const ReportList = () => {
    const { t } = useTranslation();
    const { success, error } = useToast();

    // State
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    // Generate modal
    const [generateModal, setGenerateModal] = useState(false);
    const [generateForm, setGenerateForm] = useState<GenerateFormData>(initialGenerateForm);
    const [generating, setGenerating] = useState(false);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });
    const [deleting, setDeleting] = useState(false);

    // Report types and formats
    const [reportTypes, setReportTypes] = useState<Array<{ value: string; label: string }>>([]);
    const [reportFormats, setReportFormats] = useState<Array<{ value: string; label: string }>>([]);

    // Load metadata
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [types, formats] = await Promise.all([
                    reportService.getReportTypes(),
                    reportService.getReportFormats(),
                ]);
                setReportTypes(types);
                setReportFormats(formats);
            } catch (err) {
                console.error('Failed to load report metadata:', err);
            }
        };
        loadMetadata();
    }, []);

    // Load data
    const loadReports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reportService.getReports(1, 100);
            setReports(response.data || []);
        } catch (err) {
            console.error('Failed to load reports:', err);
            error(t('report.loadError', { defaultValue: 'Failed to load reports' }));
        } finally {
            setLoading(false);
        }
    }, [t, error]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    // Auto-refresh when there are pending/processing reports (polling every 5s)
    useEffect(() => {
        const hasPendingReports = reports.some(
            (r) => r.status === 'pending' || r.status === 'processing'
        );

        if (!hasPendingReports) return;

        const interval = setInterval(() => {
            loadReports();
        }, 2000);

        return () => clearInterval(interval);
    }, [reports, loadReports]);

    // Handle generate
    const handleGenerate = async () => {
        if (!generateForm.name.trim()) {
            error(t('validation.required', { defaultValue: 'Name is required' }));
            return;
        }

        setGenerating(true);
        try {
            await reportService.generateReport({
                reportType: generateForm.type,
                format: generateForm.format,
                filters: {
                    dateFrom: generateForm.startDate || undefined,
                    dateTo: generateForm.endDate || undefined,
                },
            });
            success(t('report.generateSuccess', { defaultValue: 'Report generation started' }));
            setGenerateModal(false);
            setGenerateForm(initialGenerateForm);
            loadReports();
        } catch (err: any) {
            error(err.response?.data?.message || t('report.generateError', { defaultValue: 'Failed to generate report' }));
        } finally {
            setGenerating(false);
        }
    };

    // Handle download
    const handleDownload = async (report: Report) => {
        if (report.status !== 'completed' || !report.fileName) {
            error(t('report.notReady', { defaultValue: 'Report is not ready for download' }));
            return;
        }

        try {
            await reportService.downloadReportFile(report.id, report.fileName);
            success(t('report.downloadSuccess', { defaultValue: 'Report downloaded' }));
        } catch (err) {
            error(t('report.downloadError', { defaultValue: 'Failed to download report' }));
        }
    };

    // Handle preview (PDF only - opens in new tab)
    const handlePreview = async (report: Report) => {
        if (report.status !== 'completed' || !report.fileName) {
            error(t('report.notReady', { defaultValue: 'Report is not ready for preview' }));
            return;
        }

        try {
            await reportService.previewReport(report.id);
        } catch (err) {
            error(t('report.previewError', { defaultValue: 'Failed to preview report' }));
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteModal.report) return;
        
        setDeleting(true);
        try {
            await reportService.deleteReport(deleteModal.report.id);
            success(t('report.deleteSuccess', { defaultValue: 'Report deleted successfully' }));
            setDeleteModal({ open: false, report: null });
            loadReports();
        } catch (err) {
            error(t('report.deleteError', { defaultValue: 'Failed to delete report' }));
        } finally {
            setDeleting(false);
        }
    };

    // Format file size
    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Get type badge color
    const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' => {
        const colors: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'> = {
            maintenance: 'primary',
            equipment: 'success',
            users: 'info',
            work_orders: 'warning',
            custom: 'secondary',
        };
        return colors[type] || 'secondary';
    };

    // Get format icon
    const getFormatIcon = (format: string): string => {
        const icons: Record<string, string> = {
            pdf: 'file-pdf',
            excel: 'file-excel',
            csv: 'file-csv',
        };
        return icons[format] || 'file';
    };

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: '#', field: 'id', sort: true, width: 60 },
        { label: t('report.name', { defaultValue: 'Name' }), field: 'name', sort: true, width: 200 },
        { label: t('report.type', { defaultValue: 'Type' }), field: 'type', sort: false, width: 130 },
        { label: t('report.format', { defaultValue: 'Format' }), field: 'format', sort: false, width: 100 },
        { label: t('report.status', { defaultValue: 'Status' }), field: 'status', sort: false, width: 120 },
        { label: t('report.generatedBy', { defaultValue: 'Generated By' }), field: 'generatedBy', sort: true, width: 150 },
        { label: t('report.generatedAt', { defaultValue: 'Date' }), field: 'generatedAt', sort: true, width: 140 },
        { label: t('report.fileSize', { defaultValue: 'Size' }), field: 'fileSize', sort: true, width: 80 },
        { label: t('common.actions', { defaultValue: 'Actions' }), field: 'actions', sort: false, width: 120 },
    ], [t]);

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return reports.map((report) => ({
            id: report.id,
            name: report.name,
            type: (
                <MDBBadge color={getTypeColor(report.reportType || report.type)} pill>
                    {t(`report.type_${report.reportType || report.type}`, { defaultValue: report.reportType || report.type })}
                </MDBBadge>
            ),
            format: (
                <span className="text-uppercase">
                    <MDBIcon icon={getFormatIcon(report.format)} className="me-1" />
                    {report.format}
                </span>
            ),
            status: <StatusBadge status={report.status} />,
            generatedBy: report.generatedBy?.fullName || report.generatedBy?.email || '-',
            generatedAt: report.generatedAt || report.createdAt
                ? new Date(report.generatedAt || report.createdAt).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-',
            fileSize: formatFileSize(report.fileSize),
            actions: (
                <div className="d-flex gap-1">
                    {report.status === 'completed' && report.format === 'pdf' && (
                        <MDBBtn
                            size="sm"
                            color="info"
                            floating
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handlePreview(report);
                            }}
                            title={t('common.preview', { defaultValue: 'Preview' })}
                        >
                            <MDBIcon icon="eye" />
                        </MDBBtn>
                    )}
                    {report.status === 'completed' && (
                        <MDBBtn
                            size="sm"
                            color="success"
                            floating
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleDownload(report);
                            }}
                            title={t('common.download', { defaultValue: 'Download' })}
                        >
                            <MDBIcon icon="download" />
                        </MDBBtn>
                    )}
                    <MDBBtn
                        size="sm"
                        color="danger"
                        floating
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setDeleteModal({ open: true, report });
                        }}
                        title={t('common.delete', { defaultValue: 'Delete' })}
                    >
                        <MDBIcon icon="trash" />
                    </MDBBtn>
                </div>
            ),
            _original: report,
        }));
    }, [reports, t]);

    // Type select data for generate form
    const typeSelectData = useMemo((): SelectData[] => {
        return reportTypes.map(type => ({
            text: type.label,
            value: type.value,
            defaultSelected: generateForm.type === type.value,
        }));
    }, [reportTypes, generateForm.type]);

    // Format select data for generate form
    const formatSelectData = useMemo((): SelectData[] => {
        return reportFormats.map(format => ({
            text: format.label,
            value: format.value,
            defaultSelected: generateForm.format === format.value,
        }));
    }, [reportFormats, generateForm.format]);

    // Stats
    const stats = useMemo(() => ({
        total: reports.length,
        completed: reports.filter(r => r.status === 'completed').length,
        processing: reports.filter(r => r.status === 'processing' || r.status === 'pending').length,
        failed: reports.filter(r => r.status === 'failed').length,
    }), [reports]);

    return (
        <div>
            <PageHeader
                title={t('report.list', { defaultValue: 'Reports' })}
                subtitle={t('report.listSubtitle', { 
                    defaultValue: `Total ${stats.total} reports`,
                    count: stats.total 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.reports', { defaultValue: 'Reports' }) },
                ]}
                actions={
                    <MDBBtn color="primary" onClick={() => setGenerateModal(true)}>
                        <MDBIcon icon="file-alt" className="me-2" />
                        {t('report.generate', { defaultValue: 'Generate Report' })}
                    </MDBBtn>
                }
            />

            {/* Quick Stats */}
            <MDBRow className="mb-4 g-3 stats-row">
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="file-alt" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.total}</h4>
                                <small className="text-muted">{t('report.total', { defaultValue: 'Total' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="check-circle" size="lg" className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.completed}</h4>
                                <small className="text-muted">{t('report.completed', { defaultValue: 'Completed' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="spinner" size="lg" className="text-warning" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.processing}</h4>
                                <small className="text-muted">{t('report.processing', { defaultValue: 'Processing' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="exclamation-triangle" size="lg" className="text-danger" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.failed}</h4>
                                <small className="text-muted">{t('report.failed', { defaultValue: 'Failed' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* DataTable */}
            <MDBCard className="shadow-sm border-0">
                <MDBCardBody className="p-0 table-responsive">
                    <MDBDataTable
                        columns={datatableColumns}
                        rows={datatableRows}
                        loading={loading}
                        noFoundMessage={{
                            icon: 'file-alt',
                            iconColor: 'text-muted',
                            title: t('report.noReports', { defaultValue: 'No reports to display' }),
                            subtitle: t('report.noReportsHint', { defaultValue: 'Generate a new report to get started' }),
                        }}
                        loadingMessage={{
                            text: t('report.loading', { defaultValue: 'Loading reports...' }),
                        }}
                    />
                </MDBCardBody>
            </MDBCard>

            {/* Generate Modal */}
            <MDBModal open={generateModal} setOpen={setGenerateModal} tabIndex="-1">
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>
                                <MDBIcon icon="file-alt" className="me-2 text-primary" />
                                {t('report.generate', { defaultValue: 'Generate Report' })}
                            </MDBModalTitle>
                            <MDBBtn 
                                className="btn-close" 
                                color="none" 
                                onClick={() => setGenerateModal(false)}
                            />
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className="mb-3">
                                <MDBInput
                                    label={t('report.name', { defaultValue: 'Report Name' }) + ' *'}
                                    value={generateForm.name}
                                    onChange={(e) => setGenerateForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">
                                    {t('report.type', { defaultValue: 'Report Type' })}
                                </label>
                                {/* @ts-expect-error MDB types issue */}
                                <MDBSelect
                                    data={typeSelectData}
                                    onValueChange={(data: unknown) => {
                                        const selected = Array.isArray(data) ? data[0] : data;
                                        const value = (selected as SelectData)?.value || 'maintenance';
                                        setGenerateForm(prev => ({ ...prev, type: value as ReportType }));
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">
                                    {t('report.format', { defaultValue: 'Format' })}
                                </label>
                                {/* @ts-expect-error MDB types issue */}
                                <MDBSelect
                                    data={formatSelectData}
                                    onValueChange={(data: unknown) => {
                                        const selected = Array.isArray(data) ? data[0] : data;
                                        const value = (selected as SelectData)?.value || 'pdf';
                                        setGenerateForm(prev => ({ ...prev, format: value as ReportFormat }));
                                    }}
                                />
                            </div>
                            <MDBRow className="g-3">
                                <MDBCol md="6">
                                    <MDBInput
                                        type="date"
                                        label={t('report.startDate', { defaultValue: 'Start Date' })}
                                        value={generateForm.startDate}
                                        onChange={(e) => setGenerateForm(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </MDBCol>
                                <MDBCol md="6">
                                    <MDBInput
                                        type="date"
                                        label={t('report.endDate', { defaultValue: 'End Date' })}
                                        value={generateForm.endDate}
                                        onChange={(e) => setGenerateForm(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </MDBCol>
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="light" onClick={() => setGenerateModal(false)}>
                                {t('common.cancel', { defaultValue: 'Cancel' })}
                            </MDBBtn>
                            <MDBBtn color="primary" onClick={handleGenerate} disabled={generating}>
                                {generating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        {t('report.generating', { defaultValue: 'Generating...' })}
                                    </>
                                ) : (
                                    <>
                                        <MDBIcon icon="file-alt" className="me-2" />
                                        {t('report.generate', { defaultValue: 'Generate' })}
                                    </>
                                )}
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, report: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.report?.name || ''}
                loading={deleting}
            />
        </div>
    );
};
