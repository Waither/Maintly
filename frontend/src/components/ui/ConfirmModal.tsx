/**
 * Confirm Modal Component
 * Reusable confirmation dialog
 */

import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

type ModalVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: ModalVariant;
    loading?: boolean;
    icon?: string;
}

const variantConfig: Record<ModalVariant, { color: string; icon: string }> = {
    danger: { color: 'danger', icon: 'exclamation-triangle' },
    warning: { color: 'warning', icon: 'exclamation-circle' },
    info: { color: 'info', icon: 'info-circle' },
    success: { color: 'success', icon: 'check-circle' },
};

export const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText,
    cancelText,
    variant = 'danger',
    loading = false,
    icon
}: ConfirmModalProps) => {
    const { t } = useTranslation();
    
    const config = variantConfig[variant];
    const displayIcon = icon || config.icon;
    const displayConfirmText = confirmText || t('common.confirm', { defaultValue: 'Potwierdź' });
    const displayCancelText = cancelText || t('common.cancel', { defaultValue: 'Anuluj' });

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    return (
        <MDBModal open={isOpen} onClose={onClose} tabIndex={-1}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>
                            <MDBIcon 
                                icon={displayIcon} 
                                className={`text-${config.color} me-2`} 
                            />
                            {title}
                        </MDBModalTitle>
                        <MDBBtn 
                            className="btn-close" 
                            color="none" 
                            onClick={onClose}
                            disabled={loading}
                        />
                    </MDBModalHeader>
                    <MDBModalBody>
                        {typeof message === 'string' ? (
                            <p className="mb-0">{message}</p>
                        ) : (
                            message
                        )}
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn 
                            color="secondary" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            {displayCancelText}
                        </MDBBtn>
                        <MDBBtn 
                            color={config.color as any} 
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                            )}
                            {displayConfirmText}
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
};

// Specialized variants
export const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName,
    loading = false
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    loading?: boolean;
}) => {
    const { t } = useTranslation();
    
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            variant="danger"
            title={t('common.deleteConfirmTitle', { defaultValue: 'Potwierdź usunięcie' })}
            message={t('common.deleteConfirmMessage', { 
                defaultValue: `Czy na pewno chcesz usunąć "${itemName}"? Ta operacja jest nieodwracalna.`,
                itemName 
            })}
            confirmText={t('common.delete', { defaultValue: 'Usuń' })}
            icon="trash"
            loading={loading}
        />
    );
};
