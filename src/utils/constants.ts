export const API_BASE_URL: string =
  process.env.REACT_APP_API_URL || "https://api-e-commerce.tenzorsoft.uz";

export const JWT_STORAGE_KEY: string =
  process.env.REACT_APP_JWT_STORAGE_KEY || "authToken";

export const DEFAULT_LANGUAGE: string =
  process.env.REACT_APP_DEFAULT_LANGUAGE || "uz";

// Developer mode constants
export const DEVELOPER_MODE_CLICK_COUNT = 3;
export const DEVELOPER_MODE_CLICK_TIMEOUT = 3000; // 3 seconds
export const DEVELOPER_MODE_STORAGE_KEY = "developerMode";
