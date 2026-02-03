import { useState } from 'react';
import { useRecurringTransactions, RecurringTransaction } from '@/lib/hooks/useRecurringTransactions';
import styles from './RecurringTransactionsList.module.css';
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
        return <div className={styles.loading}>Loading recurring transactions...</div>;
    }

    if (recurringTransactions.length === 0) {
        return (
            <div className={styles.empty}>
                <Repeat className={styles.emptyIcon} size={48} />
                <p>No recurring transactions found.</p>
                <span className={styles.emptyHint}>Add one when creating a new transaction!</span>
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
            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{totalIncome}</span>
                    <span className={`${styles.summaryValue} ${styles.income}`}>
                        {formatCurrency(totalIncomeValue, settings.currencySymbol)}
                    </span>
                    <span className={styles.summaryLabel}>Total Recurring Incomes</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{totalExpense}</span>
                    <span className={`${styles.summaryValue} ${styles.expense}`}>
                        {formatCurrency(totalExpenseValue, settings.currencySymbol)}
                    </span>
                    <span className={styles.summaryLabel}>Total Recurring Expenses</span>
                </div>
            </div>

            <div className={styles.list}>
                {recurringTransactions.map(transaction => (
                    <div key={transaction.id} className={styles.item} data-testid="recurring-item">
                        <div className={styles.info}>
                            <div className={styles.header}>
                                <span className={styles.category}>{transaction.category}</span>
                                <span className={`${styles.amount} ${transaction.type === 'income' ? styles.income : styles.expense}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount, settings.currencySymbol)}
                                </span>
                            </div>
                            <div className={styles.details}>
                                <span className={styles.detail}>
                                    <Repeat size={14} /> {transaction.frequency}
                                </span>
                                <span className={styles.detail}>
                                    <Calendar size={14} /> Next: {formatDateDynamic(transaction.next_run, settings.dateFormat)}
                                </span>
                            </div>
                            {transaction.description && (
                                <div className={styles.description}>{transaction.description}</div>
                            )}
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.editButton}
                                onClick={() => handleEdit(transaction)}
                                aria-label="Edit recurring transaction"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                className={styles.deleteButton}
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
