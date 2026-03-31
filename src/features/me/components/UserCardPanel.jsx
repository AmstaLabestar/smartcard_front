import { QRCodeDisplay } from '../../../shared/components/qr/QRCodeDisplay';

export function UserCardPanel({ card }) {
  if (!card) return null;

  return (
    <section className="smart-card-panel smart-card-panel-premium">
      <div className="smart-card-surface smart-card-surface-premium smart-card-surface-showcase">
        <div className="smart-card-shell-top">
          <div>
            <p className="eyebrow eyebrow-inverse">Active</p>
            <h2>{card.cardPlan?.name || card.title}</h2>
          </div>
          <span className={`status-pill status-${card.status?.toLowerCase()}`}>{card.status}</span>
        </div>

        <div className="smart-card-meta smart-card-meta-premium smart-card-meta-premium-compact">
          <div>
            <span className="meta-label meta-label-inverse">Numero</span>
            <strong>{card.cardNumber}</strong>
          </div>
        </div>

        <div className="smart-card-qr smart-card-qr-visual smart-card-qr-visual-premium">
          <div>
            <p className="smart-card-title">Montrez ce QR</p>
            <p className="smart-card-helper">Le reste est automatique.</p>
          </div>
          <QRCodeDisplay value={card.qrCode} title={`Carte ${card.cardNumber}`} showValue={false} className="smart-card-qr-display" />
        </div>
      </div>

      <article className="content-card compact-card card-detail-card card-detail-card-premium">
        <h3>Numero & QR</h3>
        <div className="premium-detail-list premium-detail-list-compact">
          <div>
            <span className="meta-label">Numero</span>
            <strong>{card.cardNumber}</strong>
          </div>
          <div>
            <span className="meta-label">QR</span>
            <QRCodeDisplay value={card.qrCode} title={`Valeur QR ${card.cardNumber}`} size={120} className="owned-card-qr-display" />
          </div>
        </div>
      </article>
    </section>
  );
}
