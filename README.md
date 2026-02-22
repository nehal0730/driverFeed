# Driver Feedback & Sentiment Dashboard

A modern React application for collecting post-trip employee feedback and providing real-time analytics for operations teams.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Access the app at `http://localhost:5174`

## 📁 Architecture

### Tech Stack
- **React 19** - UI library with concurrent features
- **TypeScript** - Type safety with strict mode
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Vite** - Fast build tool
- **Vitest** - Unit testing

### Project Structure
```
src/
├── api/              # API client layer (6 modules)
├── components/       # Atomic design components
│   ├── Atoms/       # Base components (Button, Card, Badge)
│   ├── Molecules/   # Composite (StarRating, TagChip)
│   └── Organisms/   # Features (FeedbackForm, DriverLeaderboard)
├── pages/           # Route components
├── store/           # Zustand state stores
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── constants/       # App configuration
└── utils/           # Helper functions
```

## 🎨 Design Decisions

### 1. **Atomic Design Pattern**
Components are organized in a hierarchy (Atoms → Molecules → Organisms) for maximum reusability and maintainability. This makes the codebase scalable and easier to test.

### 2. **Feature Flag Architecture**
All feedback modules (Driver, Trip, App, Marshal) are controlled by feature flags stored in Zustand. The UI dynamically renders based on these flags without requiring code changes or redeployment.

```javascript
// Example: Feature flags control which feedback sections appear
flags.driverFeedback ? <DriverSection /> : null
```

### 3. **State Management with Zustand**
Chose Zustand over Redux for its simplicity and minimal boilerplate. Each domain has its own store:
- `featureFlagStore` - Feature toggles
- `feedbackStore` - Submission history
- `alertStore` - Notifications & toasts
- `dashboardStore` - UI filters & preferences

### 4. **Mobile-First Responsive Design**
All components use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`) to ensure touch-friendly interfaces on all devices.

### 5. **Accessibility (WCAG 2.1 AA)**
- Semantic HTML with ARIA labels
- Keyboard navigation (Tab, Arrow keys, Enter)
- Focus management with visible indicators
- Color contrast ratios meet 4.5:1 minimum

### 6. **Form Validation Strategy**
- **Inline validation** - Errors shown on blur for immediate feedback
- **Progress tracking** - Visual indicator for multi-section forms
- **Duplicate prevention** - Submit button disabled during submission using `hasSubmitted` state
- **Character limits** - Real-time count with visual feedback

### 7. **Error Handling**
Axios interceptors normalize all API errors into user-friendly messages. Components gracefully handle loading, error, and empty states with appropriate UI feedback.

## 💡 Complex Logic Explained

### FeedbackForm Component
**Challenge**: Dynamically render entity sections based on feature flags while maintaining form state consistency.

**Solution**: 
- Used `useForm` custom hook to centralize state management
- `expandedSections` state syncs with feature flags on mount
- Progress calculation only includes enabled sections to avoid confusion

```javascript
// Only calculate progress for enabled sections
const enabledSections = ['driver', 'trip', 'app', 'marshal']
  .filter(section => flags[`${section}Feedback`]);
const progressPercent = (completedSections.length / enabledSections.length) * 100;
```

### DriverLeaderboard Component
**Challenge**: Provide rich filtering + expandable rows with recent feedback without performance issues.

**Solution**:
- Lazy-load recent feedback only when row expands
- Cache feedback in local state to avoid re-fetching
- Debounced search input to reduce API calls
- Color-coded rows calculated on-the-fly based on rating thresholds

```javascript
// Color logic based on business rules
const getRowClass = (rating) => {
  if (rating >= 4.0) return 'bg-green-50';   // Green: Excellent
  if (rating >= 2.5) return 'bg-amber-50';   // Amber: Warning
  return 'bg-red-50';                        // Red: Needs attention
};
```

### Real-Time Updates
**Challenge**: Keep dashboard data fresh without overwhelming the server.

**Solution**: `useRealTimeUpdates` hook provides configurable polling intervals for different data types. Can be easily upgraded to WebSocket/SSE when backend supports it.

## 🧪 Testing
```bash
npm run test        # Run all tests
npm run test:ui     # Interactive test UI
npm run coverage    # Generate coverage report
```

Tests focus on critical user flows:
- Feedback submission with validation
- Star rating interactions
- Form state management
- Component rendering with feature flags

## 🔧 Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_REAL_TIME_UPDATES=true
```

## 📦 Production Build
```bash
npm run build       # Outputs to dist/
npm run preview     # Preview production build locally
```

Build outputs ~218 KB gzipped. For further optimization, implement code splitting by route.

## 🚢 Deployment
The app is ready for deployment to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker containers**

Ensure all routes redirect to `index.html` for client-side routing.

## 📚 Further Documentation
See [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) for detailed implementation notes and API endpoint documentation.

---

**Status**: ✅ Production Ready  
**Built with**: React 19 + TypeScript + Tailwind CSS
