import { QRCodeDisplay } from '../../../shared/components/qr/QRCodeDisplay';

export function UserCardPanel({ card }) {
  if (!card) return null;

  return (
    <section className="smart-card-panel smart-card-panel-premium wallet-active-card-panel user-card-panel-v2">
      <div className="smart-card-surface smart-card-surface-premium smart-card-surface-showcase wallet-active-card-surface user-card-surface-v2 user-card-surface-v2-compact">
        <div className="smart-card-shell-top user-card-shell-top-v2">
          <div className="user-card-title-block">
            <h2>{card.cardPlan?.name || card.title}</h2>
            <p className="user-card-status-text">Active</p>
          </div>
          <p className="user-card-brand">Tanga Groupe</p>
        </div>

        <div className="smart-card-qr smart-card-qr-visual smart-card-qr-visual-premium user-card-qr-wrap">
          <QRCodeDisplay value={card.qrCode} title={`Carte ${card.cardNumber}`} size={144} showValue={false} className="smart-card-qr-display user-card-qr-display" />
        </div>

        <div className="user-card-footer">
          <p className="user-card-number">{card.cardNumber}</p>
        </div>
      </div>
    </section>
  );
}
