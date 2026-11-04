const capacitor = window.Capacitor;
const nativePlatform = capacitor?.getPlatform?.();
if (capacitor?.isNativePlatform?.() || nativePlatform === 'android' || nativePlatform === 'ios'
  || window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
  document.documentElement.classList.add('native-app');
}

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const appPage = document.querySelector('.page');
  const assistantLauncher = document.getElementById('assistantLauncher');
  const assistantPanel = document.getElementById('assistantPanel');
  const closeAssistantButton = document.getElementById('closeAssistantBtn');
  const assistantMessages = document.getElementById('assistantMessages');
  const assistantForm = document.getElementById('assistantForm');
  const assistantInput = document.getElementById('assistantInput');
  const getProductCards = () => document.querySelectorAll('#products .product-card, #infiniteProducts .product-card');
  const categoryNavigation = document.querySelector('.category-nav');
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.getElementById('searchButton');
  const homeSearchMicButton = document.getElementById('homeSearchMicBtn');
  const headerLoginButton = document.getElementById('headerLoginButton');
  const moreMenuButton = document.getElementById('moreMenuButton');
  const moreMenu = document.getElementById('moreMenu');
  const moreMenuItems = document.querySelectorAll('[data-more-action]');
  const menuAuthButtons = document.querySelectorAll('[data-menu-auth]');
  const moreMenuSignup = document.getElementById('moreMenuSignup');
  const moreMenuGreeting = document.getElementById('moreMenuGreeting');
  const serviceActionButtons = document.querySelectorAll('[data-service-action]');
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
  const infiniteProductsContainer = document.getElementById('infiniteProducts');
  const productsEmpty = document.getElementById('productsEmpty');
  const getCategoryPills = () => categoryNavigation?.querySelectorAll('.category-pill') || [];
  const shortcutCards = document.querySelectorAll('[data-shortcut-category]');
  const topAppsAction = document.querySelector('[data-home-action="offers"]');
  const filterTrigger = document.getElementById('filterTrigger');
  const filterPanel = document.getElementById('filterPanel');
  const closeFilterButton = document.getElementById('closeFilterBtn');
  const filterBackdrop = document.getElementById('filterBackdrop');
  const priceMinInput = document.getElementById('priceMinInput');
  const priceMaxInput = document.getElementById('priceMaxInput');
  const subcategoryFilter = document.getElementById('subcategoryFilter');
  const brandFilterOptions = document.getElementById('brandFilterOptions');
  const discountFilter = document.getElementById('discountFilter');
  const availabilityFilter = document.getElementById('availabilityFilter');
  const ratingFilters = document.querySelectorAll('.rating-filter');
  const categoryFilterOptions = document.getElementById('categoryFilterOptions');
  const getCategoryFilters = () => document.querySelectorAll('.category-filter');
  const getBrandFilters = () => document.querySelectorAll('.brand-filter');
  const sortProducts = document.getElementById('sortProducts');
  const clearFiltersButton = document.getElementById('clearFiltersBtn');
  const applyFiltersButton = document.getElementById('applyFiltersBtn');
  const filterResultSummary = document.getElementById('filterResultSummary');
  const categoryCatalogPanel = document.getElementById('categoryCatalogPanel');
  const categoryProductsContainer = document.getElementById('categoryProducts');
  const catalogTitle = document.getElementById('catalogTitle');
  const catalogSubtitle = document.getElementById('catalogSubtitle');
  const catalogSort = document.getElementById('catalogSort');
  const catalogCategorySelect = document.getElementById('catalogCategorySelect');
  const catalogSubcategorySelect = document.getElementById('catalogSubcategorySelect');
  const catalogBrandSelect = document.getElementById('catalogBrandSelect');
  const catalogTypeSelect = document.getElementById('catalogTypeSelect');
  const catalogModelSelect = document.getElementById('catalogModelSelect');
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
  const modalStockStatus = document.getElementById('modalStockStatus');
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
  const productReviewForm = document.getElementById('productReviewForm');
  const productReviewPurchase = document.getElementById('productReviewPurchase');
  const productReviewEligibility = document.getElementById('productReviewEligibility');
  const productReviewFeedback = document.getElementById('productReviewFeedback');
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
  const navCartCountEl = document.getElementById('navCartCount');
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
  const cartPlatformFeeEl = document.getElementById('cartPlatformFee');
  const cartMrpTotalEl = document.getElementById('cartMrpTotal');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartProceedTotalEl = document.getElementById('cartProceedTotal');
  const cartSavingsMessage = document.getElementById('cartSavingsMessage');
  const cartModeMessage = document.getElementById('cartModeMessage');
  const cartFooter = document.getElementById('cartFooter');
  const cartDeliveryAddress = document.getElementById('cartDeliveryAddress');
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
  const checkoutGiftCardDiscountEl = document.getElementById('checkoutGiftCardDiscount');
  const placeOrderButton = document.getElementById('placeOrderBtn');
  const placeCodOrderButton = document.getElementById('placeCodOrderBtn');
  const paymentModeNotice = document.getElementById('paymentModeNotice');
  const confirmationTitle = document.getElementById('confirmationTitle');
  const confirmationNote = document.getElementById('confirmationNote');
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
  const profilePopupMobile = document.getElementById('profilePopupMobile');
  const profilePopupAddress = document.getElementById('profilePopupAddress');
  const profilePopupStatus = document.getElementById('profilePopupStatus');
  const profilePopupAction = document.getElementById('profilePopupAction');
  const profilePopupEditButton = document.getElementById('profilePopupEdit');
  const profilePopupAddressesButton = document.getElementById('profilePopupAddresses');
  const profilePopupActions = document.getElementById('profilePopupActions');
  const profileEditForm = document.getElementById('profileEditForm');
  const profileEditName = document.getElementById('profileEditName');
  const profileEditEmail = document.getElementById('profileEditEmail');
  const profileEditMobile = document.getElementById('profileEditMobile');
  const profileCurrentPassword = document.getElementById('profileCurrentPassword');
  const profileEditFeedback = document.getElementById('profileEditFeedback');
  const profileEditCancelButton = document.getElementById('profileEditCancel');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettingsButton = document.getElementById('closeSettingsBtn');
  const settingsDoneButton = document.getElementById('settingsDoneBtn');
  const sellerPanel = document.getElementById('sellerPanel');
  const sellerForm = document.getElementById('sellerForm');
  const sellerFeedback = document.getElementById('sellerFeedback');
  const sellerStatus = document.getElementById('sellerStatus');
  const sellerWorkspace = document.getElementById('sellerWorkspace');
  const sellerProductForm = document.getElementById('sellerProductForm');
  const sellerProductList = document.getElementById('sellerProductList');
  const sellerProductFeedback = document.getElementById('sellerProductFeedback');
  const sellerProductImportFile = document.getElementById('sellerProductImportFile');
  const sellerOrdersList = document.getElementById('sellerOrdersList');
  const sellerReturnsList = document.getElementById('sellerReturnsList');
  const sellerOrderFeedback = document.getElementById('sellerOrderFeedback');
  const sellerPhotoList = document.getElementById('sellerPhotoList');
  let sellerCurrentImages = [];
  const notificationSettingsPanel = document.getElementById('notificationSettingsPanel');
  const notificationPreferencesForm = document.getElementById('notificationPreferencesForm');
  const notificationPreferencesFeedback = document.getElementById('notificationPreferencesFeedback');
  const supportPanel = document.getElementById('supportPanel');
  const supportForm = document.getElementById('supportForm');
  const supportFeedback = document.getElementById('supportFeedback');
  const supportTicketList = document.getElementById('supportTicketList');
  const advertisingPanel = document.getElementById('advertisingPanel');
  const advertisingForm = document.getElementById('advertisingForm');
  const advertisingFeedback = document.getElementById('advertisingFeedback');
  const advertisingRequestList = document.getElementById('advertisingRequestList');
  const plusZonePanel = document.getElementById('plusZonePanel');
  const plusStatus = document.getElementById('plusStatus');
  const plusProgress = document.getElementById('plusProgress');
  const plusProgressBar = document.getElementById('plusProgressBar');
  const plusCoinBalance = document.getElementById('plusCoinBalance');
  const plusExclusiveOffer = document.getElementById('plusExclusiveOffer');
  const rewardsPanel = document.getElementById('rewardsPanel');
  const rewardsCoinBalance = document.getElementById('rewardsCoinBalance');
  const rewardsHistory = document.getElementById('rewardsHistory');
  const rewardsCoupons = document.getElementById('rewardsCoupons');
  const giftCardsPanel = document.getElementById('giftCardsPanel');
  const giftCardBalance = document.getElementById('giftCardBalance');
  const giftCardPurchaseForm = document.getElementById('giftCardPurchaseForm');
  const giftCardRedeemForm = document.getElementById('giftCardRedeemForm');
  const giftCardIssuedCode = document.getElementById('giftCardIssuedCode');
  const giftCardsFeedback = document.getElementById('giftCardsFeedback');
  const giftCardsHistory = document.getElementById('giftCardsHistory');
  const useGiftCardBalanceInput = document.getElementById('useGiftCardBalance');
  const downloadAppPanel = document.getElementById('downloadAppPanel');
  const copyAppLinkButton = document.getElementById('copyAppLinkButton');
  const appLinkFeedback = document.getElementById('appLinkFeedback');
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
  const accountLoginAction = document.getElementById('accountLoginAction');
  const accountAuthAction = document.getElementById('accountAuthAction');
  const accountCoinBalance = document.getElementById('accountCoinBalance');
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
  const deliveryPincodePanel = document.getElementById('deliveryPincodePanel');
  const deliveryPincodeForm = document.getElementById('deliveryPincodeForm');
  const deliveryPincodeInput = document.getElementById('deliveryPincodeInput');
  const deliveryPincodeError = document.getElementById('deliveryPincodeError');
  const closeDeliveryPincodeButton = document.getElementById('closeDeliveryPincodeBtn');
  const cancelDeliveryPincodeButton = document.getElementById('cancelDeliveryPincodeBtn');
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
  const adminProductImportFile = document.getElementById('adminProductImportFile');
  const adminImportMessage = document.getElementById('adminImportMessage');
  const supplierFeedForm = document.getElementById('supplierFeedForm');
  const supplierFeedName = document.getElementById('supplierFeedName');
  const supplierFeedMessage = document.getElementById('supplierFeedMessage');
  const supplierFeedsList = document.getElementById('supplierFeedsList');
  const productOtherVariantsInput = document.getElementById('productOtherVariantsInput');
  const adminCatalogSelectors = [
    { kind: 'category', select: document.getElementById('adminCatalogCategory'), placeholder: 'Select category' },
    { kind: 'subcategory', select: document.getElementById('adminCatalogSubcategory'), placeholder: 'Select sub-category' },
    { kind: 'brand', select: document.getElementById('adminCatalogBrand'), placeholder: 'Select brand' },
    { kind: 'product_type', select: document.getElementById('adminCatalogProductType'), placeholder: 'Select product type' },
    { kind: 'model', select: document.getElementById('adminCatalogModel'), placeholder: 'Select model' }
  ];
  const addCatalogNodeButton = document.getElementById('addCatalogNodeBtn');
  const editCatalogNodeButton = document.getElementById('editCatalogNodeBtn');
  const deleteCatalogNodeButton = document.getElementById('deleteCatalogNodeBtn');
  const refreshCatalogButton = document.getElementById('refreshCatalogBtn');
  const catalogNodeForm = document.getElementById('catalogNodeForm');
  const catalogNodeFormTitle = document.getElementById('catalogNodeFormTitle');
  const catalogNodeName = document.getElementById('catalogNodeName');
  const catalogNodeNameLabel = document.getElementById('catalogNodeNameLabel');
  const catalogNodeFormMessage = document.getElementById('catalogNodeFormMessage');
  const adminCatalogMessage = document.getElementById('adminCatalogMessage');
  const cancelCatalogNodeButton = document.getElementById('cancelCatalogNodeBtn');
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
  const productRatingInput = document.getElementById('productRatingInput');
  const productReviewsInput = document.getElementById('productReviewsInput');
  const productStockInput = document.getElementById('productStockInput');
  const productCategoryInput = document.getElementById('productCategoryInput');
  const productSubcategoryInput = document.getElementById('productSubcategoryInput');
  const productBrandInput = document.getElementById('productBrandInput');
  const productTypeInput = document.getElementById('productTypeInput');
  const productModelInput = document.getElementById('productModelInput');
  const productSpecificationsInput = document.getElementById('productSpecificationsInput');
  const productPhotosInput = document.getElementById('productPhotosInput');
  const productSizesInput = document.getElementById('productSizesInput');
  const productColorsInput = document.getElementById('productColorsInput');
  const productStorageInput = document.getElementById('productStorageInput');
  const productSellerInput = document.getElementById('productSellerInput');
  const productDeliveryInput = document.getElementById('productDeliveryInput');
  const productImageClassInput = document.getElementById('productImageClassInput');
  const productDescriptionInput = document.getElementById('productDescriptionInput');
  const productActiveInput = document.getElementById('productActiveInput');
  const CART_STORAGE_KEY = 'nexora-cart';
  const ADDRESS_STORAGE_KEY = 'nexora-delivery-address';
  const DELIVERY_PINCODE_STORAGE_KEY = 'nexora-delivery-pincode';
  const ADDRESSES_STORAGE_KEY = 'nexora-delivery-addresses';
  const ORDERS_STORAGE_KEY = 'nexora-orders';
  const WISHLIST_STORAGE_KEY = 'nexora-wishlist';
  const NOTIFICATIONS_STORAGE_KEY = 'nexora-notifications';
  const NOTIFICATION_PREFERENCES_STORAGE_KEY = 'nexora-notification-preferences';
  const AUTH_USERS_STORAGE_KEY = 'nexora-auth-users';
  const AUTH_SESSION_STORAGE_KEY = 'nexora-auth-session';
  const RECENT_SEARCHES_STORAGE_KEY = 'nexora-recent-searches';
  const configuredApiBase = window.NEXORA_API_BASE
    || document.querySelector('meta[name="nexora-api-base"]')?.content
    || '';
  const API_BASE = configuredApiBase.replace(/\/$/, '')
    || (window.location.protocol === 'file:'
      ? 'http://localhost:3000'
      : window.location.origin);
  let apiAvailable = false;
  let paymentConfig = null;
  let recentSearchEditMode = false;
  let recentSearchSaveTimer;
  const apiRequest = async (path, options = {}) => {
    const session = getAuthSession();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    try {
      const requestOptions = { ...options, headers };
      const response = await fetch(`${API_BASE}${path}`, requestOptions);
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
      if (!error.apiResponse) {
        apiAvailable = false;
        throw new Error('Unable to connect to the server. Check your connection and try again.');
      }
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

  let searchResultProducts = [];
  let searchResultRequestId = 0;
  let searchResultDebounceTimer = 0;
  const renderSearchResults = async () => {
    if (!searchResults) return;
    const query = fullSearchInput?.value.trim() || '';
    const requestId = ++searchResultRequestId;
    if (!query) {
      searchResultProducts = [];
      searchResults.replaceChildren();
      if (searchPageTitle) searchPageTitle.textContent = 'Discover something new';
      if (searchResultSummary) searchResultSummary.textContent = 'Search products, categories and brands.';
      searchSuggestionsSection?.classList.add('hidden');
      return;
    }
    if (searchPageTitle) searchPageTitle.textContent = `Results for “${query}”`;
    if (searchResultSummary) searchResultSummary.textContent = 'Searching the catalog…';
    let matches;
    try {
      const params = new URLSearchParams({ q: query, active: '1', limit: '20', sort: '-popularity' });
      const response = await apiRequest(`/api/products?${params.toString()}`);
      if (requestId !== searchResultRequestId) return;
      matches = Array.isArray(response.products) ? response.products : [];
      searchResultProducts = matches;
    } catch (error) {
      if (requestId === searchResultRequestId && searchResultSummary) {
        searchResultSummary.textContent = `Search could not be completed: ${error.message}`;
        searchResults.replaceChildren();
      }
      return;
    }
    if (searchSuggestions && searchSuggestionsSection) {
      const suggestions = matches.slice(0, 5);
      searchSuggestionsSection.classList.toggle('hidden', !query || !suggestions.length);
      searchSuggestions.innerHTML = suggestions.map((card) => `
        <button class="search-suggestion-item" type="button" data-suggestion-product="${Number(card.id)}">
          <span class="search-suggestion-icon">🔎</span>
          <span><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.category)} · ${escapeHtml(card.brand)}</small></span>
          <span class="search-suggestion-arrow">↗</span>
        </button>
      `).join('');
      searchSuggestions.querySelectorAll('[data-suggestion-product]').forEach((button) => {
        button.addEventListener('click', () => {
          const product = searchResultProducts.find((item) => item.id === Number(button.dataset.suggestionProduct));
          if (product) showSearchProduct(product);
        });
      });
    }
    if (searchResultSummary) searchResultSummary.textContent = `${matches.length} product${matches.length === 1 ? '' : 's'} found`;
    searchResults.innerHTML = matches.length ? matches.map((card) => `
      <button class="search-result-card" type="button" data-search-product="${Number(card.id)}">
        <span class="search-result-image ${safeImageClass(card.image_class)}">${card.image_url ? `<img src="${escapeHtml(card.image_url)}" alt="" loading="lazy" decoding="async" />` : ''}</span>
        <span class="search-result-info"><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.category)} · ${escapeHtml(card.brand)}${Number(card.stock) > 0 ? '' : ' · Out of stock'}</small></span>
        <span class="search-result-price">₹${Number(card.price || 0).toLocaleString('en-IN')}</span>
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
        const product = searchResultProducts.find((item) => item.id === Number(button.dataset.searchProduct));
        if (product) showSearchProduct(product);
      });
    });
  };
  const showSearchProduct = (product) => {
    const cardData = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: `₹${Number(product.price || 0).toLocaleString('en-IN')}`,
      rating: String(product.rating || 0),
      reviews: String(product.reviews || 0),
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand,
      productType: product.product_type || '',
      model: product.model || product.name,
      variants: parseProductJson(product.variants_json, {}),
      specifications: parseProductJson(product.specifications_json, {}),
      images: parseProductJson(product.images_json, []),
      imageUrl: product.image_url || '',
      originalPrice: product.original_price ? `₹${Number(product.original_price).toLocaleString('en-IN')}` : '',
      description: product.description || '',
      seller: product.seller || '',
      deliveryInformation: product.delivery_information || '',
      imageClass: safeImageClass(product.image_class),
      stock: Number(product.stock ?? 0)
    };
    const container = document.createElement('div');
    container.innerHTML = catalogCardMarkup(cardData);
    closeSearchPage();
    openProductModal(container.firstElementChild);
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
    if (profilePopupMobile) profilePopupMobile.textContent = currentUser.mobile || 'Not added';
    const savedAddress = selectedAddress();
    if (profilePopupAddress) {
      profilePopupAddress.textContent = savedAddress
        ? `${savedAddress.address}, ${savedAddress.pincode}`
        : 'No saved address';
    }
    if (profilePopupStatus) profilePopupStatus.textContent = currentUser.token ? 'Active member' : 'Local member';
    profileEditForm?.classList.add('hidden');
    profilePopupActions?.classList.remove('hidden');
    if (profileEditName) profileEditName.value = currentUser.name || '';
    if (profileEditEmail) profileEditEmail.value = currentUser.email || '';
    if (profileEditMobile) profileEditMobile.value = currentUser.mobile || '';
    if (profileCurrentPassword) profileCurrentPassword.value = '';
    if (profileEditFeedback) profileEditFeedback.textContent = '';
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
  let buyNowCartContext = null;
  let cartCount = 0;
  let syncCartToServer = async () => {};
  let wishlist = [];
  let appliedCoupon = null;
  let notifications = [];
  let notificationPreferences = { offers: true, orders: true, messages: true };
  let rewardCoinBalance = 0;
  let giftCardWalletBalance = 0;
  let applyGiftCardBalance = false;
  let selectedRating = 0;
  let selectedCategory = '';
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

  [addressMobileInput, addressPincodeInput, profileAddressMobile, profileAddressPincode, deliveryPincodeInput]
    .forEach((input) => input?.addEventListener('input', () => normalizeDigits(input, input === addressPincodeInput || input === profileAddressPincode || input === deliveryPincodeInput ? 6 : 10)));

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

  const servicePanels = [
    sellerPanel, notificationSettingsPanel, supportPanel, advertisingPanel,
    plusZonePanel, rewardsPanel, giftCardsPanel, downloadAppPanel
  ].filter(Boolean);
  const servicePanelForAction = {
    seller: sellerPanel,
    'notification-settings': notificationSettingsPanel,
    support: supportPanel,
    advertising: advertisingPanel,
    'plus-zone': plusZonePanel,
    rewards: rewardsPanel,
    'gift-cards': giftCardsPanel,
    'download-app': downloadAppPanel
  };
  const persistNotificationPreferences = () => {
    localStorage.setItem(NOTIFICATION_PREFERENCES_STORAGE_KEY, JSON.stringify(notificationPreferences));
    if (!notificationPreferencesForm) return;
    Object.entries(notificationPreferences).forEach(([name, enabled]) => {
      const input = notificationPreferencesForm.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.checked = enabled;
    });
  };
  try {
    const savedPreferences = JSON.parse(localStorage.getItem(NOTIFICATION_PREFERENCES_STORAGE_KEY) || 'null');
    if (savedPreferences && ['offers', 'orders', 'messages'].every((name) => typeof savedPreferences[name] === 'boolean')) {
      notificationPreferences = {
        offers: savedPreferences.offers,
        orders: savedPreferences.orders,
        messages: savedPreferences.messages
      };
    }
  } catch (error) {
    console.warn('Unable to read saved notification preferences.', error);
  }
  persistNotificationPreferences();
  const closeServicePanels = () => {
    servicePanels.forEach((panel) => {
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
    });
  };
  const requireServiceAccount = () => {
    if (currentUser?.token) return true;
    closeMoreMenu();
    openAuthPanel('login');
    showToast('Sign in to use Nexora account services.', 'info');
    return false;
  };
  const renderServiceRequests = (container, items, titleField) => {
    if (!container) return;
    container.innerHTML = items.length ? items.map((item) => `
      <div class="service-request-item"><span>#${escapeHtml(item.id)} · ${escapeHtml(item[titleField])}</span><strong>${escapeHtml(item.status)}</strong></div>
    `).join('') : '';
  };
  const loadNotificationPreferences = async () => {
    const result = await apiRequest('/api/notification-preferences');
    notificationPreferences = {
      offers: result.preferences.offers,
      orders: result.preferences.orders,
      messages: result.preferences.messages
    };
    persistNotificationPreferences();
    return result.preferences;
  };
  const renderRewards = (rewards) => {
    rewardCoinBalance = Number(rewards.coins) || 0;
    if (accountCoinBalance) accountCoinBalance.textContent = rewardCoinBalance.toLocaleString('en-IN');
    const plus = Boolean(rewards.plusMember);
    if (plusStatus) plusStatus.textContent = plus ? 'Nexora Plus Member' : 'Nexora Member';
    if (plusProgress) plusProgress.textContent = plus
      ? 'You have unlocked Nexora Plus member offers.'
      : `${Number(rewards.coinsToPlus) || 0} more coins to unlock Plus.`;
    if (plusCoinBalance) plusCoinBalance.textContent = rewardCoinBalance.toLocaleString('en-IN');
    if (rewardsCoinBalance) rewardsCoinBalance.textContent = rewardCoinBalance.toLocaleString('en-IN');
    if (plusProgressBar) {
      const progress = Math.min(100, rewardCoinBalance / Number(rewards.plusMembershipCoins || 500) * 100);
      plusProgressBar.style.width = `${progress}%`;
    }
    if (plusExclusiveOffer) plusExclusiveOffer.textContent = plus
      ? 'Use code PLUS100 for ₹100 off on eligible orders.'
      : `Reach ${Number(rewards.plusMembershipCoins) || 500} coins to unlock the PLUS100 offer.`;
    if (rewardsCoupons) {
      rewardsCoupons.innerHTML = (rewards.coupons || []).map((coupon) => `
        <article class="rewards-coupon ${coupon.available ? '' : 'unavailable'}">
          <div><strong>${escapeHtml(coupon.title)}</strong><small>${escapeHtml(coupon.description)}</small></div>
          <button type="button" data-reward-coupon="${escapeHtml(coupon.code)}" ${coupon.available ? '' : 'disabled'}>${escapeHtml(coupon.available ? coupon.code : 'Locked')}</button>
        </article>
      `).join('');
    }
    if (rewardsHistory) {
      rewardsHistory.innerHTML = (rewards.history || []).map((entry) => `
        <div class="service-request-item"><span>+${Number(entry.coins)} coins · ${escapeHtml(entry.description)}</span><small>${escapeHtml(new Date(entry.created_at).toLocaleDateString('en-IN'))}</small></div>
      `).join('');
      if (!rewardsHistory.children.length) rewardsHistory.innerHTML = '<p class="service-note">Your earned coins will appear here after an order.</p>';
    }
  };
  const renderGiftCards = (giftCards) => {
    giftCardWalletBalance = Number(giftCards.balance) || 0;
    if (giftCardBalance) giftCardBalance.textContent = currency(giftCardWalletBalance);
    if (giftCardsHistory) {
      giftCardsHistory.innerHTML = (giftCards.cards || []).map((card) => `
        <div class="service-request-item"><span>#${escapeHtml(card.id)} · ${currency(card.amount)} · •••• ${escapeHtml(card.code_last_four)}</span><strong>${escapeHtml(card.status)}</strong></div>
      `).join('');
    }
  };
  const openServicePanel = async (action) => {
    const panel = servicePanelForAction[action];
    if (!panel || (action !== 'download-app' && !requireServiceAccount())) return;
    closeMoreMenu();
    closeServicePanels();
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    try {
      if (action === 'notification-settings') {
        await loadNotificationPreferences();
      } else if (action === 'seller') {
        const result = await apiRequest('/api/seller-account');
        if (result.seller && sellerForm) {
          sellerForm.elements.namedItem('business_name').value = result.seller.business_name;
          sellerForm.elements.namedItem('category').value = result.seller.category;
          sellerForm.elements.namedItem('contact_phone').value = result.seller.contact_phone;
          sellerForm.elements.namedItem('gst_number').value = result.seller.gst_number || '';
          if (sellerStatus) sellerStatus.textContent = `Seller application status: ${result.seller.status}. ${result.seller.status === 'approved' ? 'Your product studio is ready.' : 'Product management becomes available after approval.'}`;
          const approved = result.seller.status === 'approved';
          sellerForm.classList.toggle('hidden', approved);
          if (sellerWorkspace) sellerWorkspace.classList.toggle('hidden', !approved);
          if (sellerFeedback) sellerFeedback.textContent = approved ? '' : 'You can update and resubmit your seller details.';
          if (approved) {
            await loadSellerProducts();
            await loadSellerOrderWorkspace();
          }
        } else if (sellerForm && sellerFeedback) {
          sellerForm.reset();
          sellerFeedback.textContent = '';
          if (sellerStatus) sellerStatus.textContent = 'Apply to start selling on Nexora. Product management is available after approval.';
          sellerForm.classList.remove('hidden');
          if (sellerWorkspace) sellerWorkspace.classList.add('hidden');
        }
      } else if (action === 'support') {
        const result = await apiRequest('/api/support/tickets');
        renderServiceRequests(supportTicketList, result.tickets, 'subject');
      } else if (action === 'advertising') {
        const result = await apiRequest('/api/advertising/requests');
        renderServiceRequests(advertisingRequestList, result.requests, 'brand_name');
      } else if (action === 'plus-zone' || action === 'rewards') {
        const result = await apiRequest('/api/rewards');
        renderRewards(result.rewards);
      } else if (action === 'gift-cards') {
        const result = await apiRequest('/api/gift-cards');
        renderGiftCards(result.giftCards);
        if (giftCardIssuedCode) giftCardIssuedCode.classList.add('hidden');
      }
    } catch (error) {
      const feedback = action === 'seller' ? sellerFeedback
        : action === 'notification-settings' ? notificationPreferencesFeedback
          : action === 'support' ? supportFeedback
            : action === 'advertising' ? advertisingFeedback
              : action === 'gift-cards' ? giftCardsFeedback : null;
      if (feedback) feedback.textContent = error.message;
      showToast(error.message, 'error');
    }
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
  let adminCatalogNodes = [];
  let adminCatalogSelectionIds = [];
  let catalogNodeEditingId = null;
  let catalogNodeCreatingKind = null;
  let catalogNodeCreatingParentId = null;
  const selectedAdminCatalogPath = () => adminCatalogSelectionIds
    .map((id) => adminCatalogNodes.find((node) => node.id === id))
    .filter(Boolean);
  const renderAdminCatalog = () => {
    adminCatalogSelectors.forEach(({ kind, select, placeholder }, index) => {
      if (!select) return;
      const parentId = index ? adminCatalogSelectionIds[index - 1] : null;
      const options = adminCatalogNodes.filter((node) => node.kind === kind
        && (index === 0 ? node.parent_id === null : node.parent_id === parentId));
      if (adminCatalogSelectionIds[index] && !options.some((node) => node.id === adminCatalogSelectionIds[index])) {
        adminCatalogSelectionIds.length = index;
      }
      select.innerHTML = `<option value="">${placeholder}</option>${options.map((node) => `<option value="${node.id}">${escapeHtml(node.name)}</option>`).join('')}`;
      select.value = adminCatalogSelectionIds[index] || '';
      select.disabled = index > 0 && !parentId;
    });
    const selectedPath = selectedAdminCatalogPath();
    const selectedNode = selectedPath[selectedPath.length - 1];
    const nextKind = adminCatalogSelectors[selectedPath.length]?.kind;
    if (addCatalogNodeButton) {
      addCatalogNodeButton.textContent = selectedNode
        ? nextKind ? `+ Add ${nextKind === 'product_type' ? 'product type' : nextKind}` : '+ Add product'
        : '+ Add category';
      addCatalogNodeButton.disabled = false;
    }
    if (editCatalogNodeButton) editCatalogNodeButton.disabled = !selectedNode;
    if (deleteCatalogNodeButton) deleteCatalogNodeButton.disabled = !selectedNode;
    if (adminCatalogMessage) {
      adminCatalogMessage.textContent = selectedPath.length
        ? `${selectedPath.map((node) => node.name).join(' › ')} · ${adminProducts.filter((product) => productMatchesAdminCatalogPath(product, selectedPath)).length} products`
        : 'Select a category to manage its catalog.';
    }
  };
  const productCatalogValue = (product, kind) => {
    if (kind === 'category') return product.category || '';
    if (kind === 'subcategory') return product.subcategory || 'General';
    if (kind === 'brand') return product.brand || 'Unbranded';
    if (kind === 'product_type') return product.product_type || 'General';
    return product.model || product.name || '';
  };
  const productMatchesAdminCatalogPath = (product, path) => path.every((node) => (
    productCatalogValue(product, node.kind).toLowerCase() === node.name.toLowerCase()
  ));
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
  const loadSupplierFeeds = async () => {
    const { feeds } = await adminRequest('/api/admin/supplier-feeds');
    supplierFeedsList.innerHTML = feeds.length ? feeds.map((feed) => `
      <article class="supplier-feed-row">
        <div><strong>${escapeHtml(feed.name)}</strong><small>${feed.last_sync_at
          ? `Last attempt ${escapeHtml(feed.last_sync_at)} · ${escapeHtml(feed.last_sync_status)} · ${Number(feed.last_sync_count)} received (${Number(feed.last_sync_created)} new, ${Number(feed.last_sync_updated)} updated)`
          : 'No feed updates received yet'} · ${feed.active ? 'Active' : 'Paused'}</small>${feed.last_sync_error ? `<small class="supplier-feed-error">${escapeHtml(feed.last_sync_error)}</small>` : ''}</div>
        <button type="button" data-supplier-rotate="${feed.id}">Rotate key</button>
        <button type="button" data-supplier-toggle="${feed.id}" data-active="${feed.active ? 'false' : 'true'}">${feed.active ? 'Pause' : 'Activate'}</button>
        <button type="button" class="delete-product-btn" data-supplier-delete="${feed.id}">Revoke</button>
      </article>
    `).join('') : '<p class="admin-empty-state">No suppliers authorized yet.</p>';
  };
  const loadProductDuplicates = async () => {
    const duplicatesList = document.getElementById('productDuplicatesList');
    if (!duplicatesList) return;
    duplicatesList.innerHTML = '<p class="admin-empty-state">Checking catalog…</p>';
    try {
      const { duplicates } = await adminRequest('/api/admin/products/duplicates?limit=50');
      duplicatesList.innerHTML = duplicates.length ? duplicates.map((group) => `
        <article class="supplier-feed-row">
          <div>
            <strong>${escapeHtml(group.match_type === 'sku' ? `Possible duplicate SKU: ${group.match_value}` : `Possible duplicate catalog identity: ${group.match_value}`)}</strong>
            <small>${Number(group.product_count)} matching products${group.truncated ? ' · showing first 10' : ''}</small>
            ${group.products.map((product) => `<small>#${Number(product.id)} · ${escapeHtml(product.name)} · ${escapeHtml(product.seller || 'No seller')} · ${product.active ? 'Active' : 'Hidden'}${product.external_product_id ? ` · Supplier ID ${escapeHtml(product.external_product_id)}` : ''}</small>`).join('')}
          </div>
        </article>
      `).join('') : '<p class="admin-empty-state">No exact duplicate candidates detected.</p>';
    } catch (error) {
      duplicatesList.innerHTML = `<p class="admin-empty-state">Duplicate check failed: ${escapeHtml(error.message)}</p>`;
    }
  };
  document.getElementById('refreshProductDuplicatesBtn')?.addEventListener('click', loadProductDuplicates);
  supplierFeedForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    supplierFeedMessage.textContent = '';
    try {
      const { feed, api_key: apiKey } = await adminRequest('/api/admin/supplier-feeds', {
        method: 'POST',
        body: JSON.stringify({ name: supplierFeedName.value.trim() })
      });
      supplierFeedMessage.innerHTML = `Authorized ${escapeHtml(feed.name)}. Provide the one-time API key securely to that supplier; never email or publish it: <code>${escapeHtml(apiKey)}</code> <button type="button" data-copy-feed-key="${escapeHtml(apiKey)}">Copy key</button>`;
      supplierFeedForm.reset();
      await loadSupplierFeeds();
    } catch (error) {
      supplierFeedMessage.textContent = error.message;
    }
  });
  supplierFeedsList?.addEventListener('click', async (event) => {
    const copyButton = event.target.closest('[data-copy-feed-key]');
    if (copyButton) {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyFeedKey);
        supplierFeedMessage.textContent = 'Supplier key copied. Store it securely; it is only shown once.';
      } catch (error) {
        supplierFeedMessage.textContent = `Clipboard access failed: ${error.message}. Select and copy the key above.`;
      }
      return;
    }
    const toggleButton = event.target.closest('[data-supplier-toggle]');
    const rotateButton = event.target.closest('[data-supplier-rotate]');
    const deleteButton = event.target.closest('[data-supplier-delete]');
    if (!toggleButton && !rotateButton && !deleteButton) return;
    const id = toggleButton?.dataset.supplierToggle || rotateButton?.dataset.supplierRotate || deleteButton?.dataset.supplierDelete;
    try {
      if (toggleButton) {
        await adminRequest(`/api/admin/supplier-feeds/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ active: toggleButton.dataset.active === 'true' })
        });
      } else if (rotateButton) {
        if (!window.confirm('Rotate this supplier key? Their current key will stop working immediately.')) return;
        const { feed, api_key: apiKey } = await adminRequest(`/api/admin/supplier-feeds/${id}/rotate-key`, { method: 'POST' });
        supplierFeedMessage.innerHTML = `New one-time key for ${escapeHtml(feed.name)}: <code>${escapeHtml(apiKey)}</code> <button type="button" data-copy-feed-key="${escapeHtml(apiKey)}">Copy key</button>. Update the supplier securely; the old key is revoked.`;
      } else {
        if (!window.confirm('Revoke this supplier key? Products already imported will remain in the catalog.')) return;
        await adminRequest(`/api/admin/supplier-feeds/${id}`, { method: 'DELETE' });
      }
      await loadSupplierFeeds();
      if (toggleButton || rotateButton) return;
      await loadProductDuplicates();
    } catch (error) {
      supplierFeedMessage.textContent = error.message;
    }
  });
  document.getElementById('refreshSupplierFeedsBtn')?.addEventListener('click', () => {
    Promise.all([loadSupplierFeeds(), loadProductDuplicates()])
      .catch((error) => { supplierFeedMessage.textContent = error.message; });
  });
  adminProductImportFile?.addEventListener('change', async () => {
    const file = adminProductImportFile.files?.[0];
    if (!file) return;
    adminImportMessage.textContent = `Importing ${file.name}…`;
    try {
      const response = await fetch(`${API_BASE}/api/admin/products/import`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey, 'Content-Type': file.type || 'application/octet-stream' },
        body: file
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Import failed (${response.status})`);
      adminImportMessage.textContent = `Import complete: ${payload.results.created} created, ${payload.results.updated} duplicates updated (${payload.results.total} rows).`;
      await Promise.all([loadAdminCatalog(), loadAdminProducts(), loadDashboard(), loadProductDuplicates()]);
    } catch (error) {
      adminImportMessage.textContent = error.message;
    } finally {
      adminProductImportFile.value = '';
    }
  });
  const closeAdminPanel = () => {
    adminPanel?.classList.add('hidden');
    adminPanel?.setAttribute('aria-hidden', 'true');
  };

  const resetProductForm = () => {
    productForm?.reset();
    if (productIdInput) productIdInput.value = '';
    if (productActiveInput) productActiveInput.checked = true;
    if (productImageClassInput) productImageClassInput.value = 'product-one';
    if (productRatingInput) productRatingInput.value = '0';
    if (productReviewsInput) productReviewsInput.value = '0';
    if (productPhotosInput) productPhotosInput.value = '';
    if (productSizesInput) productSizesInput.value = '';
    if (productColorsInput) productColorsInput.value = '';
    if (productStorageInput) productStorageInput.value = '';
    if (productOtherVariantsInput) productOtherVariantsInput.value = '';
    if (productFormTitle) productFormTitle.textContent = 'Add product';
    productForm?.classList.add('hidden');
    if (productFormMessage) productFormMessage.textContent = '';
  };
  const parseProductJson = (value, fallback) => {
    try {
      return JSON.parse(value || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };

  const renderAdminProducts = () => {
    if (!adminProductsList) return;
    const selectedPath = selectedAdminCatalogPath();
    const visibleProducts = selectedPath.length
      ? adminProducts.filter((product) => productMatchesAdminCatalogPath(product, selectedPath))
      : adminProducts;
    if (adminProductCount) adminProductCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`;
    adminProductsList.innerHTML = visibleProducts.length ? visibleProducts.map((product) => {
      const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : '';
      return `
        <article class="admin-product-row">
          <div class="admin-product-image ${safeImageClass(product.image_class)}"></div>
          <div class="admin-product-details">
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml([product.category, product.subcategory, product.brand, product.product_type, product.model].filter(Boolean).join(' · '))} · ${currency(product.price)}${product.active ? '' : ' · Hidden'}</small>
            <span class="admin-stock ${stockClass}">${product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}</span>
          </div>
          <div class="admin-product-actions">
            <button type="button" data-admin-action="edit" data-product-id="${product.id}">Edit</button>
            <button type="button" class="delete-product-btn" data-admin-action="delete" data-product-id="${product.id}">Delete</button>
          </div>
        </article>
      `;
    }).join('') : '<div class="admin-empty-state">No products at this level yet. Select a model or add a product.</div>';
  };

  const loadAdminProducts = async () => {
    const result = await adminRequest('/api/admin/products');
    adminProducts = result.products || [];
    renderAdminProducts();
    renderAdminCatalog();
  };
  const loadAdminCatalog = async () => {
    const result = await adminRequest('/api/admin/catalog');
    adminCatalogNodes = result.nodes || [];
    const categoryValue = productCategoryInput?.value || '';
    if (productCategoryInput) {
      productCategoryInput.innerHTML = `<option value="">Select category</option>${adminCatalogNodes.filter((node) => node.kind === 'category').map((node) => `<option value="${escapeHtml(node.name)}">${escapeHtml(node.name)}</option>`).join('')}`;
      productCategoryInput.value = categoryValue;
    }
    renderAdminCatalog();
    renderAdminProducts();
  };
  const openCatalogNodeForm = ({ id = null, kind, parentId = null, name = '' }) => {
    catalogNodeEditingId = id;
    catalogNodeCreatingKind = id ? null : kind;
    catalogNodeCreatingParentId = id ? null : parentId;
    catalogNodeFormTitle.textContent = id
      ? `Edit ${kind === 'product_type' ? 'product type' : kind}`
      : `Add ${kind === 'product_type' ? 'product type' : kind}`;
    catalogNodeNameLabel.firstChild.textContent = `${kind === 'product_type' ? 'Product type' : kind.charAt(0).toUpperCase() + kind.slice(1)} name`;
    catalogNodeName.value = name;
    catalogNodeFormMessage.textContent = '';
    catalogNodeForm.classList.remove('hidden');
    catalogNodeName.focus();
  };
  const closeCatalogNodeForm = () => {
    catalogNodeForm?.classList.add('hidden');
    catalogNodeForm?.reset();
    catalogNodeFormMessage.textContent = '';
    catalogNodeEditingId = null;
    catalogNodeCreatingKind = null;
    catalogNodeCreatingParentId = null;
  };
  adminCatalogSelectors.forEach(({ kind, select }, index) => {
    select?.addEventListener('change', () => {
      adminCatalogSelectionIds.length = index;
      if (select.value) adminCatalogSelectionIds[index] = Number(select.value);
      renderAdminCatalog();
      renderAdminProducts();
    });
  });
  if (addCatalogNodeButton) {
    addCatalogNodeButton.addEventListener('click', () => {
      const path = selectedAdminCatalogPath();
      const kind = path.length ? adminCatalogSelectors[path.length]?.kind : 'category';
      if (!kind) {
        if (path[path.length - 1]?.kind === 'model') {
          newProductButton?.click();
        } else {
          showToast('Select the next catalog level before adding a child.', 'info');
        }
        return;
      }
      openCatalogNodeForm({
        kind,
        parentId: path.length ? path[path.length - 1].id : null
      });
    });
  }
  if (editCatalogNodeButton) {
    editCatalogNodeButton.addEventListener('click', () => {
      const path = selectedAdminCatalogPath();
      const node = path[path.length - 1];
      if (node) openCatalogNodeForm({ id: node.id, kind: node.kind, name: node.name });
    });
  }
  if (deleteCatalogNodeButton) {
    deleteCatalogNodeButton.addEventListener('click', async () => {
      const path = selectedAdminCatalogPath();
      const node = path[path.length - 1];
      if (!node || !window.confirm(`Delete ${node.kind === 'product_type' ? 'product type' : node.kind} "${node.name}"?`)) return;
      try {
        await adminRequest(`/api/admin/catalog-nodes/${node.id}`, { method: 'DELETE' });
        adminCatalogSelectionIds.pop();
        await Promise.all([loadAdminCatalog(), loadAdminProducts()]);
        showToast('Catalog item deleted');
      } catch (error) {
        if (adminCatalogMessage) adminCatalogMessage.textContent = error.message;
      }
    });
  }
  if (catalogNodeForm) {
    catalogNodeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const body = { name: catalogNodeName.value.trim() };
      if (!catalogNodeEditingId) {
        body.kind = catalogNodeCreatingKind;
        body.parent_id = catalogNodeCreatingParentId;
      }
      try {
        await adminRequest(catalogNodeEditingId
          ? `/api/admin/catalog-nodes/${catalogNodeEditingId}`
          : '/api/admin/catalog-nodes', {
          method: catalogNodeEditingId ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        });
        closeCatalogNodeForm();
        await Promise.all([loadAdminCatalog(), loadAdminProducts()]);
        showToast('Catalog item saved');
      } catch (error) {
        catalogNodeFormMessage.textContent = error.message;
      }
    });
  }
  if (cancelCatalogNodeButton) cancelCatalogNodeButton.addEventListener('click', closeCatalogNodeForm);
  if (refreshCatalogButton) refreshCatalogButton.addEventListener('click', () => {
    Promise.all([loadAdminCatalog(), loadAdminProducts()])
      .then(() => { if (adminCatalogMessage) adminCatalogMessage.textContent = 'Catalog refreshed.'; })
      .catch((error) => { if (adminCatalogMessage) adminCatalogMessage.textContent = error.message; });
  });

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
      Promise.all([loadDashboard(), loadAdminCatalog(), loadAdminProducts(), loadSupplierFeeds()]).catch((error) => {
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
    productRatingInput.value = product.rating ?? 0;
    productReviewsInput.value = product.reviews ?? 0;
    productStockInput.value = product.stock;
    productCategoryInput.value = product.category || '';
    productSubcategoryInput.value = product.subcategory || '';
    productBrandInput.value = product.brand || '';
    productTypeInput.value = product.product_type || '';
    productModelInput.value = product.model || '';
    productSpecificationsInput.value = JSON.stringify(parseProductJson(product.specifications_json, {}), null, 2);
    const images = parseProductJson(product.images_json, []);
    productPhotosInput.value = Array.isArray(images) && images.length
      ? images.join('\n')
      : product.image_url || '';
    const variants = parseProductJson(product.variants_json, {});
    productSizesInput.value = Array.isArray(variants.size) ? variants.size.join(', ') : '';
    productColorsInput.value = Array.isArray(variants.color) ? variants.color.join(', ') : '';
    productStorageInput.value = Array.isArray(variants.storage) ? variants.storage.join(', ') : '';
    if (productOtherVariantsInput) {
      const otherVariants = Object.fromEntries(Object.entries(variants).filter(([key]) => !['size', 'color', 'storage'].includes(key)));
      productOtherVariantsInput.value = Object.keys(otherVariants).length ? JSON.stringify(otherVariants, null, 2) : '';
    }
    productSellerInput.value = product.seller || '';
    productDeliveryInput.value = product.delivery_information || '';
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
  const cartItemsForApi = async (items, refresh = true) => {
    items.forEach((item) => {
      if (!Number(item.productId)) item.productId = findCartProductId(item) || undefined;
    });
    const unresolvedNames = [...new Set(items.filter((item) => !Number(item.productId)).map((item) => String(item.name || '').trim()).filter(Boolean))];
    const matchesByName = new Map();
    for (const name of unresolvedNames) {
      const params = new URLSearchParams({ active: '1', limit: '100', q: name });
      const response = await apiRequest(`/api/products?${params}`);
      const matches = (response.products || []).filter((product) => product.name.trim().toLowerCase() === name.toLowerCase());
      matchesByName.set(name.toLowerCase(), matches.length === 1 ? matches[0] : null);
    }
    items.forEach((item) => {
      if (Number(item.productId)) return;
      const product = matchesByName.get(String(item.name || '').trim().toLowerCase());
      if (product) item.productId = product.id;
      else item.available = false;
    });
    const ids = items.map((item) => Number(item.productId)).filter((id) => Number.isSafeInteger(id) && id > 0);
    if (ids.length && refresh) await refreshProductSnapshots(ids);
    return items.map((item) => Number(item.productId) > 0
      ? { product_id: Number(item.productId), quantity: item.qty }
      : null).filter(Boolean);
  };
  syncCartToServer = async () => {
    if (!currentUser?.token || cartSyncPromise) return cartSyncPromise;
    cartSyncPromise = (async () => {
      try {
        const items = await cartItemsForApi(cart, false);
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
    const preference = type === 'offer' ? 'offers' : 'orders';
    if (!notificationPreferences[preference]) return;
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
    if (currentUser?.token) {
      apiRequest('/api/notifications')
        .then(async ({ notifications: saved }) => {
          const serverNotifications = (saved || []).map((item) => ({
            id: `server-${item.id}`,
            type: item.type,
            title: item.title,
            message: item.message,
            icon: item.type === 'order' ? '📦' : item.type === 'offer' ? '🎁' : '💬',
            read: Boolean(item.read_at),
            createdAt: item.created_at
          }));
          const localOnly = notifications.filter((item) => !String(item.id).startsWith('server-'));
          notifications = [...serverNotifications, ...localOnly].slice(0, 50);
          await apiRequest('/api/notifications/read-all', { method: 'POST', body: '{}' });
          notifications.forEach((item) => { item.read = true; });
          saveNotifications();
          renderNotifications();
        })
        .catch((error) => showToast(error.message || 'Could not load saved notifications.', 'error'));
    }
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
  let deliveryPincode = '';
  try {
    const savedPincode = localStorage.getItem(DELIVERY_PINCODE_STORAGE_KEY) || '';
    deliveryPincode = /^\d{6}$/.test(savedPincode) ? savedPincode : '';
  } catch (error) {
    console.error('Unable to load the saved delivery PIN code.', error);
  }
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
  const applyAddressToCheckout = (address, { savePincode = false } = {}) => {
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
    if (savePincode && /^\d{6}$/.test(address.pincode || '')) {
      deliveryPincode = address.pincode;
      try {
        localStorage.setItem(DELIVERY_PINCODE_STORAGE_KEY, deliveryPincode);
      } catch (error) {
        console.error('Unable to save the selected address PIN code.', error);
        showToast('Address selected, but its PIN code could not be saved.', 'error');
      }
    }
    if (addressBarTitle) addressBarTitle.textContent = address.pincode || deliveryPincode || 'Add address';
  };
  if (addressNameInput) addressNameInput.value = savedAddress.name || '';
  if (addressMobileInput) addressMobileInput.value = savedAddress.mobile || '';
  if (addressLineInput) addressLineInput.value = savedAddress.address || '';
  if (addressPincodeInput) addressPincodeInput.value = savedAddress.pincode || '';
  applyAddressToCheckout(selectedAddress());
  if (addressBarTitle) addressBarTitle.textContent = deliveryPincode || selectedAddress()?.pincode || 'Add address';

  const bannerSlides = [
    {
      tag: 'Nexora Picks',
      title: 'Find your next favourite',
      offer: 'Fresh finds, chosen for you',
      image: '/assets/banner-style.svg',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 35%, #60a5fa 100%)'
    },
    {
      tag: 'Everyday tech',
      title: 'A little more brilliant',
      offer: 'Smart picks for everyday life',
      image: '/assets/banner-tech.svg',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 35%, #7c3aed 100%)'
    },
    {
      tag: 'Made for your space',
      title: 'Make home feel like yours',
      offer: 'Thoughtful finds for every corner',
      image: '/assets/banner-home.svg',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 35%, #f59e0b 100%)'
    }
  ];

  let currentSlide = 0;
  let dealEndsAt = Date.now() + (6 * 60 * 60 * 1000);
  const recentlyViewedKey = 'nexora-recently-viewed';
  const getProductDetails = (card) => {
    const savedVariants = parseProductJson(card.dataset.variants, {});
    const variants = Object.entries(savedVariants)
      .filter(([, values]) => Array.isArray(values))
      .flatMap(([type, values]) => values.map((value) => `${type.charAt(0).toUpperCase()}${type.slice(1)}: ${value}`));
    const catalogSpecs = [
      ['Brand', card.dataset.brand],
      ['Category', card.dataset.category],
      ['Sub-category', card.dataset.subcategory],
      ['Product type', card.dataset.productType],
      ['Model', card.dataset.model],
      ...(Number(card.dataset.reviews) > 0 && Number(card.dataset.rating) > 0
        ? [['Rating', `${card.dataset.rating} / 5`], ['Reviews', card.dataset.reviews]]
        : []),
      ['Stock', card.dataset.stock || '0']
    ].filter(([, value]) => value);
    const savedSpecificationEntries = Object.entries(parseProductJson(card.dataset.specifications, {}))
      .map(([label, value]) => [label, String(value)]);
    const savedSpecificationNames = new Set(savedSpecificationEntries.map(([label]) => label.toLowerCase()));
    return {
      seller: card.dataset.seller || '',
      deliveryInformation: card.dataset.deliveryInformation || '',
      description: card.dataset.description || '',
      variants,
      highlights: [],
      reviews: [],
      questions: [],
      specs: [
        ...savedSpecificationEntries,
        ...catalogSpecs.filter(([label]) => !savedSpecificationNames.has(label.toLowerCase()))
      ]
    };
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
        const card = [...getProductCards()].find((item) => item.dataset.name === button.dataset.detailProduct);
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
    promoVisual.src = slide.image;
    promoVisual.alt = `${slide.title} — ${slide.offer}`;
    promoBanner.style.background = slide.gradient;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
      dot.setAttribute('aria-pressed', String(index === currentSlide));
    });

    currentSlide = (currentSlide + 1) % bannerSlides.length;
  };

  const closeMoreMenu = () => {
    moreMenu?.classList.add('hidden');
    moreMenuButton?.setAttribute('aria-expanded', 'false');
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

  const loadProductReviews = async (productId) => {
    const isCurrentProduct = () => Number(modal?.dataset.productId) === productId;
    if (modalReviewSummary) modalReviewSummary.textContent = 'Loading verified reviews…';
    if (modalReviewsList) modalReviewsList.replaceChildren();
    if (productReviewForm) productReviewForm.hidden = true;
    if (productReviewEligibility) {
      productReviewEligibility.textContent = currentUser?.token
        ? 'Checking your delivered purchases…'
        : 'Sign in and purchase this product to write a verified review.';
    }

    try {
      const result = await apiRequest(`/api/products/${productId}/reviews`);
      if (!isCurrentProduct()) return;
      const count = Number(result.summary.count) || 0;
      const average = Number(result.summary.average) || 0;
      if (modalRating) modalRating.textContent = count ? average.toFixed(1) : 'Not rated';
      if (modalReviews) modalReviews.textContent = `${count} verified purchase review${count === 1 ? '' : 's'}`;
      if (modalReviewSummary) modalReviewSummary.innerHTML = count
        ? `<strong>${average.toFixed(1)} ★</strong><span>${count} verified purchase review${count === 1 ? '' : 's'}</span>`
        : '<span>No verified purchase reviews yet.</span>';
      if (modalReviewsList) modalReviewsList.innerHTML = result.reviews.length
        ? result.reviews.map((review) => `
          <article class="review-card">
            <div>${'★'.repeat(Number(review.rating))}${'☆'.repeat(5 - Number(review.rating))}<b>Verified purchase</b></div>
            <strong>${escapeHtml(review.title)}</strong>
            <p>${escapeHtml(review.body)}</p>
            <small>${escapeHtml(new Date(review.created_at).toLocaleDateString())}</small>
          </article>
        `).join('')
        : '<p>No written verified reviews yet.</p>';

      if (!currentUser?.token || !productReviewForm || !productReviewPurchase) return;
      const eligibility = await apiRequest(`/api/products/${productId}/reviews/eligibility`);
      if (!isCurrentProduct()) return;
      const purchases = eligibility.eligible_purchases || [];
      productReviewForm.hidden = purchases.length === 0;
      if (productReviewEligibility) {
        productReviewEligibility.textContent = purchases.length
          ? 'You can review after delivery is confirmed. One review is allowed per delivered purchase.'
          : 'Only customers with a delivered, not-yet-reviewed purchase can submit a review.';
      }
      productReviewPurchase.replaceChildren(...purchases.map((purchase) => {
        const option = document.createElement('option');
        option.value = String(purchase.order_item_id);
        option.textContent = `Delivered ${new Date(purchase.delivered_at).toLocaleDateString()}`;
        return option;
      }));
      if (productReviewFeedback) productReviewFeedback.textContent = '';
    } catch (error) {
      if (!isCurrentProduct()) return;
      if (modalReviewSummary) modalReviewSummary.textContent = 'Verified reviews could not be loaded.';
      if (modalReviewsList) modalReviewsList.innerHTML = '<p>Please try again later.</p>';
      if (productReviewEligibility) productReviewEligibility.textContent = error.message;
    }
  };

  productReviewForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const productId = Number(modal?.dataset.productId);
    if (!Number.isSafeInteger(productId) || productId < 1) return;
    const submitButton = productReviewForm.querySelector('button[type="submit"]');
    const formData = new FormData(productReviewForm);
    if (submitButton) submitButton.disabled = true;
    if (productReviewFeedback) productReviewFeedback.textContent = 'Submitting verified review…';
    try {
      await apiRequest(`/api/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          order_item_id: Number(formData.get('order_item_id')),
          rating: Number(formData.get('rating')),
          title: formData.get('title'),
          body: formData.get('body')
        })
      });
      productReviewForm.reset();
      if (productReviewFeedback) productReviewFeedback.textContent = 'Thank you. Your verified review has been published.';
      await loadProductReviews(productId);
      showToast('Verified review submitted successfully');
    } catch (error) {
      if (productReviewFeedback) productReviewFeedback.textContent = error.message;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  const openProductModal = (card) => {
    if (!modal || !modalTitle || !modalPrice || !modalRating || !modalImage) return;

    const productName = card.querySelector('.product-name')?.textContent || card.dataset.name || 'Product';
    const productPrice = card.dataset.price || card.querySelector('.product-price')?.textContent || '';
    const category = card.dataset.category || '';
    const productImageClass = card.querySelector('.product-image')?.className || 'product-one';
    const resolvedImageClass = productImageClass.includes('product-one') ? 'product-one' : productImageClass.includes('product-two') ? 'product-two' : productImageClass.includes('product-three') ? 'product-three' : 'product-four';
    const galleryClasses = [resolvedImageClass, 'product-two', 'product-three', 'product-four'];
    const details = getProductDetails(card);
    const productPhotos = parseProductJson(card.dataset.images, []);
    const photos = Array.isArray(productPhotos) && productPhotos.length
      ? productPhotos
      : card.dataset.imageUrl ? [card.dataset.imageUrl] : [];
    activeProductCard = card;
    saveRecentlyViewed(card);
    const productId = Number(card.dataset.productId);
    modal.dataset.productId = productId > 0 ? String(productId) : '';
    if (productReviewForm) productReviewForm.hidden = productId < 1;
    if (productReviewFeedback) productReviewFeedback.textContent = '';

    modalTitle.textContent = productName;
    modalPrice.textContent = productPrice;
    if (modalStockStatus) modalStockStatus.textContent = productStockLabel(Number(card.dataset.stock ?? 0));
    if (addToCartButton) addToCartButton.disabled = Number(card.dataset.stock ?? 0) <= 0;
    if (buyNowButton) buyNowButton.disabled = Number(card.dataset.stock ?? 0) <= 0;
    const modalOriginalPrice = modal?.querySelector('.modal-original');
    if (modalOriginalPrice) {
      modalOriginalPrice.textContent = card.dataset.originalPrice || '';
      modalOriginalPrice.classList.toggle('hidden', !card.dataset.originalPrice);
    }
    modalRating.textContent = 'Not rated';
    modalImage.className = 'modal-image ' + resolvedImageClass;
    modalImage.dataset.productClass = resolvedImageClass;
    modalImage.innerHTML = photos[0] ? `<img src="${escapeHtml(photos[0])}" alt="${escapeHtml(productName)}" />` : '';
    const deliveryInfo = modal?.querySelector('.modal-delivery small');
    if (deliveryInfo) deliveryInfo.textContent = details.deliveryInformation || 'Delivery details not provided.';
    if (modalBadge) modalBadge.textContent = category ? `${category} pick` : 'Product details';
    if (modalSeller) modalSeller.textContent = details.seller || 'Seller details not provided.';
    if (modalVariants) {
      modalVariants.hidden = !details.variants.length;
      modalVariants.innerHTML = details.variants.length
        ? `<strong>Choose variant</strong><div>${details.variants.map((variant, index) => `<button type="button" class="${index === 0 ? 'active' : ''}">${escapeHtml(variant)}</button>`).join('')}</div>`
        : '';
      modalVariants.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
        modalVariants.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      }));
    }
    if (productShowcasePanel) productShowcasePanel.innerHTML = details.highlights.length
      ? `<div class="showcase-points">${details.highlights.map((item) => `<span>✓ ${escapeHtml(item)}</span>`).join('')}</div>`
      : '<p>Product highlights have not been provided.</p>';
    if (productSpecificationsPanel) productSpecificationsPanel.innerHTML = `<div class="spec-grid">${details.specs.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`;
    const description = details.description || 'No product description has been provided.';
    if (productDescriptionPanel) productDescriptionPanel.innerHTML = `<p>${escapeHtml(description)}</p>`;
    if (modalReviews) modalReviews.textContent = 'Loading verified purchase reviews…';
    if (modalReviewSummary) modalReviewSummary.textContent = 'Loading verified reviews…';
    if (modalVerifiedBuyers) modalVerifiedBuyers.textContent = 'Verified purchases only';
    if (modalReviewHighlights) modalReviewHighlights.replaceChildren();
    if (modalReviewsList) modalReviewsList.innerHTML = '<p>Loading verified reviews…</p>';
    if (modalQuestionsList) modalQuestionsList.innerHTML = details.questions.length
      ? details.questions.map(([question, answer]) => `<article class="question-card"><strong>Q: ${escapeHtml(question)}</strong><p>A: ${escapeHtml(answer)}</p></article>`).join('')
      : '<p>No product questions have been provided.</p>';
    const recentCards = getRecentlyViewed().map((name) => [...getProductCards()].find((item) => item.dataset.name === name)).filter(Boolean).filter((item) => item !== card).slice(0, 4);
    renderDetailProductStrip(modalRecentlyViewed, recentCards);
    renderDetailProductStrip(modalMoreProducts, [...getProductCards()].filter((item) => item !== card && item.dataset.category === category).slice(0, 4));
    if (modalDescription) modalDescription.textContent = description;
    if (galleryThumbnails) {
      galleryThumbnails.innerHTML = photos.length
        ? photos.map((url, index) => `<button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-gallery-url="${escapeHtml(url)}" aria-label="View product image ${index + 1}"><img src="${escapeHtml(url)}" alt="" loading="lazy" /></button>`).join('')
        : galleryClasses.map((imageClass, index) => `
          <button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-gallery-class="${imageClass}" aria-label="View product image ${index + 1}">
            <span class="${imageClass}"></span>
          </button>
        `).join('');
      galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
          if (thumbnail.dataset.galleryUrl) {
            modalImage.innerHTML = `<img src="${escapeHtml(thumbnail.dataset.galleryUrl)}" alt="${escapeHtml(productName)}" />`;
            galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((item) => item.classList.toggle('active', item === thumbnail));
            return;
          }
          modalImage.className = `modal-image ${thumbnail.dataset.galleryClass}`;
          galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((item) => item.classList.toggle('active', item === thumbnail));
        });
      });
    }
    renderRelatedProducts(card, category);

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (productId) {
      loadProductReviews(productId);
      refreshProductSnapshots([productId]).catch((error) => {
        if (modalStockStatus) modalStockStatus.textContent = `Stock could not be verified: ${error.message}`;
      });
    }
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
    const allProducts = [...getProductCards()];
    const related = allProducts.filter((card) => card !== activeCard && (!category || card.dataset.category === category)).slice(0, 3);
    const fallback = related.length ? related : allProducts.filter((card) => card !== activeCard).slice(0, 3);
    relatedProductsContainer.innerHTML = fallback.map((card, index) => {
      const imageClass = [...(card.querySelector('.product-image')?.classList || [])].find((name) => name.startsWith('product-')) || 'product-one';
      const rating = Number(card.dataset.rating);
      const reviews = Number(card.dataset.reviews);
      const ratingLabel = rating > 0 && reviews > 0 ? `⭐ ${rating}` : 'No ratings yet';
      return `<button class="related-product" type="button" data-related-index="${allProducts.indexOf(card)}"><span class="related-product-image ${imageClass}"></span><span><strong>${escapeHtml(card.querySelector('.product-name')?.textContent.trim() || 'Product')}</strong><small>${escapeHtml(card.dataset.price || 'Price unavailable')} · ${ratingLabel}</small></span></button>`;
    }).join('');
    relatedProductsContainer.querySelectorAll('.related-product').forEach((button) => {
      button.addEventListener('click', () => openProductModal(getProductCards()[Number(button.dataset.relatedIndex)]));
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
  const productStockLabel = (stock) => stock <= 0 ? 'Out of stock' : stock <= 5 ? `Only ${stock} left in stock` : `${stock} in stock`;

  const parsePrice = (value) => {
    const numericValue = Number(String(value).replace(/[^\d]/g, '')) || 0;
    return numericValue;
  };

  const getCouponDiscount = (subtotal) => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon === 'SAVE100' && subtotal >= 999) return 100;
    if (appliedCoupon === 'BANK10') return Math.round(subtotal * 0.1);
    if (appliedCoupon === 'FREEDEL') return 40;
    if (appliedCoupon === 'PLUS100' && rewardCoinBalance >= 500) return 100;
    return 0;
  };

  const closeCartPanel = () => {
    if (!cartPanel) return;
    cartPanel.classList.add('hidden');
    cartPanel.setAttribute('aria-hidden', 'true');
  };

  let activeCartMode = 'nexora';
  const renderCart = () => {
    if (!cartItemsContainer || !cartTotalEl || !cartSubtotalEl || !cartDeliveryEl) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.available === false ? 0 : item.qty * item.price), 0);
    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + delivery;
    const savings = cart.reduce((sum, item) => {
      const originalPrice = Number(item.originalPrice) || Number(item.price);
      return sum + (item.available === false ? 0 : Math.max(0, originalPrice - Number(item.price)) * item.qty);
    }, 0);
    const mrpTotal = subtotal + savings;

    cartSubtotalEl.textContent = currency(subtotal);
    cartDeliveryEl.textContent = currency(delivery);
    cartTotalEl.textContent = currency(total);
    if (cartPlatformFeeEl) cartPlatformFeeEl.textContent = '₹0 (No fee)';
    if (cartMrpTotalEl) cartMrpTotalEl.textContent = currency(mrpTotal);
    if (cartDiscountEl) cartDiscountEl.textContent = `−${currency(savings)}`;
    if (cartProceedTotalEl) cartProceedTotalEl.textContent = currency(total);
    if (cartSavingsMessage) cartSavingsMessage.textContent = savings
      ? `You’ll save ${currency(savings)} on this order`
      : 'Add products with a discount to see your savings.';
    if (cartDeliveryAddress && addressBarTitle) {
      cartDeliveryAddress.textContent = addressBarTitle.textContent.trim() || 'Choose your address';
    }
    cartModeMessage?.classList.toggle('hidden', activeCartMode === 'nexora');
    if (cartItemsContainer) cartItemsContainer.classList.toggle('hidden', activeCartMode !== 'nexora');
    cartFooter?.classList.toggle('hidden', activeCartMode !== 'nexora');
    const invalidCartItems = cart.filter((item) => item.available === false
      || (Number.isFinite(Number(item.stock)) && Number(item.stock) >= 0 && item.qty > Number(item.stock)));
    if (checkoutBtn) checkoutBtn.disabled = !cart.length || invalidCartItems.length > 0 || activeCartMode !== 'nexora';

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
                <div class="cart-item-image ${safeImageClass(imageClass)}">${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy" />` : ''}</div>
                <div>
                  <div class="cart-item-name">${escapeHtml(item.name)}</div>
                  <div class="cart-item-price">${item.available === false ? 'Unavailable' : currency(item.price)}${Number(item.originalPrice) > Number(item.price) ? ` <s>${currency(item.originalPrice)}</s>` : ''}</div>
                  <small class="cart-stock-status">${item.available === false ? 'Unavailable' : Number(item.stock) === 0 ? 'Out of stock' : item.qty > Number(item.stock) ? `Only ${Number(item.stock)} left; reduce quantity` : item.stock <= 5 ? productStockLabel(Number(item.stock)) : ''}</small>
                  <small class="cart-delivery-estimate">${escapeHtml(item.deliveryInformation || 'Estimated delivery date shown at checkout')}</small>
                </div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-controls">
                  <button class="qty-btn qty-decrease" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                  <span class="cart-item-qty">${item.qty}</span>
                  <button class="qty-btn qty-increase" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-links"><button class="cart-item-action-btn" data-action="move-wishlist" data-index="${index}" type="button">Move to Wishlist</button><button class="remove-item-btn" data-action="remove" data-index="${index}" type="button" aria-label="Remove product">Remove</button></div>
                <button class="cart-buy-now" data-action="buy-now" data-index="${index}" type="button" ${item.available === false || item.stock <= 0 ? 'disabled' : ''}>Buy Now</button>
              </div>
            </div>
          `;
        }
      )
      .join('');

    cartItemsContainer.querySelectorAll('.qty-btn, .remove-item-btn, .cart-item-action-btn, .cart-buy-now').forEach((button) => {
      button.addEventListener('click', async () => {
        const { action, index } = button.dataset;
        const itemIndex = Number(index);
        const item = cart[itemIndex];

        if (!item) return;

        if (action === 'increase') {
          try {
            const resolvedItems = await cartItemsForApi([item]);
            if (!resolvedItems.length) {
              showToast('This product is no longer available.', 'error');
              return;
            }
          } catch (error) {
            showToast(`Stock could not be verified: ${error.message}`, 'error');
            return;
          }
          if (item.available === false) {
            showToast('This product is no longer available.', 'error');
            return;
          }
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
        } else if (action === 'move-wishlist') {
          if (!wishlist.some((saved) => Number(saved.productId) === Number(item.productId) && Number(item.productId))) {
            wishlist.push({ ...item });
            saveWishlist();
          }
          cart.splice(itemIndex, 1);
          syncWishlistButtons();
        } else if (action === 'buy-now') {
          const originalCart = cart.map((cartItem) => ({ ...cartItem }));
          const remainingCart = originalCart
            .map((cartItem) => Number(cartItem.productId) === Number(item.productId)
              ? { ...cartItem, qty: cartItem.qty - 1 }
              : cartItem)
            .filter((cartItem) => cartItem.qty > 0);
          buyNowCartContext = { originalCart, remainingCart };
          cart = [{ ...item, qty: 1 }];
          updateCartCount();
          renderCart();
          closeCartPanel();
          checkoutBtn?.click();
          return;
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
    if (navCartCountEl) navCartCountEl.textContent = String(cartCount);
    if (searchCartCount) searchCartCount.textContent = String(cartCount);
  };

  updateCartCount();
  renderCart();

  const openCartPanel = () => {
    if (!cartPanel) return;
    cartPanel.classList.remove('hidden');
    cartPanel.setAttribute('aria-hidden', 'false');
    renderCart();
    if (cart.length) {
      cartItemsForApi(cart).then(() => renderCart()).catch((error) => {
        showToast(`Cart prices and stock could not be refreshed: ${error.message}`, 'error');
      });
    }
  };

  const closeCheckoutPanel = () => {
    if (!checkoutPanel) return;
    checkoutPanel.classList.add('hidden');
    checkoutPanel.setAttribute('aria-hidden', 'true');
    if (buyNowCartContext) {
      cart = buyNowCartContext.originalCart;
      buyNowCartContext = null;
      saveCart();
      updateCartCount();
      renderCart();
    }
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
    productId: Number(card.dataset.productId) || undefined,
    name: card.querySelector('.product-name')?.textContent.trim() || 'Product',
    price: parsePrice(card.dataset.price || card.querySelector('.product-price')?.textContent),
    stock: Number(card.dataset.stock ?? 99),
    imageClass: [...(card.querySelector('.product-image')?.classList || [])]
      .find((name) => name.startsWith('product-')) || 'product-one'
  });

  let categoryCatalog = [];
  const catalogSelections = { category: '', subcategory: '', brand: '', productType: '', model: '' };

  const loadCategoryCatalogFromServer = async () => {
    try {
      const response = await apiRequest('/api/products?active=1&limit=100&sort=-newest');
      const products = Array.isArray(response.products) ? response.products : [];
      categoryCatalog = products.map((product) => ({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: `₹${Number(product.price || 0).toLocaleString('en-IN')}`,
        rating: String(product.rating || 0),
        reviews: String(product.reviews || 0),
        category: product.category,
        subcategory: product.subcategory || 'General',
        brand: product.brand,
        productType: product.product_type || 'General',
        model: product.model || product.name,
        variants: parseProductJson(product.variants_json, {}),
        specifications: parseProductJson(product.specifications_json, {}),
        images: parseProductJson(product.images_json, []),
        imageUrl: product.image_url || '',
        originalPrice: product.original_price ? `₹${Number(product.original_price).toLocaleString('en-IN')}` : '',
        description: product.description || '',
        seller: product.seller || '',
        deliveryInformation: product.delivery_information || '',
        imageClass: safeImageClass(product.image_class),
        stock: Number(product.stock || 0),
        createdAt: product.created_at || '',
        popularity: Number(product.popularity || 0),
        discount: product.original_price && product.original_price > product.price
          ? `-${Math.round((1 - product.price / product.original_price) * 100)}%`
          : '',
      }));
      if (categoryCatalogPanel && !categoryCatalogPanel.classList.contains('hidden')) {
        renderCategoryCatalog();
      }
    } catch (error) {
      showToast(`Unable to load category products: ${error.message}`, 'error');
    }
  };

  const catalogCardMarkup = (product) => `
    <article class="product-card catalog-product-card" data-product-id="${Number(product.productId || product.id) || ''}" data-name="${escapeHtml(product.name.toLowerCase())}" data-price="${escapeHtml(product.price)}" data-original-price="${escapeHtml(product.originalPrice || '')}" data-rating="${escapeHtml(product.rating)}" data-reviews="${escapeHtml(product.reviews)}" data-category="${escapeHtml(product.category)}" data-subcategory="${escapeHtml(product.subcategory || '')}" data-brand="${escapeHtml(product.brand)}" data-product-type="${escapeHtml(product.productType || '')}" data-model="${escapeHtml(product.model || '')}" data-variants="${escapeHtml(JSON.stringify(product.variants || {}))}" data-specifications="${escapeHtml(JSON.stringify(product.specifications || {}))}" data-images="${escapeHtml(JSON.stringify(product.images || []))}" data-image-url="${escapeHtml(product.imageUrl || '')}" data-description="${escapeHtml(product.description || '')}" data-seller="${escapeHtml(product.seller || '')}" data-delivery-information="${escapeHtml(product.deliveryInformation || '')}" data-stock="${Number(product.stock ?? 0)}" data-popularity="${Number(product.popularity || 0)}" data-created-at="${escapeHtml(product.createdAt || '')}">
      <div class="product-image ${product.imageClass}">
        <span class="product-discount">${escapeHtml(product.discount || '')}</span>
        <button class="wishlist-btn" type="button" aria-label="Add ${escapeHtml(product.name)} to wishlist">♡</button>
        ${product.images?.[0] || product.imageUrl ? `<img class="catalog-photo" src="${escapeHtml(product.images?.[0] || product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" />` : ''}
        ${Number(product.stock ?? 0) <= 0 ? '<span class="product-stock-status">Out of stock</span>' : ''}
      </div>
      <div class="product-name">${escapeHtml(product.name)}</div>
      <div class="product-rating">${Number(product.reviews) > 0 && Number(product.rating) > 0
    ? `⭐ ${escapeHtml(product.rating)} <span>(${escapeHtml(product.reviews)} reviews)</span>`
    : 'No ratings yet'}</div>
      <div class="product-meta"><span class="product-price">${escapeHtml(product.price)}</span>${product.originalPrice ? `<span class="product-original">${escapeHtml(product.originalPrice)}</span>` : ''}<span class="catalog-brand">${escapeHtml(product.brand)}</span></div>
    </article>
  `;

  const closeCategoryCatalog = () => {
    categoryCatalogPanel?.classList.add('hidden');
    categoryCatalogPanel?.setAttribute('aria-hidden', 'true');
  };

  const catalogHierarchySelects = [
    { key: 'category', select: catalogCategorySelect, placeholder: 'All categories' },
    { key: 'subcategory', select: catalogSubcategorySelect, placeholder: 'All sub-categories' },
    { key: 'brand', select: catalogBrandSelect, placeholder: 'All brands' },
    { key: 'productType', select: catalogTypeSelect, placeholder: 'All product types' },
    { key: 'model', select: catalogModelSelect, placeholder: 'All models' }
  ];
  let catalogMainCategories = [
    'Fashion', 'Mobiles', 'Electronics', 'Home & Kitchen', 'Beauty & Personal Care',
    'Grocery', 'Furniture', 'Appliances', 'Footwear', 'Books', 'Toys & Games',
    'Sports & Fitness', 'Automotive', 'Jewellery & Watches', 'Health & Personal Care',
    'Baby & Kids', 'Pet Supplies', 'Office & Stationery', 'Musical Instruments',
    'Tools & Home Improvement', 'Luggage & Travel', 'Garden & Outdoors',
    'Arts, Crafts & Sewing', 'Digital Products', 'Industrial & Scientific',
    'Collectibles & Art'
  ];
  let catalogTaxonomy = [];
  const renderCatalogHierarchy = () => {
    const fields = ['category', 'subcategory', 'brand', 'productType', 'model'];
    catalogHierarchySelects.forEach(({ key, select, placeholder }, index) => {
      if (!select) return;
      const filtered = categoryCatalog.filter((product) => fields.slice(0, index).every((field) => (
        !catalogSelections[field] || String(product[field] || '').toLowerCase() === catalogSelections[field].toLowerCase()
      )));
      const selectedCategory = catalogTaxonomy.find((node) => node.name === catalogSelections.category);
      const selectedSubcategory = selectedCategory?.subcategories.find((node) => node.name === catalogSelections.subcategory);
      const selectedBrand = selectedSubcategory?.brands.find((node) => node.name === catalogSelections.brand);
      const selectedType = selectedBrand?.product_types.find((node) => node.name === catalogSelections.productType);
      const taxonomyNodes = {
        category: catalogTaxonomy,
        subcategory: selectedCategory?.subcategories || [],
        brand: selectedSubcategory?.brands || [],
        productType: selectedBrand?.product_types || [],
        model: selectedType?.models || []
      }[key] || [];
      const taxonomyOptions = taxonomyNodes.map((node) => node.name);
      const productOptions = [...new Set(filtered.map((product) => String(product[key] || '').trim()).filter(Boolean))];
      const options = [...new Set(key === 'category'
        ? [...catalogMainCategories, ...taxonomyOptions, ...productOptions]
        : [...taxonomyOptions, ...productOptions])]
        .sort(key === 'category' ? (a, b) => catalogMainCategories.indexOf(a) - catalogMainCategories.indexOf(b) : (a, b) => a.localeCompare(b));
      if (catalogSelections[key] && !options.includes(catalogSelections[key])) catalogSelections[key] = '';
      select.innerHTML = `<option value="">${placeholder}</option>${options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
      select.value = catalogSelections[key];
      select.disabled = index > 0 && !catalogSelections[fields[index - 1]];
    });
  };

  const renderCategoryCatalog = () => {
    if (!categoryProductsContainer) return;
    renderCatalogHierarchy();
    const products = categoryCatalog
      .filter((product) => Object.entries(catalogSelections).every(([key, value]) => !value || String(product[key] || '').trim().toLowerCase() === value.toLowerCase()))
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
      if (sort === 'newest') return String(b.createdAt).localeCompare(String(a.createdAt));
      if (sort === 'popularity') return Number(b.popularity) - Number(a.popularity);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    const hierarchyPath = Object.values(catalogSelections).filter(Boolean);
    if (catalogTitle) catalogTitle.textContent = hierarchyPath[hierarchyPath.length - 1] || 'All Categories';
    if (catalogSubtitle) catalogSubtitle.textContent = `${products.length} products${hierarchyPath.length ? ` · ${hierarchyPath.join(' › ')}` : ' · Choose a category to explore'}`;
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

  const openCategoryCatalog = (category, brand = '') => {
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeWishlistPanel();
    closeNotificationsPanel();
    catalogSelections.category = category === 'For You' ? '' : category;
    catalogSelections.subcategory = '';
    catalogSelections.brand = brand;
    catalogSelections.productType = '';
    catalogSelections.model = '';
    renderCategoryCatalog();
    loadCategoryCatalogFromServer();
    categoryCatalogPanel?.classList.remove('hidden');
    categoryCatalogPanel?.setAttribute('aria-hidden', 'false');
  };

  catalogHierarchySelects.forEach(({ key, select }, index) => {
    select?.addEventListener('change', () => {
      const keys = catalogHierarchySelects.map((item) => item.key);
      catalogSelections[key] = select.value;
      keys.slice(index + 1).forEach((dependentKey) => { catalogSelections[dependentKey] = ''; });
      renderCategoryCatalog();
    });
  });

  let homeFeedOffset = 0;
  let homeFeedCursor = null;
  let homeFeedHasMore = true;
  let homeFeedLoading = false;
  let homeFeedTotal = 0;
  let homeFeedRequestId = 0;
  let homeFeedReloadTimer = 0;
  let productSnapshotRefresh = null;
  const feedSentinel = document.getElementById('feedSentinel');
  const feedLoader = document.getElementById('feedLoader');
  const catalogSyncStatus = document.getElementById('catalogSyncStatus');
  const findCartProductId = (item) => {
    const name = String(item.name || '').trim().toLowerCase();
    return Number(item.productId)
      || Number([...getProductCards()].find((card) => card.dataset.name === name)?.dataset.productId)
      || Number(categoryCatalog.find((product) => product.name.toLowerCase() === name)?.productId)
      || 0;
  };
  const applyProductSnapshot = (card, product) => {
    const price = Number(product.price);
    const originalPrice = Number(product.original_price) || 0;
    const stock = Number(product.stock) || 0;
    const oldPrice = card.dataset.price;
    const oldOriginalPrice = card.dataset.originalPrice || '';
    const oldStock = Number(card.dataset.stock);
    card.dataset.price = currency(price);
    card.dataset.originalPrice = originalPrice > price ? currency(originalPrice) : '';
    card.dataset.stock = String(stock);
    const priceLabel = card.querySelector('.product-price');
    if (priceLabel) priceLabel.textContent = currency(price);
    const originalLabel = card.querySelector('.product-original');
    if (originalLabel) {
      originalLabel.textContent = card.dataset.originalPrice;
      originalLabel.classList.toggle('hidden', !card.dataset.originalPrice);
    }
    const discountLabel = card.querySelector('.product-discount');
    if (discountLabel) {
      const discount = Number(product.discount_percent) || 0;
      discountLabel.textContent = discount > 0 ? `-${Math.round(discount)}%` : '';
      discountLabel.classList.toggle('hidden', discount <= 0);
    }
    const image = card.querySelector('.product-image');
    if (image) {
      let stockLabel = image.querySelector('.product-stock-status');
      if (stock <= 5) {
        if (!stockLabel) {
          stockLabel = document.createElement('span');
          stockLabel.className = 'product-stock-status';
          image.append(stockLabel);
        }
        stockLabel.textContent = product.active ? productStockLabel(stock) : 'Unavailable';
      } else {
        stockLabel?.remove();
      }
    }
    return oldPrice !== card.dataset.price
      || oldOriginalPrice !== card.dataset.originalPrice
      || oldStock !== stock;
  };
  const refreshProductSnapshots = async (requestedIds = []) => {
    const ids = [...new Set((requestedIds.length ? requestedIds : [
      ...[...getProductCards()].map((card) => Number(card.dataset.productId)),
      ...categoryCatalog.map((product) => Number(product.productId || product.id)),
      ...searchResultProducts.map((product) => Number(product.id)),
      ...wishlist.map(findCartProductId),
      ...cart.map(findCartProductId)
    ]).filter((id) => Number.isSafeInteger(Number(id)) && Number(id) > 0).map(Number))];
    if (!ids.length) return;
    const refreshKey = [...ids].sort((left, right) => left - right).join(',');
    while (productSnapshotRefresh) {
      if (productSnapshotRefresh.key === refreshKey) return productSnapshotRefresh.promise;
      await productSnapshotRefresh.promise;
    }
    const fetchSnapshots = (async () => {
      const products = [];
      for (let index = 0; index < ids.length; index += 100) {
        const params = new URLSearchParams({ active: '1', limit: '100' });
        ids.slice(index, index + 100).forEach((id) => params.append('id', String(id)));
        const response = await apiRequest(`/api/products?${params}`);
        products.push(...(Array.isArray(response.products) ? response.products : []));
      }
      return products;
    })();
    productSnapshotRefresh = { key: refreshKey, promise: fetchSnapshots };
    let products;
    try {
      products = await fetchSnapshots;
    } finally {
      if (productSnapshotRefresh?.promise === fetchSnapshots) productSnapshotRefresh = null;
    }
    const productsById = new Map(products.map((product) => [Number(product.id), product]));
    searchResultProducts = searchResultProducts.map((product) => {
      if (!ids.includes(Number(product.id))) return product;
      const current = productsById.get(Number(product.id));
      if (!current) {
        product.stock = 0;
        product.active = 0;
        return product;
      }
      product.price = current.price;
      product.original_price = current.original_price;
      product.stock = current.stock;
      return product;
    });
    document.querySelectorAll('[data-search-product]').forEach((result) => {
      if (!ids.includes(Number(result.dataset.searchProduct))) return;
      const current = productsById.get(Number(result.dataset.searchProduct));
      const price = result.querySelector('.search-result-price');
      const details = result.querySelector('.search-result-info small');
      if (!current) {
        result.disabled = true;
        if (price) price.textContent = 'Unavailable';
        if (details) details.textContent = 'This listing is no longer available.';
      } else {
        if (price) price.textContent = currency(current.price);
        if (details) details.textContent = `${current.category} · ${current.brand}${Number(current.stock) > 0 ? '' : ' · Out of stock'}`;
      }
    });
    let catalogChanged = false;
    [...getProductCards()].forEach((card) => {
      const id = Number(card.dataset.productId);
      if (!ids.includes(id)) return;
      const product = productsById.get(id);
      if (product) {
        applyProductSnapshot(card, product);
      } else {
        card.dataset.stock = '0';
        card.dataset.active = 'false';
        card.dataset.price = '';
        card.dataset.originalPrice = '';
        const priceLabel = card.querySelector('.product-price');
        if (priceLabel) priceLabel.textContent = 'Unavailable';
        const originalLabel = card.querySelector('.product-original');
        if (originalLabel) {
          originalLabel.textContent = '';
          originalLabel.classList.add('hidden');
        }
        const discountLabel = card.querySelector('.product-discount');
        if (discountLabel) {
          discountLabel.textContent = '';
          discountLabel.classList.add('hidden');
        }
        const image = card.querySelector('.product-image');
        let stockLabel = image?.querySelector('.product-stock-status');
        if (image && !stockLabel) {
          stockLabel = document.createElement('span');
          stockLabel.className = 'product-stock-status';
          image.append(stockLabel);
        }
        if (stockLabel) stockLabel.textContent = 'Unavailable';
        if (card === activeProductCard && addToCartButton) addToCartButton.disabled = true;
        if (card === activeProductCard && buyNowButton) buyNowButton.disabled = true;
        if (card === activeProductCard && modalStockStatus) modalStockStatus.textContent = 'Unavailable';
      }
    });
    categoryCatalog = categoryCatalog.filter((product) => {
      const id = Number(product.productId || product.id);
      const snapshot = productsById.get(id);
      if (!ids.includes(id)) return true;
      if (!snapshot) {
        catalogChanged = true;
        return false;
      }
      const price = currency(snapshot.price);
      const originalPrice = Number(snapshot.original_price) > Number(snapshot.price)
        ? currency(snapshot.original_price) : '';
      const stock = Number(snapshot.stock) || 0;
      if (product.price !== price || product.originalPrice !== originalPrice || product.stock !== stock) catalogChanged = true;
      product.price = price;
      product.originalPrice = originalPrice;
      product.stock = stock;
      product.discount = Number(snapshot.discount_percent) > 0 ? `-${Math.round(Number(snapshot.discount_percent))}%` : '';
      return true;
    });
    let cartChanged = false;
    cart.forEach((item) => {
      const id = findCartProductId(item);
      if (!id || !ids.includes(id)) return;
      const product = productsById.get(id);
      if (!product) {
        cartChanged ||= item.available !== false || item.stock !== 0;
        item.available = false;
        item.stock = 0;
        return;
      }
      cartChanged ||= item.productId !== product.id || item.name !== product.name
        || Number(item.price) !== Number(product.price) || Number(item.stock) !== Number(product.stock)
        || Number(item.originalPrice) !== (Number(product.original_price) > Number(product.price)
          ? Number(product.original_price) : Number(product.price))
        || item.imageUrl !== (product.image_url || '')
        || item.deliveryInformation !== (product.delivery_information || '')
        || item.available === false;
      item.productId = product.id;
      item.name = product.name;
      item.price = Number(product.price);
      item.originalPrice = Number(product.original_price) > Number(product.price)
        ? Number(product.original_price) : Number(product.price);
      item.imageUrl = product.image_url || '';
      item.deliveryInformation = product.delivery_information || '';
      item.stock = Number(product.stock) || 0;
      item.available = true;
    });
    let wishlistChanged = false;
    wishlist.forEach((item) => {
      const id = findCartProductId(item);
      if (!id || !ids.includes(id)) return;
      const product = productsById.get(id);
      if (!product) {
        wishlistChanged ||= item.available !== false || item.stock !== 0;
        item.available = false;
        item.stock = 0;
        return;
      }
      wishlistChanged ||= item.productId !== product.id || item.name !== product.name
        || Number(item.price) !== Number(product.price) || Number(item.stock) !== Number(product.stock)
        || item.available === false;
      item.productId = product.id;
      item.name = product.name;
      item.price = Number(product.price);
      item.stock = Number(product.stock) || 0;
      item.available = true;
    });
    if (activeProductCard && !modal?.classList.contains('hidden')) {
      const latest = productsById.get(Number(activeProductCard.dataset.productId));
      if (latest) {
        applyProductSnapshot(activeProductCard, latest);
        modalPrice.textContent = currency(latest.price);
        const originalLabel = modal?.querySelector('.modal-original');
        const originalPrice = Number(latest.original_price);
        if (originalLabel) {
          originalLabel.textContent = originalPrice > Number(latest.price) ? currency(originalPrice) : '';
          originalLabel.classList.toggle('hidden', originalPrice <= Number(latest.price));
        }
        if (modalStockStatus) modalStockStatus.textContent = productStockLabel(Number(latest.stock));
        if (addToCartButton) addToCartButton.disabled = Number(latest.stock) <= 0;
        if (buyNowButton) buyNowButton.disabled = Number(latest.stock) <= 0;
      } else if (ids.includes(Number(activeProductCard.dataset.productId))) {
        activeProductCard.dataset.stock = '0';
        activeProductCard.dataset.active = 'false';
        if (modalPrice) modalPrice.textContent = 'Unavailable';
        const originalLabel = modal?.querySelector('.modal-original');
        if (originalLabel) {
          originalLabel.textContent = '';
          originalLabel.classList.add('hidden');
        }
        if (modalStockStatus) modalStockStatus.textContent = 'Unavailable';
        if (addToCartButton) addToCartButton.disabled = true;
        if (buyNowButton) buyNowButton.disabled = true;
      }
    }
    if (catalogChanged && categoryCatalogPanel && !categoryCatalogPanel.classList.contains('hidden')) {
      renderCategoryCatalog();
    }
    if (cartChanged && cartItemsContainer && !cartPanel?.classList.contains('hidden')) renderCart();
    if (wishlistChanged && wishlistPanel && !wishlistPanel.classList.contains('hidden')) openWishlistPanel();
    if (wishlistChanged) localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    if (cartChanged && checkoutPanel && !checkoutPanel.classList.contains('hidden')) {
      renderCheckout();
      const cartUnavailable = cart.some((item) => item.available === false || item.qty > Number(item.stock));
      if (placeOrderButton) placeOrderButton.disabled = cartUnavailable || !paymentConfig?.enabled;
      if (placeCodOrderButton) placeCodOrderButton.disabled = cartUnavailable || !paymentConfig?.cod_enabled;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    if (catalogSyncStatus) {
      catalogSyncStatus.textContent = `Prices and stock updated at ${new Date().toLocaleTimeString()}.`;
    }
  };
  const productMatchesFilters = (product) => {
    const query = searchInput?.value.trim().toLowerCase() || '';
    const category = product.category || '';
    const brand = product.brand || '';
    const subcategory = product.subcategory || '';
    const name = product.name || '';
    const haystack = `${name} ${category} ${subcategory} ${brand} ${product.productType || ''} ${product.model || ''}`.toLowerCase();
    const price = Number(String(product.price || '').replace(/[₹,]/g, '')) || 0;
    const originalPrice = Number(String(product.originalPrice || '').replace(/[₹,]/g, '')) || 0;
    const rating = Number(product.rating || 0);
    const minPrice = Number(priceMinInput?.value || 0);
    const maxPrice = Number(priceMaxInput?.value || Number.MAX_SAFE_INTEGER);
    const selectedCategories = [...getCategoryFilters()].filter((input) => input.checked).map((input) => input.value);
    const selectedBrands = [...getBrandFilters()].filter((input) => input.checked).map((input) => input.value);
    return (!query || haystack.includes(query))
      && price >= minPrice && price <= maxPrice
      && rating >= selectedRating
      && (!selectedCategory || category === selectedCategory)
      && (!selectedCategories.length || selectedCategories.includes(category))
      && (!subcategoryFilter?.value || subcategory.toLowerCase() === subcategoryFilter.value.toLowerCase())
      && (!discountFilter?.checked || originalPrice > price)
      && (!availabilityFilter?.checked || Number(product.stock ?? 0) > 0)
      && (!selectedBrands.length || selectedBrands.includes(brand));
  };
  const feedQueryParams = () => {
    const params = new URLSearchParams({ active: '1', limit: '12', cursor: homeFeedCursor || 'start' });
    const query = searchInput?.value.trim();
    const categories = new Set([...getCategoryFilters()].filter((input) => input.checked).map((input) => input.value));
    if (selectedCategory) categories.add(selectedCategory);
    categories.forEach((category) => params.append('category', category));
    if (query) params.set('q', query);
    if (subcategoryFilter?.value) params.set('subcategory', subcategoryFilter.value);
    [...getBrandFilters()].filter((input) => input.checked).forEach((input) => params.append('brand', input.value));
    if (priceMinInput?.value) params.set('minPrice', priceMinInput.value);
    if (priceMaxInput?.value) params.set('maxPrice', priceMaxInput.value);
    if (selectedRating) params.set('minRating', String(selectedRating));
    if (discountFilter?.checked) params.set('onDiscount', 'true');
    if (availabilityFilter?.checked) params.set('inStock', 'true');
    const sort = sortProducts?.value || 'relevance';
    const sortMap = {
      relevance: '-popularity',
      'price-low': 'price',
      'price-high': '-price',
      rating: '-rating',
      newest: '-newest',
      popularity: '-popularity',
      name: 'name'
    };
    params.set('sort', sortMap[sort] || '-popularity');
    return params;
  };
  const loadHomeFeedBatch = async (reset = false) => {
    if (homeFeedLoading && !reset) return;
    if (!homeFeedHasMore && !reset) return;
    if (reset) {
      homeFeedRequestId += 1;
      homeFeedOffset = 0;
      homeFeedCursor = null;
      homeFeedHasMore = true;
      homeFeedTotal = 0;
      productsContainer?.setAttribute('aria-busy', 'true');
      productsContainer?.replaceChildren();
      infiniteProductsContainer?.replaceChildren();
      if (feedLoader) feedLoader.textContent = 'Loading products…';
    }
    const requestId = ++homeFeedRequestId;
    homeFeedLoading = true;
    let loadedPage = false;
    try {
      const params = feedQueryParams();
      const response = await apiRequest(`/api/products?${params.toString()}`);
      if (requestId !== homeFeedRequestId) return;
      loadedPage = true;
      const products = Array.isArray(response.products) ? response.products : [];
      productsContainer?.setAttribute('aria-busy', 'false');
      products.forEach((product) => {
        const card = [...getProductCards()].find((entry) => Number(entry.dataset.productId) === Number(product.id));
        if (card) applyProductSnapshot(card, product);
      });
      const pagination = response.pagination || {};
      if (pagination.total !== null && pagination.total !== undefined) {
        homeFeedTotal = Number(pagination.total);
      } else {
        homeFeedTotal = homeFeedOffset + products.length;
      }
      homeFeedHasMore = Boolean(pagination.hasMore);
      const target = homeFeedOffset === 0 ? productsContainer : infiniteProductsContainer;
      if (products.length && target) {
        target.insertAdjacentHTML('beforeend', products.map((product) => catalogCardMarkup({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: `₹${Number(product.price || 0).toLocaleString('en-IN')}`,
          rating: String(product.rating || 0),
          reviews: String(product.reviews || 0),
          category: product.category,
          subcategory: product.subcategory || '',
          brand: product.brand,
          productType: product.product_type || '',
          model: product.model || product.name,
          variants: parseProductJson(product.variants_json, {}),
          specifications: parseProductJson(product.specifications_json, {}),
          images: parseProductJson(product.images_json, []),
          imageUrl: product.image_url || '',
          originalPrice: product.original_price ? `₹${Number(product.original_price).toLocaleString('en-IN')}` : '',
          description: product.description || '',
          seller: product.seller || '',
          deliveryInformation: product.delivery_information || '',
          imageClass: safeImageClass(product.image_class),
          stock: Number(product.stock ?? 0),
          createdAt: product.created_at || '',
          popularity: Number(product.popularity || 0),
          discount: Number(product.discount_percent) > 0 ? `-${Number(product.discount_percent)}%` : ''
        })).join(''));
        homeFeedOffset += products.length;
        homeFeedCursor = pagination.nextCursor || null;
        syncWishlistButtons();
      }
      if (filterResultSummary) {
        filterResultSummary.textContent = pagination.total === null
          ? `${homeFeedOffset} products loaded`
          : `${Math.min(homeFeedOffset, homeFeedTotal)} of ${homeFeedTotal} products`;
        filterResultSummary.classList.toggle('visible', Boolean(searchInput?.value.trim() || selectedRating || selectedCategory
          || [...getCategoryFilters()].some((input) => input.checked) || [...getBrandFilters()].some((input) => input.checked)
          || subcategoryFilter?.value || priceMinInput?.value || priceMaxInput?.value
          || discountFilter?.checked || availabilityFilter?.checked || (sortProducts?.value && sortProducts.value !== 'relevance')));
      }
      productsEmpty?.classList.toggle('hidden', homeFeedTotal > 0);
      if (feedLoader) feedLoader.textContent = homeFeedHasMore ? '' : (homeFeedTotal ? 'You’ve reached the end of the catalog.' : '');
    } catch (error) {
      if (requestId === homeFeedRequestId) {
        productsContainer?.setAttribute('aria-busy', 'false');
        if (feedLoader) feedLoader.textContent = `Products could not be loaded: ${error.message}`;
        if (catalogSyncStatus) catalogSyncStatus.textContent = 'Current prices and stock could not be verified; displayed values may be outdated.';
        productsEmpty?.classList.remove('hidden');
      }
    } finally {
      if (requestId === homeFeedRequestId) {
        homeFeedLoading = false;
        if (loadedPage && homeFeedHasMore && feedSentinel
          && feedSentinel.getBoundingClientRect().top < window.innerHeight + 500) {
          window.setTimeout(() => loadHomeFeedBatch(), 0);
        }
      }
    }
  };
  const scheduleHomeFeedReload = () => {
    window.clearTimeout(homeFeedReloadTimer);
    homeFeedReloadTimer = window.setTimeout(() => loadHomeFeedBatch(true), 180);
  };
  let catalogRefreshTimer = 0;
  let lastCatalogRefreshAt = 0;
  const refreshVisibleCatalog = () => {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - lastCatalogRefreshAt < 30000) return;
    window.clearTimeout(catalogRefreshTimer);
    catalogRefreshTimer = window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      lastCatalogRefreshAt = Date.now();
      refreshProductSnapshots().catch((error) => {
        if (catalogSyncStatus) catalogSyncStatus.textContent = `Prices and stock could not be refreshed: ${error.message}`;
      });
    }, 200);
  };
  document.addEventListener('visibilitychange', refreshVisibleCatalog);
  window.addEventListener('focus', refreshVisibleCatalog);
  window.setInterval(refreshVisibleCatalog, 300000);
  const loadProductFacets = async () => {
    try {
      const facets = await apiRequest('/api/products/facets');
      const categories = facets.categories || [];
      catalogMainCategories = categories;
      catalogTaxonomy = facets.catalog || [];
      if (categoryNavigation) {
        const categoryIcons = {
          Fashion: '👗', Mobiles: '📱', Electronics: '🎧', 'Home & Kitchen': '🏠',
          'Beauty & Personal Care': '💄', Grocery: '🍱', Furniture: '🪑',
          Appliances: '🫖', Footwear: '👟', Books: '📚', 'Toys & Games': '🧸',
          'Sports & Fitness': '🏸', Automotive: '🛵', 'Jewellery & Watches': '⌚',
          'Health & Personal Care': '🩺', 'Baby & Kids': '🍼', 'Pet Supplies': '🐾',
          'Office & Stationery': '✏️', 'Musical Instruments': '🎸',
          'Tools & Home Improvement': '🛠️', 'Luggage & Travel': '🧳',
          'Garden & Outdoors': '🌱', 'Arts, Crafts & Sewing': '🎨',
          'Digital Products': '💾', 'Industrial & Scientific': '🔬',
          'Collectibles & Art': '🖼️'
        };
        categoryNavigation.innerHTML = `
          <button class="category-pill ${selectedCategory ? '' : 'active'}" data-category="For You" aria-pressed="${selectedCategory ? 'false' : 'true'}" type="button"><span class="category-icon">✨</span><span>For You</span></button>
          ${categories.map((name) => `
            <button class="category-pill ${selectedCategory === name ? 'active' : ''}" data-category="${escapeHtml(name)}" aria-pressed="${selectedCategory === name}" type="button"><span class="category-icon">${categoryIcons[name] || '🛍️'}</span><span>${escapeHtml(name)}</span></button>
          `).join('')}
        `;
      }
      const replaceCategoryOptions = (select, placeholder, includeOther = false) => {
        if (!select) return;
        const current = select.value;
        const names = includeOther ? [...categories, 'Other'] : categories;
        select.innerHTML = `${placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : ''}${names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
        if (names.includes(current)) select.value = current;
      };
      replaceCategoryOptions(sellerForm?.elements.namedItem('category'), 'Choose a category', true);
      replaceCategoryOptions(sellerProductForm?.elements.namedItem('category'), '', false);
      renderCatalogHierarchy();
      if (subcategoryFilter) {
        const selected = subcategoryFilter.value;
        subcategoryFilter.innerHTML = '<option value="">All sub-categories</option>'
          + (facets.subcategories || []).map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
        subcategoryFilter.value = selected;
      }
      if (categoryFilterOptions) {
        const selected = new Set([...getCategoryFilters()].filter((input) => input.checked).map((input) => input.value));
        categoryFilterOptions.innerHTML = (facets.categories || []).map((name) => `
          <label><input class="category-filter" type="checkbox" value="${escapeHtml(name)}" ${selected.has(name) ? 'checked' : ''} /> ${escapeHtml(name)}</label>
        `).join('');
      }
      if (brandFilterOptions) {
        brandFilterOptions.innerHTML = (facets.brands || []).map((name) => `
          <label><input class="brand-filter" type="checkbox" value="${escapeHtml(name)}" /> ${escapeHtml(name)}</label>
        `).join('');
      }
    } catch (error) {
      showToast(`Product filters could not be loaded: ${error.message}`, 'error');
    }
  };
  if (feedSentinel && 'IntersectionObserver' in window) {
    const feedObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadHomeFeedBatch();
    }, { rootMargin: '500px 0px' });
    feedObserver.observe(feedSentinel);
  } else if (feedSentinel) {
    window.addEventListener('scroll', () => {
      if (feedSentinel.getBoundingClientRect().top < window.innerHeight + 500) loadHomeFeedBatch();
    }, { passive: true });
  }
  const syncWishlistButtons = () => {
    document.querySelectorAll('.wishlist-btn').forEach((button) => {
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
          <span>${currency(item.price)}${item.available === false ? ' · Unavailable' : Number(item.stock) === 0 ? ' · Out of stock' : item.stock <= 5 ? ` · ${productStockLabel(Number(item.stock))}` : ''}</span>
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

  localStorage.removeItem(AUTH_USERS_STORAGE_KEY);

  const loadAuthSession = () => {
    try {
      const savedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
      const parsedSession = savedSession ? JSON.parse(savedSession) : null;
      return parsedSession && parsedSession.email && typeof parsedSession.token === 'string' && parsedSession.token
        ? parsedSession
        : null;
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
      return parsedSession && parsedSession.email && typeof parsedSession.token === 'string' && parsedSession.token
        ? parsedSession
        : null;
    } catch (error) {
      return null;
    }
  };
  loadHomeFeedBatch(true);
  loadProductFacets();
  loadCategoryCatalogFromServer();

  const renderAccountState = () => {
    const signedIn = Boolean(currentUser);
    if (moreMenuGreeting) moreMenuGreeting.textContent = signedIn ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Welcome to Nexora';
    if (moreMenuSignup) moreMenuSignup.classList.toggle('hidden', signedIn);
    const loginMenuLabel = moreMenuLogin?.querySelector('span');
    if (loginMenuLabel) loginMenuLabel.textContent = signedIn ? 'My Account' : 'Login';
    if (!accountTitle || !accountSubtitle || !accountAuthTitle || !accountAuthHint || !accountAuthAction) return;
    if (currentUser) {
      const firstName = currentUser.name.split(' ')[0];
      accountAvatar.textContent = '✨';
      accountTitle.textContent = `Hey, ${firstName}`;
      accountSubtitle.textContent = currentUser.email;
      accountAuthTitle.textContent = `Hi ${firstName}, welcome back`;
      accountAuthHint.textContent = 'Your account is ready for a faster checkout.';
      accountLoginAction?.classList.add('hidden');
      accountAuthAction.textContent = 'Log out';
    } else {
      accountAvatar.textContent = '👤';
      accountTitle.textContent = 'Hey, User';
      accountSubtitle.textContent = 'Manage your account';
      accountAuthTitle.textContent = 'Welcome to Nexora';
      accountAuthHint.textContent = 'Sign in to unlock your personalized shopping experience.';
      accountLoginAction?.classList.remove('hidden');
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
    setAuthError();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setAuthError('Please enter a valid email address.');

    if (authMode === 'signup') {
      const name = authNameInput?.value.trim() || '';
      const confirmPassword = authConfirmPasswordInput?.value || '';
      if (!/^[A-Za-z\u00C0-\u024F\u0900-\u097F .'-]{2,80}$/.test(name)) return setAuthError('Please enter a valid full name.');
      if (password.length < 8) return setAuthError('Password must be at least 8 characters.');
      if (password !== confirmPassword) return setAuthError('Passwords do not match.');
      apiRequest('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) })
        .then((result) => {
          currentUser = { ...result.user, token: result.token };
          saveAuthSession(currentUser, rememberMeInput?.checked !== false);
          renderAccountState();
          closeAuthPanel();
          showToast(`Welcome to Nexora, ${result.user.name.split(' ')[0]}!`);
          authForm.reset();
          setAuthMode('login');
          syncAccountData();
        })
        .catch((error) => {
          setAuthError(error.message);
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
        setAuthError(error.status === 401 ? 'Email or password is incorrect.' : error.message);
      });
  };

  currentUser = getAuthSession();
  renderAccountState();

  const customerOrderFromApi = (order) => ({
    id: `NX-${order.id}`,
    apiId: order.id,
    total: order.total,
    status: ({
      payment_pending: 'Awaiting payment',
      payment_failed: 'Payment failed',
      payment_issue: 'Payment issue',
      pending: 'Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    })[order.status] || order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    createdAt: order.created_at,
    items: (order.items || []).map((item) => ({
      apiId: item.id,
      name: item.product_name,
      price: item.unit_price,
      qty: item.quantity,
      imageClass: 'product-one',
      fulfillmentStatus: item.fulfillment_status,
      deliveredAt: item.delivered_at,
      trackingProvider: item.tracking_provider,
      trackingNumber: item.tracking_number,
      trackingUrl: item.tracking_url,
      trackingUpdatedAt: item.tracking_updated_at,
      returnId: item.return_id,
      returnStatus: item.return_status,
      refundStatus: item.refund_status,
      refundReviewRequired: Boolean(item.refund_review_required)
    }))
  });

  const syncAccountData = async () => {
    if (!currentUser?.token) return;
    try {
      const [profileResult, addressResult, orderResult, serverCartResult, serverWishlistResult, rewardsResult, giftCardsResult] = await Promise.all([
        apiRequest('/api/auth/me'),
        apiRequest('/api/addresses'),
        apiRequest('/api/orders'),
        apiRequest('/api/cart'),
        apiRequest('/api/wishlist'),
        apiRequest('/api/rewards'),
        apiRequest('/api/gift-cards')
      ]);
      renderRewards(rewardsResult.rewards);
      renderGiftCards(giftCardsResult.giftCards);
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
      orders = (orderResult.orders || []).map(customerOrderFromApi);
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
      applyAddressToCheckout(selectedAddress(), { savePincode: true });
      try {
        await loadNotificationPreferences();
      } catch (error) {
        console.warn('Unable to sync notification preferences with the account.', error);
      }
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
        applyAddressToCheckout(selectedAddress(), { savePincode: true });
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
        applyAddressToCheckout(selectedAddress(), { savePincode: true });
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

  const setActiveNavItem = (destination) => {
    navItems.forEach((item) => {
      const active = item.dataset.nav === destination;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    assistantLauncher?.classList.toggle('hidden', destination !== 'home');
    if (destination !== 'home') {
      assistantPanel?.classList.add('hidden');
      assistantPanel?.setAttribute('aria-hidden', 'true');
      assistantLauncher?.setAttribute('aria-expanded', 'false');
    }
  };

  const showHome = () => {
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeOrdersPanel();
    closeAccountPanel();
    closeWishlistPanel();
    closeCategoryCatalog();
    if (appPage) appPage.dataset.currentView = 'home';
    setActiveNavItem('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderOrders = () => {
    if (!ordersList) return;
    const orderStages = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    const isReturnEligible = (item) => {
      if (item.fulfillmentStatus !== 'delivered' || item.returnId || !item.deliveredAt) return false;
      const deliveredAt = Date.parse(`${String(item.deliveredAt).replace(' ', 'T')}Z`);
      const age = Date.now() - deliveredAt;
      return Number.isFinite(deliveredAt) && age >= 0 && age <= 7 * 24 * 60 * 60 * 1000;
    };
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
                <span>Qty: ${item.qty} · ${escapeHtml(item.fulfillmentStatus || 'pending')}</span>
                ${item.trackingUrl ? `<a class="order-tracking-link" href="${escapeHtml(item.trackingUrl)}" target="_blank" rel="noopener noreferrer">Track with ${escapeHtml(item.trackingProvider || 'carrier')}</a>` : ''}
                ${item.returnStatus ? `<span>Return: ${escapeHtml(item.returnStatus)} · ${item.refundReviewRequired ? 'Refund review required; no refund has been issued' : 'No payment/refund applies to this demo order'}</span>` : ''}
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
        ${(order.status === 'Awaiting payment' || order.status === 'Payment failed' || (order.status === 'Placed' && order.paymentStatus !== 'captured')) ? `<button class="order-details-btn order-cancel-btn" type="button" data-order-cancel="${escapeHtml(order.id)}">Cancel order</button>` : ''}
        ${order.items.some(isReturnEligible) ? `
          <button class="order-details-btn order-return-btn" type="button" data-order-return-open="${escapeHtml(order.id)}" aria-expanded="false">Request return (within 7 days of delivery)</button>
          <form class="order-return-form hidden" data-order-return-form="${escapeHtml(order.id)}">
            <label>Return reason<textarea name="reason" minlength="3" maxlength="500" rows="3" required placeholder="Tell the seller why you want to return this item"></textarea></label>
            <button class="order-details-btn" type="submit">Submit return request</button>
          </form>
        ` : ''}
        ${order.status === 'Cancelled'
          ? `<p class="order-demo-note">${order.paymentStatus === 'not_collected' ? 'This demo order was cancelled; no payment was collected.' : 'This order was cancelled.'}</p>`
          : order.status === 'Payment issue'
            ? '<p class="order-demo-note">Payment was received, but stock changed before confirmation. Contact Nexora support for refund assistance.</p>'
          : `<div class="order-status-tracker" aria-label="Order status">
            ${orderStages.map((stage, index) => {
              const currentIndex = order.paymentStatus === 'created'
                ? -1
                : Math.max(0, orderStages.indexOf(order.status));
              const isComplete = index <= currentIndex;
              return `
                ${index > 0 ? `<div class="status-line ${index <= currentIndex ? 'complete' : ''}"></div>` : ''}
                <div class="status-step ${isComplete ? 'active' : ''}">
                  <span>${isComplete ? '✓' : index + 1}</span>
                  <small>${stage}</small>
                </div>
              `;
            }).join('')}
          </div>`}
        ${order.paymentStatus === 'captured'
          ? '<p class="order-demo-note">Payment captured securely. Shipment tracking will appear after the seller ships your order.</p>'
          : order.paymentStatus === 'created'
            ? '<p class="order-demo-note">Payment is not complete. This order will not be fulfilled until payment succeeds.</p>'
            : order.paymentStatus === 'not_collected'
              ? '<p class="order-demo-note">Demo order only · no payment collected or delivery arranged.</p>'
                : order.paymentStatus === 'pending_collection'
                  ? '<p class="order-demo-note">Cash on delivery · pay the courier when your order arrives.</p>'
                : ''}
      </article>
    `).join('');
    ordersList.querySelectorAll('[data-order-details]').forEach((button) => {
      button.addEventListener('click', () => {
        const order = orders.find((item) => item.id === button.dataset.orderDetails);
        if (order) openOrderDetailsPanel(order);
      });
    });
    ordersList.querySelectorAll('[data-order-cancel]').forEach((button) => {
      button.addEventListener('click', async () => {
        const order = orders.find((item) => item.id === button.dataset.orderCancel);
        if (!order?.apiId) return;
        button.disabled = true;
        try {
          await apiRequest(`/api/orders/${order.apiId}/cancel`, { method: 'POST' });
          await syncAccountData();
          renderOrders();
          showToast('Order cancelled.');
        } catch (error) {
          button.disabled = false;
          showToast(error.message, 'error');
        }
      });
    });
    ordersList.querySelectorAll('[data-order-return-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const form = ordersList.querySelector(`[data-order-return-form="${button.dataset.orderReturnOpen}"]`);
        if (!form) return;
        const isOpening = form.classList.contains('hidden');
        form.classList.toggle('hidden', !isOpening);
        button.setAttribute('aria-expanded', String(isOpening));
      });
    });
    ordersList.querySelectorAll('[data-order-return-form]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const order = orders.find((item) => item.id === form.dataset.orderReturnForm);
        if (!order?.apiId) return;
        const orderItemIds = order.items
          .filter(isReturnEligible)
          .map((item) => item.apiId);
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        try {
          await apiRequest(`/api/orders/${order.apiId}/returns`, {
            method: 'POST',
            body: JSON.stringify({ order_item_ids: orderItemIds, reason: form.elements.namedItem('reason').value.trim() })
          });
          await syncAccountData();
          renderOrders();
          showToast('Return request submitted.');
        } catch (error) {
          if (submitButton) submitButton.disabled = false;
          showToast(error.message, 'error');
        }
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
            <div><strong>${escapeHtml(item.name || item.product_name || 'Product')}</strong><small>${item.qty || item.quantity || 1} × ${currency(item.price || item.unit_price || 0)} · ${escapeHtml(item.fulfillmentStatus || 'pending')}${item.returnStatus ? ` · Return ${escapeHtml(item.returnStatus)}` : ''}</small></div>
            <strong>${currency((item.price || item.unit_price || 0) * (item.qty || item.quantity || 1))}</strong>
          </div>
        `).join('')}
      </div>
      <div class="order-details-total"><span>Order total</span><strong>${currency(order.total)}</strong></div>
      <p class="order-demo-note">${order.paymentStatus === 'captured'
        ? 'Payment was captured by Razorpay. Carrier tracking is not connected; any approved refund requires separate support processing.'
        : order.paymentStatus === 'created'
          ? 'Payment has not been completed. Seller fulfillment will not start until payment is captured.'
          : 'Demo order only. Payment was not collected; return decisions do not transfer money.'}</p>
    `;
    orderDetailsPanel.classList.remove('hidden');
    orderDetailsPanel.setAttribute('aria-hidden', 'false');
  };

  const openOrdersPanel = async () => {
    if (!ordersPanel) return;
    closeCartPanel();
    closeCheckoutPanel();
    closeOrderConfirmation();
    closeAccountPanel();
    closeProfilePanel();
    closeOrderDetailsPanel();
    ordersPanel.classList.remove('hidden');
    ordersPanel.setAttribute('aria-hidden', 'false');
    if (currentUser?.token) {
      try {
        const result = await apiRequest('/api/orders');
        orders = (result.orders || []).map(customerOrderFromApi);
        saveOrders(orders);
      } catch (error) {
        showToast(`Unable to refresh your orders: ${error.message}`, 'error');
      }
    }
    renderOrders();
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error('Secure payment could not be loaded. Check your internet connection.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Secure payment could not be loaded. Check your internet connection.'));
    document.head.append(script);
  });

  const loadPaymentConfig = async () => {
    paymentConfig = await apiRequest('/api/payments/razorpay/config');
    if (paymentModeNotice) {
      paymentModeNotice.textContent = paymentConfig.enabled
        ? paymentConfig.mode === 'test'
          ? 'Razorpay test mode is active. Test payments only; cash on delivery is also available.'
          : paymentConfig.cod_enabled
            ? 'Razorpay live payments are enabled. Cash on delivery is also available.'
            : 'Razorpay live payments are enabled. Cash on delivery is disabled on this server.'
        : paymentConfig.cod_enabled
          ? 'Razorpay is unavailable until configured. Cash on delivery is available.'
          : 'Razorpay and cash on delivery are unavailable on this server.';
    }
    const inventoryUnavailable = cart.some((item) => item.available === false || item.qty > Number(item.stock));
    if (placeOrderButton) placeOrderButton.disabled = !paymentConfig.enabled || inventoryUnavailable;
    if (placeCodOrderButton) placeCodOrderButton.disabled = !paymentConfig.cod_enabled || inventoryUnavailable;
  };

  const openOrderConfirmation = async () => {
    if (!orderConfirmation || !cart.length) return;
    if (!currentUser?.token) {
      showToast('Please login to pay and save your order securely.', 'error');
      openAuthPanel('login');
      return;
    }
    if (!paymentConfig?.enabled) {
      showToast('Secure payments are not configured on this server yet.', 'error');
      return;
    }
    const apiItems = await cartItemsForApi(cart);
    if (apiItems.length !== cart.length || cart.some((item) => item.available === false || item.qty > Number(item.stock))) {
      throw new Error('A cart item is unavailable or has insufficient stock. Update your cart before checkout.');
    }
    const selected = selectedAddress();
    const paymentOrder = await apiRequest('/api/payments/razorpay/orders', {
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
        use_gift_card_balance: false,
        items: apiItems
      })
    });
    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = currency(paymentOrder.subtotal);
    if (checkoutDeliveryEl) checkoutDeliveryEl.textContent = currency(paymentOrder.delivery_fee);
    if (checkoutDiscountEl) checkoutDiscountEl.textContent = `-${currency(paymentOrder.discount)}`;
    if (checkoutGiftCardDiscountEl) checkoutGiftCardDiscountEl.textContent = `-${currency(0)}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = currency(paymentOrder.total);
    if (checkoutItemsContainer) {
      checkoutItemsContainer.innerHTML = paymentOrder.items.map((item) => `
        <div class="checkout-item">
          <span class="checkout-item-name">${escapeHtml(item.name)}</span>
          <span class="checkout-item-quantity">${Number(item.quantity)}</span>
          <strong>${currency(item.unit_price * item.quantity)}</strong>
        </div>
      `).join('');
    }
    await loadRazorpayScript();
    const options = {
      key: paymentOrder.key_id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'Nexora',
      description: `Order NX-${paymentOrder.order_id}`,
      order_id: paymentOrder.razorpay_order_id,
      prefill: {
        name: selected?.name || addressNameInput.value.trim(),
        email: currentUser.email || '',
        contact: selected?.mobile || addressMobileInput.value.trim()
      },
      theme: { color: '#6b4eff' },
      handler: async (response) => {
        try {
          const verified = await apiRequest('/api/payments/razorpay/verify', {
            method: 'POST',
            body: JSON.stringify({ order_id: paymentOrder.order_id, ...response })
          });
          const paidOrder = customerOrderFromApi(verified.order);
          orders = [paidOrder, ...orders.filter((item) => item.apiId !== paidOrder.apiId)];
          saveOrders(orders);
          if (orderIdEl) orderIdEl.textContent = paidOrder.id;
          if (confirmationTitle) confirmationTitle.textContent = 'Payment confirmed';
          if (confirmationNote) confirmationNote.textContent = 'Payment received securely. Shipment status and tracking details will appear in your orders after the seller ships.';
          addNotification('order', 'Payment confirmed', `Your payment for ${paidOrder.id} was captured successfully.`, '✅');
          cart = buyNowCartContext?.remainingCart || [];
          buyNowCartContext = null;
          appliedCoupon = null;
          if (couponInput) couponInput.value = '';
          saveCart();
          updateCartCount();
          renderCart();
          closeCheckoutPanel();
          orderConfirmation.classList.remove('hidden');
          orderConfirmation.setAttribute('aria-hidden', 'false');
          showToast('Payment confirmed');
        } catch (error) {
          showToast(error.message || 'Payment verification is pending. Check My Orders before retrying.', 'error');
        }
      },
      modal: {
        ondismiss: () => showToast('Payment was not completed. No order was confirmed.', 'info')
      },
      retry: { enabled: true }
    };
    const checkout = new window.Razorpay(options);
    checkout.on('payment.failed', (event) => {
      showToast(event.error?.description || 'Payment failed. You can try again.', 'error');
    });
    checkout.open();
  };

  const openCodOrderConfirmation = async () => {
    if (!orderConfirmation || !cart.length) return;
    if (!currentUser?.token) {
      showToast('Please login to save your order securely.', 'error');
      openAuthPanel('login');
      return;
    }
    const items = await cartItemsForApi(cart);
    if (items.length !== cart.length || cart.some((item) => item.available === false || item.qty > Number(item.stock))) {
      throw new Error('A cart item is unavailable or has insufficient stock. Update your cart before checkout.');
    }
    const selected = selectedAddress();
    const result = await apiRequest('/api/orders/cod', {
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
        use_gift_card_balance: false,
        items
      })
    });
    const placedOrder = customerOrderFromApi(result.order);
    orders = [placedOrder, ...orders.filter((item) => item.apiId !== placedOrder.apiId)];
    saveOrders(orders);
    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = currency(result.order.subtotal);
    if (checkoutDeliveryEl) checkoutDeliveryEl.textContent = currency(result.order.delivery_fee);
    if (checkoutDiscountEl) checkoutDiscountEl.textContent = `-${currency(result.order.discount)}`;
    if (checkoutGiftCardDiscountEl) checkoutGiftCardDiscountEl.textContent = `-${currency(0)}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = currency(result.order.total);
    if (orderIdEl) orderIdEl.textContent = placedOrder.id;
    if (confirmationTitle) confirmationTitle.textContent = 'Order placed';
    if (confirmationNote) confirmationNote.textContent = 'Your order is confirmed. Pay cash on delivery; delivery is estimated in 3–5 business days.';
    cart = buyNowCartContext?.remainingCart || [];
    buyNowCartContext = null;
    appliedCoupon = null;
    if (couponInput) couponInput.value = '';
    saveCart();
    updateCartCount();
    renderCart();
    closeCheckoutPanel();
    orderConfirmation.classList.remove('hidden');
    orderConfirmation.setAttribute('aria-hidden', 'false');
    showToast(result.email_sent
      ? 'COD order placed; confirmation email sent.'
      : 'COD order placed; confirmation email could not be sent.');
  };

  const renderCheckout = () => {
    if (!checkoutItemsContainer || !checkoutSubtotalEl || !checkoutDeliveryEl || !checkoutDiscountEl || !checkoutTotalEl) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.available === false ? 0 : item.qty * item.price), 0);
    const delivery = subtotal > 0 ? 40 : 0;
    const discount = getCouponDiscount(subtotal);
    const giftCardDiscount = 0;
    checkoutSubtotalEl.textContent = currency(subtotal);
    checkoutDeliveryEl.textContent = currency(delivery);
    checkoutDiscountEl.textContent = `-${currency(discount)}`;
    if (checkoutGiftCardDiscountEl) checkoutGiftCardDiscountEl.textContent = `-${currency(giftCardDiscount)}`;
    checkoutTotalEl.textContent = currency(subtotal + delivery - discount - giftCardDiscount);
    checkoutItemsContainer.innerHTML = cart.map((item) => `
      <div class="checkout-item">
        <span class="checkout-item-name">${escapeHtml(item.name)}</span>
        <span class="checkout-item-quantity">${item.qty}</span>
        <strong>${item.available === false ? 'Unavailable' : currency(item.price * item.qty)}</strong>
        <small class="cart-stock-status">${item.available === false ? 'Unavailable' : Number(item.stock) === 0 ? 'Out of stock' : item.qty > Number(item.stock) ? `Only ${Number(item.stock)} left; reduce quantity` : item.stock <= 5 ? productStockLabel(Number(item.stock)) : ''}</small>
      </div>
    `).join('');
  };

  const openCheckoutPanel = async () => {
    if (!checkoutPanel || !cart.length) return;
    if (checkoutBtn) checkoutBtn.disabled = true;
    try {
      const items = await cartItemsForApi(cart);
      if (items.length !== cart.length || cart.some((item) => item.available === false || item.qty > Number(item.stock))) {
        renderCart();
        showToast('A cart item is unavailable or has insufficient stock. Update your cart before checkout.', 'error');
        if (buyNowCartContext) closeCheckoutPanel();
        return;
      }
    } catch (error) {
      renderCart();
      showToast(`Current prices and stock could not be verified: ${error.message}`, 'error');
      if (buyNowCartContext) closeCheckoutPanel();
      return;
    }
    closeCartPanel();
    renderCheckout();
    checkoutPanel.classList.remove('hidden');
    checkoutPanel.setAttribute('aria-hidden', 'false');
    if (placeOrderButton) placeOrderButton.disabled = true;
    if (placeCodOrderButton) placeCodOrderButton.disabled = true;
    loadPaymentConfig().catch((error) => {
      if (paymentModeNotice) paymentModeNotice.textContent = error.message || 'Could not check payment availability.';
      showToast(error.message || 'Could not check payment availability.', 'error');
    });
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
    notificationButton.addEventListener('click', () => {
      closeMoreMenu();
      openNotificationsPanel();
    });
  }
  serviceActionButtons.forEach((button) => {
    button.addEventListener('click', () => openServicePanel(button.dataset.serviceAction));
  });
  document.querySelectorAll('[data-close-service]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.dataset.closeService);
      panel?.classList.add('hidden');
      panel?.setAttribute('aria-hidden', 'true');
    });
  });
  servicePanels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
      if (event.target !== panel) return;
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
    });
  });
  if (notificationPreferencesForm) {
    notificationPreferencesForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = notificationPreferencesForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (notificationPreferencesFeedback) notificationPreferencesFeedback.textContent = '';
      try {
        const formData = new FormData(notificationPreferencesForm);
        const result = await apiRequest('/api/notification-preferences', {
          method: 'PUT',
          body: JSON.stringify({
            offers: formData.get('offers') === 'on',
            orders: formData.get('orders') === 'on',
            messages: formData.get('messages') === 'on'
          })
        });
        notificationPreferences = {
          offers: result.preferences.offers,
          orders: result.preferences.orders,
          messages: result.preferences.messages
        };
        persistNotificationPreferences();
        if (notificationPreferencesFeedback) notificationPreferencesFeedback.textContent = 'Your notification preferences have been saved.';
        showToast('Notification settings updated.');
      } catch (error) {
        if (notificationPreferencesFeedback) notificationPreferencesFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  const renderSellerPhotos = () => {
    if (!sellerPhotoList) return;
    sellerPhotoList.innerHTML = sellerCurrentImages.map((url, index) => `
      <div class="seller-photo-item"><img src="${escapeHtml(url)}" alt="Product photo ${index + 1}" loading="lazy" decoding="async" />
        <button type="button" data-seller-photo-remove="${index}" aria-label="Remove product photo ${index + 1}">×</button>
      </div>
    `).join('');
  };
  const optimizeSellerPhoto = async (file) => {
    if (typeof createImageBitmap !== 'function') return file;
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      throw new Error(`${file.name} could not be decoded as an image.`);
    }
    try {
      if (bitmap.width * bitmap.height > 40_000_000) {
        throw new Error(`${file.name} has too many pixels to upload safely.`);
      }
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) return file;
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const optimized = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
      return optimized && optimized.size < file.size
        ? new Blob([optimized], { type: 'image/webp' })
        : file;
    } finally {
      bitmap.close();
    }
  };
  const sellerProductPayload = async () => {
    const form = sellerProductForm;
    if (!form) throw new Error('Seller product form is unavailable');
    const formData = new FormData(form);
    const photoFiles = [...(form.elements.namedItem('photos')?.files || [])];
    if (sellerCurrentImages.length + photoFiles.length > 10) throw new Error('A product can have up to 10 photos');
    const addedImages = [];
    try {
      for (const file of photoFiles) {
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB`);
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error(`${file.name} is not a JPEG, PNG or WebP image`);
        const uploadFile = await optimizeSellerPhoto(file);
        if (uploadFile.size > 5 * 1024 * 1024) throw new Error(`${file.name} remains larger than 5 MB after optimization`);
        const uploaded = await apiRequest('/api/seller/products/images', {
          method: 'POST',
          headers: { 'Content-Type': uploadFile.type || file.type },
          body: uploadFile
        });
        addedImages.push(uploaded.url);
      }
      const variants = {};
      let otherVariants = {};
      const otherVariantsInput = String(formData.get('variants_json') || '').trim();
      if (otherVariantsInput) {
        otherVariants = JSON.parse(otherVariantsInput);
        if (!otherVariants || typeof otherVariants !== 'object' || Array.isArray(otherVariants)) {
          throw new Error('Other variants must be a JSON object of option arrays.');
        }
      }
      ['size', 'color', 'storage'].forEach((key) => {
        variants[key] = String(formData.get(key) || '').split(',').map((value) => value.trim()).filter(Boolean);
      });
      Object.assign(variants, otherVariants);
      return {
        addedImages,
        payload: {
          name: formData.get('name'),
          category: formData.get('category'),
          subcategory: formData.get('subcategory'),
          brand: formData.get('brand'),
          product_type: formData.get('product_type'),
          model: formData.get('model'),
          price: Number(formData.get('price')),
          discount_percent: Number(formData.get('discount_percent') || 0),
          stock: Number(formData.get('stock')),
          variants_json: JSON.stringify(variants),
          specifications_json: JSON.stringify(JSON.parse(String(formData.get('specifications_json') || '{}'))),
          images_json: JSON.stringify([...sellerCurrentImages, ...addedImages]),
          image_url: [...sellerCurrentImages, ...addedImages][0] || '',
          description: formData.get('description'),
          delivery_information: formData.get('delivery_information')
        }
      };
    } catch (error) {
      const cleanup = await Promise.allSettled(addedImages.map((url) => apiRequest('/api/seller/products/images', {
        method: 'DELETE',
        body: JSON.stringify({ url })
      })));
      if (cleanup.some((result) => result.status === 'rejected')) {
        throw new Error(`${error.message}. One or more uploaded photos could not be cleaned up.`);
      }
      throw error;
    }
  };
  const loadSellerProducts = async () => {
    if (!sellerProductList) return;
    const { products } = await apiRequest('/api/seller/products');
    sellerProductList.innerHTML = products.length ? products.map((product) => `
      <article class="seller-product-card">
        <img src="${escapeHtml(product.image_url || 'assets/placeholder.svg')}" alt="" loading="lazy" decoding="async" />
        <div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.brand || '')} · ${escapeHtml(product.category || '')} · Stock: ${Number(product.stock) || 0}</small>
          <span>${currency(product.price)}${product.original_price ? ` <del>${currency(product.original_price)}</del>` : ''}</span>
        </div>
        <div class="seller-product-card-actions"><button type="button" data-seller-edit="${product.id}">Edit</button><button type="button" data-seller-delete="${product.id}">Delete</button></div>
      </article>
    `).join('') : '<p class="seller-empty">No products yet. Add your first listing to get started.</p>';
    sellerProductList.querySelectorAll('[data-seller-edit]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = products.find((entry) => entry.id === Number(button.dataset.sellerEdit));
        if (!product || !sellerProductForm) return;
        sellerProductForm.reset();
        sellerProductForm.elements.namedItem('product_id').value = product.id;
        ['name', 'category', 'subcategory', 'brand', 'product_type', 'model', 'price', 'stock', 'description', 'delivery_information'].forEach((key) => {
          sellerProductForm.elements.namedItem(key).value = product[key] ?? '';
        });
        sellerProductForm.elements.namedItem('specifications_json').value = JSON.stringify(JSON.parse(product.specifications_json || '{}'), null, 2);
        const variants = JSON.parse(product.variants_json || '{}');
        ['size', 'color', 'storage'].forEach((key) => {
          sellerProductForm.elements.namedItem(key).value = Array.isArray(variants[key]) ? variants[key].join(', ') : '';
        });
        const otherVariants = Object.fromEntries(Object.entries(variants).filter(([key]) => !['size', 'color', 'storage'].includes(key)));
        sellerProductForm.elements.namedItem('variants_json').value = Object.keys(otherVariants).length ? JSON.stringify(otherVariants, null, 2) : '';
        const discount = product.original_price > product.price
          ? Math.round((1 - product.price / product.original_price) * 1000) / 10
          : 0;
        sellerProductForm.elements.namedItem('discount_percent').value = discount;
        sellerCurrentImages = JSON.parse(product.images_json || '[]');
        renderSellerPhotos();
        const title = document.getElementById('sellerProductFormTitle');
        if (title) title.textContent = 'Edit product';
        sellerProductForm.classList.remove('hidden');
        sellerProductForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    sellerProductList.querySelectorAll('[data-seller-delete]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!window.confirm('Delete this product listing?')) return;
        button.disabled = true;
        try {
          await apiRequest(`/api/seller/products/${button.dataset.sellerDelete}`, { method: 'DELETE' });
          await loadSellerProducts();
          if (sellerProductFeedback) sellerProductFeedback.textContent = 'Product deleted.';
        } catch (error) {
          if (sellerProductFeedback) sellerProductFeedback.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });
    });
  };
  sellerProductImportFile?.addEventListener('change', async () => {
    const file = sellerProductImportFile.files?.[0];
    if (!file) return;
    if (sellerProductFeedback) sellerProductFeedback.textContent = `Importing ${file.name}…`;
    try {
      const result = await apiRequest('/api/seller/products/import', {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file
      });
      await loadSellerProducts();
      if (sellerProductFeedback) sellerProductFeedback.textContent = `Import complete: ${result.results.created} created, ${result.results.updated} matching listings updated (${result.results.total} rows).`;
    } catch (error) {
      if (sellerProductFeedback) sellerProductFeedback.textContent = error.message;
    } finally {
      sellerProductImportFile.value = '';
    }
  });
  const renderSellerOrders = (sellerOrders) => {
    if (!sellerOrdersList) return;
    const nextStatus = { pending: 'processing', processing: 'shipped', shipped: 'delivered' };
    sellerOrdersList.innerHTML = sellerOrders.length ? sellerOrders.map((order) => `
      <article class="seller-order-card">
        <div class="seller-order-card-heading"><strong>Order #${Number(order.id)}</strong><span>${escapeHtml(order.status)}</span></div>
        <small>${escapeHtml(new Date(order.created_at).toLocaleDateString('en-IN'))} · ${order.payment_status === 'captured' ? 'Payment captured' : 'Demo order · payment not collected'}</small>
        ${order.items.map((item) => `
          <div class="seller-order-item">
            <div><strong>${escapeHtml(item.name)}</strong><small>Qty ${Number(item.quantity)} · ${currency(item.unit_price)} · ${escapeHtml(item.fulfillment_status)}</small></div>
            ${item.fulfillment_status === 'processing'
              ? `<button type="button" data-seller-tracking-toggle="${Number(item.id)}" aria-expanded="false">Add tracking &amp; mark shipped</button>`
              : nextStatus[item.fulfillment_status]
              ? `<button type="button" data-seller-order-item="${Number(item.id)}" data-next-status="${nextStatus[item.fulfillment_status]}">Mark ${nextStatus[item.fulfillment_status]}</button>`
              : ''}
            ${item.tracking_url ? `<a class="order-tracking-link" href="${escapeHtml(item.tracking_url)}" target="_blank" rel="noopener noreferrer">Track ${escapeHtml(item.tracking_provider || 'shipment')} · ${escapeHtml(item.tracking_number || '')}</a>` : ''}
            ${item.fulfillment_status === 'processing' ? `
              <form class="seller-tracking-form hidden" data-seller-tracking-form="${Number(item.id)}">
                <label>Carrier/provider<input name="tracking_provider" required minlength="2" maxlength="60" autocomplete="organization" /></label>
                <label>Tracking number<input name="tracking_number" required minlength="3" maxlength="100" autocomplete="off" /></label>
                <label>HTTPS tracking link<input name="tracking_url" type="url" required pattern="https://.+" placeholder="https://carrier.example/track/..." /></label>
                <button type="submit">Save tracking &amp; ship</button>
              </form>
            ` : ''}
          </div>
        `).join('')}
      </article>
    `).join('') : '<p class="seller-empty">No orders for your products yet.</p>';
  };
  const renderSellerReturns = (requests) => {
    if (!sellerReturnsList) return;
    sellerReturnsList.innerHTML = requests.length ? requests.map((request) => `
      <article class="seller-return-card">
        <div><strong>${escapeHtml(request.product_name)}</strong><small>Order #${Number(request.order_id)} · Qty ${Number(request.quantity)}</small></div>
        <p>${escapeHtml(request.reason)}</p>
        <small>Status: ${escapeHtml(request.status)} · ${request.refund_review_required ? 'Refund review required; no refund is issued automatically' : 'No payment/refund applies to this demo order'}</small>
        ${request.status === 'pending' ? `<div class="seller-return-actions"><button type="button" data-seller-return="${Number(request.id)}" data-return-status="approved">Approve return</button><button type="button" data-seller-return="${Number(request.id)}" data-return-status="rejected">Decline</button></div>` : ''}
      </article>
    `).join('') : '<p class="seller-empty">No return requests yet.</p>';
  };
  const loadSellerOrderWorkspace = async () => {
    try {
      const [orderResult, returnResult] = await Promise.all([
        apiRequest('/api/seller/orders'),
        apiRequest('/api/seller/returns')
      ]);
      renderSellerOrders(orderResult.orders || []);
      renderSellerReturns(returnResult.requests || []);
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = '';
    } catch (error) {
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = error.message;
      throw error;
    }
  };
  sellerOrdersList?.addEventListener('click', async (event) => {
    const trackingToggle = event.target.closest('[data-seller-tracking-toggle]');
    if (trackingToggle) {
      const form = sellerOrdersList.querySelector(`[data-seller-tracking-form="${trackingToggle.dataset.sellerTrackingToggle}"]`);
      form?.classList.toggle('hidden');
      trackingToggle.setAttribute('aria-expanded', String(Boolean(form && !form.classList.contains('hidden'))));
      return;
    }
    const button = event.target.closest('[data-seller-order-item]');
    if (!button) return;
    button.disabled = true;
    try {
      await apiRequest(`/api/seller/order-items/${button.dataset.sellerOrderItem}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: button.dataset.nextStatus })
      });
      await loadSellerOrderWorkspace();
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = 'Order status updated.';
    } catch (error) {
      button.disabled = false;
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = error.message;
    }
  });
  sellerOrdersList?.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-seller-tracking-form]');
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    if (button) button.disabled = true;
    try {
      await apiRequest(`/api/seller/order-items/${form.dataset.sellerTrackingForm}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'shipped',
          tracking_provider: formData.get('tracking_provider'),
          tracking_number: formData.get('tracking_number'),
          tracking_url: formData.get('tracking_url')
        })
      });
      await loadSellerOrderWorkspace();
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = 'Shipment tracking saved and order marked shipped.';
    } catch (error) {
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = error.message;
      if (button) button.disabled = false;
    }
  });
  sellerReturnsList?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-seller-return]');
    if (!button) return;
    button.disabled = true;
    try {
      await apiRequest(`/api/seller/returns/${button.dataset.sellerReturn}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: button.dataset.returnStatus })
      });
      await loadSellerOrderWorkspace();
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = 'Return decision saved. Any refund for a paid order must be processed separately.';
    } catch (error) {
      button.disabled = false;
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = error.message;
    }
  });
  document.getElementById('sellerRefreshOrders')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await loadSellerOrderWorkspace();
    } catch (error) {
      if (sellerOrderFeedback) sellerOrderFeedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  document.getElementById('sellerAddProduct')?.addEventListener('click', () => {
    if (!sellerProductForm) return;
    sellerProductForm.reset();
    sellerProductForm.elements.namedItem('product_id').value = '';
    sellerCurrentImages = [];
    renderSellerPhotos();
    const title = document.getElementById('sellerProductFormTitle');
    if (title) title.textContent = 'Add a product';
    sellerProductForm.classList.remove('hidden');
    sellerProductForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('sellerCancelProduct')?.addEventListener('click', () => {
    sellerProductForm?.classList.add('hidden');
  });
  sellerPhotoList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-seller-photo-remove]');
    if (!button) return;
    sellerCurrentImages.splice(Number(button.dataset.sellerPhotoRemove), 1);
    renderSellerPhotos();
  });
  if (sellerProductForm) {
    sellerProductForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = sellerProductForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (sellerProductFeedback) sellerProductFeedback.textContent = '';
      let uploadedImages = [];
      let productSaved = false;
      try {
        const productId = sellerProductForm.elements.namedItem('product_id').value;
        const previousImages = [...sellerCurrentImages];
        const { payload, addedImages } = await sellerProductPayload();
        uploadedImages = addedImages;
        await apiRequest(productId ? `/api/seller/products/${productId}` : '/api/seller/products', {
          method: productId ? 'PUT' : 'POST',
          body: JSON.stringify(payload)
        });
        productSaved = true;
        const removedImages = previousImages.filter((url) => !new Set(JSON.parse(payload.images_json)).has(url));
        uploadedImages = [];
        const cleanup = await Promise.allSettled(removedImages
          .filter((url) => url.startsWith('/assets/uploads/sellers/'))
          .map((url) => apiRequest('/api/seller/products/images', { method: 'DELETE', body: JSON.stringify({ url }) })));
        await loadSellerProducts();
        sellerProductForm.reset();
        sellerProductForm.classList.add('hidden');
        sellerCurrentImages = [];
        renderSellerPhotos();
        if (sellerProductFeedback) sellerProductFeedback.textContent = cleanup.some((result) => result.status === 'rejected')
          ? 'Product saved. A removed photo could not be cleaned up.'
          : 'Product saved successfully.';
      } catch (error) {
        if (uploadedImages.length) {
          const cleanup = await Promise.allSettled(uploadedImages.map((url) => apiRequest('/api/seller/products/images', {
            method: 'DELETE',
            body: JSON.stringify({ url })
          })));
          if (cleanup.some((result) => result.status === 'rejected')) error.message += '. One or more uploaded photos could not be cleaned up.';
        }
        if (sellerProductFeedback) sellerProductFeedback.textContent = productSaved
          ? `Product saved, but the inventory view could not refresh: ${error.message}`
          : error.message;
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (sellerForm) {
    sellerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = sellerForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (sellerFeedback) sellerFeedback.textContent = '';
      try {
        const formData = new FormData(sellerForm);
        const result = await apiRequest('/api/seller-account', {
          method: 'POST',
          body: JSON.stringify({
            business_name: formData.get('business_name'),
            category: formData.get('category'),
            contact_phone: formData.get('contact_phone'),
            gst_number: formData.get('gst_number')
          })
        });
        if (sellerFeedback) sellerFeedback.textContent = `Seller application #${result.seller.id} submitted. Status: ${result.seller.status}.`;
        if (sellerStatus) sellerStatus.textContent = `Seller application status: ${result.seller.status}. ${result.seller.status === 'approved' ? 'Your product studio is ready.' : 'Product management becomes available after approval.'}`;
        if (result.seller.status === 'approved') {
          sellerForm.classList.add('hidden');
          sellerWorkspace?.classList.remove('hidden');
          await loadSellerProducts();
          await loadSellerOrderWorkspace();
        }
        showToast('Seller application submitted.');
      } catch (error) {
        if (sellerFeedback) sellerFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (supportForm) {
    supportForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = supportForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (supportFeedback) supportFeedback.textContent = '';
      try {
        const formData = new FormData(supportForm);
        const orderId = String(formData.get('order_id') || '').trim();
        const result = await apiRequest('/api/support/tickets', {
          method: 'POST',
          body: JSON.stringify({
            category: formData.get('category'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            order_id: orderId ? Number(orderId) : null
          })
        });
        if (supportFeedback) supportFeedback.textContent = `Support request #${result.ticket.id} sent. Current status: ${result.ticket.status}.`;
        supportForm.reset();
        const tickets = await apiRequest('/api/support/tickets');
        renderServiceRequests(supportTicketList, tickets.tickets, 'subject');
        showToast('Customer care request submitted.');
      } catch (error) {
        if (supportFeedback) supportFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (advertisingForm) {
    advertisingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = advertisingForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (advertisingFeedback) advertisingFeedback.textContent = '';
      try {
        const formData = new FormData(advertisingForm);
        const result = await apiRequest('/api/advertising/requests', {
          method: 'POST',
          body: JSON.stringify({
            brand_name: formData.get('brand_name'),
            campaign_details: formData.get('campaign_details'),
            monthly_budget: Number(formData.get('monthly_budget'))
          })
        });
        if (advertisingFeedback) advertisingFeedback.textContent = `Advertising request #${result.request.id} submitted. Status: ${result.request.status}.`;
        advertisingForm.reset();
        const requests = await apiRequest('/api/advertising/requests');
        renderServiceRequests(advertisingRequestList, requests.requests, 'brand_name');
        showToast('Advertising request submitted.');
      } catch (error) {
        if (advertisingFeedback) advertisingFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (giftCardPurchaseForm) {
    giftCardPurchaseForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = giftCardPurchaseForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (giftCardsFeedback) giftCardsFeedback.textContent = '';
      try {
        const formData = new FormData(giftCardPurchaseForm);
        const result = await apiRequest('/api/gift-cards/purchase', {
          method: 'POST',
          body: JSON.stringify({ amount: Number(formData.get('amount')) })
        });
        if (giftCardIssuedCode) {
          giftCardIssuedCode.classList.remove('hidden');
          giftCardIssuedCode.replaceChildren();
          const label = document.createElement('strong');
          label.textContent = `Demo gift card code: ${result.card.code}`;
          const note = document.createElement('small');
          note.textContent = 'Copy and save this code. It is shown only once.';
          const copyButton = document.createElement('button');
          copyButton.className = 'service-submit';
          copyButton.type = 'button';
          copyButton.textContent = 'Copy code';
          copyButton.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(result.card.code);
              if (giftCardsFeedback) giftCardsFeedback.textContent = 'Gift card code copied.';
            } catch (error) {
              if (giftCardsFeedback) giftCardsFeedback.textContent = 'Clipboard is unavailable. Select and copy the code above.';
            }
          });
          giftCardIssuedCode.append(label, note, copyButton);
        }
        renderGiftCards(result.giftCards);
        giftCardPurchaseForm.reset();
        if (giftCardsFeedback) giftCardsFeedback.textContent = 'Demo code created; no payment was collected.';
      } catch (error) {
        if (giftCardsFeedback) giftCardsFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (giftCardRedeemForm) {
    giftCardRedeemForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = giftCardRedeemForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (giftCardsFeedback) giftCardsFeedback.textContent = '';
      try {
        const formData = new FormData(giftCardRedeemForm);
        const result = await apiRequest('/api/gift-cards/redeem', {
          method: 'POST',
          body: JSON.stringify({ code: formData.get('code') })
        });
        renderGiftCards(result.giftCards);
        giftCardRedeemForm.reset();
        if (giftCardsFeedback) giftCardsFeedback.textContent = `${currency(result.redeemedAmount)} added to your Nexora wallet.`;
        showToast('Gift card redeemed successfully.');
        if (checkoutPanel && !checkoutPanel.classList.contains('hidden')) renderCheckout();
      } catch (error) {
        if (giftCardsFeedback) giftCardsFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (useGiftCardBalanceInput) {
    useGiftCardBalanceInput.addEventListener('change', () => {
      applyGiftCardBalance = useGiftCardBalanceInput.checked;
      renderCheckout();
    });
  }
  if (copyAppLinkButton) {
    copyAppLinkButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (appLinkFeedback) appLinkFeedback.textContent = 'Nexora website link copied.';
      } catch (error) {
        if (appLinkFeedback) appLinkFeedback.textContent = `Copy is unavailable. Open this address in your mobile browser: ${window.location.href}`;
      }
    });
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

      if (!['SAVE100', 'BANK10', 'FREEDEL', 'PLUS100'].includes(code)) {
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
      if (code === 'PLUS100' && rewardCoinBalance < 500) {
        appliedCoupon = null;
        if (couponMessage) {
          couponMessage.textContent = 'PLUS100 is for Nexora Plus members with 500 coins.';
          couponMessage.className = 'coupon-message error';
        }
        renderCheckout();
        return;
      }
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
      productsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  if (closeAccountButton) {
    closeAccountButton.addEventListener('click', closeAccountPanel);
  }
  if (closeProfileButton) closeProfileButton.addEventListener('click', closeProfilePanel);
  if (profilePopupAction) profilePopupAction.addEventListener('click', closeProfilePanel);
  if (closeSettingsButton) closeSettingsButton.addEventListener('click', closeSettingsPanel);
  if (settingsDoneButton) settingsDoneButton.addEventListener('click', closeSettingsPanel);
  if (searchButton) searchButton.addEventListener('click', openSearchPage);
  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      openSearchPage();
    });
  }
  if (headerLoginButton) {
    headerLoginButton.addEventListener('click', () => {
      closeMoreMenu();
      if (currentUser) openAccountPanel();
      else openAuthPanel('login');
    });
  }
  if (moreMenuButton) {
    moreMenuButton.addEventListener('click', () => {
      const isOpen = moreMenuButton.getAttribute('aria-expanded') === 'true';
      moreMenuButton.setAttribute('aria-expanded', String(!isOpen));
      moreMenu?.classList.toggle('hidden', isOpen);
    });
  }
  moreMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
      closeMoreMenu();
      const action = item.dataset.moreAction;
      if (action === 'profile') openProfilePanel();
      else if (action === 'orders') openOrdersPanel();
      else if (action === 'wishlist') openWishlistPanel();
    });
  });
  menuAuthButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeMoreMenu();
      const mode = button.dataset.menuAuth === 'signup' ? 'signup' : 'login';
      if (mode === 'login' && currentUser) openAccountPanel();
      else openAuthPanel(mode);
    });
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !moreMenu?.contains(event.target) && !moreMenuButton?.contains(event.target)) {
      closeMoreMenu();
    }
  });
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
      window.clearTimeout(searchResultDebounceTimer);
      searchResultDebounceTimer = window.setTimeout(renderSearchResults, 180);
    });
    fullSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        rememberSearch(fullSearchInput.value);
        window.clearTimeout(searchResultDebounceTimer);
        renderSearchResults();
      }
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
  const startVoiceSearch = (input) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice search is not supported by this browser. Please type your search.', 'info');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener('result', (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (!transcript || !input) return;
      input.value = transcript;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    recognition.addEventListener('error', (event) => {
      const message = event.error === 'not-allowed'
        ? 'Allow microphone access to use voice search.'
        : event.error === 'no-speech'
          ? 'No speech was detected. Please try again.'
          : 'Voice search could not start. Please type your search.';
      showToast(message, 'info');
    });
    recognition.addEventListener('start', () => showToast('Listening…', 'info'));
    try {
      recognition.start();
    } catch (error) {
      showToast(`Voice search could not start: ${error.message}`, 'error');
    }
  };
  searchMicButton?.addEventListener('click', () => startVoiceSearch(fullSearchInput));
  homeSearchMicButton?.addEventListener('click', () => startVoiceSearch(searchInput));

  profileDashboardCards.forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.profileAction;
      if (action === 'orders') openOrdersPanel();
      else if (action === 'wishlist') openWishlistPanel();
      else if (action === 'addresses') showAddressManager();
      else if (action === 'settings') openSettingsPanel();
    });
  });
  if (profilePopupEditButton) {
    profilePopupEditButton.addEventListener('click', () => {
      if (!currentUser?.token) {
        if (profileEditFeedback) profileEditFeedback.textContent = 'Connect and sign in to the Nexora account server before changing profile details.';
        return;
      }
      if (profileEditName) profileEditName.value = currentUser.name || '';
      if (profileEditEmail) profileEditEmail.value = currentUser.email || '';
      if (profileEditMobile) profileEditMobile.value = currentUser.mobile || '';
      if (profileCurrentPassword) profileCurrentPassword.value = '';
      if (profileEditFeedback) profileEditFeedback.textContent = '';
      profilePopupActions?.classList.add('hidden');
      profileEditForm?.classList.remove('hidden');
      profileEditName?.focus();
    });
  }
  if (profileEditCancelButton) {
    profileEditCancelButton.addEventListener('click', () => {
      profileEditForm?.classList.add('hidden');
      profilePopupActions?.classList.remove('hidden');
      if (profileCurrentPassword) profileCurrentPassword.value = '';
      if (profileEditFeedback) profileEditFeedback.textContent = '';
    });
  }
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!currentUser?.token) {
        if (profileEditFeedback) profileEditFeedback.textContent = 'Sign in to the Nexora account server to save profile changes.';
        return;
      }
      const submitButton = profileEditForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (profileEditFeedback) profileEditFeedback.textContent = '';
      try {
        const result = await apiRequest('/api/auth/profile', {
          method: 'PATCH',
          body: JSON.stringify({
            name: profileEditName?.value.trim(),
            email: profileEditEmail?.value.trim(),
            mobile: profileEditMobile?.value.trim() || '',
            current_password: profileCurrentPassword?.value || ''
          })
        });
        currentUser = { ...currentUser, ...result.user };
        saveAuthSession(currentUser, Boolean(localStorage.getItem(AUTH_SESSION_STORAGE_KEY)));
        renderAccountState();
        openProfilePanel();
        showToast('Profile details updated.');
      } catch (error) {
        if (profileEditFeedback) profileEditFeedback.textContent = error.message;
        showToast(error.message, 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (profilePopupAddressesButton) {
    profilePopupAddressesButton.addEventListener('click', () => {
      closeProfilePanel();
      openAccountPanel();
      showAddressManager();
    });
  }
  if (rewardsCoupons) {
    rewardsCoupons.addEventListener('click', async (event) => {
      const button = event.target instanceof Element ? event.target.closest('[data-reward-coupon]') : null;
      const code = button?.getAttribute('data-reward-coupon');
      if (!code || button.hasAttribute('disabled')) return;
      try {
        await navigator.clipboard.writeText(code);
        showToast(`${code} copied. Apply it at checkout.`);
      } catch (error) {
        showToast(`Use ${code} at checkout.`, 'info');
      }
    });
  }
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
      if (address.selected) applyAddressToCheckout(address, { savePincode: true });
      profileAddressForm.classList.add('hidden');
      editingAddressId = null;
      renderSavedAddresses();
      renderProfileDashboard();
      showToast(`${address.label} address saved`);
    });
  }
  const closeDeliveryPincodePanel = () => {
    deliveryPincodePanel?.classList.add('hidden');
    deliveryPincodePanel?.setAttribute('aria-hidden', 'true');
  };
  const openDeliveryPincodePanel = () => {
    if (!deliveryPincodePanel) return;
    deliveryPincodeInput.value = deliveryPincode || selectedAddress()?.pincode || '';
    if (deliveryPincodeError) deliveryPincodeError.textContent = '';
    deliveryPincodePanel.classList.remove('hidden');
    deliveryPincodePanel.setAttribute('aria-hidden', 'false');
    deliveryPincodeInput.focus();
  };
  addressBarButton?.addEventListener('click', openDeliveryPincodePanel);
  closeDeliveryPincodeButton?.addEventListener('click', closeDeliveryPincodePanel);
  cancelDeliveryPincodeButton?.addEventListener('click', closeDeliveryPincodePanel);
  deliveryPincodePanel?.addEventListener('click', (event) => {
    if (event.target === deliveryPincodePanel) closeDeliveryPincodePanel();
  });
  deliveryPincodeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const pincode = deliveryPincodeInput.value.trim();
    if (!/^\d{6}$/.test(pincode)) {
      if (deliveryPincodeError) deliveryPincodeError.textContent = 'Enter a valid 6-digit PIN code.';
      return;
    }
    try {
      localStorage.setItem(DELIVERY_PINCODE_STORAGE_KEY, pincode);
    } catch (error) {
      if (deliveryPincodeError) deliveryPincodeError.textContent = 'Your location could not be saved. Check your browser storage settings and try again.';
      console.error('Unable to save the delivery PIN code.', error);
      return;
    }
    deliveryPincode = pincode;
    if (addressBarTitle) addressBarTitle.textContent = pincode;
    closeDeliveryPincodePanel();
    showToast('Delivery PIN code saved');
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
  accountLoginAction?.addEventListener('click', () => openAuthPanel('login'));

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
      } else if (action === 'rewards' || action === 'help-centre') {
        closeAccountPanel();
        openServicePanel(action === 'rewards' ? 'rewards' : 'support');
      } else if (action === 'addresses') {
        showAddressManager();
      } else if (action === 'notifications' || action === 'subscriptions' || action === 'gift-cards') {
        closeAccountPanel();
        const service = {
          notifications: 'notification-settings',
          subscriptions: 'plus-zone',
          'gift-cards': 'gift-cards'
        }[action];
        openServicePanel(service);
      } else if (action === 'questions') {
        closeAccountPanel();
        openServicePanel('support');
      } else if (action === 'payment-methods') {
        showToast('Saved payment methods are managed securely during checkout.', 'info');
      } else if (action === 'privacy' || action === 'devices' || action === 'policies') {
        showToast('This information will be available before the feature launches.', 'info');
      }
    });
  });

  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', async () => {
      if (!addressForm?.reportValidity()) return;
      placeOrderButton.disabled = true;
      try {
        await openOrderConfirmation();
      } catch (error) {
        showToast(error.message || 'Unable to start secure payment. Please try again.', 'error');
      } finally {
        placeOrderButton.disabled = !paymentConfig?.enabled || cart.some((item) => item.available === false || item.qty > Number(item.stock));
      }
    });
  }

  if (placeCodOrderButton) {
    placeCodOrderButton.addEventListener('click', async () => {
      if (!addressForm?.reportValidity()) return;
      placeCodOrderButton.disabled = true;
      if (placeOrderButton) placeOrderButton.disabled = true;
      try {
        await openCodOrderConfirmation();
      } catch (error) {
        showToast(error.message || 'Unable to place the COD order. Please try again.', 'error');
      } finally {
        const inventoryUnavailable = cart.some((item) => item.available === false || item.qty > Number(item.stock));
        placeCodOrderButton.disabled = !paymentConfig?.cod_enabled || inventoryUnavailable;
        if (placeOrderButton) placeOrderButton.disabled = !paymentConfig?.enabled || inventoryUnavailable;
      }
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
      applyAddressToCheckout(address, { savePincode: true });
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

  const addActiveProductToCart = async ({ openCart = true } = {}) => {
    const card = activeProductCard;
    const productId = Number(card?.dataset.productId);
    if (!card || !Number.isSafeInteger(productId) || productId < 1) {
      showToast('This product could not be verified with the catalog.', 'error');
      return false;
    }
    if (addToCartButton) addToCartButton.disabled = true;
    if (buyNowButton) buyNowButton.disabled = true;
    try {
      await refreshProductSnapshots([productId]);
    } catch (error) {
      showToast(`Current price and stock could not be verified: ${error.message}`, 'error');
      if (modalStockStatus) modalStockStatus.textContent = 'Current stock could not be verified.';
      return false;
    } finally {
      const availableStock = Number(card.dataset.stock) || 0;
      if (addToCartButton) addToCartButton.disabled = availableStock <= 0;
      if (buyNowButton) buyNowButton.disabled = availableStock <= 0;
    }
    const stock = Number(card.dataset.stock) || 0;
    const productName = card.querySelector('.product-name')?.textContent.trim() || modalTitle?.textContent || 'Product';
    const productPrice = parsePrice(card.dataset.price);
    const productImageClass = modalImage?.dataset.productClass || 'product-one';
    const foundItem = cart.find((item) => Number(item.productId) === productId);
    if (stock <= 0) {
      showToast('This product is out of stock.', 'error');
      return false;
    }
    if (foundItem && foundItem.qty >= stock) {
      showToast(`Only ${stock} left in stock.`, 'error');
      return false;
    }
    if (foundItem) {
      foundItem.qty += 1;
      foundItem.name = productName;
      foundItem.price = productPrice;
      foundItem.originalPrice = parsePrice(card.dataset.originalPrice) || productPrice;
      foundItem.stock = stock;
      foundItem.available = true;
      foundItem.imageUrl = card.dataset.imageUrl || parseProductJson(card.dataset.images, [])[0] || '';
      foundItem.deliveryInformation = card.dataset.deliveryInformation || '';
    } else {
      cart.push({
        productId,
        name: productName,
        price: productPrice,
        originalPrice: parsePrice(card.dataset.originalPrice) || productPrice,
        qty: 1,
        imageClass: productImageClass,
        imageUrl: card.dataset.imageUrl || parseProductJson(card.dataset.images, [])[0] || '',
        deliveryInformation: card.dataset.deliveryInformation || '',
        stock,
        available: true
      });
    }
    cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    saveCart();
    updateCartCount();
    renderCart();
    if (openCart) openCartPanel();
    closeProductModal();
    showToast(`${productName} added to cart`);
    if (addToCartButton) {
      addToCartButton.classList.add('added');
      addToCartButton.textContent = 'Added';
      setTimeout(() => {
        addToCartButton.classList.remove('added');
        addToCartButton.textContent = 'Add to Cart';
      }, 1000);
    }
    return true;
  };
  const addQuickCartButtons = (root) => {
    const cards = [];
    if (root instanceof Element && root.matches('.product-card')) cards.push(root);
    cards.push(...root.querySelectorAll('.product-card'));
    cards.forEach((card) => {
      const productMeta = card.querySelector('.product-meta');
      if (!productMeta) return;
      const discount = card.dataset.discount || card.querySelector('.product-discount')?.textContent.trim();
      if (discount && !productMeta.querySelector('.product-discount-label')) {
        const discountLabel = document.createElement('span');
        discountLabel.className = 'product-discount-label';
        discountLabel.textContent = `${discount} off`;
        productMeta.append(discountLabel);
      }
      const existingButton = card.querySelector('.quick-add-btn');
      if (existingButton) {
        existingButton.disabled = card.dataset.stock !== undefined && Number(card.dataset.stock) <= 0;
        return;
      }
      const button = document.createElement('button');
      button.className = 'quick-add-btn';
      button.type = 'button';
      button.textContent = 'Add to Cart';
      button.setAttribute('aria-label', `Add ${card.querySelector('.product-name')?.textContent.trim() || 'product'} to cart`);
      button.disabled = card.dataset.stock !== undefined && Number(card.dataset.stock) <= 0;
      productMeta.after(button);
    });
  };
  addQuickCartButtons(document);
  [productsContainer, infiniteProductsContainer, categoryProductsContainer].filter(Boolean).forEach((container) => {
    new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === 'attributes') {
          addQuickCartButtons(record.target);
          return;
        }
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) addQuickCartButtons(node);
        });
      });
    }).observe(container, { attributes: true, attributeFilter: ['data-stock'], childList: true, subtree: true });
  });
  document.addEventListener('click', (event) => {
    const quickAddButton = event.target instanceof Element ? event.target.closest('.quick-add-btn') : null;
    const card = quickAddButton?.closest('.product-card');
    if (!quickAddButton || !card || quickAddButton.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    quickAddButton.disabled = true;
    quickAddButton.textContent = 'Adding…';
    openProductModal(card);
    addActiveProductToCart({ openCart: false }).then((added) => {
      if (!added) closeProductModal();
      quickAddButton.textContent = added ? 'Added' : 'Add to Cart';
      quickAddButton.disabled = card.dataset.stock !== undefined && Number(card.dataset.stock) <= 0;
      if (added) window.setTimeout(() => {
        if (!quickAddButton.isConnected) return;
        quickAddButton.textContent = 'Add to Cart';
      }, 1200);
    }).catch((error) => {
      closeProductModal();
      quickAddButton.textContent = 'Add to Cart';
      quickAddButton.disabled = card.dataset.stock !== undefined && Number(card.dataset.stock) <= 0;
      showToast(error.message || 'Unable to add this product to your cart.', 'error');
    });
  }, true);
  addToCartButton?.addEventListener('click', () => {
    addActiveProductToCart().catch((error) => showToast(error.message || 'Unable to add this product to your cart.', 'error'));
  });
  buyNowButton?.addEventListener('click', async () => {
    try {
      if (await addActiveProductToCart()) {
        closeCartPanel();
        checkoutBtn?.click();
      }
    } catch (error) {
      showToast(error.message || 'Unable to start checkout for this product.', 'error');
    }
  });

  let dealsRequestId = 0;
  let selectedDealCategory = '';
  const loadDeals = async (category = selectedDealCategory) => {
    const dealsProducts = document.getElementById('dealsProducts');
    const dealsStatus = document.getElementById('dealsStatus');
    if (!dealsProducts || !dealsStatus) return;
    selectedDealCategory = category;
    const requestId = ++dealsRequestId;
    dealsProducts.replaceChildren();
    dealsStatus.textContent = 'Loading discounted products…';
    const params = new URLSearchParams({ active: '1', onDiscount: 'true', limit: '40', sort: '-popularity' });
    if (category) params.set('category', category);
    try {
      const response = await apiRequest(`/api/products?${params.toString()}`);
      if (requestId !== dealsRequestId) return;
      const products = Array.isArray(response.products) ? response.products : [];
      dealsProducts.innerHTML = products.map((product) => catalogCardMarkup({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: currency(product.price),
        rating: String(product.rating || 0),
        reviews: String(product.reviews || 0),
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand,
        productType: product.product_type || '',
        model: product.model || product.name,
        variants: parseProductJson(product.variants_json, {}),
        specifications: parseProductJson(product.specifications_json, {}),
        images: parseProductJson(product.images_json, []),
        imageUrl: product.image_url || '',
        originalPrice: product.original_price ? currency(product.original_price) : '',
        description: product.description || '',
        seller: product.seller || '',
        deliveryInformation: product.delivery_information || '',
        imageClass: safeImageClass(product.image_class),
        stock: Number(product.stock ?? 0),
        createdAt: product.created_at || '',
        popularity: Number(product.popularity || 0),
        discount: Number(product.discount_percent) > 0 ? `-${Math.round(Number(product.discount_percent))}%` : ''
      })).join('');
      syncWishlistButtons();
      dealsStatus.textContent = products.length
        ? `${products.length} discounted ${products.length === 1 ? 'product' : 'products'}`
        : 'No discounted products are available in this category right now.';
    } catch (error) {
      if (requestId !== dealsRequestId) return;
      dealsStatus.textContent = `Deals could not be loaded: ${error.message}`;
      showToast(`Unable to load Top Deals: ${error.message}`, 'error');
    }
  };
  const setDiscoveryView = (destination) => {
    showHome();
    if (destination === 'play' || destination === 'deals') {
      if (appPage) appPage.dataset.currentView = destination;
      setActiveNavItem(destination);
      if (destination === 'deals') loadDeals();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  document.querySelectorAll('[data-play-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.playTab;
      document.querySelectorAll('[data-play-tab]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('[data-play-panel]').forEach((panel) => {
        const active = panel.dataset.playPanel === selected;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    });
  });
  document.querySelectorAll('[data-play-creator]').forEach((button) => {
    button.addEventListener('click', () => showToast('Creator sign-ups are coming soon to Nexora Play.', 'info'));
  });
  document.querySelectorAll('[data-deal-category]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-deal-category]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      loadDeals(tab.dataset.dealCategory || '');
    });
  });
  document.querySelectorAll('[data-cart-mode]').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCartMode = tab.dataset.cartMode || 'nexora';
      document.querySelectorAll('[data-cart-mode]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      if (cartModeMessage) {
        cartModeMessage.textContent = activeCartMode === 'grocery'
          ? 'Grocery shopping is coming soon. Your Nexora items remain in the Nexora section.'
          : 'Nexora Minutes is coming soon. Your Nexora items remain in the Nexora section.';
      }
      renderCart();
    });
  });
  document.querySelector('[data-cart-location]')?.addEventListener('click', () => addressBarButton?.click());
  document.getElementById('dealsProducts')?.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const wishlistButton = event.target.closest('.wishlist-btn');
    if (wishlistButton) {
      event.preventDefault();
      event.stopPropagation();
      const product = productFromCard(card);
      const existingIndex = wishlist.findIndex((item) => item.name === product.name);
      if (existingIndex >= 0) wishlist.splice(existingIndex, 1);
      else wishlist.push(product);
      saveWishlist();
      syncWishlistButtons();
      showToast(existingIndex >= 0 ? 'Removed from wishlist' : 'Added to wishlist', existingIndex >= 0 ? 'info' : 'success');
      return;
    }
    openProductModal(card);
  });
  const openAssistant = () => {
    assistantPanel?.classList.remove('hidden');
    assistantPanel?.setAttribute('aria-hidden', 'false');
    assistantLauncher?.setAttribute('aria-expanded', 'true');
    assistantInput?.focus();
  };
  const closeAssistant = () => {
    assistantPanel?.classList.add('hidden');
    assistantPanel?.setAttribute('aria-hidden', 'true');
    assistantLauncher?.setAttribute('aria-expanded', 'false');
  };
  const appendAssistantMessage = (message, role, action = '', actionLabel = '') => {
    if (!assistantMessages) return;
    const bubble = document.createElement('p');
    bubble.className = `assistant-message assistant-message-${role}`;
    bubble.textContent = message;
    if (action) {
      const button = document.createElement('button');
      button.className = 'assistant-message-action';
      button.type = 'button';
      button.dataset.assistantAction = action;
      button.textContent = actionLabel;
      bubble.append(document.createElement('br'), button);
    }
    assistantMessages.appendChild(bubble);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };
  const handleAssistantMessage = (rawMessage) => {
    const message = rawMessage.trim();
    if (!message) return;
    appendAssistantMessage(message, 'user');
    const normalized = message.toLowerCase();
    if (/\b(deal|deals|discount|offer|sale)\b/.test(normalized)) {
      setDiscoveryView('deals');
      appendAssistantMessage('I’ve opened Top Deals. Browse discounted products or explore the featured categories.', 'bot', 'close', 'Got it');
    } else if (/\b(cart|basket|checkout)\b/.test(normalized)) {
      const itemCount = cart.reduce((total, item) => total + item.qty, 0);
      appendAssistantMessage(`Your cart has ${itemCount} ${itemCount === 1 ? 'item' : 'items'}.`, 'bot', 'cart', 'Open cart');
    } else if (/\b(account|profile|sign in|login)\b/.test(normalized)) {
      appendAssistantMessage('You can view your profile, orders and saved addresses from Account.', 'bot', 'account', 'Open account');
    } else if (/\b(play|video|videos|reels|shorts)\b/.test(normalized)) {
      setDiscoveryView('play');
      appendAssistantMessage('Nexora Play is being prepared. I’ll let you know when product videos are available.', 'bot', 'close', 'Got it');
    } else {
      showHome();
      const allCategoryPill = [...getCategoryPills()].find((pill) => pill.dataset.category === 'For You');
      allCategoryPill?.click();
      if (searchInput) {
        searchInput.value = message;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      appendAssistantMessage(`I’ve started a catalog search for “${message}”.`, 'bot', 'results', 'View matching products');
    }
  };

  assistantLauncher?.addEventListener('click', () => {
    if (assistantPanel?.classList.contains('hidden')) openAssistant();
    else closeAssistant();
  });
  closeAssistantButton?.addEventListener('click', closeAssistant);
  assistantForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = assistantInput?.value.trim();
    if (!message) return;
    assistantForm.reset();
    handleAssistantMessage(message);
  });
  assistantPanel?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const prompt = event.target.closest('[data-assistant-prompt]');
    if (prompt) {
      handleAssistantMessage(prompt.dataset.assistantPrompt || '');
      return;
    }
    const action = event.target.closest('[data-assistant-action]')?.dataset.assistantAction;
    if (action === 'close') closeAssistant();
    else if (action === 'cart') {
      closeAssistant();
      document.querySelector('.nav-item[data-nav="cart"]')?.click();
    } else if (action === 'account') {
      closeAssistant();
      document.querySelector('.nav-item[data-nav="account"]')?.click();
    } else if (action === 'results') {
      closeAssistant();
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  document.querySelectorAll('[data-discovery-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.discoveryAction;
      if (action === 'home') {
        showHome();
        return;
      }
      if (action === 'discounts') {
        showHome();
        const allCategoryPill = [...getCategoryPills()].find((pill) => pill.dataset.category === 'For You');
        allCategoryPill?.click();
        if (discountFilter) discountFilter.checked = true;
        applyProductFilters();
        scheduleHomeFeedReload();
        document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const destination = item.dataset.nav;
      if (destination === 'home') {
        showHome();
      } else if (destination === 'play' || destination === 'deals') {
        setDiscoveryView(destination);
      } else if (destination === 'cart') {
        showHome();
        setActiveNavItem('cart');
        closeCheckoutPanel();
        closeOrderConfirmation();
        closeOrdersPanel();
        closeAccountPanel();
        closeWishlistPanel();
        closeNotificationsPanel();
        openCartPanel();
      } else if (destination === 'account') {
        showHome();
        setActiveNavItem('account');
        openAccountPanel();
      } else if (destination === 'categories') {
        showHome();
        setActiveNavItem('categories');
        openCategoryCatalog('For You');
      }
    });
  });

  [productsContainer, infiniteProductsContainer].filter(Boolean).forEach((container) => {
    container.addEventListener('click', (event) => {
      const card = event.target.closest('.product-card');
      if (!card) return;
      const wishlistButton = event.target.closest('.wishlist-btn');
      if (wishlistButton) {
        event.preventDefault();
        event.stopPropagation();
        const product = productFromCard(card);
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
        return;
      }
      getProductCards().forEach((product) => product.classList.remove('selected'));
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
    const max = priceMaxInput?.value ? `₹${Number(priceMaxInput.value).toLocaleString('en-IN')}` : 'No limit';
    const min = priceMinInput?.value ? `₹${Number(priceMinInput.value).toLocaleString('en-IN')}` : '₹0';
    const priceLabel = document.getElementById('priceRangeValue');
    if (priceLabel) priceLabel.textContent = `${min} - ${max}`;
  };

  const applyProductFilters = () => {
    const query = searchInput?.value.trim().toLowerCase() || '';
    const minPrice = Number(priceMinInput?.value || 0);
    const maxPrice = Number(priceMaxInput?.value || Number.MAX_SAFE_INTEGER);
    const selectedCategories = [...getCategoryFilters()].filter((input) => input.checked).map((input) => input.value);
    const selectedBrands = [...getBrandFilters()].filter((input) => input.checked).map((input) => input.value);
    const sort = sortProducts?.value || 'relevance';
    const visibleCards = [];

    getProductCards().forEach((card) => {
      const matches = productMatchesFilters({
        name: card.dataset.name || '',
        category: card.dataset.category || '',
        subcategory: card.dataset.subcategory || '',
        brand: card.dataset.brand || '',
        productType: card.dataset.productType || '',
        model: card.dataset.model || '',
        price: card.dataset.price || '',
        originalPrice: card.dataset.originalPrice || '',
        rating: card.dataset.rating || 0,
        stock: card.dataset.stock || 0
      });
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCards.push(card);
    });

    if (productsContainer && sort !== 'relevance') {
      [productsContainer, infiniteProductsContainer].filter(Boolean).forEach((container) => {
        visibleCards.filter((card) => card.parentElement === container).sort((a, b) => {
          if (sort === 'price-low' || sort === 'price-high') {
            const priceA = Number(a.dataset.price.replace(/[₹,]/g, ''));
            const priceB = Number(b.dataset.price.replace(/[₹,]/g, ''));
            return sort === 'price-low' ? priceA - priceB : priceB - priceA;
          }
          if (sort === 'rating') return Number(b.dataset.rating) - Number(a.dataset.rating);
          if (sort === 'newest') return String(b.dataset.createdAt || '').localeCompare(String(a.dataset.createdAt || ''));
          if (sort === 'popularity') return Number(b.dataset.popularity || 0) - Number(a.dataset.popularity || 0);
          return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        }).forEach((card) => container.appendChild(card));
      });
    }
    if (filterResultSummary) {
      filterResultSummary.textContent = `${visibleCards.length} of ${getProductCards().length} products`;
      filterResultSummary.classList.toggle('visible', Boolean(query || selectedRating || selectedCategory || selectedCategories.length || selectedBrands.length
        || subcategoryFilter?.value || priceMinInput?.value || priceMaxInput?.value || discountFilter?.checked || availabilityFilter?.checked || sort !== 'relevance'));
    }
    productsEmpty?.classList.toggle('hidden', visibleCards.length > 0);
  };

  if (categoryNavigation) {
    categoryNavigation.addEventListener('click', (event) => {
      const pill = event.target.closest('.category-pill');
      if (!pill || !categoryNavigation.contains(pill)) return;
      const categoryPills = getCategoryPills();
      categoryPills.forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');
      categoryPills.forEach((item) => item.setAttribute('aria-pressed', item === pill ? 'true' : 'false'));
      selectedCategory = pill.dataset.category === 'For You' ? '' : pill.dataset.category;
      getCategoryFilters().forEach((input) => { input.checked = input.value === selectedCategory; });
      applyProductFilters();
      scheduleHomeFeedReload();
      const title = document.querySelector('.section-title h3');
      if (title) title.textContent = selectedCategory || 'Popular picks for you';
      productsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.querySelectorAll('[data-category-link]').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.categoryLink || 'For You';
      openCategoryCatalog(category);
    });
  });

  document.querySelectorAll('[data-brand-search]').forEach((button) => {
    button.addEventListener('click', () => {
      openCategoryCatalog('For You', button.dataset.brandSearch || '');
    });
  });

  document.querySelectorAll('[data-home-action]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.homeAction === 'payments') {
        openCartPanel();
        if (cart.length) checkoutBtn?.click();
        else showToast('Add an item to your cart to see checkout payment options.', 'info');
      } else if (button.dataset.homeAction === 'pay-later') {
        showToast('Nexora Pay Later is not available. This demo does not offer credit.', 'info');
      }
    });
  });

  const storeSurveyForm = document.getElementById('storeSurveyForm');
  const storeSurveyFeedback = document.getElementById('storeSurveyFeedback');
  if (storeSurveyForm) {
    storeSurveyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(storeSurveyForm);
      const response = {
        rating: Number(formData.get('rating')),
        feedback: String(formData.get('feedback') || '').trim(),
        savedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('nexora_store_survey', JSON.stringify(response));
        storeSurveyForm.reset();
        if (storeSurveyFeedback) storeSurveyFeedback.textContent = 'Thank you. Your feedback is saved on this device.';
      } catch (error) {
        if (storeSurveyFeedback) storeSurveyFeedback.textContent = 'Feedback could not be saved on this device. Please check your browser storage settings.';
        console.error('Unable to save Nexora storefront survey response.', error);
      }
    });
  }

  shortcutCards.forEach((card) => {
    card.addEventListener('click', () => {
      const shortcut = card.dataset.shortcutCategory;
      if (shortcut === 'Deals') {
        promoBanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Today’s best deals are ready');
        return;
      }
      const categoryMap = { Travel: 'Fashion', Grocery: 'Grocery', 'For You': 'For You' };
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
      renderCategoryCatalog();
    });
  });
  if (catalogSort) catalogSort.addEventListener('change', () => renderCategoryCatalog());
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
  [priceMinInput, priceMaxInput].forEach((input) => {
    input?.addEventListener('input', () => {
      updatePriceRangeLabel();
      scheduleHomeFeedReload();
    });
  });
  updatePriceRangeLabel();
  ratingFilters.forEach((button) => {
    button.addEventListener('click', () => {
      selectedRating = Number(button.dataset.ratingFilter);
      ratingFilters.forEach((item) => item.classList.toggle('active', item === button));
      scheduleHomeFeedReload();
    });
  });
  categoryFilterOptions?.addEventListener('change', (event) => {
    if (!event.target.matches('.category-filter')) return;
    selectedCategory = '';
    applyProductFilters();
    scheduleHomeFeedReload();
  });
  brandFilterOptions?.addEventListener('change', (event) => {
    if (!event.target.matches('.brand-filter')) return;
    applyProductFilters();
    scheduleHomeFeedReload();
  });
  subcategoryFilter?.addEventListener('change', () => {
    applyProductFilters();
    scheduleHomeFeedReload();
  });
  [discountFilter, availabilityFilter].forEach((input) => input?.addEventListener('change', () => {
    applyProductFilters();
    scheduleHomeFeedReload();
  }));
  if (sortProducts) sortProducts.addEventListener('change', () => {
    applyProductFilters();
    scheduleHomeFeedReload();
  });
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (priceMinInput) priceMinInput.value = '';
      if (priceMaxInput) priceMaxInput.value = '';
      if (subcategoryFilter) subcategoryFilter.value = '';
      if (discountFilter) discountFilter.checked = false;
      if (availabilityFilter) availabilityFilter.checked = false;
      selectedRating = 0;
      selectedCategory = '';
      ratingFilters.forEach((button) => button.classList.toggle('active', button.dataset.ratingFilter === '0'));
      getCategoryFilters().forEach((input) => { input.checked = false; });
      getBrandFilters().forEach((input) => { input.checked = false; });
      if (sortProducts) sortProducts.value = 'relevance';
      getCategoryPills().forEach((pill) => {
        const isDefault = pill.dataset.category === 'For You';
        pill.classList.toggle('active', isDefault);
        pill.setAttribute('aria-pressed', String(isDefault));
      });
      const title = document.querySelector('.section-title h3');
      if (title) title.textContent = 'Popular picks for you';
      updatePriceRangeLabel();
      applyProductFilters();
      scheduleHomeFeedReload();
    });
  }
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', () => {
      applyProductFilters();
      scheduleHomeFeedReload();
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
        await Promise.all([loadAdminCatalog(), loadAdminProducts(), loadSupplierFeeds()]);
        sessionStorage.setItem('nexora-admin-key', adminKey);
        adminKeyForm.classList.add('hidden');
        adminWorkspace?.classList.remove('hidden');
      } catch (error) {
        adminKey = '';
        if (adminKeyMessage) adminKeyMessage.textContent = error.message;
      }
    });
  }
  const applyAdminCatalogPathToProductForm = () => {
    const path = selectedAdminCatalogPath();
    const values = Object.fromEntries(path.map((node) => [node.kind, node.name]));
    if (values.category) productCategoryInput.value = values.category;
    if (values.subcategory && values.subcategory !== 'General') productSubcategoryInput.value = values.subcategory;
    if (values.brand && values.brand !== 'Unbranded') productBrandInput.value = values.brand;
    if (values.product_type && values.product_type !== 'General') productTypeInput.value = values.product_type;
    if (values.model) productModelInput.value = values.model;
  };
  if (newProductButton) newProductButton.addEventListener('click', () => {
    resetProductForm();
    applyAdminCatalogPathToProductForm();
    productForm?.classList.remove('hidden');
    productForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (cancelProductButton) cancelProductButton.addEventListener('click', resetProductForm);
  if (productForm) {
    productForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = productIdInput?.value;
      let otherVariants = {};
      let specifications = {};
      try {
        otherVariants = productOtherVariantsInput.value.trim() ? JSON.parse(productOtherVariantsInput.value) : {};
        if (!otherVariants || typeof otherVariants !== 'object' || Array.isArray(otherVariants)) {
          throw new Error('Other variants must be a JSON object of option arrays.');
        }
        specifications = productSpecificationsInput.value.trim() ? JSON.parse(productSpecificationsInput.value) : {};
        if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)) {
          throw new Error('Specifications must be a JSON object of name/value pairs.');
        }
      } catch (error) {
        if (productFormMessage) productFormMessage.textContent = `Invalid product data: ${error.message}`;
        return;
      }
      const body = {
        name: productNameInput.value.trim(),
        sku: productSkuInput.value.trim() || undefined,
        price: Number(productPriceInput.value),
        original_price: productOriginalPriceInput.value ? Number(productOriginalPriceInput.value) : null,
        rating: Number(productRatingInput.value),
        reviews: Number(productReviewsInput.value),
        stock: Number(productStockInput.value),
        category: productCategoryInput.value.trim(),
        subcategory: productSubcategoryInput.value.trim(),
        brand: productBrandInput.value.trim(),
        product_type: productTypeInput.value.trim(),
        model: productModelInput.value.trim(),
        images_json: productPhotosInput.value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean),
        specifications_json: specifications,
        variants_json: {
          ...otherVariants,
          size: productSizesInput.value.split(',').map((value) => value.trim()).filter(Boolean),
          color: productColorsInput.value.split(',').map((value) => value.trim()).filter(Boolean),
          storage: productStorageInput.value.split(',').map((value) => value.trim()).filter(Boolean)
        },
        seller: productSellerInput.value.trim(),
        delivery_information: productDeliveryInput.value.trim(),
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
        await Promise.all([loadAdminCatalog(), loadAdminProducts()]);
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
        await Promise.all([loadAdminCatalog(), loadAdminProducts()]);
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
    searchInput.addEventListener('input', scheduleHomeFeedReload);
  }

  applyProductFilters();
  updateCartCount();
});
