import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMerchantOffer, updateMerchantOfferStatus } from '../api/merchant.api';
import { MerchantOfferList } from '../components/MerchantOfferList';
import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { PageIntro } from '../../../shared/ui/PageIntro';

const FILTERS = [
  { id: 'ALL', label: 'Toutes' },
  { id: 'ACTIVE', label: 'Actives' },
  { id: 'DRAFT', label: 'Inactives' },
];

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
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ['merchant', 'offers'],
    queryFn: fetchMerchantOffers,
  });

  const createMutation = useMutation({
    mutationFn: createMerchantOffer,
    onSuccess: () => {
      const message = 'Offre creee.';
      setFeedback(message);
      setForm(initialForm);
      setIsComposerOpen(false);
      toast.success(message, 'Nouvelle offre');
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

  const visibleOffers = useMemo(() => {
    if (activeFilter === 'ALL') return offers;
    return offers.filter((offer) => offer.status === activeFilter);
  }, [offers, activeFilter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('');
    createMutation.mutate({
      ...form,
      discountValue: Number(form.discountValue),
    });
  };

  return (
    <div className="premium-page-stack merchant-offers-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft merchant-offers-v2-hero">
        <PageIntro
          kicker="Offres"
          title="Creez et gerez vos offres"
          description="Catalogue simple et activation rapide."
          compact
        />
      </section>

      <section className="panel content-card premium-support-card merchant-offers-v2-toolbar">
        <div className="merchant-offers-v2-toolbar-actions">
          <button
            type="button"
            className="primary-button merchant-offers-v2-toolbar-button"
            onClick={() => {
              setFeedback('');
              setIsComposerOpen(true);
            }}
          >
            Nouvelle offre
          </button>
        </div>

        <div className="merchant-offers-v2-filters">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-chip ${activeFilter === filter.id ? 'filter-chip-active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel content-card premium-support-card merchant-offers-v2-catalog">
        <div className="merchant-offers-v2-heading">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2>Mes offres</h2>
          </div>
          <span className="merchant-offers-v2-count">{visibleOffers.length}</span>
        </div>

        {isLoading ? (
          <p className="muted">Chargement...</p>
        ) : visibleOffers.length === 0 ? (
          <div className="merchant-offers-v2-empty">
            <p className="muted">{activeFilter === 'ACTIVE' ? 'Aucune offre active.' : 'Aucune offre pour le moment.'}</p>
            <button
              type="button"
              className="primary-button merchant-offers-v2-empty-button"
              onClick={() => {
                setFeedback('');
                setIsComposerOpen(true);
              }}
            >
              Nouvelle offre
            </button>
          </div>
        ) : (
          <MerchantOfferList
            offers={visibleOffers}
            isUpdating={statusMutation.isPending}
            onStatusChange={(offerId, status) => statusMutation.mutate({ offerId, status })}
          />
        )}
      </section>

      {isComposerOpen ? (
        <div className="merchant-offers-modal-backdrop" role="presentation" onClick={() => setIsComposerOpen(false)}>
          <section
            className="merchant-offers-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="merchant-offer-create-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="merchant-offers-modal-head">
              <div>
                <p className="eyebrow">Creation</p>
                <h3 id="merchant-offer-create-title">Nouvelle offre</h3>
              </div>
              <button
                type="button"
                className="merchant-offers-modal-close"
                onClick={() => setIsComposerOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form className="stack-form merchant-offers-v2-form" onSubmit={handleSubmit}>
              <input placeholder="Nom" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input
                placeholder="Description courte"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="merchant-offers-v2-form-row">
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="PERCENTAGE">Pourcentage</option>
                  <option value="FIXED">Montant fixe</option>
                </select>
                <input
                  type="number"
                  placeholder="Valeur"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                />
              </div>
              <input placeholder="Conditions" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Brouillon</option>
              </select>

              {feedback ? <p className={createMutation.isError ? 'error-banner' : 'success-banner'}>{feedback}</p> : null}

              <div className="merchant-offers-v2-form-actions">
                <button type="button" className="primary-button alt-button merchant-offers-v2-toolbar-button" onClick={() => setIsComposerOpen(false)}>
                  Annuler
                </button>
                <button className="primary-button merchant-offers-v2-toolbar-button" type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creation...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
