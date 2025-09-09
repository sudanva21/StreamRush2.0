import { test, expect } from '@playwright/test';

test.describe('Playlists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user authentication is handled or mocked
  });

  test('should display playlists page', async ({ page }) => {
    await page.goto('/playlists');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check if playlists page loads - either authenticated user view or login prompt
    const h1Elements = await page.locator('h1').allTextContents();
    const hasPlaylistsTitle = h1Elements.some(text => text.includes('Your Playlists'));
    
    expect(hasPlaylistsTitle).toBe(true);
    
    // Check for different page states
    const hasLoginPrompt = await page.locator('text=Please log in').count() > 0;
    const hasCreateButton = await page.locator('[data-testid="create-playlist"]').count() > 0;
    const hasEmptyState = await page.locator('[data-testid="empty-playlists"]').count() > 0;
    
    // At least one of these should be true
    expect(hasLoginPrompt || hasCreateButton || hasEmptyState).toBe(true);
  });

  test('should create new playlist', async ({ page }) => {
    await page.goto('/playlists');
    
    // Click create playlist button
    await page.locator('[data-testid="create-playlist"]').click();
    
    // Fill playlist details
    await page.locator('[data-testid="playlist-name"]').fill('Test Playlist');
    await page.locator('[data-testid="playlist-description"]').fill('Test Description');
    
    // Submit form
    await page.locator('[data-testid="create-playlist-submit"]').click();
    
    // Check if playlist was created
    await expect(page.locator('text=Test Playlist')).toBeVisible();
  });

  test('should add video to playlist from watch page', async ({ page }) => {
    // Navigate to a video page
    const videoLinks = page.locator('[data-testid="video-card"]').first();
    if (await videoLinks.count() > 0) {
      await videoLinks.click();
    } else {
      test.skip('No videos available for testing');
    }

    // Wait for video page to load
    await page.waitForSelector('[data-testid="video-player"]', { timeout: 10000 });

    // Click save/add to playlist button
    await page.locator('[data-testid="save-to-playlist"]').click();
    
    // Select or create playlist
    if (await page.locator('[data-testid="playlist-option"]').first().isVisible()) {
      await page.locator('[data-testid="playlist-option"]').first().click();
    } else {
      // Create new playlist if none exist
      await page.locator('[data-testid="create-new-playlist"]').click();
      await page.locator('[data-testid="new-playlist-name"]').fill('My Videos');
      await page.locator('[data-testid="create-playlist-confirm"]').click();
    }

    // Verify success message
    await expect(page.locator('text=Added to playlist')).toBeVisible();
  });

  test('should show playlist details', async ({ page }) => {
    await page.goto('/playlists');
    
    const playlists = page.locator('[data-testid="playlist-item"]');
    if (await playlists.count() > 0) {
      await playlists.first().click();
      
      // Check if playlist detail page loads
      await expect(page.locator('[data-testid="playlist-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="playlist-videos"]')).toBeVisible();
    }
  });

  test('should remove video from playlist', async ({ page }) => {
    await page.goto('/playlists');
    
    const playlists = page.locator('[data-testid="playlist-item"]');
    if (await playlists.count() > 0) {
      await playlists.first().click();
      
      const playlistVideos = page.locator('[data-testid="playlist-video-item"]');
      const initialCount = await playlistVideos.count();
      
      if (initialCount > 0) {
        // Remove first video from playlist
        await page.locator('[data-testid="remove-from-playlist"]').first().click();
        
        // Confirm removal
        await page.locator('[data-testid="confirm-remove"]').click();
        
        // Check if video is removed
        await expect(playlistVideos).toHaveCount(initialCount - 1);
      }
    }
  });

  test('should delete entire playlist', async ({ page }) => {
    await page.goto('/playlists');
    
    const playlists = page.locator('[data-testid="playlist-item"]');
    const initialCount = await playlists.count();
    
    if (initialCount > 0) {
      // Click options menu on first playlist
      await page.locator('[data-testid="playlist-options"]').first().click();
      
      // Click delete option
      await page.locator('[data-testid="delete-playlist"]').click();
      
      // Confirm deletion
      await page.locator('[data-testid="confirm-delete"]').click();
      
      // Check if playlist is removed
      await expect(playlists).toHaveCount(initialCount - 1);
    }
  });

  test('should show empty state when no playlists', async ({ page }) => {
    await page.goto('/playlists');
    
    // Check if empty state is shown when no playlists exist
    const playlists = page.locator('[data-testid="playlist-item"]');
    if (await playlists.count() === 0) {
      await expect(page.locator('[data-testid="empty-playlists"]')).toBeVisible();
      await expect(page.locator('text=No playlists yet')).toBeVisible();
    }
  });

  test('should require authentication for playlist access', async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    
    await page.goto('/playlists');
    
    // Should redirect to login or show auth required message
    await expect(page.locator('text=Please log in')).toBeVisible();
  });

  test('should validate playlist creation form', async ({ page }) => {
    await page.goto('/playlists');
    
    // Click create playlist button
    await page.locator('[data-testid="create-playlist"]').click();
    
    // Try to submit empty form
    await page.locator('[data-testid="create-playlist-submit"]').click();
    
    // Check for validation error
    await expect(page.locator('text=Please enter a playlist name')).toBeVisible();
  });
});