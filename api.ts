
import type { MenuItem, Order, UserProfile, AdminProfile } from './types';
import {
    MENU_STORAGE_KEY,
    ORDERS_STORAGE_KEY,
    USER_PROFILE_KEY,
    ADMIN_PROFILE_KEY,
    CUSTOM_ADMIN_PASSWORD_KEY,
    ADMIN_PASSWORD as DEFAULT_ADMIN_PASSWORD,
    MENU_ITEMS as initialMenu
} from './constants';

// --- Helper Functions ---
const deserializeOrders = (savedOrders: any): Order[] => {
    if (!Array.isArray(savedOrders)) return [];
    return savedOrders.map(order => ({
        ...order,
        timestamp: new Date(order.timestamp),
    }));
};

const getItem = <T>(key: string, defaultValue: T, deserializer?: (value: any) => T): T => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        const parsed = JSON.parse(item);
        return deserializer ? deserializer(parsed) : parsed;
    } catch (e) {
        console.error(`Error reading ${key} from localStorage`, e);
        return defaultValue;
    }
};

const setItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error writing ${key} to localStorage`, e);
    }
};

// --- API Functions (Simulated with Promises) ---

// Menu
export const getMenuItems = async (): Promise<MenuItem[]> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 100));
    return Promise.resolve(getItem<MenuItem[]>(MENU_STORAGE_KEY, initialMenu));
};

export const saveMenuItems = async (items: MenuItem[]): Promise<void> => {
    setItem(MENU_STORAGE_KEY, items);
    return Promise.resolve();
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
    await new Promise(res => setTimeout(res, 100));
    return Promise.resolve(getItem<Order[]>(ORDERS_STORAGE_KEY, [], deserializeOrders));
};

export const saveOrders = async (orders: Order[]): Promise<void> => {
    setItem(ORDERS_STORAGE_KEY, orders);
    return Promise.resolve();
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile> => {
    return Promise.resolve(getItem<UserProfile>(USER_PROFILE_KEY, { loyaltyPoints: 0 }));
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    setItem(USER_PROFILE_KEY, profile);
    return Promise.resolve();
};

// Admin
export const getAdminProfile = async (): Promise<AdminProfile | null> => {
    return Promise.resolve(getItem<AdminProfile | null>(ADMIN_PROFILE_KEY, null));
};

export const saveAdminProfile = async (profile: AdminProfile): Promise<void> => {
    setItem(ADMIN_PROFILE_KEY, profile);
    return Promise.resolve();
};

export const clearAdminProfile = async (): Promise<void> => {
    localStorage.removeItem(ADMIN_PROFILE_KEY);
    return Promise.resolve();
};

export const getAdminPassword = async (): Promise<string> => {
    return Promise.resolve(localStorage.getItem(CUSTOM_ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD);
};

export const setAdminPassword = async (password: string): Promise<void> => {
    localStorage.setItem(CUSTOM_ADMIN_PASSWORD_KEY, password);
    return Promise.resolve();
};
