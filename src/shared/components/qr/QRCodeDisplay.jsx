import { QRCodeSVG } from 'qrcode.react';

export function QRCodeDisplay({ value, title = 'QR code SmartCard', size = 172, showValue = true, className = '' }) {
  if (!value) {
    return null;
  }

  const rootClassName = className ? `qr-display ${className}` : 'qr-display';

  return (
    <div className={rootClassName}>
      <div className="qr-display-frame">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#ffffff"
          fgColor="#18230f"
          includeMargin
          level="M"
          title={title}
        />
      </div>
      {showValue ? <code className="qr-display-value">{value}</code> : null}
    </div>
  );
}
