
import { useState, useEffect, useCallback } from 'react';

// Custom hook to manage state with localStorage and real-time cross-tab synchronization.
export function useLocalStorage<T>(
    key: string, 
    initialValue: T,
    // Optional deserializer to handle complex data types like Dates on load.
    deserializer?: (value: any) => T
): [T, (value: T | ((val: T) => T)) => void] {

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;

            const parsedItem = JSON.parse(item);
            // Apply deserializer if provided (e.g., for converting date strings to Date objects)
            return deserializer ? deserializer(parsedItem) : parsedItem;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    // A wrapper for setStoredValue that persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    };

    // This effect listens for changes in other tabs
    const handleStorageChange = useCallback((event: StorageEvent) => {
        if (event.key === key && event.newValue) {
            try {
                const parsedItem = JSON.parse(event.newValue);
                const finalValue = deserializer ? deserializer(parsedItem) : parsedItem;
                setStoredValue(finalValue);
            } catch (error) {
                console.error(`Error parsing storage change for key “${key}”:`, error);
            }
        }
    }, [key, deserializer]);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [handleStorageChange]);

    return [storedValue, setValue];
}
