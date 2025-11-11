# E-Accounting Dashboard Frontend

A comprehensive financial management dashboard built with React, TypeScript, and modern web technologies. This application provides complete investment portfolio management, transaction tracking, performance analytics, and advanced reporting capabilities.

![E-Accounting Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### 🔐 Authentication System
- **JWT-based authentication** with automatic token refresh
- **Secure login/register** with form validation
- **Protected routes** and navigation guards
- **User session management** with persistent storage

### 💼 Investment Portfolio Management
- **Complete CRUD operations** for investment tracking
- **6 Investment Types**: Stocks, Bonds, Real Estate, Crypto, Mutual Funds, Other
- **Real-time profit/loss calculations** with percentage tracking
- **Advanced filtering** by type, status, amount, and date ranges
- **Investment performance metrics** and risk assessment

### 💳 Transaction Management System
- **3 Transaction Types**: Deposits, Withdrawals, Transfers
- **Investment linking** with automatic balance updates
- **Advanced search and filtering** by multiple criteria
- **Transaction analytics** with summary widgets and trends
- **Professional timeline view** with detailed transaction history

### 📈 Performance Analytics Dashboard
- **Sophisticated returns analysis** with Chart.js visualizations
- **Benchmark comparisons** vs S&P 500, NASDAQ, Treasury bonds
- **Risk metrics**: Volatility, Sharpe ratio, maximum drawdown
- **5-year return projections** with multiple scenario modeling
- **Time period analysis**: Daily, Weekly, Monthly, Quarterly, Yearly

### 📋 Advanced Reporting System
- **6 Report Types**: Portfolio Summary, Investment Performance, Transaction History, Returns Analysis, Risk Assessment, Custom
- **4 Export Formats**: PDF, CSV, Excel, JSON
- **Scheduled reports** with email notifications
- **Custom report builder** with advanced filtering options
- **Trend analysis** with predictive insights

### 🎨 Professional UI/UX
- **Industry-standard financial design** with professional color schemes
- **Responsive layouts** optimized for mobile, tablet, and desktop
- **Interactive Chart.js visualizations** with tooltips and animations
- **Modal-based workflows** for clean user interactions
- **Loading states and error handling** with graceful fallbacks

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 4.9.5** - Static type checking for better code quality
- **React Router DOM 6.21.3** - Client-side routing with nested routes

### UI & Styling
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui components** - Modern, accessible component library
- **Lucide React 0.323.0** - Beautiful, customizable icons
- **Radix UI primitives** - Unstyled, accessible UI components

### Data Visualization
- **Chart.js v4** - Powerful charting library for financial data
- **react-chartjs-2** - React wrapper for Chart.js integration

### HTTP Client & State Management
- **Axios 1.6.7** - Promise-based HTTP client with interceptors
- **React Context API** - Global state management for authentication
- **Local State Management** - Component-level state with React hooks

### Development Tools
- **Create React App 5.0.1** - Zero-config React development setup
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and style consistency

## 📦 Installation

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **Git** for version control

### Clone Repository
```bash
git clone https://github.com/yourusername/E-Accounting-Frontend.git
cd E-Accounting-Frontend
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Start Development Server
```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
# or
yarn build
```

## 🏗️ Project Structure

```
E-Accounting-Frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, Modal)
│   │   ├── layout/           # Layout components (Sidebar, Header)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── investments/      # Investment management components
│   │   ├── transactions/     # Transaction management components
│   │   ├── returns/          # Performance analytics components
│   │   └── reports/          # Reporting system components
│   ├── contexts/             # React Context providers
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Main application pages
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── Login.tsx         # Authentication pages
│   │   └── Register.tsx
│   ├── services/             # API service layers
│   │   ├── api.ts           # Base API configuration
│   │   ├── authService.ts   # Authentication services
│   │   ├── investmentService.ts
│   │   ├── transactionService.ts
│   │   ├── returnsService.ts
│   │   └── reportsService.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── investment.ts
│   │   ├── transaction.ts
│   │   ├── returns.ts
│   │   └── reports.ts
│   ├── utils/                # Utility functions
│   │   └── cn.ts            # Class name utility
│   ├── App.tsx               # Main application component
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── package.json              # Project dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🔌 API Integration

The frontend integrates with a RESTful API backend. Expected endpoints:

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/me            # Get current user
POST /api/auth/refresh       # Refresh JWT token
POST /api/auth/logout        # User logout
```

### Investment Endpoints
```
GET    /api/investments           # List investments
POST   /api/investments           # Create investment
GET    /api/investments/:id       # Get single investment
PUT    /api/investments/:id       # Update investment
DELETE /api/investments/:id       # Delete investment
```

### Transaction Endpoints
```
GET    /api/transactions          # List transactions
POST   /api/transactions          # Create transaction
GET    /api/transactions/:id      # Get single transaction
PUT    /api/transactions/:id      # Update transaction
DELETE /api/transactions/:id      # Delete transaction
GET    /api/transactions/summary  # Transaction analytics
```

### Returns & Analytics Endpoints
```
GET  /api/returns                 # List returns data
GET  /api/returns/analytics       # Performance analytics
GET  /api/returns/performances    # Investment performances
POST /api/returns/calculate       # Calculate returns
GET  /api/returns/benchmarks      # Benchmark data
```

### Reports Endpoints
```
GET    /api/reports               # List reports
POST   /api/reports               # Create report
GET    /api/reports/:id           # Get report
PUT    /api/reports/:id           # Update report
DELETE /api/reports/:id           # Delete report
GET    /api/reports/:id/export    # Export report
```

## 🚀 Usage Guide

### Getting Started
1. **Register/Login** - Create an account or login with existing credentials
2. **Dashboard Overview** - View portfolio summary, charts, and recent activity
3. **Add Investments** - Start by adding your investment portfolio
4. **Track Transactions** - Record deposits, withdrawals, and transfers
5. **Analyze Performance** - Use the returns section for detailed analytics
6. **Generate Reports** - Create custom reports for your financial data

### Key Features Usage

#### Investment Management
- Navigate to **Investments** page
- Click **"Add Investment"** to create new entries
- Use **filters** to search by type, status, or amount
- Click **investment cards** to view detailed information
- **Edit/Delete** investments using the action buttons

#### Transaction Tracking
- Go to **Transactions** page
- Use **"Add Transaction"** for new entries
- **Link transactions** to specific investments
- **Filter by date range**, type, or investment
- View **transaction analytics** in summary widgets

#### Performance Analytics
- Visit **Returns** page for comprehensive analytics
- Select **time periods** for analysis (daily to yearly)
- Compare against **market benchmarks**
- View **risk metrics** and performance projections
- Use **interactive charts** for detailed insights

#### Report Generation
- Access **Reports** page
- Choose from **pre-built templates** or create custom reports
- Set **date ranges** and **filtering options**
- **Export** in PDF, CSV, Excel, or JSON formats
- **Schedule reports** for automatic generation

## 🎯 Development Setup

### Code Style & Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Type Checking
```bash
# Run TypeScript compiler
npx tsc --noEmit

# Watch mode for type checking
npx tsc --noEmit --watch
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🌟 Key Components

### Authentication System
- `AuthContext.tsx` - Global authentication state
- `ProtectedRoute.tsx` - Route protection wrapper
- `Login.tsx` & `Register.tsx` - Authentication forms

### Dashboard Components
- `DashboardLayout.tsx` - Main application layout
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - Top navigation bar
- `PortfolioChart.tsx` - Portfolio performance visualization
- `AssetAllocationChart.tsx` - Investment allocation display

### Investment Management
- `InvestmentCard.tsx` - Investment display cards
- `InvestmentForm.tsx` - Investment creation/editing
- `InvestmentDetail.tsx` - Detailed investment view

### Transaction System
- `TransactionCard.tsx` - Transaction display cards
- `TransactionForm.tsx` - Transaction creation/editing
- `TransactionSummaryWidget.tsx` - Analytics widgets

### Performance Analytics
- `PerformanceOverview.tsx` - Summary metrics
- `PerformanceChart.tsx` - Returns visualization
- `BenchmarkComparison.tsx` - Market comparison
- `ReturnProjections.tsx` - Future projections

### Reporting System
- `ReportBuilder.tsx` - Custom report creation
- `ReportCard.tsx` - Report display cards
- `AnalyticsDashboard.tsx` - Analytics widgets
- `TrendAnalysisWidget.tsx` - Trend visualization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px and above) - Full feature set with sidebar navigation
- **Tablet** (768px - 1023px) - Adaptive layout with collapsible sidebar
- **Mobile** (320px - 767px) - Touch-optimized interface with mobile navigation

## 🔒 Security Features

- **JWT Token Authentication** with automatic refresh
- **Protected Routes** preventing unauthorized access
- **Input Validation** on all forms
- **XSS Protection** through proper data sanitization
- **HTTPS-ready** for secure data transmission

## 🚀 Performance Optimizations

- **Code Splitting** with React.lazy for faster initial loads
- **Memoization** of expensive calculations and components
- **Optimized Bundle Size** with tree shaking
- **Efficient Re-rendering** with proper dependency management
- **Image Optimization** and lazy loading

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow **TypeScript** best practices
- Use **ESLint** and **Prettier** for code formatting
- Write **comprehensive tests** for new features
- Update **documentation** for API changes
- Follow **conventional commit** messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Chart.js** - For powerful data visualization capabilities
- **Radix UI** - For accessible component primitives
- **Lucide** - For beautiful icon library

## 📞 Support

If you have any questions or need help with setup, please:
1. Check the **Issues** tab for existing solutions
2. Create a **New Issue** with detailed information
3. Contact the maintainers directly

---

**Built with ❤️ using React, TypeScript, and Modern Web Technologies**
