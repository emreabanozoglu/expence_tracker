// Main Expense Tracker Page

'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Expense, ExpenseFormData, DateRangePreset } from '@/lib/types';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { exportToCSV } from '@/lib/utils/export';
import { filterExpensesByDateRange } from '@/lib/utils/dateFilters';
import { getDateRangeLabel } from '@/lib/utils/monthFilters';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';

import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import TypeFilter from '@/components/dashboard/TypeFilter';
import RecurringFilter, { RecurringFilterType } from '@/components/dashboard/RecurringFilter';
import PaginationControls from '@/components/ui/PaginationControls';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TouchButton } from '@/components/ui/TouchButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileNav from '@/components/ui/MobileNav';
import BudgetGoalsModal from '@/components/dashboard/BudgetGoalsModal';
import TransactionDetailsModal from '@/components/dashboard/TransactionDetailsModal';
import { Plus, Download, Wallet, Settings, LogOut, Inbox, X, Target } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useSubscription } from '@/lib/context/SubscriptionContext';
import Link from 'next/link';
import Image from 'next/image';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { useRouter } from 'next/navigation';
import PaymentVerification from '@/components/dashboard/PaymentVerification';
import toast from 'react-hot-toast';

export default function Home() {
  const { expenses, addExpense, addRecurringTransaction, updateExpense, deleteExpense, isLoading } = useExpenses();
  const { settings } = useSettingsContext();
  const { signOut } = useAuth();
  const { refreshSubscription } = useSubscription();
  // searchParams logic moved to PaymentVerification component
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangePreset>('thisMonth');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [recurringFilter, setRecurringFilter] = useState<RecurringFilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Payment verification logic moved to PaymentVerification component

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Filter by Date (Base for everything)
  const dateFilteredExpenses = useMemo(() => {
    return filterExpensesByDateRange(expenses, dateRange);
  }, [expenses, dateRange]);

  // 2. Filter by Type
  const typeFilteredExpenses = useMemo(() => {
    if (filterType === 'all') {
      return dateFilteredExpenses;
    }
    return dateFilteredExpenses.filter(t => t.type === filterType);
  }, [dateFilteredExpenses, filterType]);

  // 3. Filter by Recurring (NEW)
  const recurringFilteredExpenses = useMemo(() => {
    if (recurringFilter === 'all') return typeFilteredExpenses;
    if (recurringFilter === 'recurring') return typeFilteredExpenses.filter(t => t.isRecurring);
    if (recurringFilter === 'non-recurring') return typeFilteredExpenses.filter(t => !t.isRecurring);
    return typeFilteredExpenses;
  }, [typeFilteredExpenses, recurringFilter]);

  // 4. Filter by Category
  const categoryFilteredExpenses = useMemo(() => {
    if (!selectedCategory) return recurringFilteredExpenses;

    // For "Expense"/"Income" pseudo-categories in "All" view
    if (filterType === 'all') {
      if (selectedCategory === 'Expense') return recurringFilteredExpenses.filter(t => t.type === 'expense');
      if (selectedCategory === 'Income') return recurringFilteredExpenses.filter(t => t.type === 'income');
    }

    return recurringFilteredExpenses.filter(t => t.category === selectedCategory);
  }, [recurringFilteredExpenses, selectedCategory, filterType]);

  // 4. Pagination Logic
  const totalItems = categoryFilteredExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return categoryFilteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [categoryFilteredExpenses, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, filterType, recurringFilter, selectedCategory]);

  // Reset category when main filters change
  useEffect(() => {
    setSelectedCategory(null);
  }, [dateRange, filterType, recurringFilter]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const clearCategoryFilter = () => setSelectedCategory(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else if (data.isRecurring) {
      await addRecurringTransaction(data);
    } else {
      await addExpense(data);
    }
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  const handleViewExpense = (expense: Expense) => {
    setViewingExpense(expense);
  };

  const handleExport = () => {
    exportToCSV(typeFilteredExpenses, settings.dateFormat);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettingsClick = () => {
    window.location.href = '/settings';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-base-content/60" data-testid="loading-page">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <PaymentVerification />
      </Suspense>
      <div className="min-h-screen flex flex-col bg-base-100">
        <header className="bg-base-100/80 backdrop-blur-md border-b border-base-200 py-4 sticky top-0 z-50">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Bibudget Logo" width={32} height={32} className="text-primary" priority />
              <h1 className="text-2xl font-bold m-0 text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-focus">Bibudget</h1>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center">
              <MobileNav
                onSettingsClick={handleSettingsClick}
                onExportClick={handleExport}
                onSignOutClick={handleSignOut}
                onBudgetClick={() => setIsBudgetModalOpen(true)}
                showExport={expenses.length > 0}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-3">
              <Button variant="ghost" onClick={() => setIsBudgetModalOpen(true)}>
                <Target size={20} />
                Budget
              </Button>
              <Link href="/settings">
                <Button variant="ghost">
                  <Settings size={20} />
                  Settings
                </Button>
              </Link>
              <Button onClick={signOut} variant="ghost" data-testid="logout-button">
                <LogOut size={20} />
                Logout
              </Button>
              <Button onClick={handleAddExpense} variant="primary" data-testid="add-expense-button">
                <Plus size={20} />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>



        <main className="flex-1 py-8 pb-24 md:pb-8">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-8">

            {/* Filter Section */}
            {expenses.length > 0 && (
              <>


                <div className="mb-6">
                  <div className="flex gap-2 flex-wrap items-stretch">
                    <div className="flex-1 min-w-[300px]">
                      <label className="block mb-2 text-sm font-medium text-base-content/60">
                        Transaction Type
                      </label>
                      <TypeFilter
                        selected={filterType}
                        onSelect={setFilterType}
                      />
                    </div>
                    <div className="flex-1 min-w-[300px] relative">
                      <label className="block mb-2 text-sm font-medium text-base-content/60">
                        Date Period
                      </label>
                      <DateRangeFilter
                        selected={dateRange}
                        onSelect={setDateRange}
                        expenses={expenses}
                      />
                    </div>
                  </div>

                  {filterType === 'expense' && (
                    <div className="mt-9">
                      <label className="block mb-1 text-xs font-medium text-base-content/60">
                        Recurring Status
                      </label>
                      <RecurringFilter
                        selected={recurringFilter}
                        onSelect={setRecurringFilter}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {dateFilteredExpenses.length === 0 && (
              <div data-testid="empty-state" className="flex flex-col items-center justify-center py-12 px-6 text-center text-base-content/60 bg-base-100 border border-base-200 rounded-xl mt-3">
                <div className="bg-base-200 p-4 rounded-full mb-4">
                  <Inbox size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  No transactions found
                </h3>
                <p className="max-w-xs mx-auto mb-6">
                  There are no transactions for this period. Try selecting a different date range or add a new transaction.
                </p>
                <Button variant="primary" onClick={handleAddExpense} data-testid="add-expense-button-empty">
                  <Plus size={18} className="mr-2" />
                  Add Transaction
                </Button>
              </div>
            )}

            {/* Breakdown Section */}
            {dateFilteredExpenses.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-8">
                  <div className="min-h-[300px] md:min-h-[400px]" data-testid="category-chart">
                    <CategoryBreakdown
                      expenses={recurringFilteredExpenses}
                      filterType={filterType}
                      selectedCategory={selectedCategory}
                      onCategorySelect={handleCategorySelect}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6" data-testid="expense-list-section">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold m-0 text-base-content">
                      {getDateRangeLabel(dateRange)}
                    </h2>
                    {selectedCategory && (
                      <Button variant="ghost" size="sm" onClick={clearCategoryFilter} className="text-xs h-8">
                        {selectedCategory} <X size={14} className="ml-1.5" />
                      </Button>
                    )}
                  </div>
                  <ExpenseList
                    expenses={paginatedExpenses}
                    onEdit={handleEditExpense}
                    onDelete={deleteExpense}
                    onItemClick={handleViewExpense}
                  />
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              </>
            )}
          </div>
        </main>


        {/* Floating Action Button - Always visible on mobile */}
        <TouchButton
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-focus text-primary-content border-none shadow-lg cursor-pointer flex items-center justify-center z-[1000] active:scale-95 md:hidden"
          onTap={handleAddExpense}
          data-testid="fab-add-expense-button"
          aria-label="Add Transaction"
        >
          <Plus size={24} />
        </TouchButton>

        {/* Budget Goals Modal */}
        <BudgetGoalsModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          expenses={dateFilteredExpenses}
          expenseTarget={settings.expenseTarget}
          savingTarget={settings.savingTarget}
          currencySymbol={settings.currencySymbol}
        />

        {/* Transaction Details Modal */}
        <TransactionDetailsModal
          isOpen={!!viewingExpense}
          onClose={() => setViewingExpense(null)}
          expense={viewingExpense}
        />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={editingExpense ? 'Edit Transaction' : 'Add New Transaction'}
          size="md"
        >
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
