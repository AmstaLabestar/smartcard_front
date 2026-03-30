import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { scanMerchantTransaction } from '../api/merchant.api';
import { ScanResultCard } from '../components/ScanResultCard';

export function MerchantScanPage() {
  const [form, setForm] = useState({
    qrCode: '',
    offerId: '',
    originalAmount: 100,
  });

  const { data: offersResponse } = useQuery({
    queryKey: ['merchant', 'offers'],
    queryFn: fetchMerchantOffers,
  });

  const mutation = useMutation({
    mutationFn: scanMerchantTransaction,
  });

  const offers = offersResponse?.data || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      ...form,
      originalAmount: Number(form.originalAmount),
    });
  };

  return (
    <div className="merchant-grid">
      <section className="content-card">
        <p className="eyebrow">Scan client</p>
        <h1>Valider une reduction</h1>
        <form className="stack-form" onSubmit={handleSubmit}>
          <input placeholder="QR Code du client" value={form.qrCode} onChange={(e) => setForm({ ...form, qrCode: e.target.value })} />
          <select value={form.offerId} onChange={(e) => setForm({ ...form, offerId: e.target.value })}>
            <option value="">Choisir une offre</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.title}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Montant initial" value={form.originalAmount} onChange={(e) => setForm({ ...form, originalAmount: e.target.value })} />
          {mutation.isError ? <p className="error-banner">{mutation.error.response?.data?.error?.message || 'Scan impossible'}</p> : null}
          <button className="primary-button" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Validation...' : 'Scanner et appliquer'}
          </button>
        </form>
      </section>
      <ScanResultCard transaction={mutation.data?.data} />
    </div>
  );
}
