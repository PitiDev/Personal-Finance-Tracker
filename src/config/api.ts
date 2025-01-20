// config/api.ts

import { config } from './config';

export const API_BASE_URL = config.apiBaseUrl

export const API_ROUTES = {
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    USER_PROFILE: `${API_BASE_URL}/user/profile`,
    // Add more API routes as needed
};