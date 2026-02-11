import { useState } from 'react';
import { useRecurringTransactions, RecurringTransaction } from '@/lib/hooks/useRecurringTransactions';
import { Trash2, Calendar, Repeat, Edit2 } from 'lucide-react';
import { formatCurrency, formatDateDynamic } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import Modal from '@/components/ui/Modal';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { ExpenseFormData, TransactionType, Category, RecurrenceFrequency } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function RecurringTransactionsList() {
    const { recurringTransactions, isLoading, deleteTransaction, updateTransaction } = useRecurringTransactions();
    const { settings } = useSettingsContext();
    const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);

    const handleEdit = (transaction: RecurringTransaction) => {
        setEditingTransaction(transaction);
    };

    const handleUpdate = async (data: ExpenseFormData) => {
        if (!editingTransaction) return;

        try {
            await updateTransaction(editingTransaction.id, {
                amount: parseFloat(data.amount),
                category: data.category,
                description: data.description,
                type: data.type,
                frequency: data.frequency,
                next_run: data.date, // ExpenseForm 'date' maps to 'next_run'
            });
            setEditingTransaction(null);
            toast.success('Recurring transaction updated');
        } catch (error) {
            console.error('Failed to update transaction:', error);
            toast.error('Failed to update transaction');
        }
    };

    if (isLoading) {
        return <div className="text-center p-8 text-base-content/60">Loading recurring transactions...</div>;
    }

    if (recurringTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 text-center p-8 text-base-content/60">
                <Repeat className="text-base-content/40 mb-2 opacity-50" size={48} />
                <p>No recurring transactions found.</p>
                <span className="text-sm text-base-content/40">Add one when creating a new transaction!</span>
            </div>
        );
    }

    const totalIncome = recurringTransactions.filter(t => t.type === 'income').length;
    const totalExpense = recurringTransactions.filter(t => t.type === 'expense').length;

    const totalIncomeValue = recurringTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenseValue = recurringTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-base-100 border border-base-200 p-4 rounded-xl flex-1 min-w-[150px] flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold mb-1 block text-base-content">{totalIncome}</span>
                    <span className="text-lg font-bold mb-1 block text-success">
                        {formatCurrency(totalIncomeValue, settings.currencySymbol)}
                    </span>
                    <span className="text-sm text-base-content/60 font-medium text-center">Total Recurring Incomes</span>
                </div>
                <div className="bg-base-100 border border-base-200 p-4 rounded-xl flex-1 min-w-[150px] flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold mb-1 block text-base-content">{totalExpense}</span>
                    <span className="text-lg font-bold mb-1 block text-error">
                        {formatCurrency(totalExpenseValue, settings.currencySymbol)}
                    </span>
                    <span className="text-sm text-base-content/60 font-medium text-center">Total Recurring Expenses</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {recurringTransactions.map(transaction => (
                    <div key={transaction.id} className="bg-base-100 border border-base-200 rounded-xl p-4 flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow-md" data-testid="recurring-item">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2 pr-4">
                                <span className="font-semibold text-base text-base-content">{transaction.category}</span>
                                <span className={`font-bold text-base ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount, settings.currencySymbol)}
                                </span>
                            </div>
                            <div className="flex gap-4 mb-1">
                                <span className="flex items-center gap-1 text-xs text-base-content/60 capitalize">
                                    <Repeat size={14} /> {transaction.frequency}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-base-content/60 capitalize">
                                    <Calendar size={14} /> Next: {formatDateDynamic(transaction.next_run, settings.dateFormat)}
                                </span>
                            </div>
                            {transaction.description && (
                                <div className="italic text-sm text-base-content/60 mt-1">{transaction.description}</div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary hover:bg-base-200"
                                onClick={() => handleEdit(transaction)}
                                aria-label="Edit recurring transaction"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10"
                                onClick={() => deleteTransaction(transaction.id)}
                                aria-label="Delete recurring transaction"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                title="Edit Recurring Transaction"
            >
                {editingTransaction && (
                    <ExpenseForm
                        expense={{
                            id: editingTransaction.id,
                            type: editingTransaction.type,
                            amount: editingTransaction.amount,
                            category: editingTransaction.category,
                            description: editingTransaction.description || '',
                            date: editingTransaction.next_run,
                            createdAt: new Date().toISOString(), // Dummy
                            updatedAt: new Date().toISOString(), // Dummy
                        }}
                        initialRecurringState={{
                            isRecurring: true,
                            frequency: editingTransaction.frequency
                        }}
                        showRecurringToggle={false}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingTransaction(null)}
                    // We might need to pass initial recurrence state if ExpenseForm supports it fully
                    // ExpenseForm has local state for isRecurring and frequency.
                    // We can modify ExpenseForm to accept these as props or rely on it inferring from props if we add them.
                    // Since ExpenseForm only takes 'expense' (Transaction), we might need to tweak ExpenseForm props 
                    // OR we can just rely on the user re-setting frequency if they want to change it.
                    // Ideally, we should pass frequency. Let's check ExpenseForm again.
                    // ExpenseForm takes `expense: Expense`. Expense doesn't have frequency.
                    // We should probably extend ExpenseFormProps to accept initialRecurringState.
                    />
                )}
            </Modal>
        </>
    );
}
