export interface Dictionary {
  navigation: {
    [key: string]: string;
  };
  common: {
    [key: string]: string;
  };
  // Add other dictionary sections as needed
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description?: string;
  date: string;
  // Add other transaction properties
} 