import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function CameraScanner({ active, onDetected, onStatusChange }) {
  const reactId = useId();
  const scannerId = useMemo(() => `smartcard-scanner-${reactId.replace(/[:]/g, '')}`, [reactId]);
  const [status, setStatus] = useState('');
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
        updateStatus('');
        return;
      }

      try {
        updateStatus('');
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

            updateStatus('');
            try {
              await html5QrCode.stop();
            } catch {
              // The scanner may already be stopping after a successful read.
            }
            await detectedRef.current?.(decodedText);
          },
          () => {},
        );
        const scannerRoot = document.getElementById(scannerId);
        const dashboard = scannerRoot?.querySelector('[id$="__dashboard"]');
        if (dashboard) {
          dashboard.setAttribute('hidden', 'hidden');
        }
        updateStatus('');
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

  const shouldShowStatus = Boolean(status && status.startsWith('Impossible'));

  return (
    <div className="camera-scanner-shell">
      <div id={scannerId} className="camera-scanner-view" />
      {shouldShowStatus ? <p className="muted camera-scanner-status">{status}</p> : null}
    </div>
  );
}
