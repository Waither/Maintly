/**
 * Empty State Component
 * Displays when a list or table has no data
 */

import { MDBIcon } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
    icon?: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState = ({ 
    icon = 'inbox', 
    title, 
    description,
    action 
}: EmptyStateProps) => {
    const { t } = useTranslation();
    
    const displayTitle = title || t('common.noData', { defaultValue: 'Brak danych' });
    const displayDescription = description || t('common.noDataDescription', { 
        defaultValue: 'Nie znaleziono żadnych elementów do wyświetlenia.' 
    });

    return (
        <div className="text-center py-5">
            <MDBIcon 
                far 
                icon={icon} 
                size="4x" 
                className="text-muted mb-3"
            />
            <h5 className="text-muted mb-2">{displayTitle}</h5>
            <p className="text-muted mb-3">{displayDescription}</p>
            {action && (
                <div className="mt-3">
                    {action}
                </div>
            )}
        </div>
    );
};

// Specialized variants
export const NoResultsState = ({ searchTerm }: { searchTerm?: string }) => {
    const { t } = useTranslation();
    
    return (
        <EmptyState
            icon="search"
            title={t('common.noResults', { defaultValue: 'Brak wyników' })}
            description={
                searchTerm 
                    ? t('common.noResultsFor', { 
                        defaultValue: `Nie znaleziono wyników dla "${searchTerm}"`,
                        searchTerm 
                      })
                    : t('common.tryDifferentSearch', { 
                        defaultValue: 'Spróbuj zmienić kryteria wyszukiwania.' 
                      })
            }
        />
    );
};

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => {
    const { t } = useTranslation();
    
    return (
        <EmptyState
            icon="exclamation-triangle"
            title={t('common.error', { defaultValue: 'Wystąpił błąd' })}
            description={message || t('common.errorDescription', { 
                defaultValue: 'Nie udało się załadować danych. Spróbuj ponownie.' 
            })}
            action={
                onRetry && (
                    <button 
                        className="btn btn-primary" 
                        onClick={onRetry}
                    >
                        <MDBIcon icon="redo" className="me-2" />
                        {t('common.retry', { defaultValue: 'Spróbuj ponownie' })}
                    </button>
                )
            }
        />
    );
};
