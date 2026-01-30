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
import PaginationControls from '@/components/ui/PaginationControls';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileNav from '@/components/ui/MobileNav';
import { Plus, Download, Wallet, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import TypeFilter from '@/components/dashboard/TypeFilter';
import styles from './page.module.css';

export default function Home() {
  const { expenses, addExpense, addRecurringTransaction, updateExpense, deleteExpense, isLoading } = useExpenses();
  const { settings } = useSettingsContext();
  const { signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangePreset>('thisMonth');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Filter by Date (Base for everything)
  const dateFilteredExpenses = useMemo(() => {
    return filterExpensesByDateRange(expenses, dateRange);
  }, [expenses, dateRange]);

  // 2. Filter by Type (For Breakdown and List only)
  const typeFilteredExpenses = useMemo(() => {
    if (filterType === 'all') {
      return dateFilteredExpenses;
    }
    return dateFilteredExpenses.filter(t => t.type === filterType);
  }, [dateFilteredExpenses, filterType]);

  // 3. Pagination Logic
  const totalItems = typeFilteredExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return typeFilteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [typeFilteredExpenses, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, filterType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to list top if needed, but smooth behavior might be annoying if list is short.
    // window.scrollTo({ top: 0, behavior: 'smooth' }); 
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
    // Navigation handled by Link component in MobileNav
    window.location.href = '/settings';
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
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
              <Link href="/settings">
                <Button variant="ghost">
                  <Settings size={20} />
                  Settings
                </Button>
              </Link>
              <ThemeToggle />
              {expenses.length > 0 && (
                <Button variant="ghost" onClick={handleExport}>
                  <Download size={20} />
                  Export
                </Button>
              )}
              <Button variant="ghost" onClick={handleSignOut} data-testid="logout-button">
                <LogOut size={20} />
                Sign Out
              </Button>
              <Button variant="primary" onClick={handleAddExpense} data-testid="add-expense-button">
                <Plus size={20} />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>

        {/* Floating Action Button - Always visible */}
        <button
          className={styles.fab}
          onClick={handleAddExpense}
          data-testid="fab-add-expense-button"
          aria-label="Add Transaction"
        >
          <Plus size={24} />
        </button>

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Filter Section */}
            {expenses.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <DateRangeFilter
                  selected={dateRange}
                  onSelect={setDateRange}
                  expenses={expenses}
                />
              </div>
            )}

            {/* Summary Cards - Always filters by Date only */}
            {dateFilteredExpenses.length > 0 && (
              <div data-testid="summary-cards">
                <SummaryCards expenses={dateFilteredExpenses} />
              </div>
            )}

            {/* Budget Progress - Always filters by Date only */}
            <div data-testid="budget-progress">
              <BudgetProgress
                expenses={dateFilteredExpenses}
                expenseTarget={settings.expenseTarget}
                savingTarget={settings.savingTarget}
                currencySymbol={settings.currencySymbol}
              />
            </div>

            {/* Type Filter & Breakdown Section */}
            {dateFilteredExpenses.length > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <TypeFilter
                    selected={filterType}
                    onSelect={setFilterType}
                  />
                </div>

                <div className={styles.dashboardGrid}>
                  <div className={styles.chartSection} data-testid="category-chart">
                    <CategoryBreakdown expenses={typeFilteredExpenses} filterType={filterType} />
                  </div>
                </div>

                <div className={styles.listSection} data-testid="expense-list-section">
                  <h2 className={styles.sectionTitle}>
                    {getDateRangeLabel(dateRange)}
                  </h2>
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
