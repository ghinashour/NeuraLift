import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // ignore
        }
    }, [key, value]);

    return [value, setValue];
};


