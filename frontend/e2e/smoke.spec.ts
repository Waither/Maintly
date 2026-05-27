import { expect, test, type Page } from '@playwright/test';

const authenticatedUser = {
  id: 1,
  email: 'admin@maintly.com',
  firstName: 'Administrator',
  lastName: 'Systemu',
  role: 'admin',
  fullName: 'Administrator Systemu',
};

const reporterUser = {
  id: 5,
  email: 'reporter@maintly.com',
  firstName: 'Operator',
  lastName: 'Produkcji',
  role: 'reporter',
  fullName: 'Operator Produkcji',
};

const dashboardStatsResponse = {
  workOrders: {
    total: 4,
    byStatus: {
      new: 1,
      in_progress: 2,
      completed: 1,
    },
    overdueCount: 0,
  },
  equipment: {
    total: 7,
  },
  users: {
    total: 5,
    active: 5,
  },
  reports: {
    total: 2,
    pending: 1,
  },
};

const recentWorkOrdersResponse = {
  data: [
    {
      id: 101,
      title: 'Wymiana uszczelnienia pompy',
      status: { name: 'open' },
      priority: { name: 'high' },
      plannedEndDate: '2026-05-28T12:00:00.000Z',
    },
  ],
};

const upcomingMaintenanceResponse = {
  data: [],
};

async function mockApi(page: Page, user = authenticatedUser) {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (pathname.endsWith('/api/login') && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'test-token' }),
      });
      return;
    }

    if (pathname.endsWith('/api/me') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: user }),
      });
      return;
    }

    if (pathname.endsWith('/api/dashboard/stats') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(dashboardStatsResponse),
      });
      return;
    }

    if (pathname.endsWith('/api/work-orders') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(recentWorkOrdersResponse),
      });
      return;
    }

    if (pathname.endsWith('/api/equipment/maintenance/upcoming') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(upcomingMaintenanceResponse),
      });
      return;
    }

    if (pathname.endsWith('/api/notifications/unread-count') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 3 }),
      });
      return;
    }

    if (pathname.includes('/api/translations/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }),
      });
      return;
    }

    if (pathname.includes('/api/realtime/pulse')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });
}

test('redirects anonymous users to login when opening a protected route', async ({ page }) => {
  await mockApi(page);

  await page.goto('/work-orders');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId('login-page')).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('can log in and land on the dashboard', async ({ page }) => {
  await mockApi(page);

  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@maintly.com');
  await page.locator('input[type="password"]').fill('MaintlyAdmin!@#');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('New Work Order')).toBeVisible();
});

test('can open the profile page from the navbar', async ({ page }) => {
  await mockApi(page);

  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  await page.goto('/');

  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await page.getByTestId('profile-menu-toggle').click();
  await page.getByRole('link', { name: 'Mój profil' }).click();

  await expect(page).toHaveURL(/\/profile#?$/);
  await expect(page.getByRole('heading', { name: 'Mój profil' })).toBeVisible();
  await expect(page.locator('main').getByText('Dane użytkownika')).toBeVisible();
});

test('blocks a reporter from admin-only users page', async ({ page }) => {
  await mockApi(page, reporterUser);

  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  await page.goto('/users');

  await expect(page.getByText('Brak dostępu')).toBeVisible();
  await expect(page.getByText('Nie masz uprawnień do tej strony.')).toBeVisible();
});