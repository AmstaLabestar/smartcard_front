import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createMerchantOffer, updateMerchantOfferStatus } from '../api/merchant.api';
import { MerchantOfferList } from '../components/MerchantOfferList';
import { fetchMerchantOffers } from '../../offers/api/offers.api';

const initialForm = {
  title: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  terms: '',
  status: 'ACTIVE',
};

export function MerchantOffersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ['merchant', 'offers'],
    queryFn: fetchMerchantOffers,
  });

  const createMutation = useMutation({
    mutationFn: createMerchantOffer,
    onSuccess: () => {
      setFeedback('Offre creee avec succes.');
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['merchant', 'offers'] });
      queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
    onError: (error) => {
      setFeedback(error.response?.data?.error?.message || 'Creation impossible');
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateMerchantOfferStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'offers'] });
      queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
  });

  const offers = offersResponse?.data || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('');
    createMutation.mutate({
      ...form,
      discountValue: Number(form.discountValue),
    });
  };

  return (
    <div className="merchant-grid">
      <section className="content-card">
        <p className="eyebrow">Merchant Offers</p>
        <h1>Creer une offre</h1>
        <form className="stack-form" onSubmit={handleSubmit}>
          <input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
            <option value="PERCENTAGE">Pourcentage</option>
            <option value="FIXED">Montant fixe</option>
          </select>
          <input type="number" placeholder="Valeur reduction" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          <input placeholder="Conditions" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
          </select>
          {feedback ? <p className="muted">{feedback}</p> : null}
          <button className="primary-button" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creation...' : 'Creer l\'offre'}
          </button>
        </form>
      </section>
      <section className="content-card">
        <p className="eyebrow">Mes offres</p>
        <h2>Catalogue merchant</h2>
        {isLoading ? (
          <p className="muted">Chargement des offres...</p>
        ) : offers.length === 0 ? (
          <p className="muted">Aucune offre pour le moment.</p>
        ) : (
          <MerchantOfferList
            offers={offers}
            isUpdating={statusMutation.isPending}
            onStatusChange={(offerId, status) => statusMutation.mutate({ offerId, status })}
          />
        )}
      </section>
    </div>
  );
}
