import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MerchantScanPage } from '../../features/merchant/pages/MerchantScanPage';
import { renderWithProviders } from '../utils/renderWithProviders';

const successToast = vi.fn();
const errorToast = vi.fn();
const infoToast = vi.fn();

vi.mock('../../features/merchant/components/CameraScanner', () => ({
  CameraScanner: ({ onDetected }) => (
    <button type="button" onClick={() => onDetected('qr-from-camera')}>
      Fake camera scan
    </button>
  ),
}));

vi.mock('../../features/merchant/api/merchant.api', () => ({
  previewMerchantScan: vi.fn(),
  scanMerchantTransaction: vi.fn(),
}));

vi.mock('../../shared/components/feedback/ToastProvider', async () => {
  const actual = await vi.importActual('../../shared/components/feedback/ToastProvider');
  return {
    ...actual,
    useToast: () => ({
      success: successToast,
      error: errorToast,
      info: infoToast,
    }),
  };
});

const { previewMerchantScan, scanMerchantTransaction } = await import('../../features/merchant/api/merchant.api');

describe('MerchantScanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads eligible offers after a camera scan and confirms a transaction', async () => {
    previewMerchantScan.mockResolvedValue({
      data: {
        customer: { firstName: 'Nadia', lastName: 'Client' },
        card: { cardNumber: 'SC-001', cardPlan: { name: 'Carte Premium' } },
        eligibleOffers: [
          {
            id: 'offer-1',
            title: 'Reduction premium',
            discountValue: 20,
            discountType: 'PERCENTAGE',
            terms: 'Valable en boutique',
          },
        ],
        limits: { maxTransactionAmount: 1000000 },
      },
    });

    scanMerchantTransaction.mockResolvedValue({
      data: {
        amount: 160,
        originalAmount: 200,
        discountAmount: 40,
        reference: 'TXN-001',
        offer: { title: 'Reduction premium' },
        user: { firstName: 'Nadia', lastName: 'Client' },
        card: { cardNumber: 'SC-001' },
      },
    });

    renderWithProviders(<MerchantScanPage />);

    await userEvent.click(await screen.findByRole('button', { name: 'Fake camera scan' }));

    await waitFor(() => {
      expect(previewMerchantScan).toHaveBeenCalled();
    });

    expect(previewMerchantScan.mock.calls[0][0]).toEqual({ qrCode: 'qr-from-camera' });
    expect(await screen.findByText('Reduction premium')).toBeInTheDocument();

    const amountInput = screen.getByPlaceholderText('Montant initial');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '200');

    await userEvent.click(screen.getByRole('button', { name: 'Valider' }));

    await waitFor(() => {
      expect(scanMerchantTransaction).toHaveBeenCalled();
    });

    expect(scanMerchantTransaction.mock.calls[0][0]).toEqual({
      qrCode: 'qr-from-camera',
      offerId: 'offer-1',
      originalAmount: 200,
    });

    await waitFor(() => {
      expect(successToast).toHaveBeenCalled();
    });
  });
});

