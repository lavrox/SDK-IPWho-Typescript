import { describe, it, expect, vi } from 'vitest';
import { IPWho } from '../src';

describe('IPWho SDK', () => {
  const sdk = new IPWho('sk_test_123');

  it('should throw error if API key is missing', () => {
    expect(() => new IPWho('')).toThrow("API Key is required");
  });

  it('should format the URL correctly for getIp', async () => {
    // We mock the global fetch to prevent real API calls during tests
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { ip: '8.8.8.8' } })
    });
    global.fetch = mockFetch;

    await sdk.getIp('8.8.8.8');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ip/8.8.8.8?apiKey=sk_test_123'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-API-Key': 'sk_test_123'
        })
      })
    );
  });
});
