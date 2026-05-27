/**
 * QR Scanner Component
 * Uses html5-qrcode (dynamic import) for camera-based QR scanning.
 * Falls back gracefully when the package is not available.
 * After scanning:
 *   - If the value is a URL pointing to this app's /qr/:code  → React Router navigate
 *   - Bare code EQ-/WO- → navigate('/qr/CODE')
 *   - Otherwise → passes raw value to onScan callback
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

interface QrScannerProps {
    onScan?: (value: string) => void;
    onError?: (error: string) => void;
    onClose?: () => void;
}

export const QrScanner = ({ onScan, onError, onClose }: QrScannerProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scannerRef = useRef<any>(null);
    const elementId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unavailable, setUnavailable] = useState(false);
    const navigate = useNavigate();

    const handleSuccess = (decodedText: string) => {
        stop();

        try {
            const url = new URL(decodedText);
            const match = url.pathname.match(/^\/qr\/([^/]+)$/);
            if (match) {
                navigate(`/qr/${encodeURIComponent(match[1])}`);
                return;
            }
        } catch {
            // Not a URL
        }

        if (/^(EQ|WO)-\d{6}$/i.test(decodedText.trim())) {
            navigate(`/qr/${encodeURIComponent(decodedText.trim().toUpperCase())}`);
            return;
        }

        onScan?.(decodedText);
    };

    const stop = () => {
        scannerRef.current?.stop().catch(() => {});
        scannerRef.current = null;
        setScanning(false);
    };

    const start = async () => {
        setError(null);
        try {
            // Dynamic import — if package missing in container, shows friendly message
            const { Html5Qrcode } = await import('html5-qrcode').catch(() => {
                throw new Error('Biblioteka skanera niedostępna. Przebuduj kontener frontend.');
            });

            const qr = new Html5Qrcode(elementId.current);
            scannerRef.current = qr;
            await qr.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                handleSuccess,
                () => { /* ignore per-frame errors */ },
            );
            setScanning(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Nie można uruchomić kamery';
            if (msg.includes('niedostępna')) setUnavailable(true);
            setError(msg);
            onError?.(msg);
        }
    };

    useEffect(() => {
        start();
        return () => { stop(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (unavailable) {
        return (
            <div className="text-center py-3">
                <MDBIcon icon="camera" size="2x" className="text-muted mb-3" />
                <p className="text-muted small">
                    Skaner jest niedostępny w tej wersji kontenera.<br />
                    Skieruj aparat telefonu na kod QR — link otworzy się automatycznie.
                </p>
                {onClose && (
                    <MDBBtn color="light" size="sm" onClick={onClose}>Zamknij</MDBBtn>
                )}
            </div>
        );
    }

    return (
        <div className="text-center">
            {error && (
                <div className="alert alert-danger small mb-3">
                    <MDBIcon icon="exclamation-triangle" className="me-2" />
                    {error}
                </div>
            )}

            <div
                id={elementId.current}
                className="overflow-hidden rounded"
                style={{ maxWidth: 320, margin: '0 auto' }}
            />

            <div className="mt-3 d-flex gap-2 justify-content-center">
                {scanning ? (
                    <MDBBtn color="danger" size="sm" onClick={stop}>
                        <MDBIcon icon="stop" className="me-1" />
                        Zatrzymaj
                    </MDBBtn>
                ) : (
                    !error && (
                        <MDBBtn color="primary" size="sm" onClick={start}>
                            <MDBIcon icon="camera" className="me-1" />
                            Skanuj
                        </MDBBtn>
                    )
                )}
                {onClose && (
                    <MDBBtn color="light" size="sm" onClick={() => { stop(); onClose(); }}>
                        Zamknij
                    </MDBBtn>
                )}
            </div>

            <p className="text-muted small mt-2">
                Skieruj kamerę na kod QR sprzętu lub zlecenia
            </p>
        </div>
    );
};


interface QrScannerProps {
    /** Called with raw scanned text when not a Maintly deep-link */
    onScan?: (value: string) => void;
    /** Called on scanner error */
    onError?: (error: string) => void;
    /** Callback when scanner is closed */
    onClose?: () => void;
}

export const QrScanner = ({ onScan, onError, onClose }: QrScannerProps) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const elementId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSuccess = (decodedText: string) => {
        stop();

        // Check if the value is a deep-link URL: .../qr/CODE
        try {
            const url = new URL(decodedText);
            const match = url.pathname.match(/^\/qr\/([^/]+)$/);
            if (match) {
                navigate(`/qr/${encodeURIComponent(match[1])}`);
                return;
            }
        } catch {
            // Not a URL — treat as raw code
        }

        // Bare code like EQ-000001 / WO-000001
        if (/^(EQ|WO)-\d{6}$/i.test(decodedText.trim())) {
            navigate(`/qr/${encodeURIComponent(decodedText.trim().toUpperCase())}`);
            return;
        }

        onScan?.(decodedText);
    };

    const start = async () => {
        setError(null);
        try {
            const qr = new Html5Qrcode(elementId.current);
            scannerRef.current = qr;
            await qr.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                handleSuccess,
                () => { /* ignore per-frame errors */ },
            );
            setScanning(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Nie można uruchomić kamery';
            setError(msg);
            onError?.(msg);
        }
    };

    const stop = () => {
        scannerRef.current?.stop().catch(() => {});
        scannerRef.current = null;
        setScanning(false);
    };

    useEffect(() => {
        start();
        return () => { stop(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="text-center">
            {error && (
                <div className="alert alert-danger small mb-3">
                    <MDBIcon icon="exclamation-triangle" className="me-2" />
                    {error}
                </div>
            )}

            {/* html5-qrcode mounts the camera feed here */}
            <div
                id={elementId.current}
                className="overflow-hidden rounded"
                style={{ maxWidth: 320, margin: '0 auto' }}
            />

            <div className="mt-3 d-flex gap-2 justify-content-center">
                {scanning ? (
                    <MDBBtn color="danger" size="sm" onClick={stop}>
                        <MDBIcon icon="stop" className="me-1" />
                        Zatrzymaj
                    </MDBBtn>
                ) : (
                    !error && (
                        <MDBBtn color="primary" size="sm" onClick={start}>
                            <MDBIcon icon="camera" className="me-1" />
                            Skanuj
                        </MDBBtn>
                    )
                )}
                {onClose && (
                    <MDBBtn color="light" size="sm" onClick={() => { stop(); onClose(); }}>
                        Zamknij
                    </MDBBtn>
                )}
            </div>

            <p className="text-muted small mt-2">
                Skieruj kamerę na kod QR sprzętu lub zlecenia
            </p>
        </div>
    );
};
