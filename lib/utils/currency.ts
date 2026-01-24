// Currency utilities and constants with comprehensive world currency support

import currencyCodes from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

export interface Currency {
    code: string;
    symbol: string;
    name: string;
}

// Get all currencies from currency-codes package
const allCurrencyCodes = currencyCodes.data;

// Build comprehensive currency list with symbols
export const CURRENCIES: Currency[] = allCurrencyCodes
    .map((currency) => ({
        code: currency.code,
        symbol: getSymbolFromCurrency(currency.code) || currency.code,
        name: currency.currency,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

export function getCurrencyByCode(code: string): Currency {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency || CURRENCIES.find(c => c.code === 'USD') || CURRENCIES[0];
}

// Popular currencies for quick access (optional - can be used for a "favorites" section)
export const POPULAR_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'TRY'
].map(code => getCurrencyByCode(code));
