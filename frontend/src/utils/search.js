import { api } from '../api/client';

/**
 * Search API Service
 */
export class SearchService {
  /**
   * Perform product search
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query string
   * @param {string} searchParams.category - Category filter
   * @param {number} searchParams.minPrice - Minimum price filter
   * @param {number} searchParams.maxPrice - Maximum price filter
   * @param {string} searchParams.sortBy - Sort field (price, name, date, rating)
   * @param {string} searchParams.sortOrder - Sort order (asc, desc)
   * @param {number} searchParams.page - Page number for pagination
   * @param {number} searchParams.limit - Items per page
   * @returns {Promise<Object>} Search results
   */
  static async searchProducts(searchParams = {}) {
    try {
      const {
        query = '',
        category = '',
        minPrice = 0,
        maxPrice = 0,
        sortBy = 'relevance',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = searchParams;

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query.trim());
      if (category) params.append('category', category);
      if (minPrice > 0) params.append('minPrice', minPrice);
      if (maxPrice > 0) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      params.append('page', page);
      params.append('limit', limit);

      // Backend supports path param: GET /api/products/search/:query
      const response = await api.get(`/products/search/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search API Error:', error);
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  /**
   * Get search suggestions
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of suggestions
   */
  static async getSearchSuggestions(query) {
    try {
      if (!query || query.length < 2) return [];
      
      // Not implemented on backend; return empty list for now
      return [];
    } catch (error) {
      console.error('Suggestions API Error:', error);
      return [];
    }
  }

  /**
   * Get popular search terms
   * @returns {Promise<Array>} Array of popular search terms
   */
  static async getPopularSearches() {
    try {
      // Not implemented on backend; return empty list for now
      return [];
    } catch (error) {
      console.error('Popular searches API Error:', error);
      return [];
    }
  }
}

/**
 * Search State Management Class
 */
export class SearchState {
  constructor() {
    this.query = '';
    this.category = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.sortBy = 'relevance';
    this.sortOrder = 'desc';
    this.page = 1;
    this.limit = 20;
    this.results = [];
    this.totalResults = 0;
    this.totalPages = 0;
    this.loading = false;
    this.error = null;
    this.suggestions = [];
    this.showSuggestions = false;
  }

  /**
   * Update search parameters
   * @param {Object} params - Parameters to update
   */
  updateParams(params) {
    Object.keys(params).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = params[key];
      }
    });
  }

  /**
   * Reset search state
   */
  reset() {
    this.query = '';
    this.category = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.sortBy = 'relevance';
    this.sortOrder = 'desc';
    this.page = 1;
    this.results = [];
    this.totalResults = 0;
    this.totalPages = 0;
    this.error = null;
    this.suggestions = [];
    this.showSuggestions = false;
  }

  /**
   * Get current search parameters as object
   * @returns {Object} Current search parameters
   */
  getSearchParams() {
    return {
      query: this.query,
      category: this.category,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      limit: this.limit
    };
  }
}

/**
 * Search Logic Handler
 */
export class SearchLogic {
  constructor() {
    this.state = new SearchState();
    this.debounceTimer = null;
    this.suggestionTimer = null;
  }

  /**
   * Perform search with current state
   * @returns {Promise<Object>} Search results
   */
  async performSearch() {
    this.state.loading = true;
    this.state.error = null;

    try {
      const results = await SearchService.searchProducts(this.state.getSearchParams());
      
      this.state.results = results.products || [];
      this.state.totalResults = results.totalResults || 0;
      this.state.totalPages = results.totalPages || 0;
      this.state.loading = false;

      return results;
    } catch (error) {
      this.state.error = error.message;
      this.state.loading = false;
      this.state.results = [];
      throw error;
    }
  }

  /**
   * Handle search input with debouncing
   * @param {string} query - Search query
   * @param {Function} callback - Callback function to execute after search
   */
  handleSearchInput(query, callback) {
    this.state.query = query;
    
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer for debounced search
    this.debounceTimer = setTimeout(async () => {
      if (query.trim()) {
        try {
          await this.performSearch();
          if (callback) callback(this.state.results);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        this.state.results = [];
        if (callback) callback([]);
      }
    }, 300); // 300ms debounce
  }

  /**
   * Handle search suggestions with debouncing
   * @param {string} query - Search query
   * @param {Function} callback - Callback function for suggestions
   */
  handleSuggestions(query, callback) {
    // Clear existing timer
    if (this.suggestionTimer) {
      clearTimeout(this.suggestionTimer);
    }

    // Set new timer for debounced suggestions
    this.suggestionTimer = setTimeout(async () => {
      if (query.trim() && query.length >= 2) {
        try {
          const suggestions = await SearchService.getSearchSuggestions(query);
          this.state.suggestions = suggestions;
          this.state.showSuggestions = true;
          if (callback) callback(suggestions);
        } catch (error) {
          console.error('Suggestions error:', error);
          this.state.suggestions = [];
        }
      } else {
        this.state.suggestions = [];
        this.state.showSuggestions = false;
        if (callback) callback([]);
      }
    }, 200); // 200ms debounce for suggestions
  }

  /**
   * Apply filters and perform search
   * @param {Object} filters - Filter parameters
   */
  async applyFilters(filters) {
    this.state.updateParams(filters);
    this.state.page = 1; // Reset to first page when applying filters
    return await this.performSearch();
  }

  /**
   * Change page and perform search
   * @param {number} page - Page number
   */
  async changePage(page) {
    this.state.page = page;
    return await this.performSearch();
  }

  /**
   * Change sorting and perform search
   * @param {string} sortBy - Sort field
   * @param {string} sortOrder - Sort order
   */
  async changeSort(sortBy, sortOrder = 'desc') {
    this.state.sortBy = sortBy;
    this.state.sortOrder = sortOrder;
    this.state.page = 1; // Reset to first page when changing sort
    return await this.performSearch();
  }

  /**
   * Clear search and reset state
   */
  clearSearch() {
    this.state.reset();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.suggestionTimer) {
      clearTimeout(this.suggestionTimer);
    }
  }

  /**
   * Get current state
   * @returns {SearchState} Current search state
   */
  getState() {
    return this.state;
  }
}

/**
 * Search Utilities
 */
export class SearchUtils {
  /**
   * Highlight search terms in text
   * @param {string} text - Text to highlight
   * @param {string} searchTerm - Term to highlight
   * @returns {string} HTML string with highlighted terms
   */
  static highlightSearchTerms(text, searchTerm) {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }

  /**
   * Format price for display
   * @param {number} price - Price value
   * @param {string} currency - Currency symbol
   * @returns {string} Formatted price string
   */
  static formatPrice(price, currency = '$') {
    return `${currency}${price.toFixed(2)}`;
  }

  /**
   * Generate search URL with parameters
   * @param {Object} params - Search parameters
   * @returns {string} Search URL
   */
  static generateSearchUrl(params) {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] && params[key] !== '' && params[key] !== 0) {
        searchParams.append(key, params[key]);
      }
    });

    return `/search?${searchParams.toString()}`;
  }

  /**
   * Parse search URL parameters
   * @param {string} searchString - URL search string
   * @returns {Object} Parsed parameters
   */
  static parseSearchUrl(searchString) {
    const params = new URLSearchParams(searchString);
    return {
      query: params.get('q') || '',
      category: params.get('category') || '',
      minPrice: parseInt(params.get('minPrice')) || 0,
      maxPrice: parseInt(params.get('maxPrice')) || 0,
      sortBy: params.get('sortBy') || 'relevance',
      sortOrder: params.get('sortOrder') || 'desc',
      page: parseInt(params.get('page')) || 1,
      limit: parseInt(params.get('limit')) || 20
    };
  }

  /**
   * Validate search parameters
   * @param {Object} params - Parameters to validate
   * @returns {Object} Validation result
   */
  static validateSearchParams(params) {
    const errors = [];
    
    if (params.minPrice < 0) {
      errors.push('Minimum price cannot be negative');
    }
    
    if (params.maxPrice < 0) {
      errors.push('Maximum price cannot be negative');
    }
    
    if (params.minPrice > 0 && params.maxPrice > 0 && params.minPrice > params.maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }
    
    if (params.page < 1) {
      errors.push('Page number must be greater than 0');
    }
    
    if (params.limit < 1 || params.limit > 100) {
      errors.push('Limit must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Search Categories Configuration
 */
export const SEARCH_CATEGORIES = [
  'All Categories',
  'Accessories',
  'Art & Collectibles',
  'Baby',
  'Bags & Purses',
  'Bath & Beauty',
  'Books, Movies & Music',
  'Clothing',
  'Craft Supplies & Tools',
  'Electronics & Accessories',
  'Gifts',
  'Home & Living',
  'Jewelry',
  'Paper & Party Supplies',
  'Pet Supplies',
  'Shoes',
  'Toys & Games',
  'Weddings'
];

/**
 * Search Sort Options
 */
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant', order: 'desc' },
  { value: 'price', label: 'Price: Low to High', order: 'asc' },
  { value: 'price', label: 'Price: High to Low', order: 'desc' },
  { value: 'name', label: 'Name: A to Z', order: 'asc' },
  { value: 'name', label: 'Name: Z to A', order: 'desc' },
  { value: 'date', label: 'Newest First', order: 'desc' },
  { value: 'date', label: 'Oldest First', order: 'asc' },
  { value: 'rating', label: 'Highest Rated', order: 'desc' },
  { value: 'rating', label: 'Lowest Rated', order: 'asc' }
];

/**
 * Default Export - Main Search Logic Instance
 */
const searchLogic = new SearchLogic();
export default searchLogic;
