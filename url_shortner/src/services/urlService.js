import { StorageService } from "./storageService.js";

export const UrlService = {
  generateShortCode(length = 6) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidShortCode(shortCode) {
    return (
      /^[a-zA-Z0-9]+$/.test(shortCode) &&
      shortCode.length >= 3 &&
      shortCode.length <= 20
    );
  },

  createShortUrl(originalUrl, validityMinutes = 30, customShortCode = null) {
    const data = StorageService.clearExpiredUrls();

    // Validate URL
    if (!this.isValidUrl(originalUrl)) {
      throw new Error("Invalid URL format");
    }

    // Validate validity period
    if (validityMinutes <= 0 || validityMinutes > 10080) {
      // Max 1 week
      throw new Error("Validity period must be between 1 minute and 1 week");
    }

    // Generate or validate short code
    let shortCode = customShortCode;
    if (shortCode) {
      if (!this.isValidShortCode(shortCode)) {
        throw new Error(
          "Custom shortcode must be alphanumeric and 3-20 characters long"
        );
      }
      if (data.urls[shortCode]) {
        throw new Error("Custom shortcode already exists");
      }
    } else {
      // Generate unique short code
      do {
        shortCode = this.generateShortCode();
      } while (data.urls[shortCode]);
    }

    const now = Date.now();
    const expiresAt = now + validityMinutes * 60 * 1000;

    // Store URL data
    data.urls[shortCode] = {
      originalUrl,
      shortCode,
      createdAt: now,
      expiresAt,
      validityMinutes,
    };

    // Initialize analytics
    data.analytics[shortCode] = {
      totalClicks: 0,
      clicks: [],
    };

    StorageService.saveData(data);

    return {
      shortCode,
      shortUrl: `${window.location.origin}/${shortCode}`,
      originalUrl,
      createdAt: now,
      expiresAt,
      validityMinutes,
    };
  },

  getUrlByShortCode(shortCode) {
    const data = StorageService.clearExpiredUrls();
    return data.urls[shortCode] || null;
  },

  getAllUrls() {
    const data = StorageService.clearExpiredUrls();
    return Object.values(data.urls);
  },

  getAnalytics(shortCode) {
    const data = StorageService.getData();
    return data.analytics[shortCode] || { totalClicks: 0, clicks: [] };
  },

  getAllAnalytics() {
    const data = StorageService.getData();
    const urls = this.getAllUrls();

    return urls.map((url) => ({
      ...url,
      analytics: data.analytics[url.shortCode] || {
        totalClicks: 0,
        clicks: [],
      },
    }));
  },

  recordClick(shortCode) {
    const data = StorageService.getData();

    if (!data.analytics[shortCode]) {
      data.analytics[shortCode] = { totalClicks: 0, clicks: [] };
    }

    const clickData = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || "Direct",
      // Simplified location detection
      location: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    };

    data.analytics[shortCode].totalClicks++;
    data.analytics[shortCode].clicks.push(clickData);

    StorageService.saveData(data);
  },
};
