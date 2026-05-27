/**
 * QR Code Display Component
 * Generates a QR code image using the free qrserver.com API.
 * No external npm package required — works out of the box.
 * The QR content is a deep-link URL: {origin}/qr/{code}
 */

import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

interface QrCodeDisplayProps {
    /** EQ-000001 or WO-000001 */
    code: string;
    /** Label shown below the QR code */
    label?: string;
    /** Size in pixels (default 180) */
    size?: number;
    /** Show download button */
    showDownload?: boolean;
}

export const QrCodeDisplay = ({
    code,
    label,
    size = 180,
    showDownload = true,
}: QrCodeDisplayProps) => {
    const qrValue = `${window.location.origin}/qr/${encodeURIComponent(code)}`;

    // Uses the free qrserver.com API – no package needed
    const imgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrValue)}&format=svg&margin=4`;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = `${code}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="text-center">
            <div className="d-inline-block p-2 bg-white rounded border" style={{ lineHeight: 0 }}>
                <img
                    src={imgSrc}
                    alt={`QR: ${code}`}
                    width={size}
                    height={size}
                    style={{ display: 'block' }}
                />
            </div>
            {label && (
                <div className="mt-2 font-monospace small text-muted">{label}</div>
            )}
            {showDownload && (
                <div className="mt-2">
                    <MDBBtn size="sm" color="light" onClick={handleDownload} title="Pobierz SVG">
                        <MDBIcon icon="download" className="me-1" />
                        Pobierz SVG
                    </MDBBtn>
                </div>
            )}
        </div>
    );
};


interface QrCodeDisplayProps {
    /** EQ-000001 or WO-000001 */
    code: string;
    /** Label shown below the QR code */
    label?: string;
    /** Size in pixels (default 180) */
    size?: number;
    /** Show download button */
    showDownload?: boolean;
}

export const QrCodeDisplay = ({
    code,
    label,
    size = 180,
    showDownload = true,
}: QrCodeDisplayProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const qrValue = `${window.location.origin}/qr/${encodeURIComponent(code)}`;

    const handleDownload = () => {
        const svg = containerRef.current?.querySelector('svg');
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });

        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${code}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="text-center">
            <div
                ref={containerRef}
                className="d-inline-block p-2 bg-white rounded border"
                style={{ lineHeight: 0 }}
            >
                <QRCode
                    value={qrValue}
                    size={size}
                    style={{ height: 'auto', maxWidth: '100%', width: size }}
                    viewBox={`0 0 ${size} ${size}`}
                />
            </div>
            {label && (
                <div className="mt-2 font-monospace small text-muted">{label}</div>
            )}
            {showDownload && (
                <div className="mt-2">
                    <MDBBtn
                        size="sm"
                        color="light"
                        onClick={handleDownload}
                        title="Pobierz SVG"
                    >
                        <MDBIcon icon="download" className="me-1" />
                        Pobierz SVG
                    </MDBBtn>
                </div>
            )}
        </div>
    );
};
