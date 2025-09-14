# SchoolPay - School Payments Dashboard

A modern, responsive React.js frontend for a School Payments and Dashboard application built with Vite, Tailwind CSS, and Framer Motion.

## Features

### Core Pages
- **Dashboard**: Overview with KPI cards and recent transactions
- **Transactions Overview**: Paginated, searchable table with advanced filtering
- **Transactions by School**: View transactions for specific schools
- **Transaction Status Check**: Check transaction status by Custom Order ID

### Key Features
- ✅ Responsive design (desktop + mobile)
- ✅ Dark/Light mode toggle with smooth transitions
- ✅ Advanced filtering (status, school, date range)
- ✅ Column sorting with visual indicators
- ✅ Pagination with URL state persistence
- ✅ Real-time loading states and skeleton loaders
- ✅ Smooth animations and micro-interactions
- ✅ Professional SaaS UI/UX design

### Motion Effects
- Subtle hover animations on cards and buttons
- Smooth page transitions
- Staggered list animations
- Button state transitions (loading spinners)
- Status pill color transitions
- Dropdown animations with scale and fade

## Tech Stack

- **React.js** (18.2.0) with Vite
- **Tailwind CSS** for styling with dark mode support
- **Framer Motion** for animations and transitions
- **Axios** for API calls
- **React Router** (6.20.1) for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-payment-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SchoolPay
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Netlify, Vercel, or AWS Amplify.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with theme toggle
│   ├── Table.jsx       # Data table with sorting and animations
│   ├── Pagination.jsx  # Pagination component
│   ├── KPICard.jsx     # KPI card with hover animations
│   ├── StatusPill.jsx  # Status indicator with color transitions
│   ├── TransactionFilters.jsx # Advanced filtering component
│   └── SkeletonLoader.jsx # Loading state components
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── TransactionsOverview.jsx # Transactions table page
│   ├── TransactionsBySchool.jsx # School-specific transactions
│   └── TransactionStatus.jsx # Status check page
├── services/           # API services
│   └── api.js         # Axios instance and API functions
├── contexts/          # React contexts
│   └── ThemeContext.jsx # Dark/light mode context
├── utils/             # Utility functions
│   └── helpers.js    # Helper functions
├── App.jsx           # Main app component with routing
├── main.jsx         # App entry point
└── index.css        # Global styles and Tailwind imports
```

## API Integration

The application expects the following API endpoints:

### Transactions API
- `GET /transactions` - Get paginated transactions with filters
- `GET /transactions/school/:schoolId` - Get transactions for specific school
- `GET /transaction-status/:customOrderId` - Get transaction status
- `GET /schools` - Get list of schools

### Expected Response Format

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10,
  "limit": 25
}
```

## Customization

### Theme Colors
Update `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      success: { /* your success colors */ },
      // ... other colors
    }
  }
}
```

### Animation Settings
Modify animation durations and easing in components or create a centralized animation config.

### API Configuration
Update the base URL and add authentication headers in `src/services/api.js`.

## Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy
3. Set environment variables in Vercel dashboard

### AWS Amplify
1. Connect your repository to AWS Amplify
2. Configure build settings
3. Set environment variables in Amplify console

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.



