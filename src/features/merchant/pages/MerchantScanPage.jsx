import { useMutation } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

import { previewMerchantScan, scanMerchantTransaction } from '../api/merchant.api';
import { ScanResultCard } from '../components/ScanResultCard';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { LoadingState } from '../../../shared/components/states/LoadingState';

const CameraScanner = lazy(() => import('../components/CameraScanner').then((module) => ({ default: module.CameraScanner })));

const DEFAULT_MAX_ALLOWED_AMOUNT = Number(import.meta.env.VITE_MAX_TRANSACTION_AMOUNT || 1000000);

export function MerchantScanPage() {
  const toast = useToast();
  const [scanMode, setScanMode] = useState('camera');
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

      if ((response.data.eligibleOffers?.length || 0) > 0) {
        toast.success('Carte lue.', 'Scan pret');
      } else {
        toast.info('Aucune reduction disponible pour cette carte ici.', 'Aucune reduction');
      }
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
      toast.success(`Montant final : ${response.data.amount}.`, 'Reduction appliquee');
      setForm((current) => ({
        ...current,
        originalAmount: '',
      }));
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

  const maxAllowedAmount = Number(previewData?.limits?.maxTransactionAmount || DEFAULT_MAX_ALLOWED_AMOUNT);
  const amountWarning = Number(form.originalAmount) > maxAllowedAmount
    ? `Le montant depasse ${maxAllowedAmount}.`
    : '';
  const hasScanResult = Boolean(previewData || confirmMutation.data?.data);

  const launchPreview = async (qrCodeValue) => {
    const normalizedValue = qrCodeValue.trim();
    if (!normalizedValue) {
      return;
    }

    setForm((current) => ({ ...current, qrCode: normalizedValue }));
    previewMutation.mutate({ qrCode: normalizedValue });
  };

  const handlePreview = async (event) => {
    event.preventDefault();
    await launchPreview(form.qrCode);
  };

  const handleDetected = async (decodedText) => {
    await launchPreview(decodedText);
  };

  const handleConfirm = (event) => {
    event.preventDefault();

    confirmMutation.mutate({
      qrCode: form.qrCode,
      offerId: form.offerId,
      originalAmount: Number(form.originalAmount),
    });
  };

  const handleResetScan = () => {
    setPreviewData(null);
    setPreviewError('');
    setForm({
      qrCode: '',
      offerId: '',
      originalAmount: 100,
    });
    previewMutation.reset();
    confirmMutation.reset();
  };

  return (
    <div className="merchant-grid merchant-scan-grid premium-page-stack merchant-scan-layout">
      <section className="content-card premium-support-card merchant-scan-main-card">
        <p className="eyebrow">Scan client</p>
        <h1>Pret a scanner</h1>
        <p className="muted">Camera d abord. Saisie manuelle en secours.</p>

        <div className="scan-mode-toggle" role="tablist" aria-label="Mode de scan">
          <button
            className={scanMode === 'camera' ? 'filter-chip filter-chip-active' : 'filter-chip'}
            type="button"
            onClick={() => setScanMode('camera')}
          >
            Camera
          </button>
          <button
            className={scanMode === 'manual' ? 'filter-chip filter-chip-active' : 'filter-chip'}
            type="button"
            onClick={() => setScanMode('manual')}
          >
            Manuel
          </button>
        </div>

        {scanMode === 'camera' && !hasScanResult ? (
          <div className="scan-camera-card">
            <div className="scan-tip-card">
              <strong>1. Scannez</strong>
              <p className="muted">Cadrez le QR.</p>
            </div>
            <Suspense fallback={<LoadingState title="Camera" description="Nous preparons le scanner." />}>
              <CameraScanner active onDetected={handleDetected} />
            </Suspense>
            <button className="primary-button alt-button merchant-secondary-button" type="button" onClick={() => setScanMode('manual')}>
              Passer en manuel
            </button>
          </div>
        ) : scanMode === 'manual' && !hasScanResult ? (
          <>
            <div className="scan-tip-card">
              <strong>1. Verifiez</strong>
              <p className="muted">Saisissez le code de la carte.</p>
            </div>

            <form className="stack-form" onSubmit={handlePreview}>
              <input
                placeholder="Code carte"
                value={form.qrCode}
                onChange={(e) => setForm({ ...form, qrCode: e.target.value })}
              />
              {previewError ? <p className="error-banner">{previewError}</p> : null}
              <button className="primary-button" type="submit" disabled={previewMutation.isPending || !form.qrCode.trim()}>
                {previewMutation.isPending ? 'Verification...' : 'Verifier'}
              </button>
            </form>
          </>
        ) : null}

        {hasScanResult ? (
          <div className="scan-tip-card scan-tip-card-compact">
            <strong>Carte lue</strong>
            <p className="muted">Passez a la validation.</p>
            <button className="primary-button alt-button merchant-secondary-button" type="button" onClick={handleResetScan}>
              Nouveau scan
            </button>
          </div>
        ) : null}

        {previewData ? (
          <>
            <div className="scan-tip-card">
              <strong>2. Validez</strong>
              <p className="muted">Choisissez et confirmez.</p>
            </div>

            {eligibleOffers.length === 0 ? (
              <p className="error-banner">Aucune reduction disponible pour cette carte dans votre commerce.</p>
            ) : (
              <form className="stack-form" onSubmit={handleConfirm}>
                <select value={form.offerId} onChange={(e) => setForm({ ...form, offerId: e.target.value })}>
                  <option value="">Choisir une offre</option>
                  {eligibleOffers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.title}
                    </option>
                  ))}
                </select>
                {selectedOffer ? (
                  <div className="purchase-result">
                    <p><strong>Reduction :</strong> {selectedOffer.discountValue} {selectedOffer.discountType === 'PERCENTAGE' ? '%' : ''}</p>
                    <p><strong>Conditions :</strong> {selectedOffer.terms || 'Aucune.'}</p>
                  </div>
                ) : null}
                <input
                  type="number"
                  min="0"
                  max={maxAllowedAmount}
                  placeholder="Montant initial"
                  value={form.originalAmount}
                  onChange={(e) => setForm({ ...form, originalAmount: e.target.value })}
                />
                <p className="muted">Max : {maxAllowedAmount}</p>
                {amountWarning ? <p className="error-banner">{amountWarning}</p> : null}
                {confirmMutation.isError ? <p className="error-banner">{getApiErrorMessage(confirmMutation.error, 'Validation impossible')}</p> : null}
                <button
                  className="primary-button"
                  type="submit"
                  disabled={confirmMutation.isPending || !form.offerId || Number(form.originalAmount) > maxAllowedAmount}
                >
                  {confirmMutation.isPending ? 'Validation...' : 'Valider'}
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
