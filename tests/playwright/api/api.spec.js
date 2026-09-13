// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Bandhan Matrimonial - REST API Validation Suite', () => {
  let userToken = '';
  let adminToken = '';

  test('POST /api/auth/login - authenticate demo user', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: {
        email: 'demo@bandhan.com',
        password: 'Demo@123',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('demo@bandhan.com');
    userToken = body.token;
  });

  test('POST /api/auth/login - authenticate admin', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: {
        email: 'admin@bandhan.com',
        password: 'Admin@123',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user.role).toBe('admin');
    adminToken = body.token;
  });

  test('QA-TEST [BUG-010]: POST /api/auth/register validation error status code', async ({ request }) => {
    // Missing required fields
    const res = await request.post('/api/auth/register', {
      data: {
        email: 'invalid-email',
        password: '123', // less than 6 chars
      },
    });

    // BUG-010 Check: Standard REST API requires 400 Bad Request, but defect returns 200 with { success: false }
    console.log(`[QA Audit BUG-010] Registration validation returned HTTP status: ${res.status()}`);
    // If res.status() === 200, BUG-010 is verified!
  });

  test('GET /api/profiles - retrieve all candidates', async ({ request }) => {
    const res = await request.get('/api/profiles');
    expect(res.status()).toBe(200);
    const profiles = await res.json();
    expect(Array.isArray(profiles)).toBe(true);
    expect(profiles.length).toBeGreaterThanOrEqual(15);
  });

  test('GET /api/profiles/:id - retrieve specific profile', async ({ request }) => {
    const res = await request.get('/api/profiles/2');
    expect(res.status()).toBe(200);
    const profile = await res.json();
    expect(profile.full_name).toBe('Ananya Sharma');
    expect(profile.city).toBe('Indore');
  });

  test('GET /api/admin/stats - verify admin metrics calculation', async ({ request }) => {
    const res = await request.get('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status()).toBe(200);
    const stats = await res.json();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('maleUsers');
    expect(stats).toHaveProperty('femaleUsers');
    expect(stats).toHaveProperty('pendingInterests');
    expect(stats).toHaveProperty('totalMessages');

    // BUG-008: Check if pendingInterests improperly includes rejected interests
    console.log('[QA Audit BUG-008] Admin reported pending interests:', stats.pendingInterests);
  });
});
