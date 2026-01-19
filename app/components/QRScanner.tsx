'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function QRScanner() {
    const router = useRouter();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cameraId, setCameraId] = useState<string>('');
    const [cameras, setCameras] = useState<any[]>([]);

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);
                // Prefer back camera
                const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
                setCameraId(backCamera?.id || devices[0].id);
            }
        }).catch(err => {
            setError('Unable to access cameras. Please check permissions.');
        });

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        if (!cameraId) {
            setError('No camera available');
            return;
        }

        try {
            const scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;

            await scanner.start(
                cameraId,
                {
                    fps: 30, // Increased from 10 to 30 for faster detection
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    // Successfully scanned
                    handleScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Scan error (ignore, happens frequently)
                }
            );

            setIsScanning(true);
            setError('');
            setSuccess('');
        } catch (err: any) {
            setError(err.message || 'Failed to start camera');
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const handleScanSuccess = async (decodedText: string) => {
        // Stop scanning immediately
        await stopScanning();

        try {
            // Parse the URL
            const url = new URL(decodedText);

            // Check if it's our app's QR code
            if (url.pathname.startsWith('/q/')) {
                // Extract item ID
                const itemId = url.pathname.split('/q/')[1];

                // Show success message
                setSuccess('QR Code detected! Redirecting...');

                // Navigate to the public page after a brief delay
                setTimeout(() => {
                    router.push(`/q/${itemId}`);
                }, 500);
            } else {
                setError('This QR code is not from QR Master app');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            // Not a valid URL, try to extract item ID directly
            // In case QR code just contains the item ID
            if (/^\d+$/.test(decodedText)) {
                setSuccess('QR Code detected! Redirecting...');
                setTimeout(() => {
                    router.push(`/q/${decodedText}`);
                }, 500);
            } else {
                setError('Invalid QR code');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const switchCamera = () => {
        if (cameras.length > 1) {
            const currentIndex = cameras.findIndex(c => c.id === cameraId);
            const nextIndex = (currentIndex + 1) % cameras.length;
            setCameraId(cameras[nextIndex].id);

            if (isScanning) {
                stopScanning().then(() => startScanning());
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - var(--nav-height))',
            background: '#000'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '16px 20px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                    📷 Scan QR Code
                </h1>
                {cameras.length > 1 && (
                    <button
                        onClick={switchCamera}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Switch
                    </button>
                )}
            </div>

            {/* Scanner Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '20px'
            }}>
                {/* QR Reader */}
                <div
                    id="qr-reader"
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)'
                    }}
                />

                {/* Scan Overlay */}
                {isScanning && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '250px',
                        height: '250px',
                        border: '3px solid var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        pointerEvents: 'none',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-3px',
                            left: '-3px',
                            width: '30px',
                            height: '30px',
                            borderTop: '6px solid var(--primary)',
                            borderLeft: '6px solid var(--primary)',
                            borderRadius: '8px 0 0 0'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '-3px',
                            right: '-3px',
                            width: '30px',
                            height: '30px',
                            borderTop: '6px solid var(--primary)',
                            borderRight: '6px solid var(--primary)',
                            borderRadius: '0 8px 0 0'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-3px',
                            left: '-3px',
                            width: '30px',
                            height: '30px',
                            borderBottom: '6px solid var(--primary)',
                            borderLeft: '6px solid var(--primary)',
                            borderRadius: '0 0 0 8px'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-3px',
                            right: '-3px',
                            width: '30px',
                            height: '30px',
                            borderBottom: '6px solid var(--primary)',
                            borderRight: '6px solid var(--primary)',
                            borderRadius: '0 0 8px 0'
                        }} />
                    </div>
                )}

                {/* Instructions */}
                {!isScanning && !error && (
                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                            Point your camera at a QR Master QR code
                        </p>
                        <button
                            onClick={startScanning}
                            className="btn btn-primary"
                            style={{ minWidth: '200px' }}
                        >
                            🎥 Start Camera
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px 24px',
                        background: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 500,
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px 24px',
                        background: '#d1fae5',
                        color: '#065f46',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 500,
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        ✓ {success}
                    </div>
                )}

                {/* Scanning Status */}
                {isScanning && (
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#10b981',
                                animation: 'pulse 2s infinite'
                            }} />
                            Scanning...
                        </div>
                        <button
                            onClick={stopScanning}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                padding: '12px 24px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Stop Scanning
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}
