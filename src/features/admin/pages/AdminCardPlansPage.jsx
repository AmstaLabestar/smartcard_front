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

const initialForm = {
  name: '',
  slug: '',
  description: '',
  marketingHighlights: '',
  price: 19.99,
  status: 'ACTIVE',
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
      toast.success('Le card plan a ete cree avec succes.', 'Card plan cree');
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
      toast.success(`Statut mis a jour : ${variables.status}.`, 'Card plan mis a jour');
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
      toast.success('Les offres rattachees ont ete mises a jour.', 'Avantages mis a jour');
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
    return <LoadingState title="Chargement des card plans" description="Nous recuperons les cartes commerciales et les offres disponibles." />;
  }

  return (
    <div className="merchant-grid admin-card-plan-grid">
      <section className="content-card">
        <p className="eyebrow">Admin Card Plans</p>
        <h1>Creer une carte commerciale</h1>
        <form
          className="stack-form"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate({
              ...form,
              price: Number(form.price),
            });
          }}
        >
          <input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Arguments commerciaux" value={form.marketingHighlights} onChange={(e) => setForm({ ...form, marketingHighlights: e.target.value })} />
          <input type="number" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <button className="primary-button" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creation...' : 'Creer le card plan'}
          </button>
        </form>
      </section>

      <section className="content-card">
        <p className="eyebrow">Catalogue admin</p>
        <h2>Card plans existants</h2>
        {cardPlans.length === 0 ? (
          <EmptyState
            title="Aucun card plan"
            description="Creez votre premiere carte commerciale pour commencer a vendre des avantages segmentes."
          />
        ) : (
          <div className="list-stack">
            {cardPlans.map((cardPlan) => (
              <article key={cardPlan.id} className="list-item admin-card-plan-item">
                <div>
                  <strong>{cardPlan.name}</strong>
                  <p className="muted">{cardPlan.price} - {cardPlan.slug}</p>
                  <p className="muted">{cardPlan.offers?.length || 0} offres liees</p>
                </div>
                <div className="merchant-offer-actions">
                  <span className={`status-pill status-${cardPlan.status.toLowerCase()}`}>{cardPlan.status}</span>
                  <div className="inline-actions">
                    <button type="button" onClick={() => setSelectedCardPlanId(cardPlan.id)}>
                      Gerer les offres
                    </button>
                    <button type="button" onClick={() => statusMutation.mutate({ cardPlanId: cardPlan.id, status: 'ACTIVE' })}>
                      Activer
                    </button>
                    <button type="button" onClick={() => statusMutation.mutate({ cardPlanId: cardPlan.id, status: 'DRAFT' })}>
                      Draft
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-card admin-card-plan-offers-card">
        <p className="eyebrow">Liaison offres</p>
        <h2>{selectedCardPlan ? `Offres pour ${selectedCardPlan.name}` : 'Selectionnez un card plan'}</h2>
        {!selectedCardPlan ? (
          <p className="muted">Choisissez un card plan dans la liste pour lui rattacher des offres.</p>
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
              {offersMutation.isPending ? 'Enregistrement...' : 'Enregistrer les offres'}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
