import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { activateOwnedCard } from '../api/cards.api';
import { OwnedCardGrid } from '../components/OwnedCardGrid';
import { UserCardPanel } from '../../me/components/UserCardPanel';
import { fetchMyActiveCard, fetchMyCards } from '../../me/api/me.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function MyCardsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: cardsResponse, isLoading: isCardsLoading } = useQuery({
    queryKey: ['me', 'cards'],
    queryFn: fetchMyCards,
  });

  const { data: activeCardResponse, isLoading: isActiveCardLoading } = useQuery({
    queryKey: ['me', 'cards', 'active'],
    queryFn: fetchMyActiveCard,
    retry: false,
  });

  const activateMutation = useMutation({
    mutationFn: activateOwnedCard,
    onSuccess: async () => {
      toast.success('Votre carte active a ete mise a jour. Vos avantages visibles suivent maintenant cette formule.', 'Carte active mise a jour');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'cards'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'card'] }),
        queryClient.invalidateQueries({ queryKey: ['offers', 'active'] }),
      ]);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Impossible d activer cette carte'), 'Activation impossible');
    },
  });

  const cards = cardsResponse?.data || [];
  const activeCard = activeCardResponse?.data || cards.find((card) => card.status === 'ACTIVE') || null;

  if (isCardsLoading || isActiveCardLoading) {
    return <LoadingState title="Chargement de votre portefeuille" description="Nous recuperons vos cartes, votre formule active et vos avantages disponibles." />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Votre portefeuille est encore vide"
        description="Choisissez une carte dans le catalogue pour commencer a debloquer vos avantages SmartCard."
      />
    );
  }

  return (
    <div className="wallet-page">
      <section className="panel content-card hero-card">
        <p className="eyebrow">Mes cartes</p>
        <h1>Gardez la bonne carte active au bon moment</h1>
        <p className="muted">Votre portefeuille SmartCard vous permet de passer d une formule a une autre en quelques secondes pour afficher les avantages qui vous interessent vraiment.</p>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/card-plans">Acheter une autre carte</Link>
        </div>
      </section>

      {activeCard ? <UserCardPanel card={activeCard} /> : null}

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Cartes dans votre portefeuille</h3>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Retrouvez ici toutes vos cartes disponibles et choisissez celle qui doit piloter vos avantages visibles.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Carte actuellement active</h3>
          <p className="metric-value">{activeCard?.cardPlan?.name || 'Aucune'}</p>
          <p className="muted">Les offres affichees dans l application suivent toujours votre carte active.</p>
        </article>
      </section>

      <section className="panel content-card wallet-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Votre portefeuille</p>
            <h2>Toutes vos cartes</h2>
          </div>
          <p className="muted">Activez une autre carte a tout moment pour changer instantanement les avantages accessibles, ou achetez une nouvelle formule pour elargir votre terrain de jeu.</p>
        </div>
        <OwnedCardGrid cards={cards} onActivate={(cardId) => activateMutation.mutate(cardId)} activatingCardId={activateMutation.variables} />
      </section>
    </div>
  );
}
