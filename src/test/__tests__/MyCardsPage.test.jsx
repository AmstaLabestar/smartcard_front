import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MyCardsPage } from '../../features/cards/pages/MyCardsPage';
import { renderWithProviders } from '../utils/renderWithProviders';

const invalidateQueries = vi.fn(() => Promise.resolve());
const successToast = vi.fn();
const errorToast = vi.fn();

vi.mock('../../features/me/api/me.api', () => ({
  fetchMyCards: vi.fn(),
  fetchMyActiveCard: vi.fn(),
}));

vi.mock('../../features/cards/api/cards.api', () => ({
  activateOwnedCard: vi.fn(),
}));

vi.mock('../../shared/components/feedback/ToastProvider', async () => {
  const actual = await vi.importActual('../../shared/components/feedback/ToastProvider');
  return {
    ...actual,
    useToast: () => ({
      success: successToast,
      error: errorToast,
      info: vi.fn(),
    }),
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries }),
  };
});

const { fetchMyCards, fetchMyActiveCard } = await import('../../features/me/api/me.api');
const { activateOwnedCard } = await import('../../features/cards/api/cards.api');

describe('MyCardsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wallet metrics and activates another card', async () => {
    fetchMyCards.mockResolvedValue({
      data: [
        {
          id: 'card-1',
          title: 'Carte Food',
          status: 'ACTIVE',
          cardNumber: 'SC-001',
          price: 20,
          qrCode: 'qr-1',
          activatedAt: '2026-03-01T10:00:00.000Z',
          eligibleOffers: [{ id: 'offer-1' }],
          cardPlan: { name: 'Carte Food', description: 'Food', marketingHighlights: 'A et B' },
        },
        {
          id: 'card-2',
          title: 'Carte Premium',
          status: 'INACTIVE',
          cardNumber: 'SC-002',
          price: 30,
          qrCode: 'qr-2',
          activatedAt: null,
          eligibleOffers: [{ id: 'offer-2' }, { id: 'offer-3' }],
          cardPlan: { name: 'Carte Premium', description: 'Premium', marketingHighlights: 'C et D' },
        },
      ],
    });

    fetchMyActiveCard.mockResolvedValue({
      data: {
        id: 'card-1',
        title: 'Carte Food',
        status: 'ACTIVE',
        cardNumber: 'SC-001',
        price: 20,
        qrCode: 'qr-1',
        activatedAt: '2026-03-01T10:00:00.000Z',
        eligibleOffers: [{ id: 'offer-1' }],
        cardPlan: { name: 'Carte Food', description: 'Food', marketingHighlights: 'A et B' },
      },
    });

    activateOwnedCard.mockResolvedValue({ success: true });

    renderWithProviders(<MyCardsPage />);

    expect(await screen.findByText('Une carte active, le reste a portee de main.')).toBeInTheDocument();
    expect(screen.getByText('Votre portefeuille')).toBeInTheDocument();
    expect(screen.getByText('Toutes vos cartes')).toBeInTheDocument();
    expect(screen.getByText('Carte Premium')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Activer' }));

    await waitFor(() => {
      expect(activateOwnedCard).toHaveBeenCalled();
    });

    expect(activateOwnedCard.mock.calls[0][0]).toBe('card-2');

    await waitFor(() => {
      expect(successToast).toHaveBeenCalled();
      expect(invalidateQueries).toHaveBeenCalled();
    });
  });
});
