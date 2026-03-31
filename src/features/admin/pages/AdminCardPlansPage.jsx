import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  createAdminCardPlan,
  fetchAdminCardPlans,
  fetchAdminOffers,
  replaceAdminCardPlanOffers,
  updateAdminCardPlanStatus,
} from '../api/admin.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { PageIntro } from '../../../shared/ui/PageIntro';

const initialForm = {
  name: '',
  slug: '',
  description: '',
  marketingHighlights: '',
  price: 19.99,
  status: 'ACTIVE',
};

const toOptionalField = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
};

export function AdminCardPlansPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [selectedCardPlanId, setSelectedCardPlanId] = useState('');
  const [selectedOfferIds, setSelectedOfferIds] = useState([]);

  const { data: cardPlansResponse, isLoading: isCardPlansLoading } = useQuery({
    queryKey: ['admin', 'card-plans'],
    queryFn: fetchAdminCardPlans,
  });

  const { data: offersResponse, isLoading: isOffersLoading } = useQuery({
    queryKey: ['admin', 'offers'],
    queryFn: fetchAdminOffers,
  });

  const cardPlans = cardPlansResponse?.data || [];
  const offers = offersResponse?.data || [];

  const selectedCardPlan = useMemo(
    () => cardPlans.find((cardPlan) => cardPlan.id === selectedCardPlanId) || null,
    [cardPlans, selectedCardPlanId],
  );

  const createMutation = useMutation({
    mutationFn: createAdminCardPlan,
    onSuccess: () => {
      toast.success('Le plan a ete cree.', 'Plan ajoute');
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['admin', 'card-plans'] });
      queryClient.invalidateQueries({ queryKey: ['card-plans', 'public'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Creation impossible'), 'Action impossible');
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateAdminCardPlanStatus,
    onSuccess: (_response, variables) => {
      toast.success(`Le plan est maintenant ${variables.status.toLowerCase()}.`, 'Statut mis a jour');
      queryClient.invalidateQueries({ queryKey: ['admin', 'card-plans'] });
      queryClient.invalidateQueries({ queryKey: ['card-plans', 'public'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Mise a jour impossible'), 'Action impossible');
    },
  });

  const offersMutation = useMutation({
    mutationFn: replaceAdminCardPlanOffers,
    onSuccess: () => {
      toast.success('Les avantages ont ete mis a jour.', 'Offres associees');
      setSelectedOfferIds([]);
      queryClient.invalidateQueries({ queryKey: ['admin', 'card-plans'] });
      queryClient.invalidateQueries({ queryKey: ['card-plans', 'public'] });
      queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Association impossible'), 'Action impossible');
    },
  });

  if (isCardPlansLoading || isOffersLoading) {
    return <LoadingState title="Plans" description="Nous recuperons les cartes commerciales." />;
  }

  return (
    <div className="premium-page-stack admin-card-plans-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Plans"
          title="Composez les cartes commerciales"
          description="Creez un plan, fixez son prix et associez-lui les bonnes offres."
        />
      </section>

      <section className="merchant-grid admin-card-plan-grid admin-card-plan-grid-polished">
        <section className="content-card premium-support-card">
          <p className="eyebrow">Creation</p>
          <h2>Nouveau plan</h2>
          <form
            className="stack-form"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate({
                name: form.name.trim(),
                slug: toOptionalField(form.slug),
                description: toOptionalField(form.description),
                marketingHighlights: toOptionalField(form.marketingHighlights),
                price: Number(form.price),
                status: form.status,
              });
            }}
          >
            <input placeholder="Nom du plan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Promesse" value={form.marketingHighlights} onChange={(e) => setForm({ ...form, marketingHighlights: e.target.value })} />
            <input type="number" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Brouillon</option>
              <option value="ARCHIVED">Archivee</option>
            </select>
            <button className="primary-button" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creation...' : 'Creer'}
            </button>
          </form>
        </section>

        <section className="content-card premium-support-card premium-support-card-accent">
          <p className="eyebrow">Catalogue</p>
          <h2>Plans existants</h2>
          {cardPlans.length === 0 ? (
            <EmptyState
              title="Aucun plan pour le moment"
              description="Creez votre premier plan pour commencer."
            />
          ) : (
            <div className="list-stack">
              {cardPlans.map((cardPlan) => (
                <article key={cardPlan.id} className="list-item admin-card-plan-item admin-card-plan-item-polished">
                  <div>
                    <strong>{cardPlan.name}</strong>
                    <p className="muted">{cardPlan.price} - {cardPlan.slug}</p>
                    <p className="muted">{cardPlan.offers?.length || 0} avantages</p>
                  </div>
                  <div className="merchant-offer-actions">
                    <span className={`status-pill status-${cardPlan.status.toLowerCase()}`}>{cardPlan.status}</span>
                    <div className="inline-actions premium-inline-actions-compact">
                      <button type="button" onClick={() => setSelectedCardPlanId(cardPlan.id)}>
                        Offres
                      </button>
                      <button type="button" onClick={() => statusMutation.mutate({ cardPlanId: cardPlan.id, status: 'ACTIVE' })}>
                        Publier
                      </button>
                      <button type="button" onClick={() => statusMutation.mutate({ cardPlanId: cardPlan.id, status: 'DRAFT' })}>
                        Pause
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="content-card admin-card-plan-offers-card premium-support-card">
          <p className="eyebrow">Offres</p>
          <h2>{selectedCardPlan ? selectedCardPlan.name : 'Choisissez un plan'}</h2>
          {!selectedCardPlan ? (
            <p className="muted">Selectionnez un plan pour lui associer des offres.</p>
          ) : (
            <>
              <div className="offer-selector-grid">
                {offers.map((offer) => {
                  const checked = selectedOfferIds.includes(offer.id) || selectedCardPlan.offers?.some((linkedOffer) => linkedOffer.id === offer.id);

                  return (
                    <label key={offer.id} className="selector-card">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedOfferIds((current) => [...new Set([...current, offer.id])]);
                            return;
                          }

                          setSelectedOfferIds((current) => current.filter((id) => id !== offer.id));
                        }}
                      />
                      <span>{offer.title}</span>
                      <small className="muted">{offer.discountType} - {offer.discountValue}</small>
                    </label>
                  );
                })}
              </div>
              <button
                className="primary-button"
                type="button"
                disabled={offersMutation.isPending}
                onClick={() => {
                  const currentIds = selectedOfferIds.length > 0
                    ? selectedOfferIds
                    : (selectedCardPlan.offers || []).map((offer) => offer.id);

                  offersMutation.mutate({
                    cardPlanId: selectedCardPlan.id,
                    offerIds: currentIds,
                  });
                }}
              >
                {offersMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </>
          )}
        </section>
      </section>
    </div>
  );
}
