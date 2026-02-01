// Main Expense Tracker Page

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Expense, ExpenseFormData, DateRangePreset } from '@/lib/types';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { exportToCSV } from '@/lib/utils/export';
import { filterExpensesByDateRange } from '@/lib/utils/dateFilters';
import { getDateRangeLabel } from '@/lib/utils/monthFilters';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import TypeFilter from '@/components/dashboard/TypeFilter';
import PaginationControls from '@/components/ui/PaginationControls';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileNav from '@/components/ui/MobileNav';
import BudgetGoalsModal from '@/components/dashboard/BudgetGoalsModal';
import { Plus, Download, Wallet, Settings, LogOut, Inbox, X, Target } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import styles from './page.module.css';

export default function Home() {
  const { expenses, addExpense, addRecurringTransaction, updateExpense, deleteExpense, isLoading } = useExpenses();
  const { settings } = useSettingsContext();
  const { signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangePreset>('thisMonth');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // 3. Filter by Category (NEW)
  const categoryFilteredExpenses = useMemo(() => {
    if (!selectedCategory) return typeFilteredExpenses;

    // For "Expense"/"Income" pseudo-categories in "All" view
    if (filterType === 'all') {
      if (selectedCategory === 'Expense') return typeFilteredExpenses.filter(t => t.type === 'expense');
      if (selectedCategory === 'Income') return typeFilteredExpenses.filter(t => t.type === 'income');
    }

    return typeFilteredExpenses.filter(t => t.category === selectedCategory);
  }, [typeFilteredExpenses, selectedCategory, filterType]);

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
  }, [dateRange, filterType, selectedCategory]);

  // Reset category when main filters change
  useEffect(() => {
    setSelectedCategory(null);
  }, [dateRange, filterType]);

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
      <div className={styles.loading} data-testid="loading-page">
        <div className={styles.spinner}></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.branding}>
              <Image src="/logo.png" alt="BiBudget Logo" width={32} height={32} className={styles.logo} priority />
              <h1 className={styles.title}>BiBudget</h1>
            </div>

            {/* Mobile Navigation */}
            <div className={styles.mobileNav}>
              <MobileNav
                onSettingsClick={handleSettingsClick}
                onExportClick={handleExport}
                onSignOutClick={handleSignOut}
                showExport={expenses.length > 0}
              />
            </div>

            {/* Desktop Navigation */}
            <div className={styles.headerActions}>
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



        <main className={styles.main}>
          <div className={styles.container}>

            {/* Filter Section */}
            {expenses.length > 0 && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <SummaryCards expenses={dateFilteredExpenses} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                        Transaction Type
                      </label>
                      <TypeFilter
                        selected={filterType}
                        onSelect={setFilterType}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                        Date Period
                      </label>
                      <DateRangeFilter
                        selected={dateRange}
                        onSelect={setDateRange}
                        expenses={expenses}
                      />
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {dateFilteredExpenses.length === 0 && (
              <div data-testid="empty-state" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--gray-500)',
                backgroundColor: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                marginTop: '12px'
              }}>
                <div style={{
                  backgroundColor: 'var(--gray-100)',
                  padding: '16px',
                  borderRadius: '50%',
                  marginBottom: '16px'
                }}>
                  <Inbox size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: '8px'
                }}>
                  No transactions found
                </h3>
                <p style={{ maxWidth: '300px', margin: '0 0 24px 0' }}>
                  There are no transactions for this period. Try selecting a different date range or add a new transaction.
                </p>
                <Button variant="primary" onClick={handleAddExpense} data-testid="add-expense-button-empty">
                  <Plus size={18} style={{ marginRight: '8px' }} />
                  Add Transaction
                </Button>
              </div>
            )}

            {/* Breakdown Section */}
            {dateFilteredExpenses.length > 0 && (
              <>
                <div className={styles.dashboardGrid}>
                  <div className={styles.chartSection} data-testid="category-chart">
                    <CategoryBreakdown
                      expenses={typeFilteredExpenses}
                      filterType={filterType}
                      selectedCategory={selectedCategory}
                      onCategorySelect={handleCategorySelect}
                    />
                  </div>
                </div>

                <div className={styles.listSection} data-testid="expense-list-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                      {getDateRangeLabel(dateRange)}
                    </h2>
                    {selectedCategory && (
                      <Button variant="ghost" size="sm" onClick={clearCategoryFilter} style={{ fontSize: '0.8rem', height: '32px' }}>
                        {selectedCategory} <X size={14} style={{ marginLeft: 6 }} />
                      </Button>
                    )}
                  </div>
                  <ExpenseList
                    expenses={paginatedExpenses}
                    onEdit={handleEditExpense}
                    onDelete={deleteExpense}
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

        {/* Floating Action Button - Always visible */}
        <button
          className={styles.fab}
          onClick={handleAddExpense}
          data-testid="fab-add-expense-button"
          aria-label="Add Transaction"
        >
          <Plus size={24} />
        </button>

        {/* Budget Goals Modal */}
        <BudgetGoalsModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          expenses={dateFilteredExpenses}
          expenseTarget={settings.expenseTarget}
          savingTarget={settings.savingTarget}
          currencySymbol={settings.currencySymbol}
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
