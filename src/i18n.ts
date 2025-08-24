import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome back",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      submit: "Submit",
      back: "Back",
      next: "Next",
      previous: "Previous",

      // Navigation
      home: "Home",
      products: "Products",
      cart: "Cart",
      orders: "Orders",
      profile: "Profile",
      login: "Login",
      register: "Register",
      logout: "Logout",

      // Dashboard
      dashboard: "Dashboard",
      quickActions: "Quick Actions",
      adminActions: "Admin Actions",
      browseProducts: "Browse Products",
      viewOrders: "View Orders",
      manageOrders: "Manage Orders",
      addProduct: "Add Product",
      shoppingCart: "Shopping Cart",
      exploreCatalog: "Explore our product catalog",
      checkOrderHistory: "Check your order history",
      manageCart: "Manage your cart",
      items: "items",
      viewProducts: "View Products",
      myOrders: "My Orders",
      viewCart: "View Cart",
      viewManageProducts: "View and manage all products",
      handleCustomerOrders: "Handle customer orders",
      createNewListings: "Create new product listings",
      manageProducts: "Manage Products",

      // Products
      productName: "Product Name",
      price: "Price",
      category: "Category",
      stock: "Stock",
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",

      // Cart
      cartEmpty: "Your cart is empty",
      cartItems: "Cart Items",
      total: "Total",
      checkout: "Checkout",
      placeOrder: "Place Order",

      // Orders
      orderId: "Order ID",
      orderStatus: "Order Status",
      orderDate: "Order Date",
      customerEmail: "Customer Email",
      totalAmount: "Total Amount",

      // Auth
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      signIn: "Sign In",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password",
      welcomeBack: "Welcome Back!",
      signInToContinue:
        "Sign in to your account to continue your shopping journey",
      usernameOrEmail: "Username or Email",
      signingIn: "Signing In...",
      devLoginAsAdmin: "Dev: Login as Admin",
      dontHaveAccount: "Don't have an account?",
      createOneHere: "Create one here",
      joinCommunity: "Join Our Community!",
      createAccountStart:
        "Create your account and start your amazing shopping experience",
      discoverProducts: "Amazing Products",
      exploreCollection:
        "Explore our curated collection of premium products with amazing deals",
      reviewItemsComplete: "Review your items and complete your purchase",
      noProductsAdded: "Looks like you haven't added any products yet",
      startShopping: "Start Shopping",
      trackOrdersStatus: "Track your orders and see their current status",
      orderSummary: "Order Summary",
      totalOrders: "Total Orders",
      activeOrders: "Active Orders",
      orderHistory: "Order History",
      monitorManageOrders:
        "Monitor and manage all customer orders from one place",
      user: "User",
      manageEcommercePlatform:
        "Manage your e-commerce platform and monitor business activities",
      ecommerceExperienceToday:
        "Here's what's happening with your e-commerce experience today",
      administrator: "Administrator",
      page: "Page",
      of: "of",
      totalItems: "total items",
      first: "First",
      last: "Last",
      loadingAmazingProducts: "Loading Amazing Products",
      pleaseWaitFetchingDeals:
        "Please wait while we fetch the best deals for you...",
      oopsSomethingWentWrong: "Oops! Something went wrong",
      devAdminLoginDetected: "Dev Admin Login Detected",
      pleaseLogoutLoginRealAccount:
        "Please logout and login with your real account to place orders with the correct email",
      goToDashboard: "Go to Dashboard",
      clearDataReload: "Clear Data & Reload",
      emailAddressRequired: "Email Address Required",
      pleaseEnterEmailContinue:
        "Please enter your email address to continue with checkout",
      suggestionTryUsing: "Suggestion: Try using",
      asYourEmail: "as your email",
      enterYourEmailAddress: "Enter your email address",
      quantity: "Quantity",
      placingOrder: "Placing Order...",
      loadingProduct: "Loading Product...",
      pleaseWaitFetchProductDetails:
        "Please wait while we fetch the product details",
      editProduct: "Edit Product",
      updateProductInformationDetails: "Update product information and details",
      currentProduct: "Current Product",
      editInformation: "Edit Information",
      productNameRequired: "Product name is required",
      nameMustBeAtLeast2Characters: "Name must be at least 2 characters",
      priceRequired: "Price is required",
      priceMustBePositive: "Price must be positive",
      enterProductCategory: "Enter product category",
      stockQuantity: "Stock Quantity",
      stockMustBePositive: "Stock must be positive",
      saveChanges: "Save Changes",
      saving: "Saving...",
      addNewProduct: "Add New Product",
      createNewProductAddInventory:
        "Create a new product and add it to your inventory",
      productCreationGuide: "Product Creation Guide",
      fillInProductDetailsBelow: "Fill in the product details below",
      ensureAllRequiredFieldsCompleted:
        "Ensure all required fields are completed",
      clickCreateProductToSave: 'Click "Create Product" to save',
      productInformation: "Product Information",
      enterProductNameExample: "Enter product name (e.g., Wireless Headphones)",
      enterProductCategoryExample:
        "Enter product category (e.g., Electronics, Clothing)",
      optionalHelpsOrganizeProducts: "Optional: Helps organize your products",
      optionalSetTo0IfOutOfStock: "Optional: Set to 0 if out of stock",
      resetForm: "Reset Form",
      creating: "Creating...",
      createProduct: "Create Product",

      // Status
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      cancelled: "Cancelled",
      delivered: "Delivered",
      processing: "Processing",
      returned: "Returned",
      onHold: "On Hold",
    },
  },
  uz: {
    translation: {
      // Common
      welcome: "Xush kelibsiz",
      loading: "Yuklanmoqda...",
      error: "Xatolik",
      save: "Saqlash",
      cancel: "Bekor qilish",
      delete: "O'chirish",
      edit: "Tahrirlash",
      create: "Yaratish",
      submit: "Yuborish",
      back: "Orqaga",
      next: "Keyingi",
      previous: "Oldingi",

      // Navigation
      home: "Bosh sahifa",
      products: "Mahsulotlar",
      cart: "Savat",
      orders: "Buyurtmalar",
      profile: "Profil",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      logout: "Chiqish",

      // Dashboard
      dashboard: "Boshqaruv paneli",
      quickActions: "Tezkor amallar",
      adminActions: "Admin amallari",
      browseProducts: "Mahsulotlarni ko'rish",
      viewOrders: "Buyurtmalarni ko'rish",
      manageOrders: "Buyurtmalar",
      addProduct: "Mahsulot qo'shish",
      shoppingCart: "Xarid savati",
      exploreCatalog: "Mahsulot katalogini ko'rish",
      checkOrderHistory: "Buyurtmalar tarixini ko'rish",
      manageCart: "Savatni boshqarish",
      items: "elementlar",
      viewProducts: "Mahsulotlarni ko'rish",
      myOrders: "Mening buyurtmalarim",
      viewCart: "Savatni ko'rish",
      viewManageProducts: "Barcha mahsulotlarni ko'rish va boshqarish",
      handleCustomerOrders: "Mijoz buyurtmalarini boshqarish",
      createNewListings: "Yangi mahsulot ro'yxatlarini yaratish",
      manageProducts: "Mahsulotlarni boshqarish",

      // Products
      productName: "Mahsulot nomi",
      price: "Narxi",
      category: "Kategoriya",
      stock: "Zaxira",
      addToCart: "Savatga qo'shish",
      outOfStock: "Zaxira yo'q",

      // Cart
      cartEmpty: "Savat bo'sh",
      cartItems: "Savat elementlari",
      total: "Jami",
      checkout: "To'lov",
      placeOrder: "Buyurtma berish",

      // Orders
      orderId: "Buyurtma ID",
      orderStatus: "Buyurtma holati",
      orderDate: "Buyurtma sanasi",
      customerEmail: "Mijoz email",
      totalAmount: "Jami summa",

      // Auth
      username: "Foydalanuvchi nomi",
      email: "Email",
      password: "Parol",
      confirmPassword: "Parolni tasdiqlash",
      signIn: "Kirish",
      signUp: "Ro'yxatdan o'tish",
      forgotPassword: "Parolni unutdingizmi",
      welcomeBack: "Xush kelibsiz!",
      signInToContinue: "Savatga davom etish uchun hisobingizga kiring",
      usernameOrEmail: "Foydalanuvchi nomi yoki Email",
      signingIn: "Kirilmoqda...",
      devLoginAsAdmin: "Dev: Admin sifatida kirish",
      dontHaveAccount: "Hisobingiz yo'qmi?",
      createOneHere: "Bu yerda yarating",
      joinCommunity: "Jamiyatimizga qo'shiling!",
      createAccountStart:
        "Hisobingizni yarating va ajoyib xarid tajribasini boshlang",
      discoverProducts: "Ajoyib mahsulotlar",
      exploreCollection:
        "Ajoyib takliflar bilan premium mahsulotlar to'plamini ko'ring",
      reviewItemsComplete:
        "Mahsulotlaringizni ko'rib chiqing va xaridni yakunlang",
      noProductsAdded: "Hali hech qanday mahsulot qo'shmagansiz",
      startShopping: "Xarid qilishni boshlang",
      trackOrdersStatus:
        "Buyurtmalaringizni kuzatib boring va ularning hozirgi holatini ko'ring",
      orderSummary: "Buyurtma xulosasi",
      totalOrders: "Jami buyurtmalar",
      activeOrders: "Faol buyurtmalar",
      orderHistory: "Buyurtmalar tarixi",
      monitorManageOrders:
        "Barcha mijoz buyurtmalarini bir joydan kuzatib boring va boshqaring",
      user: "Foydalanuvchi",
      manageEcommercePlatform:
        "E-commerce platformangizni boshqaring va biznes faoliyatini kuzatib boring",
      ecommerceExperienceToday:
        "Bugun e-commerce tajribangizda nima bo'layotganini ko'ring",
      administrator: "Administrator",
      noProductsFound: "Hech qanday mahsulot topilmadi",
      noProductsMatchSearch: "Hech qanday mahsulot qidiruvga mos kelmadi",
      tryAddingProducts:
        "Ba'zi mahsulotlar qo'shing yoki qidiruv mezonlarini sozlang",
      clearSearch: "Qidiruvni tozalash",
      deleteProductConfirm: "Haqiqatan ham o'chirmoqchimisiz",
      actionCannotBeUndone: "Bu amalni qaytarib bo'lmaydi!",
      deleting: "O'chirilmoqda...",
      enterProductName: "Mahsulot nomini kiriting...",
      enterCategory: "Kategoriyani kiriting...",
      search: "Qidirish",
      clear: "Tozalash",
      pressEnterToSearch: "Qidirish uchun Enter bosing",
      leaveFieldsEmptyToSeeAll:
        "Barcha mahsulotlarni ko'rish uchun maydonlarni bo'sh qoldiring",
      page: "Sahifa",
      of: "dan",
      totalItems: "jami elementlar",
      first: "Birinchi",
      last: "Oxirgi",
      loadingAmazingProducts: "Ajoyib mahsulotlar yuklanmoqda",
      pleaseWaitFetchingDeals:
        "Siz uchun eng yaxshi takliflarni olishda kuting...",
      oopsSomethingWentWrong: "Ups! Biror narsa noto'g'ri ketdi",
      devAdminLoginDetected: "Dev Admin Login aniqlandi",
      pleaseLogoutLoginRealAccount:
        "Iltimos, chiqib keting va haqiqiy hisobingiz bilan kirib, to'g'ri email bilan buyurtma bering",
      goToDashboard: "Dashboard ga o'tish",
      clearDataReload: "Ma'lumotlarni tozalash va qayta yuklash",
      emailAddressRequired: "Email manzili talab qilinadi",
      pleaseEnterEmailContinue:
        "Iltimos, to'lovni davom ettirish uchun email manzilingizni kiriting",
      suggestionTryUsing: "Tavsiya: Foydalanishga harakat qiling",
      asYourEmail: "email sifatida",
      enterYourEmailAddress: "Email manzilingizni kiriting",
      quantity: "Miqdori",
      placingOrder: "Buyurtma berilmoqda...",
      loadingProduct: "Mahsulot yuklanmoqda...",
      pleaseWaitFetchProductDetails:
        "Iltimos, mahsulot ma'lumotlarini olishda kuting",
      editProduct: "Mahsulotni tahrirlash",
      updateProductInformationDetails:
        "Mahsulot ma'lumotlari va tafsilotlarini yangilang",
      currentProduct: "Hozirgi mahsulot",
      editInformation: "Ma'lumotlarni tahrirlash",
      productNameRequired: "Mahsulot nomi talab qilinadi",
      nameMustBeAtLeast2Characters:
        "Nomi kamida 2 belgidan iborat bo'lishi kerak",
      priceRequired: "Narx talab qilinadi",
      priceMustBePositive: "Narx ijobiy bo'lishi kerak",
      enterProductCategory: "Mahsulot kategoriyasini kiriting",
      stockQuantity: "Zaxira miqdori",
      stockMustBePositive: "Zaxira ijobiy bo'lishi kerak",
      saveChanges: "O'zgarishlarni saqlash",
      saving: "Saqlanmoqda...",
      addNewProduct: "Yangi mahsulot qo'shish",
      createNewProductAddInventory:
        "Yangi mahsulot yarating va zaxirangizga qo'shing",
      productCreationGuide: "Mahsulot yaratish bo'yicha ko'rsatma",
      fillInProductDetailsBelow: "Quyida mahsulot ma'lumotlarini to'ldiring",
      ensureAllRequiredFieldsCompleted:
        "Barcha majburiy maydonlar to'ldirilganligiga ishonch hosil qiling",
      clickCreateProductToSave:
        '"Mahsulot yaratish" tugmasini bosing saqlash uchun',
      productInformation: "Mahsulot ma'lumotlari",
      enterProductNameExample:
        "Mahsulot nomini kiriting (masalan, Simsiz quloqchinlar)",
      enterProductCategoryExample:
        "Mahsulot kategoriyasini kiriting (masalan, Elektronika, Kiyim)",
      optionalHelpsOrganizeProducts:
        "Ixtiyoriy: Mahsulotlaringizni tashkil qilishga yordam beradi",
      optionalSetTo0IfOutOfStock: "Ixtiyoriy: Zaxira tugaganda 0 ga o'rnating",
      resetForm: "Formani qayta o'rnatish",
      creating: "Yaratilmoqda...",
      createProduct: "Mahsulot yaratish",

      // Status
      pending: "Kutilmoqda",
      confirmed: "Tasdiqlangan",
      shipped: "Yuborilgan",
      cancelled: "Bekor qilingan",
      delivered: "Yetkazilgan",
      processing: "Jarayonda",
      returned: "Qaytarilgan",
      onHold: "To'xtatilgan",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
