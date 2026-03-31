import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function CameraScanner({ active, onDetected, onStatusChange }) {
  const reactId = useId();
  const scannerId = useMemo(() => `smartcard-scanner-${reactId.replace(/[:]/g, '')}`, [reactId]);
  const [status, setStatus] = useState('Pret a scanner');
  const detectedRef = useRef(onDetected);
  const statusRef = useRef(onStatusChange);

  useEffect(() => {
    detectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    statusRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    let html5QrCode;
    let cancelled = false;

    const updateStatus = (message) => {
      setStatus(message);
      statusRef.current?.(message);
    };

    const startScanner = async () => {
      if (!active) {
        updateStatus('Scanner en pause');
        return;
      }

      try {
        updateStatus('Demarrage de la camera...');
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) {
          return;
        }

        html5QrCode = new Html5Qrcode(scannerId);
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
          async (decodedText) => {
            if (cancelled) {
              return;
            }

            updateStatus('Carte detectee. Verification en cours...');
            try {
              await html5QrCode.stop();
            } catch {
              // The scanner may already be stopping after a successful read.
            }
            await detectedRef.current?.(decodedText);
          },
          () => {
            if (!cancelled) {
              updateStatus('Cadrez le QR code dans la zone de scan');
            }
          },
        );
        updateStatus('Cadrez le QR code dans la zone de scan');
      } catch {
        updateStatus('Impossible d acceder a la camera. Utilisez la saisie manuelle.');
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      if (html5QrCode) {
        Promise.resolve()
          .then(async () => {
            if (html5QrCode.isScanning) {
              await html5QrCode.stop();
            }
          })
          .catch(() => undefined)
          .finally(() => {
            html5QrCode.clear().catch(() => undefined);
          });
      }
    };
  }, [active, scannerId]);

  return (
    <div className="camera-scanner-shell">
      <div id={scannerId} className="camera-scanner-view" />
      <p className="muted camera-scanner-status">{status}</p>
    </div>
  );
}
