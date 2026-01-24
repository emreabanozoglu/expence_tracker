// Export utility for downloading expense data

import { Expense } from '../types';
import { formatDate, formatCurrency } from './formatting';

export function exportToCSV(expenses: Expense[]): void {
    if (expenses.length === 0) {
        alert('No expenses to export');
        return;
    }

    // CSV headers
    const headers = ['Date', 'Category', 'Description', 'Amount'];

    // CSV rows
    const rows = expenses.map(expense => [
        expense.date,
        expense.category,
        `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
        expense.amount.toFixed(2),
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

export function exportToJSON(expenses: Expense[]): void {
    if (expenses.length === 0) {
        alert('No expenses to export');
        return;
    }

    const jsonContent = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
