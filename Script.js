document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const productCards = document.querySelectorAll('.product-card');
  const categoryNavigation = document.querySelector('.category-nav');
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.getElementById('searchButton');
  const searchPage = document.getElementById('searchPage');
  const closeSearchButton = document.getElementById('closeSearchBtn');
  const fullSearchInput = document.getElementById('fullSearchInput');
  const searchMicButton = document.getElementById('searchMicBtn');
  const searchCartButton = document.getElementById('searchCartBtn');
  const searchCartCount = document.getElementById('searchCartCount');
  const searchResults = document.getElementById('searchResults');
  const searchPageTitle = document.getElementById('searchPageTitle');
  const searchResultSummary = document.getElementById('searchResultSummary');
  const searchSuggestionsSection = document.getElementById('searchSuggestionsSection');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const recentSearchesList = document.getElementById('recentSearchesList');
  const editRecentSearchesButton = document.getElementById('editRecentSearchesBtn');
  const clearRecentSearchesButton = document.getElementById('clearRecentSearchesBtn');
  const productsContainer = document.querySelector('.products');
  const productsEmpty = document.getElementById('productsEmpty');
  const categoryPills = document.querySelectorAll('.category-pill');
  const shortcutCards = document.querySelectorAll('[data-shortcut-category]');
  const topAppsAction = document.querySelector('[data-home-action="offers"]');
  const filterTrigger = document.getElementById('filterTrigger');
  const filterPanel = document.getElementById('filterPanel');
  const closeFilterButton = document.getElementById('closeFilterBtn');
  const filterBackdrop = document.getElementById('filterBackdrop');
  const priceRange = document.getElementById('priceRange');
  const priceRangeValue = document.getElementById('priceRangeValue');
  const ratingFilters = document.querySelectorAll('.rating-filter');
  const categoryFilters = document.querySelectorAll('.category-filter');
  const brandFilters = document.querySelectorAll('.brand-filter');
  const sortProducts = document.getElementById('sortProducts');
  const clearFiltersButton = document.getElementById('clearFiltersBtn');
  const applyFiltersButton = document.getElementById('applyFiltersBtn');
  const filterResultSummary = document.getElementById('filterResultSummary');
  const categoryCatalogPanel = document.getElementById('categoryCatalogPanel');
  const categoryProductsContainer = document.getElementById('categoryProducts');
  const catalogTitle = document.getElementById('catalogTitle');
  const catalogSubtitle = document.getElementById('catalogSubtitle');
  const catalogSort = document.getElementById('catalogSort');
  const catalogFilterChips = document.querySelectorAll('.catalog-filter-chip');
  const closeCategoryCatalogButton = document.getElementById('closeCategoryCatalogBtn');
  const closeCategoryCatalogIcon = document.getElementById('closeCategoryCatalogIcon');
  const promoBanner = document.querySelector('.promo-banner');
  const promoTag = document.querySelector('.promo-tag');
  const promoTitle = document.querySelector('.promo-title');
  const promoOffer = document.querySelector('.promo-offer');
  const promoVisual = document.querySelector('.promo-visual');
  const dealTimer = document.getElementById('dealTimer');
  const dealHours = document.getElementById('dealHours');
  const dealMinutes = document.getElementById('dealMinutes');
  const dealSeconds = document.getElementById('dealSeconds');
  const galleryThumbnails = document.getElementById('galleryThumbnails');
  const relatedProductsContainer = document.getElementById('relatedProducts');
  const offerButtons = document.querySelectorAll('.offer-copy');
  const dots = document.querySelectorAll('.dot');
  const modal = document.getElementById('productModal');
  const closeModalButton = document.querySelector('.close-modal');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalSeller = document.getElementById('modalSeller');
  const modalWishlistButton = document.getElementById('modalWishlistBtn');
  const modalShareButton = document.getElementById('modalShareBtn');
  const modalVariants = document.getElementById('modalVariants');
  const productTabs = document.querySelectorAll('[data-product-tab]');
  const productTabPanels = document.querySelectorAll('.product-tab-panel');
  const productShowcasePanel = document.getElementById('productShowcasePanel');
  const productSpecificationsPanel = document.getElementById('productSpecificationsPanel');
  const productDescriptionPanel = document.getElementById('productDescriptionPanel');
  const modalReviewSummary = document.getElementById('modalReviewSummary');
  const modalReviewHighlights = document.getElementById('modalReviewHighlights');
  const modalReviewsList = document.getElementById('modalReviewsList');
  const modalVerifiedBuyers = document.getElementById('modalVerifiedBuyers');
  const modalQuestionsList = document.getElementById('modalQuestionsList');
  const modalRecentlyViewed = document.getElementById('modalRecentlyViewed');
  const modalMoreProducts = document.getElementById('modalMoreProducts');
  const modalRating = document.getElementById('modalRating');
  const modalReviews = document.getElementById('modalReviews');
  const modalBadge = document.getElementById('modalBadge');
  const modalDescription = document.getElementById('modalDescription');
  const modalImage = document.querySelector('.modal-image');
  const addToCartButton = document.getElementById('addToCartBtn');
  const buyNowButton = document.getElementById('buyNowBtn');
  const cartCountEl = document.getElementById('cartCount');
  const cartButton = document.getElementById('cartButton');
  const notificationButton = document.getElementById('notificationButton');
  const notificationCountEl = document.getElementById('notificationCount');
  const notificationsPanel = document.getElementById('notificationsPanel');
  const closeNotificationsButton = document.getElementById('closeNotificationsBtn');
  const markNotificationsReadButton = document.getElementById('markNotificationsReadBtn');
  const notificationsList = document.getElementById('notificationsList');
  const cartPanel = document.getElementById('cartPanel');
  const closeCartButton = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDeliveryEl = document.getElementById('cartDelivery');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutPanel = document.getElementById('checkoutPanel');
  const backToCartButton = document.getElementById('backToCartBtn');
  const closeCheckoutButton = document.getElementById('closeCheckoutBtn');
  const checkoutItemsContainer = document.getElementById('checkoutItems');
  const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
  const checkoutDeliveryEl = document.getElementById('checkoutDelivery');
  const checkoutTotalEl = document.getElementById('checkoutTotal');
  const couponInput = document.getElementById('couponInput');
  const applyCouponButton = document.getElementById('applyCouponBtn');
  const couponMessage = document.getElementById('couponMessage');
  const checkoutDiscountEl = document.getElementById('checkoutDiscount');
  const placeOrderButton = document.getElementById('placeOrderBtn');
  const paymentOptions = document.querySelectorAll('.payment-option');
  const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');
  const upiDetails = document.getElementById('upiDetails');
  const cardDetails = document.getElementById('cardDetails');
  const codDetails = document.getElementById('codDetails');
  const upiIdInput = document.getElementById('upiIdInput');
  const cardNumberInput = document.getElementById('cardNumberInput');
  const cardExpiryInput = document.getElementById('cardExpiryInput');
  const cardCvvInput = document.getElementById('cardCvvInput');
  const paymentError = document.getElementById('paymentError');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const orderIdEl = document.getElementById('orderId');
  const continueAfterOrderButton = document.getElementById('continueAfterOrderBtn');
  const ordersPanel = document.getElementById('ordersPanel');
  const closeOrdersButton = document.getElementById('closeOrdersBtn');
  const ordersList = document.getElementById('ordersList');
  const ordersCount = document.getElementById('ordersCount');
  const orderDetailsPanel = document.getElementById('orderDetailsPanel');
  const closeOrderDetailsButton = document.getElementById('closeOrderDetailsBtn');
  const orderDetailsContent = document.getElementById('orderDetailsContent');
  const orderDetailsSubtitle = document.getElementById('orderDetailsSubtitle');
  const accountPanel = document.getElementById('accountPanel');
  const closeAccountButton = document.getElementById('closeAccountBtn');
  const profilePanel = document.getElementById('profilePanel');
  const closeProfileButton = document.getElementById('closeProfileBtn');
  const profilePopupAvatar = document.getElementById('profilePopupAvatar');
  const profilePopupName = document.getElementById('profilePopupName');
  const profilePopupEmail = document.getElementById('profilePopupEmail');
  const profilePopupStatus = document.getElementById('profilePopupStatus');
  const profilePopupAction = document.getElementById('profilePopupAction');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettingsButton = document.getElementById('closeSettingsBtn');
  const settingsDoneButton = document.getElementById('settingsDoneBtn');
  const accountMenuItems = document.querySelectorAll('.account-menu-item');
  const profileDashboardCards = document.querySelectorAll('.profile-dashboard-card');
  const accountAddressManager = document.getElementById('accountAddressManager');
  const addAddressButton = document.getElementById('addAddressBtn');
  const cancelAddressButton = document.getElementById('cancelAddressBtn');
  const profileAddressForm = document.getElementById('profileAddressForm');
  const profileAddressLabel = document.getElementById('profileAddressLabel');
  const profileAddressName = document.getElementById('profileAddressName');
  const profileAddressMobile = document.getElementById('profileAddressMobile');
  const profileAddressLine = document.getElementById('profileAddressLine');
  const profileAddressPincode = document.getElementById('profileAddressPincode');
  const savedAddressesList = document.getElementById('savedAddressesList');
  const profileOrderCount = document.getElementById('profileOrderCount');
  const profileWishlistCount = document.getElementById('profileWishlistCount');
  const profileAddressCount = document.getElementById('profileAddressCount');
  const accountAvatar = document.getElementById('accountAvatar');
  const accountTitle = document.getElementById('accountTitle');
  const accountSubtitle = document.getElementById('accountSubtitle');
  const accountAuthTitle = document.getElementById('accountAuthTitle');
  const accountAuthHint = document.getElementById('accountAuthHint');
  const accountAuthAction = document.getElementById('accountAuthAction');
  const authPanel = document.getElementById('authPanel');
  const closeAuthButton = document.getElementById('closeAuthBtn');
  const authBackdrop = document.getElementById('authBackdrop');
  const authForm = document.getElementById('authForm');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authModeButtons = document.querySelectorAll('[data-auth-mode]');
  const authNameInput = document.getElementById('authName');
  const authEmailInput = document.getElementById('authEmail');
  const authPasswordInput = document.getElementById('authPassword');
  const authConfirmPasswordInput = document.getElementById('authConfirmPassword');
  const passwordToggle = document.getElementById('passwordToggle');
  const rememberMeInput = document.getElementById('rememberMe');
  const forgotPasswordButton = document.getElementById('forgotPasswordBtn');
  const authError = document.getElementById('authError');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const authSubmitText = document.getElementById('authSubmitText');
  const authNameField = document.querySelector('.auth-name-field');
  const authConfirmField = document.querySelector('.auth-confirm-field');
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  const wishlistPanel = document.getElementById('wishlistPanel');
  const closeWishlistButton = document.getElementById('closeWishlistBtn');
  const wishlistItemsContainer = document.getElementById('wishlistItems');
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingMessage = document.getElementById('loadingMessage');
  const loadingProgress = document.getElementById('loadingProgress');
  const toastContainer = document.getElementById('toastContainer');
  const addressForm = document.getElementById('addressForm');
  const addressNameInput = document.getElementById('addressName');
  const addressMobileInput = document.getElementById('addressMobile');
  const addressLineInput = document.getElementById('addressLine');
  const addressPincodeInput = document.getElementById('addressPincode');
  const addressError = document.getElementById('addressError');
  const addressSavedMessage = document.getElementById('addressSavedMessage');
  const addressBarButton = document.querySelector('.address-button');
  const addressBarTitle = document.querySelector('.address-text strong');
  const adminButton = document.getElementById('adminButton');
  const adminPanel = document.getElementById('adminPanel');
  const closeAdminButton = document.getElementById('closeAdminBtn');
  const adminKeyForm = document.getElementById('adminKeyForm');
  const adminKeyInput = document.getElementById('adminKeyInput');
  const adminKeyMessage = document.getElementById('adminKeyMessage');
  const adminWorkspace = document.getElementById('adminWorkspace');
  const refreshDashboardButton = document.getElementById('refreshDashboardBtn');
  const dashboardOrders = document.getElementById('dashboardOrders');
  const dashboardProducts = document.getElementById('dashboardProducts');
  const dashboardUsers = document.getElementById('dashboardUsers');
  const dashboardSales = document.getElementById('dashboardSales');
  const dashboardOrdersList = document.getElementById('dashboardOrdersList');
  const dashboardTopProducts = document.getElementById('dashboardTopProducts');
  const adminProductCount = document.getElementById('adminProductCount');
  const adminProductsList = document.getElementById('adminProductsList');
  const newProductButton = document.getElementById('newProductBtn');
  const productForm = document.getElementById('productForm');
  const productFormTitle = document.getElementById('productFormTitle');
  const cancelProductButton = document.getElementById('cancelProductBtn');
  const productFormMessage = document.getElementById('productFormMessage');
  const productIdInput = document.getElementById('productIdInput');
  const productNameInput = document.getElementById('productNameInput');
  const productSkuInput = document.getElementById('productSkuInput');
  const productPriceInput = document.getElementById('productPriceInput');
  const productOriginalPriceInput = document.getElementById('productOriginalPriceInput');
  const productStockInput = document.getElementById('productStockInput');
  const productCategoryInput = document.getElementById('productCategoryInput');
  const productBrandInput = document.getElementById('productBrandInput');
  const productImageClassInput = document.getElementById('productImageClassInput');
  const productDescriptionInput = document.getElementById('productDescriptionInput');
  const productActiveInput = document.getElementById('productActiveInput');
  const CART_STORAGE_KEY = 'nexora-cart';
  const ADDRESS_STORAGE_KEY = 'nexora-delivery-address';
  const ADDRESSES_STORAGE_KEY = 'nexora-delivery-addresses';
  const ORDERS_STORAGE_KEY = 'nexora-orders';
  const WISHLIST_STORAGE_KEY = 'nexora-wishlist';
  const NOTIFICATIONS_STORAGE_KEY = 'nexora-notifications';
  const AUTH_USERS_STORAGE_KEY = 'nexora-auth-users';
  const AUTH_SESSION_STORAGE_KEY = 'nexora-auth-session';
  const RECENT_SEARCHES_STORAGE_KEY = 'nexora-recent-searches';
  const configuredApiBase = window.NEXORA_API_BASE
    || document.querySelector('meta[name="nexora-api-base"]')?.content
    || '';
  const isLocalFrontend = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    && window.location.port !== '3000';
  const API_BASE = configuredApiBase.replace(/\/$/, '')
    || (window.location.protocol === 'file:' || isLocalFrontend
      ? 'http://localhost:3000'
      : window.location.origin);
  let apiAvailable = false;
  let recentSearchEditMode = false;
  let recentSearchSaveTimer;
  const apiRequest = async (path, options = {}) => {
    const session = getAuthSession();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    try {
      const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(payload.error || `Request failed (${response.status})`);
        error.apiResponse = true;
        error.status = response.status;
        throw error;
      }
      apiAvailable = true;
      return payload;
    } catch (error) {
      if (!error.apiResponse) apiAvailable = false;
      throw error;
    }
  };

  const closeProfilePanel = () => {
    if (!profilePanel) return;
    profilePanel.classList.add('hidden');
    profilePanel.setAttribute('aria-hidden', 'true');
  };

  const closeSearchPage = () => {
    if (!searchPage) return;
    searchPage.classList.add('hidden');
    searchPage.setAttribute('aria-hidden', 'true');
    searchButton?.focus({ preventScroll: true });
  };

  const loadRecentSearches = () => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim()) : [];
    } catch (error) {
      return [];
    }
  };

  const saveRecentSearches = (searches) => {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(searches.slice(0, 8)));
  };

  const renderRecentSearches = () => {
    if (!recentSearchesList) return;
    const searches = loadRecentSearches();
    const recentSearchesSection = recentSearchesList.closest('.recent-searches');
    if (recentSearchesSection) recentSearchesSection.classList.toggle('editing', recentSearchEditMode);
    recentSearchesList.classList.toggle('editing', recentSearchEditMode);
    if (!searches.length) {
      recentSearchesList.innerHTML = '<span class="recent-searches-empty">Your recent searches will appear here.</span>';
      return;
    }
    recentSearchesList.innerHTML = searches.map((query) => `
      <button class="recent-search-chip" type="button" data-recent-search="${escapeHtml(query)}">
        <span>🕘</span><span>${escapeHtml(query)}</span>
        <b class="recent-search-remove" data-remove-recent="${escapeHtml(query)}" aria-label="Remove ${escapeHtml(query)}">×</b>
      </button>
    `).join('');
    recentSearchesList.querySelectorAll('[data-recent-search]').forEach((button) => {
      button.addEventListener('click', (event) => {
        if (event.target.closest('[data-remove-recent]')) return;
        if (fullSearchInput) fullSearchInput.value = button.dataset.recentSearch;
        if (searchInput) searchInput.value = button.dataset.recentSearch;
        renderSearchResults();
      });
    });
    recentSearchesList.querySelectorAll('[data-remove-recent]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        saveRecentSearches(loadRecentSearches().filter((query) => query !== button.dataset.removeRecent));
        renderRecentSearches();
      });
    });
  };

  const rememberSearch = (value) => {
    const query = String(value || '').trim().replace(/\s+/g, ' ');
    if (query.length < 2) return;
    const searches = loadRecentSearches().filter((item) => item.toLowerCase() !== query.toLowerCase());
    saveRecentSearches([query, ...searches]);
    renderRecentSearches();
  };

  const renderSearchResults = () => {
    if (!searchResults) return;
    const query = fullSearchInput?.value.trim().toLowerCase() || '';
    const matches = [...productCards].filter((card) => {
      const haystack = `${card.dataset.name || ''} ${card.dataset.category || ''} ${card.dataset.brand || ''}`.toLowerCase();
      return !query || haystack.includes(query);
    });
    if (searchSuggestions && searchSuggestionsSection) {
      const suggestions = matches.slice(0, 5);
      searchSuggestionsSection.classList.toggle('hidden', !query || !suggestions.length);
      searchSuggestions.innerHTML = suggestions.map((card) => `
        <button class="search-suggestion-item" type="button" data-suggestion-product="${escapeHtml(card.dataset.name || '')}">
          <span class="search-suggestion-icon">🔎</span>
          <span><strong>${escapeHtml(card.querySelector('.product-name')?.textContent || 'Product')}</strong><small>${escapeHtml(card.dataset.category || '')} · ${escapeHtml(card.dataset.brand || '')}</small></span>
          <span class="search-suggestion-arrow">↗</span>
        </button>
      `).join('');
      searchSuggestions.querySelectorAll('[data-suggestion-product]').forEach((button) => {
        button.addEventListener('click', () => {
          if (fullSearchInput) fullSearchInput.value = button.dataset.suggestionProduct;
          if (searchInput) searchInput.value = button.dataset.suggestionProduct;
          rememberSearch(button.dataset.suggestionProduct);
          renderSearchResults();
        });
      });
    }
    if (searchPageTitle) searchPageTitle.textContent = query ? `Results for “${query}”` : 'Discover something new';
    if (searchResultSummary) searchResultSummary.textContent = query
      ? `${matches.length} product${matches.length === 1 ? '' : 's'} found`
      : 'Search products, categories and brands.';
    searchResults.innerHTML = matches.length ? matches.map((card) => `
      <button class="search-result-card" type="button" data-search-product="${escapeHtml(card.dataset.name || '')}">
        <span class="search-result-image ${safeImageClass(card.querySelector('.product-image')?.classList.value.split(' ').find((name) => name.startsWith('product-')))}"></span>
        <span class="search-result-info"><strong>${escapeHtml(card.querySelector('.product-name')?.textContent || 'Product')}</strong><small>${escapeHtml(card.dataset.category || '')} · ${escapeHtml(card.dataset.brand || '')}</small></span>
        <span class="search-result-price">${escapeHtml(card.querySelector('.product-price')?.textContent || '')}</span>
      </button>
    `).join('') : `
      <div class="search-empty">
        <span>🔎</span>
        <strong>No products found</strong>
        <small>Try a different product, category or brand.</small>
      </div>
    `;
    searchResults.querySelectorAll('[data-search-product]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = [...productCards].find((item) => item.dataset.name === button.dataset.searchProduct);
        if (card) {
          closeSearchPage();
          card.click();
        }
      });
    });
  };

  const openSearchPage = () => {
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeProfilePanel();
    closeSettingsPanel();
    closeWishlistPanel();
    closeNotificationsPanel();
    if (fullSearchInput && searchInput) fullSearchInput.value = searchInput.value;
    renderRecentSearches();
    renderSearchResults();
    searchPage?.classList.remove('hidden');
    searchPage?.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => fullSearchInput?.focus(), 50);
  };

  const openProfilePanel = () => {
    if (!currentUser) {
      openAuthPanel('login');
      return;
    }
    if (profilePopupAvatar) profilePopupAvatar.textContent = '✨';
    if (profilePopupName) profilePopupName.textContent = currentUser.name || 'Nexora member';
    if (profilePopupEmail) profilePopupEmail.textContent = currentUser.email || 'Not available';
    if (profilePopupStatus) profilePopupStatus.textContent = currentUser.token ? 'Active member' : 'Local member';
    if (!profilePanel) return;
    closeAccountPanel();
    profilePanel.classList.remove('hidden');
    profilePanel.setAttribute('aria-hidden', 'false');
  };
  const closeSettingsPanel = () => {
    if (!settingsPanel) return;
    settingsPanel.classList.add('hidden');
    settingsPanel.setAttribute('aria-hidden', 'true');
  };

  const openSettingsPanel = () => {
    closeAccountPanel();
    closeProfilePanel();
    settingsPanel?.classList.remove('hidden');
    settingsPanel?.setAttribute('aria-hidden', 'false');
  };
  let cart = [];
  let cartCount = 0;
  let syncCartToServer = async () => {};
  let wishlist = [];
  let appliedCoupon = null;
  let notifications = [];
  let selectedRating = 0;
  let selectedCategory = '';
  let activeCatalogCategory = 'For You';
  let activeCatalogFilter = 'all';
  let authMode = 'login';
  let currentUser = null;
  let addresses = [];

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const normalizeDigits = (input, maxLength) => {
    if (!input) return;
    input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
  };

  const safeImageClass = (value) => ['product-one', 'product-two', 'product-three', 'product-four'].includes(value)
    ? value
    : 'product-one';

  [addressMobileInput, addressPincodeInput, profileAddressMobile, profileAddressPincode, cardCvvInput]
    .forEach((input) => input?.addEventListener('input', () => normalizeDigits(input, input === addressPincodeInput || input === profileAddressPincode ? 6 : input === cardCvvInput ? 3 : 10)));

  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add('toast-hide');
      window.setTimeout(() => toast.remove(), 250);
    }, 2600);
  };

  let premiumOfferToastTimer;
  const showPremiumOfferToast = (message) => {
    if (!toastContainer) return;
    const existingToast = toastContainer.querySelector('.premium-offer-toast');
    if (existingToast) existingToast.remove();
    window.clearTimeout(premiumOfferToastTimer);

    const toast = document.createElement('div');
    toast.className = 'toast toast-premium premium-offer-toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    premiumOfferToastTimer = window.setTimeout(() => {
      toast.classList.add('toast-hide');
      window.setTimeout(() => toast.remove(), 250);
    }, 3000);
  };

  let adminKey = sessionStorage.getItem('nexora-admin-key') || '';
  let adminProducts = [];
  const renderDashboard = (dashboard) => {
    const stats = dashboard.stats || {};
    if (dashboardOrders) dashboardOrders.textContent = Number(stats.orders || 0).toLocaleString('en-IN');
    if (dashboardProducts) dashboardProducts.textContent = Number(stats.products || 0).toLocaleString('en-IN');
    if (dashboardUsers) dashboardUsers.textContent = Number(stats.users || 0).toLocaleString('en-IN');
    if (dashboardSales) dashboardSales.textContent = currency(stats.sales || 0);
    if (dashboardOrdersList) dashboardOrdersList.innerHTML = dashboard.recentOrders?.length ? dashboard.recentOrders.map((order) => `
      <div class="dashboard-order-row"><div><strong>#${escapeHtml(order.id)} · ${escapeHtml(order.customer_name)}</strong><small>${escapeHtml(order.customer_email)}</small></div><div><b>${currency(order.total)}</b><span class="order-status status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</span></div></div>
    `).join('') : '<div class="dashboard-empty">No orders yet.</div>';
    if (dashboardTopProducts) dashboardTopProducts.innerHTML = dashboard.topProducts?.length ? dashboard.topProducts.map((product, index) => `
      <div class="dashboard-product-row"><span class="rank-number">${index + 1}</span><div><strong>${escapeHtml(product.name)}</strong><small>${product.units} units sold</small></div><b>${currency(product.revenue)}</b></div>
    `).join('') : '<div class="dashboard-empty">Sales data will appear here.</div>';
  };
  const loadDashboard = async () => {
    const result = await adminRequest('/api/admin/dashboard');
    renderDashboard(result);
  };
  const adminRequest = async (path, options = {}) => {
    const headers = { 'Content-Type': 'application/json', 'x-admin-key': adminKey, ...(options.headers || {}) };
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return payload;
  };

  const closeAdminPanel = () => {
    adminPanel?.classList.add('hidden');
    adminPanel?.setAttribute('aria-hidden', 'true');
  };

  const resetProductForm = () => {
    productForm?.reset();
    if (productIdInput) productIdInput.value = '';
    if (productActiveInput) productActiveInput.checked = true;
    if (productImageClassInput) productImageClassInput.value = 'product-one';
    if (productFormTitle) productFormTitle.textContent = 'Add product';
    productForm?.classList.add('hidden');
    if (productFormMessage) productFormMessage.textContent = '';
  };

  const renderAdminProducts = () => {
    if (!adminProductsList) return;
    if (adminProductCount) adminProductCount.textContent = `${adminProducts.length} product${adminProducts.length === 1 ? '' : 's'}`;
    adminProductsList.innerHTML = adminProducts.length ? adminProducts.map((product) => {
      const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : '';
      return `
        <article class="admin-product-row">
          <div class="admin-product-image ${safeImageClass(product.image_class)}"></div>
          <div class="admin-product-details">
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(product.category)} · ${currency(product.price)}${product.active ? '' : ' · Hidden'}</small>
            <span class="admin-stock ${stockClass}">${product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}</span>
          </div>
          <div class="admin-product-actions">
            <button type="button" data-admin-action="edit" data-product-id="${product.id}">Edit</button>
            <button type="button" class="delete-product-btn" data-admin-action="delete" data-product-id="${product.id}">Delete</button>
          </div>
        </article>
      `;
    }).join('') : '<div class="admin-empty-state">No products found. Add your first product.</div>';
  };

  const loadAdminProducts = async () => {
    const result = await adminRequest('/api/admin/products');
    adminProducts = result.products || [];
    renderAdminProducts();
  };

  const openAdminPanel = () => {
    closeCartPanel();
    closeCheckoutPanel();
    closeAccountPanel();
    closeProfilePanel();
    closeSettingsPanel();
    closeWishlistPanel();
    closeNotificationsPanel();
    adminPanel?.classList.remove('hidden');
    adminPanel?.setAttribute('aria-hidden', 'false');
    if (adminKey) {
      adminKeyInput.value = '';
      adminKeyForm?.classList.add('hidden');
      adminWorkspace?.classList.remove('hidden');
      Promise.all([loadDashboard(), loadAdminProducts()]).catch((error) => {
        adminKey = '';
        sessionStorage.removeItem('nexora-admin-key');
        adminKeyForm?.classList.remove('hidden');
        adminWorkspace?.classList.add('hidden');
        if (adminKeyMessage) adminKeyMessage.textContent = error.message;
      });
    }
  };
  if (refreshDashboardButton) refreshDashboardButton.addEventListener('click', () => {
    loadDashboard().then(() => showToast('Dashboard refreshed')).catch((error) => showToast(error.message, 'error'));
  });

  const startProductEdit = (product) => {
    if (!productForm) return;
    productForm.classList.remove('hidden');
    productFormTitle.textContent = 'Edit product';
    productIdInput.value = product.id;
    productNameInput.value = product.name || '';
    productSkuInput.value = product.sku || '';
    productPriceInput.value = product.price;
    productOriginalPriceInput.value = product.original_price ?? '';
    productStockInput.value = product.stock;
    productCategoryInput.value = product.category || '';
    productBrandInput.value = product.brand || '';
    productImageClassInput.value = safeImageClass(product.image_class);
    productDescriptionInput.value = product.description || '';
    productActiveInput.checked = Boolean(product.active);
    productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setLoadingState = (message, progress) => {
    if (loadingMessage) loadingMessage.textContent = message;
    if (loadingProgress) loadingProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  };

  const showLoading = (duration = 450, message = 'Securing your order') => {
    if (!loadingScreen) return Promise.resolve();
    loadingScreen.setAttribute('aria-hidden', 'false');
    loadingScreen.classList.add('visible');
    setLoadingState(message, 24);
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => setLoadingState(message, 64));
      window.setTimeout(() => {
        setLoadingState('Almost ready', 100);
        window.setTimeout(() => {
          loadingScreen.classList.remove('visible');
          loadingScreen.setAttribute('aria-hidden', 'true');
          resolve();
        }, 120);
      }, Math.max(0, duration - 120));
    });
  };

  const finishInitialLoading = () => {
    if (!loadingScreen) return;
    setLoadingState('Ready to explore', 100);
    window.setTimeout(() => {
      loadingScreen.classList.remove('visible');
      loadingScreen.setAttribute('aria-hidden', 'true');
      document.body.classList.add('app-ready');
    }, 220);
  };

  setLoadingState('Loading your storefront', 18);
  window.requestAnimationFrame(() => setLoadingState('Curating fresh picks', 52));
  window.setTimeout(finishInitialLoading, 720);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      return [];
    }

  };

  const saveCart = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    syncCartToServer();
  };

  cart = loadCart();
  let cartSyncPromise = null;
  const cartItemsForApi = async (items) => {
    const productsResult = await apiRequest('/api/products');
    const productsByName = new Map((productsResult.products || []).map((product) => [product.name.toLowerCase(), product]));
    return items.map((item) => {
      const product = item.productId
        ? productsResult.products?.find((entry) => entry.id === Number(item.productId))
        : productsByName.get(String(item.name).toLowerCase());
      return product ? { product_id: product.id, quantity: item.qty } : null;
    }).filter(Boolean);
  };
  syncCartToServer = async () => {
    if (!currentUser?.token || cartSyncPromise) return cartSyncPromise;
    cartSyncPromise = (async () => {
      try {
        const items = await cartItemsForApi(cart);
        await apiRequest('/api/cart', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
      } catch (error) {
        if (error.apiResponse) showToast(error.message || 'Unable to save your cart.', 'error');
      } finally {
        cartSyncPromise = null;
      }
    })();
    return cartSyncPromise;
  };

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch (error) {
      return [];
    }
  };

  const saveWishlist = () => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    syncWishlistToServer();
  };

  wishlist = loadWishlist();
  let wishlistSyncPromise = null;
  const wishlistItemsForApi = async (items) => {
    const productsResult = await apiRequest('/api/products');
    const products = productsResult.products || [];
    const byName = new Map(products.map((product) => [product.name.toLowerCase(), product]));
    return items.map((item) => {
      const product = item.productId
        ? products.find((entry) => entry.id === Number(item.productId))
        : byName.get(String(item.name).toLowerCase());
      return product ? { product_id: product.id } : null;
    }).filter(Boolean);
  };
  const syncWishlistToServer = async () => {
    if (!currentUser?.token || wishlistSyncPromise) return wishlistSyncPromise;
    wishlistSyncPromise = (async () => {
      try {
        const items = await wishlistItemsForApi(wishlist);
        await apiRequest('/api/wishlist', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
      } catch (error) {
        if (error.apiResponse) showToast(error.message || 'Unable to save your wishlist.', 'error');
      } finally {
        wishlistSyncPromise = null;
      }
    })();
    return wishlistSyncPromise;
  };

  const loadNotifications = () => {
    try {
      const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const parsedNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      return Array.isArray(parsedNotifications) ? parsedNotifications : [];
    } catch (error) {
      return [];
    }
  };

  const saveNotifications = () => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  };

  notifications = loadNotifications();

  const addNotification = (type, title, message, icon) => {
    notifications.unshift({
      id: `NT-${Date.now()}`,
      type,
      title,
      message,
      icon,
      read: false,
      createdAt: new Date().toISOString()
    });
    notifications = notifications.slice(0, 30);
    saveNotifications();
    renderNotifications();
  };

  const renderNotifications = () => {
    if (!notificationsList) return;
    const unreadCount = notifications.filter((notification) => !notification.read).length;
    if (notificationCountEl) {
      notificationCountEl.textContent = String(unreadCount);
      notificationCountEl.classList.toggle('hidden', unreadCount === 0);
    }
    notificationsList.innerHTML = notifications.length ? notifications.map((notification) => `
      <article class="notification-item ${notification.read ? '' : 'unread'}">
        <div class="notification-icon notification-${notification.type}">${notification.icon}</div>
        <div class="notification-content">
          <strong>${escapeHtml(notification.title)}</strong>
          <p>${escapeHtml(notification.message)}</p>
          <small>${escapeHtml(new Date(notification.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}</small>
        </div>
      </article>
    `).join('') : `
      <div class="no-notifications">
        <div>🔔</div>
        <h4>No notifications</h4>
        <p>Order and offer updates will appear here.</p>
      </div>
    `;
  };

  const closeNotificationsPanel = () => {
    if (!notificationsPanel) return;
    notificationsPanel.classList.add('hidden');
    notificationsPanel.setAttribute('aria-hidden', 'true');
  };

  const openNotificationsPanel = () => {
    if (!notificationsPanel) return;
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeProfilePanel();
    closeWishlistPanel();
    notifications.forEach((notification) => {
      notification.read = true;
    });
    saveNotifications();
    renderNotifications();
    notificationsPanel.classList.remove('hidden');
    notificationsPanel.setAttribute('aria-hidden', 'false');
  };

  renderNotifications();

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      return Array.isArray(parsedOrders) ? parsedOrders : [];
    } catch (error) {
      return [];
    }
  };

  const saveOrders = (orders) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  };

  let orders = loadOrders();
  let editingAddressId = null;

  const loadAddress = () => {
    try {
      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
      const parsedAddress = savedAddress ? JSON.parse(savedAddress) : {};
      return parsedAddress && typeof parsedAddress === 'object' ? parsedAddress : {};
    } catch (error) {
      return {};
    }
  };

  const savedAddress = loadAddress();
  const loadAddresses = () => {
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed) && parsed.length) return parsed;
      return savedAddress.name ? [{ ...savedAddress, id: `ADDR-${Date.now()}`, label: 'Home', selected: true }] : [];
    } catch (error) {
      return savedAddress.name ? [{ ...savedAddress, id: `ADDR-${Date.now()}`, label: 'Home', selected: true }] : [];
    }
  };
  const saveAddresses = () => localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
  addresses = loadAddresses();
  const selectedAddress = () => addresses.find((address) => address.selected) || addresses[0];
  const applyAddressToCheckout = (address) => {
    if (!address) return;
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify({
      name: address.name || '',
      mobile: address.mobile || '',
      address: address.address || '',
      pincode: address.pincode || ''
    }));
    if (addressNameInput) addressNameInput.value = address.name || '';
    if (addressMobileInput) addressMobileInput.value = address.mobile || '';
    if (addressLineInput) addressLineInput.value = address.address || '';
    if (addressPincodeInput) addressPincodeInput.value = address.pincode || '';
    if (addressBarTitle) addressBarTitle.textContent = `${address.label || 'Address'} · ${address.pincode || ''}`;
  };
  if (addressNameInput) addressNameInput.value = savedAddress.name || '';
  if (addressMobileInput) addressMobileInput.value = savedAddress.mobile || '';
  if (addressLineInput) addressLineInput.value = savedAddress.address || '';
  if (addressPincodeInput) addressPincodeInput.value = savedAddress.pincode || '';
  applyAddressToCheckout(selectedAddress());

  const bannerSlides = [
    {
      tag: 'Limited Offer',
      title: 'Big Sale',
      offer: 'Up to 50% Off',
      visual: '✨',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 35%, #60a5fa 100%)'
    },
    {
      tag: 'New Launch',
      title: 'Smart Deals',
      offer: 'Free Delivery Today',
      visual: '🚀',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 35%, #7c3aed 100%)'
    },
    {
      tag: 'Weekend Pick',
      title: 'Fresh Finds',
      offer: 'Extra 20% Off',
      visual: '🎉',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 35%, #f59e0b 100%)'
    }
  ];

  let currentSlide = 0;
  let dealEndsAt = Date.now() + (6 * 60 * 60 * 1000);
  const recentlyViewedKey = 'nexora-recently-viewed';
  const productDetails = {
    'iphone pro case': { seller: 'Nexora Mobile Store', variants: ['Black', 'Clear', 'MagSafe'], specs: [['Brand', 'Apple'], ['Compatible Model', 'iPhone Pro'], ['Material', 'Shockproof TPU'], ['Warranty', '6 months']], highlights: ['Slim protective fit', 'Raised camera edge', 'Wireless charging ready'], reviews: ['Perfect fit and premium finish.', 'Good protection for everyday use.'], questions: [['Does it support wireless charging?', 'Yes, it supports wireless charging.']] },
    'wireless earbud': { seller: 'Soundcore Official', variants: ['Black', 'White', 'Blue'], specs: [['Brand', 'Soundcore'], ['Battery', '32 hours'], ['Connectivity', 'Bluetooth 5.3'], ['Warranty', '1 year']], highlights: ['Deep bass audio', 'Low-latency mode', 'USB-C fast charging'], reviews: ['Clear sound and comfortable fit.', 'Battery backup is excellent.'], questions: [['Is a charging case included?', 'Yes, the charging case is included.']] },
    'smart watch': { seller: 'Samsung Authorized', variants: ['42 mm', '44 mm', '46 mm'], specs: [['Brand', 'Samsung'], ['Display', 'AMOLED'], ['Water Resistance', '5 ATM'], ['Warranty', '1 year']], highlights: ['Health tracking', 'Bright AMOLED display', 'Smart notifications'], reviews: ['The display is bright and smooth.', 'Useful fitness features for daily use.'], questions: [['Does it track heart rate?', 'Yes, continuous heart-rate tracking is supported.']] },
    'travel backpack': { seller: 'Nexora Travel Store', variants: ['Black', 'Olive', 'Navy'], specs: [['Brand', 'Nexora'], ['Capacity', '28 litres'], ['Material', 'Water-resistant fabric'], ['Warranty', '6 months']], highlights: ['Laptop compartment', 'Water-resistant finish', 'Comfortable shoulder straps'], reviews: ['Spacious and comfortable for travel.', 'Strong zippers and useful pockets.'], questions: [['Will a 15-inch laptop fit?', 'Yes, the padded sleeve fits laptops up to 15 inches.']] }
  };

  const getProductDetails = (card) => {
    const key = String(card.dataset.name || '').toLowerCase();
    const defaults = { seller: `${card.dataset.brand || 'Nexora'} Official`, variants: ['Standard', 'Premium'], specs: [['Brand', card.dataset.brand || 'Nexora'], ['Category', card.dataset.category || 'Premium'], ['Rating', `${card.dataset.rating || '4.8'} / 5`], ['Reviews', card.dataset.reviews || '0']], highlights: ['Premium quality', 'Fast delivery', 'Easy returns'], reviews: ['Great quality and value for money.', 'Arrived quickly and matched the listing.'], questions: [['Is this product available for quick delivery?', 'Delivery availability is shown at checkout.']] };
    return { ...defaults, ...(productDetails[key] || {}) };
  };

  const getRecentlyViewed = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(recentlyViewedKey) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  };

  const saveRecentlyViewed = (card) => {
    const current = getRecentlyViewed().filter((name) => name !== card.dataset.name);
    localStorage.setItem(recentlyViewedKey, JSON.stringify([card.dataset.name, ...current].slice(0, 6)));
  };

  let activeProductCard = null;

  const renderDetailProductStrip = (container, cards) => {
    if (!container) return;
    container.innerHTML = cards.map((card) => {
      const imageClass = [...(card.querySelector('.product-image')?.classList || [])].find((name) => name.startsWith('product-')) || 'product-one';
      return `<button class="detail-product-card" type="button" data-detail-product="${escapeHtml(card.dataset.name)}"><span class="detail-product-image ${imageClass}"></span><strong>${escapeHtml(card.querySelector('.product-name')?.textContent || 'Product')}</strong><small>${escapeHtml(card.dataset.price || '')}</small></button>`;
    }).join('');
    container.querySelectorAll('[data-detail-product]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = [...productCards].find((item) => item.dataset.name === button.dataset.detailProduct);
        if (card) openProductModal(card);
      });
    });
  };

  const updateBanner = () => {
    if (!promoBanner || !promoTag || !promoTitle || !promoOffer || !promoVisual) return;

    const slide = bannerSlides[currentSlide];
    promoTag.textContent = slide.tag;
    promoTitle.textContent = slide.title;
    promoOffer.textContent = slide.offer;
    promoVisual.textContent = slide.visual;
    promoBanner.style.background = slide.gradient;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });

    currentSlide = (currentSlide + 1) % bannerSlides.length;
  };

  if (promoBanner) {
    updateBanner();
    setInterval(updateBanner, 3000);
  }
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateBanner();
    });
  });

  const updateDealTimer = () => {
    if (!dealTimer) return;
    let remaining = Math.max(0, dealEndsAt - Date.now());
    if (remaining === 0) {
      dealEndsAt = Date.now() + (6 * 60 * 60 * 1000);
      remaining = dealEndsAt - Date.now();
    }
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const formatted = [hours, minutes, seconds].map((value) => String(value).padStart(2, '0'));
    if (dealHours && dealMinutes && dealSeconds) {
      dealHours.textContent = formatted[0];
      dealMinutes.textContent = formatted[1];
      dealSeconds.textContent = formatted[2];
    } else if (dealTimer) {
      dealTimer.textContent = formatted.join(':');
    }
  };

  updateDealTimer();
  setInterval(updateDealTimer, 1000);

  const openProductModal = (card) => {
    if (!modal || !modalTitle || !modalPrice || !modalRating || !modalImage) return;

    const productName = card.dataset.name || card.querySelector('.product-name')?.textContent || 'Product';
    const productPrice = card.dataset.price || card.querySelector('.product-price')?.textContent || '₹499';
    const productRating = card.dataset.rating || card.querySelector('.product-rating')?.textContent.replace('⭐ ', '') || '4.8';
    const reviewCount = card.dataset.reviews || '0';
    const category = card.dataset.category || 'Premium';
    const productImageClass = card.querySelector('.product-image')?.className || 'product-one';
    const resolvedImageClass = productImageClass.includes('product-one') ? 'product-one' : productImageClass.includes('product-two') ? 'product-two' : productImageClass.includes('product-three') ? 'product-three' : 'product-four';
    const galleryClasses = [resolvedImageClass, 'product-two', 'product-three', 'product-four'];
    const details = getProductDetails(card);
    activeProductCard = card;
    saveRecentlyViewed(card);

    modalTitle.textContent = productName;
    modalPrice.textContent = productPrice;
    modalRating.textContent = productRating;
    if (modalReviews) {
      modalReviews.innerHTML = `
        <span class="review-stars">★★★★★</span>
        <strong>${productRating}</strong>
        <span>${escapeHtml(reviewCount)} verified reviews</span>
      `;
    }
    modalImage.className = 'modal-image ' + resolvedImageClass;
    modalImage.dataset.productClass = resolvedImageClass;
    if (modalBadge) modalBadge.textContent = `${category} pick`;
    if (modalSeller) modalSeller.textContent = details.seller;
    if (modalVariants) {
      modalVariants.innerHTML = `<strong>Choose variant</strong><div>${details.variants.map((variant, index) => `<button type="button" class="${index === 0 ? 'active' : ''}">${escapeHtml(variant)}</button>`).join('')}</div>`;
      modalVariants.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
        modalVariants.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      }));
    }
    if (productShowcasePanel) productShowcasePanel.innerHTML = `<div class="showcase-points">${details.highlights.map((item) => `<span>✓ ${escapeHtml(item)}</span>`).join('')}</div>`;
    if (productSpecificationsPanel) productSpecificationsPanel.innerHTML = `<div class="spec-grid">${details.specs.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`;
    if (productDescriptionPanel) productDescriptionPanel.innerHTML = `<p>${escapeHtml(`${productName} is designed for dependable everyday use with a premium ${category.toLowerCase()} finish and reliable performance.`)}</p>`;
    if (modalReviewSummary) modalReviewSummary.innerHTML = `<strong>${escapeHtml(productRating)} ★</strong><span>${escapeHtml(reviewCount)} ratings and reviews</span>`;
    if (modalVerifiedBuyers) modalVerifiedBuyers.textContent = `${Math.max(12, Number(reviewCount) - 8)} verified buyers`;
    if (modalReviewHighlights) modalReviewHighlights.innerHTML = ['Quality', 'Design', 'Value', 'Service', 'Safety', 'Durability'].map((label, index) => `<span><b>${label}</b><em>${(4.3 + (index % 4) * 0.1).toFixed(1)} ★</em></span>`).join('');
    if (modalReviewsList) modalReviewsList.innerHTML = details.reviews.map((review) => `<article class="review-card"><div>★★★★★ <b>Verified Buyer</b></div><p>${escapeHtml(review)}</p><small>Helpful · Recently purchased</small></article>`).join('');
    if (modalQuestionsList) modalQuestionsList.innerHTML = details.questions.map(([question, answer]) => `<article class="question-card"><strong>Q: ${escapeHtml(question)}</strong><p>A: ${escapeHtml(answer)}</p></article>`).join('');
    const recentCards = getRecentlyViewed().map((name) => [...productCards].find((item) => item.dataset.name === name)).filter(Boolean).filter((item) => item !== card).slice(0, 4);
    renderDetailProductStrip(modalRecentlyViewed, recentCards);
    renderDetailProductStrip(modalMoreProducts, [...productCards].filter((item) => item !== card && item.dataset.category === category).slice(0, 4));
    if (modalDescription) modalDescription.textContent = `${productName} is a premium ${category.toLowerCase()} essential, selected for reliable quality, everyday comfort, and a polished Nexora experience.`;
    if (galleryThumbnails) {
      galleryThumbnails.innerHTML = galleryClasses.map((imageClass, index) => `
        <button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-gallery-class="${imageClass}" aria-label="View product image ${index + 1}">
          <span class="${imageClass}"></span>
        </button>
      `).join('');
      galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
          modalImage.className = `modal-image ${thumbnail.dataset.galleryClass}`;
          galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((item) => item.classList.toggle('active', item === thumbnail));
        });
      });
    }
    renderRelatedProducts(card, category);

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  };

  if (modalWishlistButton) {
    modalWishlistButton.addEventListener('click', () => {
      if (!activeProductCard) return;
      activeProductCard.querySelector('.wishlist-btn')?.click();
      modalWishlistButton.textContent = activeProductCard.querySelector('.wishlist-btn')?.classList.contains('active') ? '♥ Saved' : '♡ Wishlist';
    });
  }
  if (modalShareButton) {
    modalShareButton.addEventListener('click', async () => {
      const title = modalTitle?.textContent || 'Nexora product';
      try {
        if (navigator.share) await navigator.share({ title, text: `Check out ${title} on Nexora` });
        else await navigator.clipboard.writeText(`${title} — Nexora`);
        showToast('Product link ready to share');
      } catch (error) {
        if (error.name !== 'AbortError') showToast('Sharing is unavailable', 'info');
      }
    });
  }

  const renderRelatedProducts = (activeCard, category) => {
    if (!relatedProductsContainer) return;
    const related = [...productCards].filter((card) => card !== activeCard && (!category || card.dataset.category === category)).slice(0, 3);
    const fallback = related.length ? related : [...productCards].filter((card) => card !== activeCard).slice(0, 3);
    relatedProductsContainer.innerHTML = fallback.map((card, index) => {
      const imageClass = [...(card.querySelector('.product-image')?.classList || [])].find((name) => name.startsWith('product-')) || 'product-one';
      return `<button class="related-product" type="button" data-related-index="${[...productCards].indexOf(card)}"><span class="related-product-image ${imageClass}"></span><span><strong>${escapeHtml(card.querySelector('.product-name')?.textContent.trim() || 'Product')}</strong><small>${escapeHtml(card.dataset.price || '₹0')} · ⭐ ${escapeHtml(card.dataset.rating || '4.8')}</small></span></button>`;
    }).join('');
    relatedProductsContainer.querySelectorAll('.related-product').forEach((button) => {
      button.addEventListener('click', () => openProductModal(productCards[Number(button.dataset.relatedIndex)]));
    });
  };

  const closeProductModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (addToCartButton) {
      addToCartButton.classList.remove('added');
      addToCartButton.textContent = 'Add to Cart';
    }

  };

  const currency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

  const parsePrice = (value) => {
    const numericValue = Number(String(value).replace(/[^\d]/g, '')) || 0;
    return numericValue;
  };

  const getCouponDiscount = (subtotal) => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon === 'SAVE100' && subtotal >= 999) return 100;
    if (appliedCoupon === 'BANK10') return Math.round(subtotal * 0.1);
    if (appliedCoupon === 'FREEDEL') return 40;
    return 0;
  };

  const closeCartPanel = () => {
    if (!cartPanel) return;
    cartPanel.classList.add('hidden');
    cartPanel.setAttribute('aria-hidden', 'true');
  };

  const renderCart = () => {
    if (!cartItemsContainer || !cartTotalEl || !cartSubtotalEl || !cartDeliveryEl) return;

    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + delivery;

    cartSubtotalEl.textContent = currency(subtotal);
    cartDeliveryEl.textContent = currency(delivery);
    cartTotalEl.textContent = currency(total);
    if (checkoutBtn) {
      checkoutBtn.disabled = !cart.length;
    }

    if (!cart.length) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🛒</div>
          <h4>Your Cart is Empty</h4>
          <button class="continue-shopping-btn" type="button">Continue Shopping</button>
        </div>
      `;

      const continueShoppingButton = cartItemsContainer.querySelector('.continue-shopping-btn');
      if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', closeCartPanel);
      }

      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item, index) => {
          const imageClass = item.imageClass || 'product-one';
          return `
            <div class="cart-item" data-index="${index}">
              <div class="cart-item-info">
                <div class="cart-item-image ${safeImageClass(imageClass)}"></div>
                <div>
                  <div class="cart-item-name">${escapeHtml(item.name)}</div>
                  <div class="cart-item-price">${currency(item.price)}</div>
                </div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-controls">
                  <button class="qty-btn qty-decrease" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                  <span class="cart-item-qty">${item.qty}</span>
                  <button class="qty-btn qty-increase" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-item-btn" data-action="remove" data-index="${index}" aria-label="Remove product">Remove</button>
              </div>
            </div>
          `;
        }
      )
      .join('');

    cartItemsContainer.querySelectorAll('.qty-btn, .remove-item-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const { action, index } = button.dataset;
        const itemIndex = Number(index);
        const item = cart[itemIndex];

        if (!item) return;

        if (action === 'increase') {
          if (Number.isFinite(Number(item.stock)) && item.stock >= 0 && item.qty >= item.stock) {
            showToast(`Only ${item.stock} left in stock.`, 'error');
            return;
          }
          item.qty += 1;
        } else if (action === 'decrease') {
          item.qty -= 1;
          if (item.qty <= 0) {
            cart.splice(itemIndex, 1);
          }
        } else if (action === 'remove') {
          cart.splice(itemIndex, 1);
        }

        cartCount = cart.reduce((sum, currentItem) => sum + currentItem.qty, 0);
        saveCart();
        updateCartCount();
        renderCart();
      });
    });
  };

  const updateCartCount = () => {
    cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) {
      cartCountEl.textContent = String(cartCount);
    }
    if (searchCartCount) searchCartCount.textContent = String(cartCount);
  };

  updateCartCount();
  renderCart();

  const openCartPanel = () => {
    if (!cartPanel) return;
    cartPanel.classList.remove('hidden');
    cartPanel.setAttribute('aria-hidden', 'false');
    renderCart();
  };

  const closeCheckoutPanel = () => {
    if (!checkoutPanel) return;
    checkoutPanel.classList.add('hidden');
    checkoutPanel.setAttribute('aria-hidden', 'true');
  };

  const closeOrderConfirmation = () => {
    if (!orderConfirmation) return;
    orderConfirmation.classList.add('hidden');
    orderConfirmation.setAttribute('aria-hidden', 'true');
  };

  const closeOrdersPanel = () => {
    if (!ordersPanel) return;
    ordersPanel.classList.add('hidden');
    ordersPanel.setAttribute('aria-hidden', 'true');
  };

  const closeOrderDetailsPanel = () => {
    orderDetailsPanel?.classList.add('hidden');
    orderDetailsPanel?.setAttribute('aria-hidden', 'true');
  };

  const closeWishlistPanel = () => {
    if (!wishlistPanel) return;
    wishlistPanel.classList.add('hidden');
    wishlistPanel.setAttribute('aria-hidden', 'true');
  };

  const productFromCard = (card) => ({
    name: card.querySelector('.product-name')?.textContent.trim() || 'Product',
    price: parsePrice(card.dataset.price || card.querySelector('.product-price')?.textContent),
    stock: Number(card.dataset.stock || 99),
    imageClass: [...(card.querySelector('.product-image')?.classList || [])]
      .find((name) => name.startsWith('product-')) || 'product-one'
  });

  let categoryCatalog = [
    { name: 'Linen Everyday Shirt', price: '₹799', rating: '4.7', reviews: '88', category: 'Fashion', brand: 'Nexora', imageClass: 'product-four', discount: '-20%' },
    { name: 'Urban Crossbody Bag', price: '₹1,299', rating: '4.8', reviews: '61', category: 'Fashion', brand: 'Nexora', imageClass: 'product-one', discount: '-15%' },
    { name: 'MagSafe Fast Charger', price: '₹899', rating: '4.9', reviews: '142', category: 'Mobiles', brand: 'Apple', imageClass: 'product-two', discount: '-18%' },
    { name: 'Slim Phone Stand', price: '₹399', rating: '4.5', reviews: '57', category: 'Mobiles', brand: 'Nexora', imageClass: 'product-three', discount: '-25%' },
    { name: 'Noise Cancelling Headphones', price: '₹1,499', rating: '4.8', reviews: '203', category: 'Electronics', brand: 'Soundcore', imageClass: 'product-two', discount: '-22%' },
    { name: 'Smart Home Hub', price: '₹999', rating: '4.6', reviews: '79', category: 'Electronics', brand: 'Samsung', imageClass: 'product-three', discount: '-16%' },
    { name: 'Glow Face Serum', price: '₹649', rating: '4.7', reviews: '119', category: 'Beauty', brand: 'Nexora', imageClass: 'product-one', discount: '-12%' },
    { name: 'Hydrating Lip Care Kit', price: '₹299', rating: '4.5', reviews: '46', category: 'Beauty', brand: 'Nexora', imageClass: 'product-four', discount: '-10%' },
    { name: 'Aroma Desk Lamp', price: '₹749', rating: '4.6', reviews: '72', category: 'Home', brand: 'Nexora', imageClass: 'product-three', discount: '-14%' },
    { name: 'Cloud Cushion Set', price: '₹1,099', rating: '4.8', reviews: '53', category: 'Home', brand: 'Nexora', imageClass: 'product-four', discount: '-19%' }
  ];

  const loadCategoryCatalogFromServer = async () => {
    try {
      const response = await apiRequest('/api/products?active=1');
      const products = Array.isArray(response.products) ? response.products : [];
      if (!products.length) return;
      categoryCatalog = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: `₹${Number(product.price || 0).toLocaleString('en-IN')}`,
        rating: String(product.rating || 0),
        reviews: String(product.reviews || 0),
        category: product.category,
        brand: product.brand,
        imageClass: safeImageClass(product.image_class),
        stock: Number(product.stock || 0),
        discount: product.original_price && product.original_price > product.price
          ? `-${Math.round((1 - product.price / product.original_price) * 100)}%`
          : '',
        originalPrice: product.original_price ? `₹${Number(product.original_price).toLocaleString('en-IN')}` : ''
      }));
      if (!categoryCatalog.some((product) => product.category === activeCatalogCategory) && activeCatalogCategory !== 'For You') {
        activeCatalogCategory = 'For You';
      }
      if (categoryCatalogPanel && !categoryCatalogPanel.classList.contains('hidden')) {
        renderCategoryCatalog(activeCatalogCategory);
      }
    } catch (error) {
      if (error.apiResponse) showToast('Unable to load category products.', 'error');
    }
  };

  const catalogCardMarkup = (product) => `
    <article class="product-card catalog-product-card" data-name="${product.name.toLowerCase()}" data-price="${product.price}" data-rating="${product.rating}" data-reviews="${product.reviews}" data-category="${product.category}" data-brand="${product.brand}" data-stock="${product.stock ?? 0}">
      <div class="product-image ${product.imageClass}">
        <span class="product-discount">${product.discount}</span>
        <button class="wishlist-btn" type="button" aria-label="Add ${product.name} to wishlist">♡</button>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-rating">⭐ ${product.rating} <span>(${product.reviews} reviews)</span></div>
      <div class="product-meta"><span class="product-price">${product.price}</span><span class="catalog-brand">${product.brand}</span></div>
    </article>
  `;

  const closeCategoryCatalog = () => {
    categoryCatalogPanel?.classList.add('hidden');
    categoryCatalogPanel?.setAttribute('aria-hidden', 'true');
  };

  const renderCategoryCatalog = (category) => {
    if (!categoryProductsContainer) return;
    activeCatalogCategory = category;
    const selectedCategoryName = category === 'For You' ? '' : String(category).trim().toLowerCase();
    const products = categoryCatalog
      .filter((product) => !selectedCategoryName || String(product.category || '').trim().toLowerCase() === selectedCategoryName)
      .filter((product) => activeCatalogFilter === 'all'
        || (activeCatalogFilter === 'budget' && Number(product.price.replace(/[₹,]/g, '')) < 1000)
        || (activeCatalogFilter === 'rated' && Number(product.rating) >= 4.5));
    const sort = catalogSort?.value || 'featured';
    products.sort((a, b) => {
      if (sort === 'price-low' || sort === 'price-high') {
        const difference = Number(a.price.replace(/[₹,]/g, '')) - Number(b.price.replace(/[₹,]/g, ''));
        return sort === 'price-low' ? difference : -difference;
      }
      if (sort === 'rating') return Number(b.rating) - Number(a.rating);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    if (catalogTitle) catalogTitle.textContent = category === 'For You' ? 'All Categories' : category;
    if (catalogSubtitle) catalogSubtitle.textContent = `${products.length} premium picks curated for you`;
    categoryProductsContainer.innerHTML = products.length
      ? products.map(catalogCardMarkup).join('')
      : '<div class="catalog-empty"><span>✨</span><strong>No products found</strong><small>Try another category filter.</small></div>';
    categoryProductsContainer.querySelectorAll('.wishlist-btn').forEach((button) => {
      const card = button.closest('.product-card');
      const item = productFromCard(card);
      const saved = wishlist.some((savedProduct) => savedProduct.name === item.name);
      button.textContent = saved ? '♥' : '♡';
      button.classList.toggle('active', saved);
    });
  };

  const openCategoryCatalog = (category) => {
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeWishlistPanel();
    closeNotificationsPanel();
    renderCategoryCatalog(category);
    loadCategoryCatalogFromServer();
    categoryCatalogPanel?.classList.remove('hidden');
    categoryCatalogPanel?.setAttribute('aria-hidden', 'false');
  };

  const syncWishlistButtons = () => {
    wishlistButtons.forEach((button) => {
      const card = button.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent.trim() || 'Product';
      const saved = wishlist.some((item) => item.name === name);
      button.classList.toggle('active', saved);
      button.textContent = saved ? '♥' : '♡';
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${name} ${saved ? 'from' : 'to'} wishlist`);
    });
  };

  const openWishlistPanel = () => {
    if (!wishlistPanel || !wishlistItemsContainer) return;
    closeAccountPanel();
    closeOrdersPanel();
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    wishlistItemsContainer.innerHTML = wishlist.length ? wishlist.map((item) => `
      <article class="wishlist-item">
        <div class="wishlist-item-image ${safeImageClass(item.imageClass)}"></div>
        <div class="wishlist-item-info">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${currency(item.price)}</span>
        </div>
        <button class="wishlist-remove-btn" type="button" data-wishlist-name="${escapeHtml(item.name)}">Remove</button>
      </article>
    `).join('') : `
      <div class="no-orders">
        <div class="no-orders-icon">❤️</div>
        <h4>Your wishlist is empty</h4>
        <p>Tap the heart on a product to save it here.</p>
      </div>
    `;
    wishlistItemsContainer.querySelectorAll('.wishlist-remove-btn').forEach((button) => {
      button.addEventListener('click', () => {
        wishlist = wishlist.filter((item) => item.name !== button.dataset.wishlistName);
        saveWishlist();
        syncWishlistButtons();
        openWishlistPanel();
        showToast('Removed from wishlist', 'info');
      });
    });
    wishlistPanel.classList.remove('hidden');
    wishlistPanel.setAttribute('aria-hidden', 'false');
  };

  syncWishlistButtons();

  const closeAccountPanel = () => {
    if (!accountPanel) return;
    accountPanel.classList.add('hidden');
    accountPanel.setAttribute('aria-hidden', 'true');
    accountAddressManager?.classList.add('hidden');
    profileAddressForm?.classList.add('hidden');
  };

  const loadAuthUsers = () => {
    try {
      const savedUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
      const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
      return Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch (error) {
      return [];
    }
  };

  const loadAuthSession = () => {
    try {
      const savedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
      const parsedSession = savedSession ? JSON.parse(savedSession) : null;
      return parsedSession && parsedSession.email ? parsedSession : null;
    } catch (error) {
      return null;
    }
  };

  const saveAuthSession = (user, remember) => {
    if (remember) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
      sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    } else {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
    }
  };

  const getAuthSession = () => {
    const savedSession = loadAuthSession();
    if (savedSession) return savedSession;
    try {
      const temporarySession = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
      const parsedSession = temporarySession ? JSON.parse(temporarySession) : null;
      return parsedSession && parsedSession.email ? parsedSession : null;
    } catch (error) {
      return null;
    }
  };

  const renderAccountState = () => {
    if (!accountTitle || !accountSubtitle || !accountAuthTitle || !accountAuthHint || !accountAuthAction) return;
    if (currentUser) {
      const firstName = currentUser.name.split(' ')[0];
      accountAvatar.textContent = '✨';
      accountTitle.textContent = firstName;
      accountSubtitle.textContent = currentUser.email;
      accountAuthTitle.textContent = `Hi ${firstName}, welcome back`;
      accountAuthHint.textContent = 'Your account is ready for a faster checkout.';
      accountAuthAction.textContent = 'Log out';
    } else {
      accountAvatar.textContent = '👤';
      accountTitle.textContent = 'Profile';
      accountSubtitle.textContent = 'Manage your account';
      accountAuthTitle.textContent = 'Welcome to Nexora';
      accountAuthHint.textContent = 'Sign in to unlock your personalized shopping experience.';
      accountAuthAction.textContent = 'Login / Signup';
    }
  };

  const setAuthError = (message = '') => {
    if (authError) authError.textContent = message;
  };

  const setAuthMode = (mode) => {
    authMode = mode === 'signup' ? 'signup' : 'login';
    const signup = authMode === 'signup';
    authTabs.forEach((tab) => {
      const active = tab.dataset.authMode === authMode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    authNameField?.classList.toggle('hidden', !signup);
    authConfirmField?.classList.toggle('hidden', !signup);
    if (authNameInput) authNameInput.required = signup;
    if (authConfirmPasswordInput) authConfirmPasswordInput.required = signup;
    if (authTitle) authTitle.textContent = signup ? 'Create your Nexora account' : 'Login to Nexora';
    if (authSubtitle) authSubtitle.textContent = signup
      ? 'Join a premium shopping experience built around you.'
      : 'Your premium shopping experience starts here.';
    if (authSubmitText) authSubmitText.textContent = signup ? 'Create account' : 'Login securely';
    if (forgotPasswordButton) forgotPasswordButton.classList.toggle('hidden', signup);
    setAuthError();
  };

  const closeAuthPanel = () => {
    if (!authPanel) return;
    authPanel.classList.add('hidden');
    authPanel.setAttribute('aria-hidden', 'true');
    setAuthError();
  };

  const openAuthPanel = (mode = 'login') => {
    if (!authPanel) return;
    const signup = mode === 'signup';
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeWishlistPanel();
    closeNotificationsPanel();
    setAuthMode(mode);
    authPanel.classList.remove('hidden');
    authPanel.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => (signup ? authNameInput : authEmailInput)?.focus(), 100);
  };

  const completeAuth = (event) => {
    event.preventDefault();
    const email = authEmailInput?.value.trim().toLowerCase() || '';
    const password = authPasswordInput?.value || '';
    const users = loadAuthUsers();
    setAuthError();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setAuthError('Please enter a valid email address.');

    if (authMode === 'signup') {
      const name = authNameInput?.value.trim() || '';
      const confirmPassword = authConfirmPasswordInput?.value || '';
      if (!/^[A-Za-z\u00C0-\u024F\u0900-\u097F .'-]{2,80}$/.test(name)) return setAuthError('Please enter a valid full name.');
      if (password.length < 8) return setAuthError('Password must be at least 8 characters.');
      if (password !== confirmPassword) return setAuthError('Passwords do not match.');
      if (users.some((user) => user.email === email)) return setAuthError('This email is already registered. Please login.');
      const finishSignup = (user, token) => {
        const localUser = { name: user.name, email: user.email, ...(token ? { token } : {}) };
        if (!token) localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify([...users, { name, email, password }]));
        currentUser = localUser;
        saveAuthSession(currentUser, rememberMeInput?.checked !== false);
        renderAccountState();
        closeAuthPanel();
        showToast(`Welcome to Nexora, ${name.split(' ')[0]}!`);
        authForm.reset();
        setAuthMode('login');
        syncAccountData();
      };
      apiRequest('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) })
        .then((result) => finishSignup(result.user, result.token))
        .catch((error) => {
          if (!error.apiResponse || error.status === 405) {
            finishSignup({ name, email });
          } else {
            setAuthError(error.message);
          }
        });
      return;
    }

    apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      .then((result) => {
        currentUser = { ...result.user, token: result.token };
        saveAuthSession(currentUser, rememberMeInput?.checked !== false);
        renderAccountState();
        closeAuthPanel();
        showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`);
        authForm.reset();
        syncAccountData();
      })
      .catch((error) => {
        if (error.apiResponse && error.status !== 405) return setAuthError(error.message);
        const user = users.find((item) => item.email === email && item.password === password);
        if (!user) return setAuthError('Email or password is incorrect.');
        currentUser = { name: user.name, email: user.email };
        saveAuthSession(currentUser, rememberMeInput?.checked !== false);
        renderAccountState();
        closeAuthPanel();
        showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
        authForm.reset();
      });
  };

  currentUser = getAuthSession();
  renderAccountState();

  const syncAccountData = async () => {
    if (!currentUser?.token) return;
    try {
      const [profileResult, addressResult, orderResult, serverCartResult, serverWishlistResult] = await Promise.all([
        apiRequest('/api/auth/me'),
        apiRequest('/api/addresses'),
        apiRequest('/api/orders'),
        apiRequest('/api/cart'),
        apiRequest('/api/wishlist')
      ]);
      currentUser = { ...currentUser, ...profileResult.user };
      saveAuthSession(currentUser, Boolean(localStorage.getItem(AUTH_SESSION_STORAGE_KEY)));
      renderAccountState();
      addresses = (addressResult.addresses || []).map((address, index) => ({
        id: String(address.id),
        label: address.label || 'Home',
        name: address.name,
        mobile: address.mobile,
        address: address.line || address.address || '',
        pincode: address.pincode,
        selected: index === 0
      }));
      orders = (orderResult.orders || []).map((order) => ({
        id: `NX-${order.id}`,
        apiId: order.id,
        total: order.total,
        status: order.status === 'pending' ? 'Placed' : order.status,
        createdAt: order.created_at,
        items: (order.items || []).map((item) => ({
          name: item.product_name,
          price: item.unit_price,
          qty: item.quantity,
          imageClass: 'product-one'
        }))
      }));
      const localCartItems = await cartItemsForApi(cart);
      const mergedCart = new Map((serverCartResult.items || []).map((item) => [
        item.product_id,
        {
          productId: item.product_id,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          imageClass: safeImageClass(item.image_class)
        }
      ]));
      localCartItems.forEach((item) => {
        const existing = mergedCart.get(item.product_id);
        const serverItem = (serverCartResult.items || []).find((entry) => entry.product_id === item.product_id);
        mergedCart.set(item.product_id, {
          productId: item.product_id,
          name: serverItem?.name || cart.find((entry) => entry.productId === item.product_id || entry.name === serverItem?.name)?.name || 'Product',
          price: serverItem?.price || cart.find((entry) => entry.productId === item.product_id)?.price || 0,
          qty: Math.min(99, (existing?.qty || 0) + item.quantity),
          imageClass: safeImageClass(serverItem?.image_class)
        });
      });
      cart = [...mergedCart.values()];
      cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      updateCartCount();
      renderCart();
      await syncCartToServer();
      const mergedWishlist = new Map((serverWishlistResult.items || []).map((item) => [
        item.product_id,
        {
          productId: item.product_id,
          name: item.name,
          price: item.price,
          imageClass: safeImageClass(item.image_class)
        }
      ]));
      const localWishlistItems = await wishlistItemsForApi(wishlist);
      localWishlistItems.forEach((item) => {
        const serverItem = (serverWishlistResult.items || []).find((entry) => entry.product_id === item.product_id);
        const localItem = wishlist.find((entry) => entry.productId === item.product_id || entry.name === serverItem?.name);
        mergedWishlist.set(item.product_id, {
          productId: item.product_id,
          name: serverItem?.name || localItem?.name || 'Product',
          price: serverItem?.price || localItem?.price || 0,
          imageClass: safeImageClass(serverItem?.image_class || localItem?.imageClass)
        });
      });
      wishlist = [...mergedWishlist.values()];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      syncWishlistButtons();
      renderProfileDashboard();
      await syncWishlistToServer();
      saveAddresses();
      saveOrders(orders);
      renderSavedAddresses();
      renderProfileDashboard();
      applyAddressToCheckout(selectedAddress());
    } catch (error) {
      if (error.apiResponse && error.message.toLowerCase().includes('authentication')) {
        currentUser = null;
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        renderAccountState();
      }
    }
  };

  const renderProfileDashboard = () => {
    if (profileOrderCount) profileOrderCount.textContent = String(orders.length);
    if (profileWishlistCount) profileWishlistCount.textContent = String(wishlist.length);
    if (profileAddressCount) profileAddressCount.textContent = String(addresses.length);
  };

  const renderSavedAddresses = () => {
    if (!savedAddressesList) return;
    savedAddressesList.innerHTML = addresses.length ? addresses.map((address) => `
      <article class="saved-address-card ${address.selected ? 'selected' : ''}">
        <button class="saved-address-select" type="button" data-address-id="${escapeHtml(address.id)}">
          <span class="saved-address-icon">${address.label === 'Work' ? '💼' : address.label === 'Other' ? '📍' : '🏠'}</span>
          <span>          <strong>${escapeHtml(address.label)}</strong><small>${escapeHtml(address.name)} · ${escapeHtml(address.mobile)}<br>${escapeHtml(address.address)}, ${escapeHtml(address.pincode)}</small></span>
          <span class="saved-address-check">${address.selected ? '✓' : ''}</span>
        </button>
        <div class="saved-address-actions">
          <button class="saved-address-edit" type="button" data-edit-address="${escapeHtml(address.id)}">Edit</button>
          <button class="saved-address-remove" type="button" data-remove-address="${escapeHtml(address.id)}" aria-label="Remove ${escapeHtml(address.label)} address">Remove</button>
        </div>
      </article>
    `).join('') : '<div class="address-empty">📍<strong>No saved addresses</strong><small>Add Home, Work or Other address.</small></div>';
    savedAddressesList.querySelectorAll('.saved-address-select').forEach((button) => {
      button.addEventListener('click', () => {
        addresses = addresses.map((address) => ({ ...address, selected: address.id === button.dataset.addressId }));
        saveAddresses();
        applyAddressToCheckout(selectedAddress());
        renderSavedAddresses();
        renderProfileDashboard();
        showToast('Delivery address selected');
      });
    });
    savedAddressesList.querySelectorAll('.saved-address-remove').forEach((button) => {
      button.addEventListener('click', () => {
      const removedId = button.dataset.removeAddress;
      addresses = addresses.filter((address) => address.id !== removedId);
      if (addresses.length && !addresses.some((address) => address.selected)) addresses[0].selected = true;
      saveAddresses();
      if (currentUser?.token && /^\d+$/.test(removedId)) apiRequest(`/api/addresses/${removedId}`, { method: 'DELETE' }).catch(() => {});
        applyAddressToCheckout(selectedAddress());
        renderSavedAddresses();
        renderProfileDashboard();
        showToast('Address removed', 'info');
      });
    });
    savedAddressesList.querySelectorAll('.saved-address-edit').forEach((button) => {
      button.addEventListener('click', () => {
        const address = addresses.find((item) => item.id === button.dataset.editAddress);
        if (!address) return;
        editingAddressId = address.id;
        profileAddressLabel.value = address.label || 'Home';
        profileAddressName.value = address.name || '';
        profileAddressMobile.value = address.mobile || '';
        profileAddressLine.value = address.address || '';
        profileAddressPincode.value = address.pincode || '';
        profileAddressForm.classList.remove('hidden');
        profileAddressName.focus();
      });
    });
  };

  const showAddressManager = () => {
    accountAddressManager?.classList.remove('hidden');
    renderSavedAddresses();
  };

  renderProfileDashboard();
  renderSavedAddresses();
  syncAccountData();

  const openAccountPanel = () => {
    if (!accountPanel) return;
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeWishlistPanel();
    renderAccountState();
    renderProfileDashboard();
    accountPanel.classList.remove('hidden');
    accountPanel.setAttribute('aria-hidden', 'false');
  };

  const showHome = () => {
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeWishlistPanel();
    closeCategoryCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderOrders = () => {
    if (!ordersList) return;
    const orderStages = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
    if (ordersCount) ordersCount.textContent = `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`;

    if (!orders.length) {
      ordersList.innerHTML = `
        <div class="no-orders">
          <div class="no-orders-icon">📦</div>
          <h4>No orders yet</h4>
          <p>Your placed orders will appear here.</p>
        </div>
      `;
      return;
    }

    ordersList.innerHTML = orders.map((order) => `
      <article class="order-card">
        <div class="order-card-header">
          <div>
            <span class="order-label">Order ID</span>
            <strong>${escapeHtml(order.id)}</strong>
          </div>
          <span class="order-status-badge">${escapeHtml(order.status)}</span>
        </div>
        <div class="ordered-products">
          ${order.items.map((item) => `
            <div class="ordered-product">
              <div class="ordered-product-image ${safeImageClass(item.imageClass)}"></div>
              <div class="ordered-product-info">
                <strong>${escapeHtml(item.name)}</strong>
                <span>Qty: ${item.qty}</span>
              </div>
              <strong>${currency(item.price * item.qty)}</strong>
            </div>
          `).join('')}
        </div>
        <div class="order-total-row">
          <span>Total</span>
          <strong>${currency(order.total)}</strong>
        </div>
        <button class="order-details-btn" type="button" data-order-details="${escapeHtml(order.id)}">View full details</button>
        <div class="order-status-tracker" aria-label="Order status">
          ${orderStages.map((stage, index) => {
            const currentIndex = Math.max(0, orderStages.indexOf(order.status));
            const isComplete = index <= currentIndex;
            return `
              ${index > 0 ? `<div class="status-line ${index <= currentIndex ? 'complete' : ''}"></div>` : ''}
              <div class="status-step ${isComplete ? 'active' : ''}">
                <span>${isComplete ? '✓' : index + 1}</span>
                <small>${stage}</small>
              </div>
            `;
          }).join('')}
        </div>
      </article>
    `).join('');
    ordersList.querySelectorAll('[data-order-details]').forEach((button) => {
      button.addEventListener('click', () => {
        const order = orders.find((item) => item.id === button.dataset.orderDetails);
        if (order) openOrderDetailsPanel(order);
      });
    });
  };

  const openOrderDetailsPanel = (order) => {
    if (!orderDetailsPanel || !orderDetailsContent) return;
    closeOrdersPanel();
    closeAccountPanel();
    closeWishlistPanel();
    if (orderDetailsSubtitle) orderDetailsSubtitle.textContent = `${order.id} · ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`;
    orderDetailsContent.innerHTML = `
      <div class="order-details-summary">
        <span class="order-status-badge">${escapeHtml(order.status || 'Placed')}</span>
        <strong>${currency(order.total)}</strong>
      </div>
      <div class="order-details-items">
        ${(order.items || []).map((item) => `
          <div class="order-details-item">
            <div class="ordered-product-image ${safeImageClass(item.imageClass)}"></div>
            <div><strong>${escapeHtml(item.name || item.product_name || 'Product')}</strong><small>${item.qty || item.quantity || 1} × ${currency(item.price || item.unit_price || 0)}</small></div>
            <strong>${currency((item.price || item.unit_price || 0) * (item.qty || item.quantity || 1))}</strong>
          </div>
        `).join('')}
      </div>
      <div class="order-details-total"><span>Order total</span><strong>${currency(order.total)}</strong></div>
    `;
    orderDetailsPanel.classList.remove('hidden');
    orderDetailsPanel.setAttribute('aria-hidden', 'false');
  };

  const openOrdersPanel = () => {
    if (!ordersPanel) return;
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeAccountPanel();
    closeProfilePanel();
    closeOrderDetailsPanel();
    renderOrders();
    ordersPanel.classList.remove('hidden');
    ordersPanel.setAttribute('aria-hidden', 'false');
  };

  const openOrderConfirmation = async () => {
    if (!orderConfirmation || !cart.length) return;
    if (!currentUser?.token) {
      showToast('Please login to save your order securely.', 'error');
      openAuthPanel('login');
      return;
    }
    const orderId = `NX-${Date.now().toString().slice(-8)}`;
    if (orderIdEl) orderIdEl.textContent = orderId;

    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const discount = getCouponDiscount(subtotal);
    const order = {
      id: orderId,
      items: cart.map((item) => ({ ...item })),
      total: subtotal + (subtotal > 0 ? 40 : 0) - discount,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'upi',
      status: 'Placed',
      createdAt: new Date().toISOString()
    };
    if (currentUser?.token) {
      try {
        const productsResult = await apiRequest('/api/products');
        const products = productsResult.products || [];
        const byName = new Map(products.map((product) => [product.name.toLowerCase(), product]));
        const apiItems = cart.map((item) => {
          const product = byName.get(item.name.toLowerCase());
          return product ? { product_id: product.id, quantity: item.qty } : null;
        });
        if (apiItems.some((item) => !item)) throw new Error('Some cart products are not available on the server.');
        const selected = selectedAddress();
        const apiOrder = await apiRequest('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            address_id: selected && /^\d+$/.test(String(selected.id)) ? Number(selected.id) : undefined,
            address: selected ? {
              label: selected.label || 'Home',
              name: selected.name,
              mobile: selected.mobile,
              line: selected.address,
              pincode: selected.pincode
            } : {
              label: 'Home',
              name: addressNameInput.value.trim(),
              mobile: addressMobileInput.value.trim(),
              line: addressLineInput.value.trim(),
              pincode: addressPincodeInput.value.trim()
            },
            coupon: appliedCoupon || undefined,
            payment_method: selectedPaymentMethod(),
            items: apiItems
          })
        });
        if (apiOrder.order?.id) {
          order.id = `NX-${apiOrder.order.id}`;
          order.apiId = apiOrder.order.id;
          order.total = apiOrder.order.total;
          order.status = apiOrder.order.status === 'pending' ? 'Placed' : apiOrder.order.status;
        }
        orders = [order, ...orders];
        saveOrders(orders);
      } catch (error) {
        showToast(error.message || 'Unable to save your order. Please try again.', 'error');
        return;
      }
    } else {
      showToast('Please login to save your order securely.', 'error');
      return;
    }
    if (orderIdEl) orderIdEl.textContent = order.id;
    addNotification('order', 'Order placed successfully', `Your order ${order.id} has been placed.`, '📦');
    addNotification('delivery', 'Delivery scheduled', 'Your order is being prepared for delivery.', '🚚');
    cart = [];
    appliedCoupon = null;
    if (couponInput) couponInput.value = '';
    saveCart();
    updateCartCount();
    renderCart();
    closeCheckoutPanel();
    orderConfirmation.classList.remove('hidden');
    orderConfirmation.setAttribute('aria-hidden', 'false');
  };

  const selectedPaymentMethod = () => document.querySelector('input[name="paymentMethod"]:checked')?.value || 'upi';

  const updatePaymentDetails = () => {
    const method = selectedPaymentMethod();
    paymentOptions.forEach((option) => {
      option.classList.toggle('active', option.querySelector('input')?.value === method);
    });
    upiDetails?.classList.toggle('hidden', method !== 'upi');
    cardDetails?.classList.toggle('hidden', method !== 'card');
    codDetails?.classList.toggle('hidden', method !== 'cod');
    if (paymentError) paymentError.textContent = '';
  };

  const validatePayment = () => {
    const method = selectedPaymentMethod();
    if (method === 'upi' && upiIdInput?.value.trim()) {
      const upiPattern = /^[\w.-]+@[\w.-]+$/;
      if (!upiPattern.test(upiIdInput.value.trim())) {
        if (paymentError) paymentError.textContent = 'Please enter a valid UPI ID, for example name@bank.';
        return false;
      }
    }
    if (method === 'card') {
      const cardNumber = cardNumberInput?.value.replace(/\s/g, '') || '';
      if (!/^\d{16}$/.test(cardNumber)) {
        if (paymentError) paymentError.textContent = 'Please enter a valid 16-digit card number.';
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiryInput?.value.trim() || '')) {
        if (paymentError) paymentError.textContent = 'Please enter expiry in MM/YY format.';
        return false;
      }
      if (!/^\d{3}$/.test(cardCvvInput?.value.trim() || '')) {
        if (paymentError) paymentError.textContent = 'Please enter a valid 3-digit CVV.';
        return false;
      }
    }
    return true;
  };

  const renderCheckout = () => {
    if (!checkoutItemsContainer || !checkoutSubtotalEl || !checkoutDeliveryEl || !checkoutDiscountEl || !checkoutTotalEl) return;

    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const delivery = subtotal > 0 ? 40 : 0;
    const discount = getCouponDiscount(subtotal);
    checkoutSubtotalEl.textContent = currency(subtotal);
    checkoutDeliveryEl.textContent = currency(delivery);
    checkoutDiscountEl.textContent = `-${currency(discount)}`;
    checkoutTotalEl.textContent = currency(subtotal + delivery - discount);
    checkoutItemsContainer.innerHTML = cart.map((item) => `
      <div class="checkout-item">
        <span class="checkout-item-name">${escapeHtml(item.name)}</span>
        <span class="checkout-item-quantity">${item.qty}</span>
        <strong>${currency(item.price * item.qty)}</strong>
      </div>
    `).join('');
  };

  const openCheckoutPanel = () => {
    if (!checkoutPanel || !cart.length) return;
    closeCartPanel();
    renderCheckout();
    checkoutPanel.classList.remove('hidden');
    checkoutPanel.setAttribute('aria-hidden', 'false');
    showToast('Checkout ready');
  };

  if (cartButton) {
    cartButton.addEventListener('click', () => {
      const isHidden = cartPanel?.classList.contains('hidden');
      if (isHidden) {
        openCartPanel();
      } else {
        closeCartPanel();
      }
    });
  }

  if (closeCartButton) {
    closeCartButton.addEventListener('click', closeCartPanel);
  }

  if (notificationButton) {
    notificationButton.addEventListener('click', openNotificationsPanel);
  }

  if (closeNotificationsButton) {
    closeNotificationsButton.addEventListener('click', closeNotificationsPanel);
  }

  if (markNotificationsReadButton) {
    markNotificationsReadButton.addEventListener('click', () => {
      notifications.forEach((notification) => {
        notification.read = true;
      });
      saveNotifications();
      renderNotifications();
      showPremiumOfferToast('✓ All notifications marked as read.');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openCheckoutPanel);
  }

  if (backToCartButton) {
    backToCartButton.addEventListener('click', () => {
      closeCheckoutPanel();
      openCartPanel();
    });
  }

  if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener('click', closeCheckoutPanel);
  }

  paymentInputs.forEach((input) => input.addEventListener('change', updatePaymentDetails));
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', () => {
      const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
      cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
  }
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', () => {
      const digits = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
      cardExpiryInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    });
  }
  updatePaymentDetails();

  if (applyCouponButton) {
    applyCouponButton.addEventListener('click', () => {
      const code = couponInput?.value.trim().toUpperCase() || '';
      if (!code) {
        appliedCoupon = null;
        if (couponMessage) {
          couponMessage.textContent = 'Enter a coupon code to apply.';
          couponMessage.className = 'coupon-message error';
        }
        renderCheckout();
        return;
      }

      if (!['SAVE100', 'BANK10', 'FREEDEL'].includes(code)) {
        appliedCoupon = null;
        if (couponMessage) {
          couponMessage.textContent = 'Invalid coupon code.';
          couponMessage.className = 'coupon-message error';
        }
        renderCheckout();
        showToast('Invalid coupon code', 'info');
        return;
      }

      const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
      if (code === 'SAVE100' && subtotal < 999) {
        appliedCoupon = null;
        if (couponMessage) {
          couponMessage.textContent = 'SAVE100 applies on orders above ₹999.';
          couponMessage.className = 'coupon-message error';
        }
        renderCheckout();
        return;
      }
      appliedCoupon = code;
      if (couponMessage) {
        couponMessage.textContent = `${code} applied successfully.`;
        couponMessage.className = 'coupon-message success';
      }
      renderCheckout();
      showToast('Coupon applied successfully');
    });
  }

  if (closeOrdersButton) {
    closeOrdersButton.addEventListener('click', closeOrdersPanel);
  }
  if (closeOrderDetailsButton) {
    closeOrderDetailsButton.addEventListener('click', closeOrderDetailsPanel);
  }

  if (closeWishlistButton) {
    closeWishlistButton.addEventListener('click', closeWishlistPanel);
  }

  const promoButton = document.querySelector('.promo-button');
  if (promoButton) {
    promoButton.addEventListener('click', () => {
      addNotification('offer', 'Flash deal available', 'Save up to 50% on today’s limited-time offers.', '🏷️');
      showToast('Deal notification added');
    });
  }

  offerButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.dataset.offerCode;
      if (code === 'SAVE100') {
        try {
          await navigator.clipboard.writeText(code);
        } catch (error) {
          // The offer toast remains useful when clipboard access is unavailable.
        }
        showPremiumOfferToast('🎟️ SAVE100 unlocked — ₹100 off on orders above ₹999.');
      } else if (button.textContent.trim() === 'Copy') {
        try {
          await navigator.clipboard.writeText(code);
          showToast(`${code} copied to clipboard`);
        } catch (error) {
          showToast(`Use offer code ${code}`, 'info');
        }
      } else if (code === 'BANK10') {
        showPremiumOfferToast('🏦 BANK10 unlocked — 10% instant discount on select cards.');
      } else if (code === 'FREEDEL') {
        showPremiumOfferToast('🚚 Free delivery unlocked — on premium orders above ₹1,499.');
      } else {
        addNotification('offer', 'Special offer unlocked', `${code} offer is ready for your next order.`, '🎁');
        showToast(`${code} offer unlocked`);
      }
    });
  });

  wishlistButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const product = productFromCard(button.closest('.product-card'));
      const existingIndex = wishlist.findIndex((item) => item.name === product.name);

      if (existingIndex >= 0) {
        wishlist.splice(existingIndex, 1);
        showToast('Removed from wishlist', 'info');
      } else {
        wishlist.push(product);
        showToast('Added to wishlist');
      }

      saveWishlist();
      syncWishlistButtons();
    });
  });

  if (closeAccountButton) {
    closeAccountButton.addEventListener('click', closeAccountPanel);
  }
  if (closeProfileButton) closeProfileButton.addEventListener('click', closeProfilePanel);
  if (profilePopupAction) profilePopupAction.addEventListener('click', closeProfilePanel);
  if (closeSettingsButton) closeSettingsButton.addEventListener('click', closeSettingsPanel);
  if (settingsDoneButton) settingsDoneButton.addEventListener('click', closeSettingsPanel);
  if (searchButton) searchButton.addEventListener('click', openSearchPage);
  if (closeSearchButton) closeSearchButton.addEventListener('click', closeSearchPage);
  if (searchCartButton) {
    searchCartButton.addEventListener('click', () => {
      closeSearchPage();
      openCartPanel();
    });
  }
  if (fullSearchInput) {
    fullSearchInput.addEventListener('input', () => {
      if (searchInput) searchInput.value = fullSearchInput.value;
      window.clearTimeout(recentSearchSaveTimer);
      recentSearchSaveTimer = window.setTimeout(() => rememberSearch(fullSearchInput.value), 650);
      renderSearchResults();
    });
    fullSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') rememberSearch(fullSearchInput.value);
    });
  }
  if (editRecentSearchesButton) {
    editRecentSearchesButton.addEventListener('click', () => {
      recentSearchEditMode = !recentSearchEditMode;
      editRecentSearchesButton.textContent = recentSearchEditMode ? 'Done' : 'Edit';
      renderRecentSearches();
    });
  }
  if (clearRecentSearchesButton) {
    clearRecentSearchesButton.addEventListener('click', () => {
      saveRecentSearches([]);
      recentSearchEditMode = false;
      if (editRecentSearchesButton) editRecentSearchesButton.textContent = 'Edit';
      renderRecentSearches();
    });
  }
  if (searchMicButton) {
    searchMicButton.addEventListener('click', () => {
      fullSearchInput?.focus();
      showToast('Type your search to find products', 'info');
    });
  }

  profileDashboardCards.forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.profileAction;
      if (action === 'orders') openOrdersPanel();
      else if (action === 'wishlist') openWishlistPanel();
      else if (action === 'addresses') showAddressManager();
      else if (action === 'settings') openSettingsPanel();
    });
  });
  if (addAddressButton) addAddressButton.addEventListener('click', () => {
    editingAddressId = null;
    profileAddressForm?.classList.remove('hidden');
    profileAddressForm?.reset();
  });
  if (cancelAddressButton) cancelAddressButton.addEventListener('click', () => {
    editingAddressId = null;
    profileAddressForm?.classList.add('hidden');
  });
  if (profileAddressForm) {
    profileAddressForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!profileAddressForm.reportValidity()) return;
      const address = {
        id: editingAddressId || `ADDR-${Date.now()}`,
        label: profileAddressLabel.value,
        name: profileAddressName.value.trim(),
        mobile: profileAddressMobile.value.trim(),
        address: profileAddressLine.value.trim(),
        pincode: profileAddressPincode.value.trim(),
        selected: !addresses.length
      };
      addresses = editingAddressId
        ? addresses.map((item) => item.id === editingAddressId ? { ...item, ...address } : item)
        : [...addresses.map((item) => ({ ...item, selected: address.selected ? false : item.selected })), address];
      saveAddresses();
      if (currentUser?.token) {
        const endpoint = editingAddressId && /^\d+$/.test(String(editingAddressId))
          ? `/api/addresses/${editingAddressId}` : '/api/addresses';
        apiRequest(endpoint, {
          method: editingAddressId && /^\d+$/.test(String(editingAddressId)) ? 'PUT' : 'POST',
          body: JSON.stringify({ label: address.label, name: address.name, mobile: address.mobile, line: address.address, pincode: address.pincode })
        }).then(() => syncAccountData()).catch(() => {});
      }
      if (address.selected) applyAddressToCheckout(address);
      profileAddressForm.classList.add('hidden');
      editingAddressId = null;
      renderSavedAddresses();
      renderProfileDashboard();
      showToast(`${address.label} address saved`);
    });
  }
  if (addressBarButton) addressBarButton.addEventListener('click', () => {
    openAccountPanel();
    showAddressManager();
  });

  authModeButtons.forEach((button) => {
    button.addEventListener('click', () => setAuthMode(button.dataset.authMode));
  });

  if (authForm) authForm.addEventListener('submit', completeAuth);
  if (closeAuthButton) closeAuthButton.addEventListener('click', closeAuthPanel);
  if (authBackdrop) authBackdrop.addEventListener('click', closeAuthPanel);
  if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const showing = authPasswordInput.type === 'text';
      authPasswordInput.type = showing ? 'password' : 'text';
      passwordToggle.textContent = showing ? 'Show' : 'Hide';
      passwordToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }
  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', () => {
      showToast('Password reset link will be available soon.', 'info');
    });
  }
  if (accountAuthAction) {
    accountAuthAction.addEventListener('click', () => {
      if (!currentUser) {
        openAuthPanel('login');
        return;
      }
      const session = currentUser;
      currentUser = null;
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      renderAccountState();
      showToast('You have been logged out.', 'info');
      if (session.token) {
        apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.token}` }
        }).catch(() => {});
      }
    });
  }

  accountMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.dataset.accountAction;
      if (action === 'orders') {
        openOrdersPanel();
      } else if (action === 'profile') {
        openProfilePanel();
      } else if (action === 'wishlist') {
        openWishlistPanel();
      } else if (action === 'settings') {
        openSettingsPanel();
      }
    });
  });

  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', async () => {
      if (!addressForm?.reportValidity()) return;
      if (!validatePayment()) return;
      placeOrderButton.disabled = true;
      await showLoading(650);
      await openOrderConfirmation();
      placeOrderButton.disabled = false;
      showToast('Order placed successfully');
    });
  }

  if (continueAfterOrderButton) {
    continueAfterOrderButton.addEventListener('click', closeOrderConfirmation);
  }

  if (addressForm) {
    addressForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!addressForm.reportValidity()) return;

      const address = {
        name: addressNameInput.value.trim(),
        mobile: addressMobileInput.value.trim(),
        address: addressLineInput.value.trim(),
        pincode: addressPincodeInput.value.trim()
      };

      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
      const current = selectedAddress();
      if (current) {
        addresses = addresses.map((item) => item.id === current.id ? { ...item, ...address, selected: true } : { ...item, selected: false });
      } else {
        addresses = [{ ...address, id: `ADDR-${Date.now()}`, label: 'Home', selected: true }];
      }
      saveAddresses();
      if (currentUser?.token) {
        const apiAddress = current && /^\d+$/.test(String(current.id)) ? `/api/addresses/${current.id}` : '/api/addresses';
        const method = current && /^\d+$/.test(String(current.id)) ? 'PUT' : 'POST';
        apiRequest(apiAddress, {
          method,
          body: JSON.stringify({ label: current?.label || 'Home', name: address.name, mobile: address.mobile, line: address.address, pincode: address.pincode })
        }).then(() => syncAccountData()).catch(() => {});
      }
      renderSavedAddresses();
      renderProfileDashboard();
      if (addressError) addressError.textContent = '';
      if (addressSavedMessage) {
        addressSavedMessage.textContent = 'Delivery address saved.';
      }
      showToast('Delivery address saved');
    });
  }

  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      const productName = modalTitle?.textContent || 'Product';
      const productPrice = modalPrice?.textContent || '₹499';
      const productImageClass = modalImage?.dataset.productClass || 'product-one';
      const foundItem = cart.find((item) => item.name === productName);
      const stock = Number(activeProductCard?.dataset.stock || 99);

      if (foundItem) {
        if (stock >= 0 && foundItem.qty >= stock) {
          showToast(stock ? `Only ${stock} left in stock.` : 'This product is out of stock.', 'error');
          return;
        }
        foundItem.qty += 1;
      } else {
        if (stock === 0) {
          showToast('This product is out of stock.', 'error');
          return;
        }
        cart.push({
          name: productName,
          price: parsePrice(productPrice),
          qty: 1,
          imageClass: productImageClass,
          stock
        });
      }

      if (buyNowButton && buyNowButton.dataset.bound !== 'true') {
        buyNowButton.dataset.bound = 'true';
        buyNowButton.addEventListener('click', () => {
          addToCartButton?.click();
          window.setTimeout(() => checkoutBtn?.click(), 80);
        });
      }

      cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
      saveCart();
      updateCartCount();
      renderCart();
      openCartPanel();
      closeProductModal();
      showToast(`${productName} added to cart`);
      addToCartButton.classList.add('added');
      addToCartButton.textContent = 'Added';
      setTimeout(() => {
        addToCartButton.classList.remove('added');
        addToCartButton.textContent = 'Add to Cart';
      }, 1000);
    });
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((nav) => nav.classList.remove('active'));
      item.classList.add('active');
      const destination = item.dataset.nav;

      if (destination === 'cart') {
        closeCheckoutPanel();
        closeOrderConfirmation();
        closeOrdersPanel();
        closeAccountPanel();
        closeWishlistPanel();
        closeNotificationsPanel();
        openCartPanel();
      } else if (destination === 'account') {
        openAccountPanel();
      } else if (destination === 'categories') {
        closeCartPanel();
        closeCheckoutPanel();
        closeOrderConfirmation();
        closeOrdersPanel();
        closeAccountPanel();
        closeWishlistPanel();
        closeNotificationsPanel();
        openCategoryCatalog('For You');
      } else {
        showHome();
      }
    });
  });

  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      productCards.forEach((product) => product.classList.remove('selected'));
      card.classList.add('selected');
      openProductModal(card);
    });
  });

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeProductModal);
  }

  productTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const panelName = tab.dataset.productTab;
      productTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      productTabPanels.forEach((panel) => panel.classList.toggle('active', panel.id === `product${panelName.charAt(0).toUpperCase()}${panelName.slice(1)}Panel`));
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProductModal);
  }

  const closeFilterPanel = () => {
    filterPanel?.classList.add('hidden');
    filterPanel?.setAttribute('aria-hidden', 'true');
    filterTrigger?.setAttribute('aria-expanded', 'false');
  };

  const openFilterPanel = () => {
    filterPanel?.classList.remove('hidden');
    filterPanel?.setAttribute('aria-hidden', 'false');
    filterTrigger?.setAttribute('aria-expanded', 'true');
  };

  const updatePriceRangeLabel = () => {
    if (priceRangeValue && priceRange) {
      priceRangeValue.textContent = `₹0 - ₹${Number(priceRange.value).toLocaleString('en-IN')}`;
    }
  };

  const applyProductFilters = () => {
    const query = searchInput?.value.trim().toLowerCase() || '';
    const maxPrice = Number(priceRange?.value || 1500);
    const selectedCategories = [...categoryFilters].filter((input) => input.checked).map((input) => input.value);
    const selectedBrands = [...brandFilters].filter((input) => input.checked).map((input) => input.value);
    const sort = sortProducts?.value || 'relevance';
    const visibleCards = [];

    productCards.forEach((card) => {
      const name = card.dataset.name || '';
      const category = card.dataset.category || '';
      const brand = card.dataset.brand || '';
      const price = Number((card.dataset.price || '').replace(/[₹,]/g, '')) || 0;
      const rating = Number(card.dataset.rating || 0);
      const matches = (!query || `${name} ${category} ${brand}`.toLowerCase().includes(query))
        && price <= maxPrice
        && rating >= selectedRating
        && (!selectedCategory || category === selectedCategory)
        && (!selectedCategories.length || selectedCategories.includes(category))
        && (!selectedBrands.length || selectedBrands.includes(brand));
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCards.push(card);
    });

    if (productsContainer && sort !== 'relevance') {
      visibleCards.sort((a, b) => {
        if (sort === 'price-low' || sort === 'price-high') {
          const priceA = Number(a.dataset.price.replace(/[₹,]/g, ''));
          const priceB = Number(b.dataset.price.replace(/[₹,]/g, ''));
          return sort === 'price-low' ? priceA - priceB : priceB - priceA;
        }
        if (sort === 'rating') return Number(b.dataset.rating) - Number(a.dataset.rating);
        return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      }).forEach((card) => productsContainer.appendChild(card));
    }
    if (filterResultSummary) {
      filterResultSummary.textContent = `${visibleCards.length} of ${productCards.length} products`;
      filterResultSummary.classList.toggle('visible', Boolean(query || selectedRating || selectedCategory || selectedCategories.length || selectedBrands.length || sort !== 'relevance' || maxPrice < 1500));
    }
    productsEmpty?.classList.toggle('hidden', visibleCards.length > 0);
  };

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      categoryPills.forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');
      categoryPills.forEach((item) => item.setAttribute('aria-pressed', item === pill ? 'true' : 'false'));
      selectedCategory = pill.dataset.category === 'For You' ? '' : pill.dataset.category;
      categoryFilters.forEach((input) => { input.checked = input.value === selectedCategory; });
      applyProductFilters();
      productsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      openCategoryCatalog(selectedCategory || 'For You');
    });
  });

  shortcutCards.forEach((card) => {
    card.addEventListener('click', () => {
      const shortcut = card.dataset.shortcutCategory;
      if (shortcut === 'Deals') {
        promoBanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Today’s best deals are ready');
        return;
      }
      const categoryMap = { Travel: 'Fashion', Grocery: 'Home', 'For You': 'For You' };
      const targetCategory = categoryMap[shortcut] || 'For You';
      const pill = [...categoryPills].find((item) => item.dataset.category === targetCategory);
      pill?.click();
    });
  });

  if (topAppsAction) {
    topAppsAction.addEventListener('click', () => {
      promoBanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  catalogFilterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCatalogFilter = chip.dataset.catalogFilter || 'all';
      catalogFilterChips.forEach((item) => item.classList.toggle('active', item === chip));
      renderCategoryCatalog(activeCatalogCategory);
    });
  });
  if (catalogSort) catalogSort.addEventListener('change', () => renderCategoryCatalog(activeCatalogCategory));
  if (closeCategoryCatalogButton) closeCategoryCatalogButton.addEventListener('click', closeCategoryCatalog);
  if (closeCategoryCatalogIcon) closeCategoryCatalogIcon.addEventListener('click', closeCategoryCatalog);
  if (categoryProductsContainer) {
    categoryProductsContainer.addEventListener('click', (event) => {
      const wishlistButton = event.target.closest('.wishlist-btn');
      const card = event.target.closest('.catalog-product-card');
      if (!card) return;
      if (wishlistButton) {
        event.stopPropagation();
        const product = productFromCard(card);
        const existingIndex = wishlist.findIndex((item) => item.name === product.name);
        if (existingIndex >= 0) {
          wishlist.splice(existingIndex, 1);
          wishlistButton.textContent = '♡';
          wishlistButton.classList.remove('active');
          showToast('Removed from wishlist', 'info');
        } else {
          wishlist.push(product);
          wishlistButton.textContent = '♥';
          wishlistButton.classList.add('active');
          showToast('Added to wishlist');
        }
        saveWishlist();
        syncWishlistButtons();
        return;
      }
      openProductModal(card);
    });
  }

  if (filterTrigger) filterTrigger.addEventListener('click', openFilterPanel);
  if (closeFilterButton) closeFilterButton.addEventListener('click', closeFilterPanel);
  if (filterBackdrop) filterBackdrop.addEventListener('click', closeFilterPanel);
  if (priceRange) {
    priceRange.addEventListener('input', updatePriceRangeLabel);
    updatePriceRangeLabel();
  }
  ratingFilters.forEach((button) => {
    button.addEventListener('click', () => {
      selectedRating = Number(button.dataset.ratingFilter);
      ratingFilters.forEach((item) => item.classList.toggle('active', item === button));
    });
  });
  [categoryFilters, brandFilters].forEach((inputs) => inputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.classList.contains('category-filter')) selectedCategory = '';
      applyProductFilters();
    });
  }));
  if (sortProducts) sortProducts.addEventListener('change', applyProductFilters);
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (priceRange) priceRange.value = '1500';
      selectedRating = 0;
      selectedCategory = '';
      ratingFilters.forEach((button) => button.classList.toggle('active', button.dataset.ratingFilter === '0'));
      categoryFilters.forEach((input) => { input.checked = false; });
      brandFilters.forEach((input) => { input.checked = false; });
      if (sortProducts) sortProducts.value = 'relevance';
      updatePriceRangeLabel();
      applyProductFilters();
    });
  }
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', () => {
      applyProductFilters();
      closeFilterPanel();
      showToast('Filters applied successfully');
    });
  }

  if (adminButton) adminButton.addEventListener('click', openAdminPanel);
  if (closeAdminButton) closeAdminButton.addEventListener('click', closeAdminPanel);
  if (adminKeyForm) {
    adminKeyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const key = adminKeyInput?.value.trim();
      if (!key) return;
      adminKey = key;
      if (adminKeyMessage) adminKeyMessage.textContent = '';
      try {
        await loadAdminProducts();
        sessionStorage.setItem('nexora-admin-key', adminKey);
        adminKeyForm.classList.add('hidden');
        adminWorkspace?.classList.remove('hidden');
      } catch (error) {
        adminKey = '';
        if (adminKeyMessage) adminKeyMessage.textContent = error.message;
      }
    });
  }
  if (newProductButton) newProductButton.addEventListener('click', () => {
    resetProductForm();
    productForm?.classList.remove('hidden');
    productForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (cancelProductButton) cancelProductButton.addEventListener('click', resetProductForm);
  if (productForm) {
    productForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = productIdInput?.value;
      const body = {
        name: productNameInput.value.trim(),
        sku: productSkuInput.value.trim() || undefined,
        price: Number(productPriceInput.value),
        original_price: productOriginalPriceInput.value ? Number(productOriginalPriceInput.value) : null,
        stock: Number(productStockInput.value),
        category: productCategoryInput.value.trim(),
        brand: productBrandInput.value.trim(),
        image_class: productImageClassInput.value,
        description: productDescriptionInput.value.trim(),
        active: productActiveInput.checked
      };
      if (productFormMessage) productFormMessage.textContent = '';
      try {
        await adminRequest(id ? `/api/admin/products/${id}` : '/api/admin/products', {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        });
        resetProductForm();
        await loadAdminProducts();
        showToast(id ? 'Product updated successfully' : 'Product added successfully');
      } catch (error) {
        if (productFormMessage) productFormMessage.textContent = error.message;
      }
    });
  }
  if (adminProductsList) {
    adminProductsList.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-admin-action]');
      if (!button) return;
      const product = adminProducts.find((item) => String(item.id) === button.dataset.productId);
      if (!product) return;
      if (button.dataset.adminAction === 'edit') {
        startProductEdit(product);
        return;
      }
      if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
      try {
        await adminRequest(`/api/admin/products/${product.id}`, { method: 'DELETE' });
        await loadAdminProducts();
        showToast('Product deleted successfully');
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProductModal();
      closeCartPanel();
      closeCheckoutPanel();
      closeOrderConfirmation();
      closeOrdersPanel();
      closeAccountPanel();
      closeWishlistPanel();
      closeNotificationsPanel();
      closeAuthPanel();
      closeProfilePanel();
      closeSettingsPanel();
      closeSearchPage();
      closeFilterPanel();
      closeCategoryCatalog();
      closeAdminPanel();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyProductFilters);
  }

  applyProductFilters();
  updateCartCount();
});
