export const StorageService = {
  STORAGE_KEY: "url_shortener_data",

  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { urls: {}, analytics: {} };
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return { urls: {}, analytics: {} };
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },

  clearExpiredUrls() {
    const data = this.getData();
    const now = Date.now();
    let hasChanges = false;

    Object.keys(data.urls).forEach((shortCode) => {
      if (data.urls[shortCode].expiresAt < now) {
        delete data.urls[shortCode];
        delete data.analytics[shortCode];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveData(data);
    }

    return data;
  },
};
