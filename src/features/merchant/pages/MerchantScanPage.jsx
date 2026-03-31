import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { previewMerchantScan, scanMerchantTransaction } from '../api/merchant.api';
import { ScanResultCard } from '../components/ScanResultCard';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

const MAX_ALLOWED_AMOUNT = 100000;

export function MerchantScanPage() {
  const toast = useToast();
  const [form, setForm] = useState({
    qrCode: '',
    offerId: '',
    originalAmount: 100,
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewError, setPreviewError] = useState('');

  const previewMutation = useMutation({
    mutationFn: previewMerchantScan,
    onSuccess: (response) => {
      setPreviewError('');
      setPreviewData(response.data);
      setForm((current) => ({
        ...current,
        offerId: response.data.eligibleOffers?.[0]?.id || '',
      }));
      toast.success('Carte verifiee. Selectionnez maintenant une reduction compatible.', 'Carte validee');
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Verification impossible');
      setPreviewData(null);
      setPreviewError(message);
      setForm((current) => ({ ...current, offerId: '' }));
      toast.error(message, 'Verification impossible');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: scanMerchantTransaction,
    onSuccess: (response) => {
      toast.success(`Reduction appliquee. Montant final : ${response.data.amount}.`, 'Transaction enregistree');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Validation impossible'), 'Validation impossible');
    },
  });

  useEffect(() => {
    setPreviewData(null);
    setPreviewError('');
    setForm((current) => ({ ...current, offerId: '' }));
  }, [form.qrCode]);

  const eligibleOffers = previewData?.eligibleOffers || [];
  const selectedOffer = useMemo(
    () => eligibleOffers.find((offer) => offer.id === form.offerId) || null,
    [eligibleOffers, form.offerId],
  );

  const amountWarning = Number(form.originalAmount) > MAX_ALLOWED_AMOUNT
    ? 'Le montant saisi depasse la limite autorisee de 100000.'
    : '';

  const handlePreview = (event) => {
    event.preventDefault();

    previewMutation.mutate({
      qrCode: form.qrCode,
    });
  };

  const handleConfirm = (event) => {
    event.preventDefault();

    confirmMutation.mutate({
      qrCode: form.qrCode,
      offerId: form.offerId,
      originalAmount: Number(form.originalAmount),
    });
  };

  return (
    <div className="merchant-grid merchant-scan-grid">
      <section className="content-card">
        <p className="eyebrow">Scan client</p>
        <h1>Verifier la carte puis appliquer la bonne reduction</h1>
        <p className="muted">Commencez par scanner la carte du client. Nous vous montrerons ensuite uniquement les avantages compatibles avec cette formule dans votre commerce.</p>

        <div className="scan-tip-card">
          <strong>Etape 1</strong>
          <p className="muted">Scannez le QR code pour verifier la carte et charger les reductions autorisees.</p>
        </div>

        <form className="stack-form" onSubmit={handlePreview}>
          <input
            placeholder="QR Code du client"
            value={form.qrCode}
            onChange={(e) => setForm({ ...form, qrCode: e.target.value })}
          />
          {previewError ? <p className="error-banner">{previewError}</p> : null}
          <button className="primary-button" type="submit" disabled={previewMutation.isPending || !form.qrCode.trim()}>
            {previewMutation.isPending ? 'Verification...' : 'Verifier la carte'}
          </button>
        </form>

        {previewData ? (
          <>
            <div className="scan-tip-card">
              <strong>Etape 2</strong>
              <p className="muted">Choisissez une reduction compatible, saisissez le montant initial exact puis confirmez la transaction.</p>
            </div>

            {eligibleOffers.length === 0 ? (
              <p className="error-banner">Aucune reduction active n est disponible pour cette carte dans votre commerce.</p>
            ) : (
              <form className="stack-form" onSubmit={handleConfirm}>
                <select value={form.offerId} onChange={(e) => setForm({ ...form, offerId: e.target.value })}>
                  <option value="">Choisir une offre compatible</option>
                  {eligibleOffers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.title}
                    </option>
                  ))}
                </select>
                {selectedOffer ? (
                  <div className="purchase-result">
                    <p><strong>Reduction :</strong> {selectedOffer.discountValue} {selectedOffer.discountType === 'PERCENTAGE' ? '%' : ''}</p>
                    <p><strong>Conditions :</strong> {selectedOffer.terms || 'Aucune condition particuliere.'}</p>
                  </div>
                ) : null}
                <input
                  type="number"
                  min="0"
                  max={MAX_ALLOWED_AMOUNT}
                  placeholder="Montant initial"
                  value={form.originalAmount}
                  onChange={(e) => setForm({ ...form, originalAmount: e.target.value })}
                />
                {amountWarning ? <p className="error-banner">{amountWarning}</p> : null}
                {confirmMutation.isError ? <p className="error-banner">{getApiErrorMessage(confirmMutation.error, 'Validation impossible')}</p> : null}
                <button
                  className="primary-button"
                  type="submit"
                  disabled={confirmMutation.isPending || !form.offerId || Number(form.originalAmount) > MAX_ALLOWED_AMOUNT}
                >
                  {confirmMutation.isPending ? 'Validation...' : 'Appliquer la reduction'}
                </button>
              </form>
            )}
          </>
        ) : null}
      </section>
      <ScanResultCard preview={previewData} transaction={confirmMutation.data?.data} />
    </div>
  );
}
