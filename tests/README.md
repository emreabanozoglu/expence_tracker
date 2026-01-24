# E2E Testing with Playwright

This directory contains end-to-end tests for the Expense Tracker application using Playwright.

## Test Structure

```
tests/
├── e2e/                    # Test suites
│   ├── auth.spec.ts        # Authentication tests
│   ├── expenses.spec.ts    # Expense CRUD tests
│   ├── dashboard.spec.ts   # Dashboard and analytics tests
│   ├── settings.spec.ts    # Settings tests
│   └── data-persistence.spec.ts  # Data persistence tests
├── fixtures/               # Test fixtures
│   └── auth.fixture.ts     # Authentication setup
├── helpers/                # Helper utilities
│   ├── test-data.ts        # Test data generators
│   └── db-cleanup.ts       # Database cleanup utilities
└── pages/                  # Page Object Models
    ├── auth.page.ts        # Auth page POM
    ├── expenses.page.ts    # Expenses page POM
    ├── dashboard.page.ts   # Dashboard page POM
    └── settings.page.ts    # Settings page POM
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/e2e/auth.spec.ts
```

### Run tests matching a pattern
```bash
npx playwright test --grep "should add"
```

## Test Features

### ✅ Test Isolation
- Each test creates its own unique user
- Tests run independently without affecting each other
- Parallel execution enabled for faster test runs

### ✅ Authentication Fixture
- Automatically creates test users before each test
- Handles login/logout
- Provides cleanup after tests

### ✅ Page Object Model
- Clean, maintainable test code
- Reusable page interactions
- Easy to update when UI changes

### ✅ Test Data Generators
- Unique emails for each test
- Random expense data
- Date utilities for filtering tests

## Test Coverage

### Authentication (7 tests)
- ✅ User signup
- ✅ Invalid email validation
- ✅ Short password validation
- ✅ User login
- ✅ Wrong password error
- ✅ Form toggle
- ✅ Session persistence

### Expense Management (8 tests)
- ✅ Empty state
- ✅ Add expense
- ✅ Add multiple expenses
- ✅ Edit expense
- ✅ Delete expense
- ✅ Form validation
- ✅ Cancel operation
- ✅ Expense ordering

### Dashboard & Analytics (6 tests)
- ✅ Summary cards
- ✅ Category breakdown chart
- ✅ Filter by "This Month"
- ✅ Filter by "Last Month"
- ✅ Real-time updates
- ✅ Empty state

### Settings (8 tests)
- ✅ Change currency
- ✅ Currency persistence
- ✅ Add custom category
- ✅ Delete custom category
- ✅ Category in expense form
- ✅ Category persistence
- ✅ Multiple currency changes
- ✅ Multiple categories

### Data Persistence (6 tests)
- ✅ Persist after refresh
- ✅ Persist after logout/login
- ✅ User data isolation
- ✅ Multiple expenses persistence
- ✅ Edited expenses persistence
- ✅ Deletion persistence

**Total: 35 comprehensive tests**

## Best Practices

### 1. Test Isolation
Each test is completely independent:
```typescript
test.beforeEach(async ({ page }) => {
  authFixture = new AuthFixture(page);
  await authFixture.createAndLoginUser();
});
```

### 2. Page Object Model
Encapsulate page interactions:
```typescript
await expensesPage.addExpense(expenseData);
```

### 3. Unique Test Data
Generate unique data for each test:
```typescript
const email = generateUniqueEmail();
const expenseData = generateExpenseData();
```

### 4. Parallel Execution
Tests run in parallel by default for speed.

## CI/CD Integration

Tests are configured to run in CI environments:
- Automatic retries on failure
- Screenshot/video capture on failure
- HTML report generation

## Troubleshooting

### Tests failing locally?
1. Make sure dev server is running: `npm run dev`
2. Check Supabase connection
3. Verify email confirmation is disabled in Supabase

### Flaky tests?
- Tests include appropriate waits
- Use `test:debug` to step through
- Check browser console in headed mode

### Need to update selectors?
- Update the Page Object Models in `tests/pages/`
- Tests will automatically use new selectors

## Adding New Tests

1. Create test file in `tests/e2e/`
2. Import necessary page objects and fixtures
3. Use `test.describe()` to group related tests
4. Create unique users in `beforeEach`
5. Write isolated, independent tests

Example:
```typescript
import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';

test.describe('My Feature', () => {
  let authFixture: AuthFixture;
  let expensesPage: ExpensesPage;

  test.beforeEach(async ({ page }) => {
    authFixture = new AuthFixture(page);
    await authFixture.createAndLoginUser();
    expensesPage = new ExpensesPage(page);
  });

  test('should do something', async () => {
    // Your test here
  });
});
```
