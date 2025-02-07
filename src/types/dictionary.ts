export interface Dictionary {
  navigation?: {
    [key: string]: string;
  };
  // Add registration form fields
  allFieldsRequired: string;
  passwordMinLength: string;
  registrationFailed: string;
  createAccount: string;
  username: string;
  email: string;
  mainCurrency: string;
  password: string;
  registering: string;
  register: string;
  alreadyHaveAccount: string;
  // Keep existing sections
  dashboard: {
    [key: string]: any; // TODO: Define specific structure
  };
  accountPage: {
    [key: string]: any; // TODO: Define specific structure
  };
  loans: {
    [key: string]: any; // TODO: Define specific structure
  };
  addAccountModal: {
    [key: string]: any; // TODO: Define specific structure
  };
  // Add other sections as needed
} 