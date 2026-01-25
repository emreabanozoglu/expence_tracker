// Main Expense Tracker Page

'use client';

import React, { useState, useMemo } from 'react';
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
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileNav from '@/components/ui/MobileNav';
import { Plus, Download, Wallet, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const { expenses, addExpense, updateExpense, deleteExpense, isLoading } = useExpenses();
  const { signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangePreset>('thisMonth');

  // Filter expenses based on date range
  const filteredExpenses = useMemo(() => {
    return filterExpensesByDateRange(expenses, dateRange);
  }, [expenses, dateRange]);

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
    exportToCSV(filteredExpenses);
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
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.branding}>
              <Wallet size={32} className={styles.logo} />
              <h1 className={styles.title}>Expense Tracker</h1>
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
                Add Expense
              </Button>
            </div>
          </div>
        </header>

        {/* Floating Action Button - Always visible */}
        <button
          className={styles.fab}
          onClick={handleAddExpense}
          data-testid="fab-add-expense-button"
          aria-label="Add Expense"
        >
          <Plus size={24} />
        </button>

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Date Range Filter */}
            {expenses.length > 0 && (
              <DateRangeFilter
                selected={dateRange}
                onSelect={setDateRange}
                expenses={expenses}
              />
            )}

            {/* Summary Cards */}
            {filteredExpenses.length > 0 && (
              <div data-testid="summary-cards">
                <SummaryCards expenses={filteredExpenses} />
              </div>
            )}

            {/* Dashboard Grid */}
            {filteredExpenses.length > 0 && (
              <div className={styles.dashboardGrid}>
                <div className={styles.chartSection} data-testid="category-chart">
                  <CategoryBreakdown expenses={filteredExpenses} />
                </div>
              </div>
            )}

            <div className={styles.listSection} data-testid="expense-list-section">
              <h2 className={styles.sectionTitle}>
                {getDateRangeLabel(dateRange)}
              </h2>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEditExpense}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        </main>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
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
