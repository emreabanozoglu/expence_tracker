// Custom hook for localStorage with SSR support

'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
        } finally {
            setIsInitialized(true);
        }
    }, [key]);

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value: T | ((prev: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    };

    // Function to clear the value
    const clearValue = () => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error clearing ${key} from localStorage:`, error);
        }
    };

    return [storedValue, setValue, clearValue];
}
