/**
 * QR Redirect Page
 * Handles deep-links opened from phone camera: /qr/EQ-000001 or /qr/WO-000001
 * Resolves the code via API and redirects to the correct entity page.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MDBCard, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit';
import { resolveCode } from '../../services/qrService';

export const QrRedirect = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setErrorMsg('Brak kodu QR.');
            return;
        }

        resolveCode(decodeURIComponent(code))
            .then((result) => {
                navigate(result.url, { replace: true });
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.error ||
                    'Nie znaleziono zasobu dla podanego kodu QR.';
                setErrorMsg(msg);
            });
    }, [code, navigate]);

    if (errorMsg) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <MDBCard className="shadow-sm border-0" style={{ maxWidth: 400 }}>
                    <MDBCardBody className="p-5 text-center">
                        <MDBIcon icon="qrcode" size="3x" className="text-secondary mb-3" />
                        <h5 className="mb-2">Nie znaleziono zasobu</h5>
                        <p className="text-muted mb-4">{errorMsg}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Wróć do pulpitu
                        </button>
                    </MDBCardBody>
                </MDBCard>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <MDBIcon icon="spinner" spin size="3x" className="text-primary mb-3" />
                <p className="text-muted">Otwieranie zasobu <span className="font-monospace">{code}</span>…</p>
            </div>
        </div>
    );
};
