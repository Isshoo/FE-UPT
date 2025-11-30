/**
 * SSR-safe storage utilities
 * Handles localStorage access safely for Next.js SSR
 */

export const storage = {
  /**
   * Get item from localStorage (SSR-safe)
   * @param {string} key
   * @returns {string|null}
   */
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * Set item to localStorage (SSR-safe)
   * @param {string} key
   * @param {string} value
   * @returns {boolean}
   */
  set: (key, value) => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  /**
   * Remove item from localStorage (SSR-safe)
   * @param {string} key
   * @returns {boolean}
   */
  remove: (key) => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * Clear all localStorage (SSR-safe)
   * @returns {boolean}
   */
  clear: () => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

