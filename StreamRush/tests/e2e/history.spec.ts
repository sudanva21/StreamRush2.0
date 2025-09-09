import { test, expect } from '@playwright/test';

test.describe('Watch History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user authentication is handled or mocked
  });

  test('should add video to watch history when playing', async ({ page }) => {
    // Navigate to a video page
    const videoLinks = page.locator('[data-testid="video-card"]').first();
    if (await videoLinks.count() > 0) {
      await videoLinks.click();
    } else {
      // Skip if no videos available
      test.skip('No videos available for testing');
    }

    // Wait for video page to load
    await page.waitForSelector('[data-testid="video-player"]', { timeout: 10000 });

    // Navigate to history page
    await page.goto('/history');
    
    // Check if the video appears in history
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount({ min: 1 });
  });

  test('should display watch history page', async ({ page }) => {
    await page.goto('/history');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check if history page loads - either authenticated user view or login prompt
    const h1Elements = await page.locator('h1').allTextContents();
    const hasWatchHistoryTitle = h1Elements.some(text => text.includes('Watch History'));
    
    expect(hasWatchHistoryTitle).toBe(true);
    
    // If we see the "Please log in" text, that's the unauthenticated view
    const hasLoginPrompt = await page.locator('text=Please log in').count() > 0;
    const hasEmptyState = await page.locator('[data-testid="empty-history"]').count() > 0;
    const hasHistory = await page.locator('[data-testid="history-item"]').count() > 0;
    
    // At least one of these should be true
    expect(hasLoginPrompt || hasEmptyState || hasHistory).toBe(true);
  });

  test('should remove individual item from history', async ({ page }) => {
    await page.goto('/history');
    
    const historyItems = page.locator('[data-testid="history-item"]');
    const initialCount = await historyItems.count();
    
    if (initialCount > 0) {
      // Click remove button on first item
      await page.locator('[data-testid="remove-from-history"]').first().click();
      
      // Confirm removal
      await page.locator('[data-testid="confirm-remove"]').click();
      
      // Check if item is removed
      await expect(historyItems).toHaveCount(initialCount - 1);
    }
  });

  test('should clear all history', async ({ page }) => {
    await page.goto('/history');
    
    const historyItems = page.locator('[data-testid="history-item"]');
    const initialCount = await historyItems.count();
    
    if (initialCount > 0) {
      // Click clear all button
      await page.locator('[data-testid="clear-history"]').click();
      
      // Confirm clear all
      await page.locator('[data-testid="confirm-clear"]').click();
      
      // Check if all items are removed
      await expect(page.locator('[data-testid="empty-history"]')).toBeVisible();
    }
  });

  test('should show empty state when no history', async ({ page }) => {
    await page.goto('/history');
    
    // Clear history first if any exists
    const clearButton = page.locator('[data-testid="clear-history"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.locator('[data-testid="confirm-clear"]').click();
    }
    
    // Check empty state
    await expect(page.locator('[data-testid="empty-history"]')).toBeVisible();
    await expect(page.locator('text=No videos in your watch history')).toBeVisible();
  });

  test('should require authentication for history access', async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    
    await page.goto('/history');
    
    // Should redirect to login or show auth required message
    await expect(page.locator('text=Please log in')).toBeVisible();
  });
});