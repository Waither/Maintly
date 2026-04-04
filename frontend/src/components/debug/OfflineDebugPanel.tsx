import { useEffect, useMemo, useState } from 'react';
import {
    getOfflineQueueLastSyncError,
    getOfflineQueueLastSyncAt,
    getQueuedRequestCount,
    getQueuedRequestSnapshot,
    OfflineQueueSyncErrorSnapshot,
    syncQueuedRequestsFallback,
} from '../../lib/offlineQueue';

export const OfflineDebugPanel = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
    const [lastSyncError, setLastSyncError] = useState<OfflineQueueSyncErrorSnapshot | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const shouldShow = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('offlineDebug') === '1') {
            return true;
        }

        return window.location.hostname === 'localhost';
    }, []);

    useEffect(() => {
        if (!shouldShow) {
            return;
        }

        const refresh = async () => {
            const [count, lastSync] = await Promise.all([
                getQueuedRequestCount(),
                Promise.resolve(getOfflineQueueLastSyncAt()),
            ]);
            setQueueCount(count);
            setLastSyncAt(lastSync);
            setLastSyncError(getOfflineQueueLastSyncError());
        };

        refresh().catch(() => {
            // Debug panel must never crash app.
        });
        const interval = window.setInterval(() => {
            refresh().catch(() => {
                // Ignore refresh errors in debug panel.
            });
        }, 2000);

        return () => {
            window.clearInterval(interval);
        };
    }, [shouldShow]);

    if (!shouldShow) {
        return null;
    }

    const handleSyncNow = async () => {
        setIsSyncing(true);
        try {
            await syncQueuedRequestsFallback();
            const count = await getQueuedRequestCount();
            setQueueCount(count);
            setLastSyncAt(getOfflineQueueLastSyncAt());
            setLastSyncError(getOfflineQueueLastSyncError());
        } finally {
            setIsSyncing(false);
        }
    };

    const handlePrintQueue = async () => {
        const snapshot = await getQueuedRequestSnapshot();
        console.table(snapshot);
    };

    return (
        <div
            style={{
                position: 'fixed',
                right: 12,
                bottom: 12,
                zIndex: 2000,
                background: '#111827',
                color: '#e5e7eb',
                border: '1px solid #374151',
                borderRadius: 8,
                padding: 12,
                width: 300,
                boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                fontSize: 12,
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Offline Queue Debug</div>
            <div>Online: {navigator.onLine ? 'yes' : 'no'}</div>
            <div>Queued requests: {queueCount}</div>
            <div>
                Last sync: {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'never'}
            </div>
            {lastSyncError && (
                <div style={{ marginTop: 8, color: '#fca5a5' }}>
                    <div>Last error: {lastSyncError.status ?? 'network'} {lastSyncError.statusText}</div>
                    <div style={{ wordBreak: 'break-all' }}>{lastSyncError.method} {lastSyncError.url}</div>
                </div>
            )}
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button
                    type="button"
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    style={{
                        border: '1px solid #4b5563',
                        background: '#1f2937',
                        color: '#e5e7eb',
                        borderRadius: 6,
                        padding: '4px 8px',
                        cursor: 'pointer',
                    }}
                >
                    {isSyncing ? 'Syncing...' : 'Sync now'}
                </button>
                <button
                    type="button"
                    onClick={handlePrintQueue}
                    style={{
                        border: '1px solid #4b5563',
                        background: '#1f2937',
                        color: '#e5e7eb',
                        borderRadius: 6,
                        padding: '4px 8px',
                        cursor: 'pointer',
                    }}
                >
                    Print queue
                </button>
            </div>
        </div>
    );
};
