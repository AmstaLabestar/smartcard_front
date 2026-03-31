import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createMerchantOffer, updateMerchantOfferStatus } from '../api/merchant.api';
import { MerchantOfferList } from '../components/MerchantOfferList';
import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { PageIntro } from '../../../shared/ui/PageIntro';

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
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ['merchant', 'offers'],
    queryFn: fetchMerchantOffers,
  });

  const createMutation = useMutation({
    mutationFn: createMerchantOffer,
    onSuccess: () => {
      const message = 'Votre offre est prete.';
      setFeedback(message);
      setForm(initialForm);
      toast.success(message, 'Offre creee');
      queryClient.invalidateQueries({ queryKey: ['merchant', 'offers'] });
      queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Creation impossible');
      setFeedback(message);
      toast.error(message, 'Creation impossible');
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateMerchantOfferStatus,
    onSuccess: (_response, variables) => {
      toast.success(`Statut : ${variables.status}.`, 'Offre mise a jour');
      queryClient.invalidateQueries({ queryKey: ['merchant', 'offers'] });
      queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Mise a jour impossible'), 'Action impossible');
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
    <div className="merchant-grid premium-page-stack merchant-offers-layout">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Offres"
          title="Creez et pilotez vos offres"
          description="Des offres claires, activables et faciles a suivre."
        />
      </section>

      <section className="content-card premium-support-card">
        <p className="eyebrow">Creation</p>
        <h2>Nouvelle offre</h2>
        <form className="stack-form" onSubmit={handleSubmit}>
          <input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description courte" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
            <option value="PERCENTAGE">Pourcentage</option>
            <option value="FIXED">Montant fixe</option>
          </select>
          <input type="number" placeholder="Valeur" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          <input placeholder="Conditions" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Brouillon</option>
          </select>
          {feedback ? <p className={createMutation.isError ? 'error-banner' : 'success-banner'}>{feedback}</p> : null}
          <button className="primary-button" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creation...' : 'Creer'}
          </button>
        </form>
      </section>
      <section className="content-card premium-support-card premium-support-card-accent">
        <p className="eyebrow">Catalogue</p>
        <h2>Mes offres</h2>
        {isLoading ? (
          <p className="muted">Chargement...</p>
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
