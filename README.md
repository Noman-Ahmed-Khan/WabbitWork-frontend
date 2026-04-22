# WabbitWork - Frontend

## Overview

WabbitWork is a comprehensive team task management application providing teams with centralized task tracking, team collaboration, and project management capabilities. The frontend is built with modern web technologies and follows a component-driven architecture with centralized state management.

## Core Features

- Session-based authentication with secure credential handling
- Multi-team workspace management
- Task creation, assignment, and tracking with priority levels
- Member management with role-based access control
- Real-time notification system
- Advanced search and filtering capabilities
- Responsive design supporting all screen sizes
- Dark mode support with theme persistence

## Architecture Overview

### Application Structure

The application is organized into functional domains with clear separation of concerns:

```
src/
├── api/              # API client layer and service modules
├── components/       # Reusable UI components organized by domain
├── views/            # Page-level components and route containers
├── stores/           # Centralized state management
├── hooks/            # Custom React hooks
├── layouts/          # Layout wrapper components
├── theme/            # Design tokens and theming
├── utils/            # Utility functions and helpers
├── animations/       # Animation variants and transitions
└── config/           # Configuration and environment settings
```

### Technology Stack

#### Core Framework
- **React 18** - Component-based UI framework with hooks
- **Vite** - Next-generation build tool with instant HMR
- **React Router** - Client-side routing and navigation

#### Styling and Design
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Tailwind-based component library
- **PostCSS** - CSS processing pipeline

#### State Management and Data
- **Context API** - Application state management
- **Axios** - HTTP client for API communication

#### Code Quality
- **ESLint** - Static code analysis and linting

## Project Structure

### API Layer (`src/api/`)

The API layer provides abstraction for all backend communication:

- `client.js` - Axios configuration and interceptors
- `auth.js` - Authentication endpoints (login, register, logout, password reset)
- `dashboard.js` - Dashboard metrics and statistics
- `tasks.js` - Task CRUD operations and filtering
- `teams.js` - Team management operations
- `invitations.js` - Team invitation handling
- `sessions.js` - Session management
- `notifications.js` - Notification fetching
- `health.js` - Service health checks

### State Management (`src/stores/`)

Centralized state stores using Context API:

- `authStore.js` - Authentication state (user, session, credentials)
- `taskStore.js` - Task state and operations
- `teamStore.js` - Team data and team-related state
- `notificationStore.js` - Notifications and alerts
- `invitationStore.js` - Pending and sent invitations
- `sessionStore.js` - Session information
- `uiStore.js` - UI state (modals, sidebars, theme)

### Component Organization (`src/components/`)

Components are organized by functional domain:

#### Authentication Components
- `AuthFormContent.jsx` - Form wrapper for auth pages
- `AuthHeader.jsx` - Header section for auth views
- `SocialAuthButtons.jsx` - OAuth provider buttons
- `ForgotPasswordForm.jsx` - Password recovery form
- `PasswordRequirements.jsx` - Password validation display
- `EmailVerificationBanner.jsx` - Email verification status
- `GrainyCard.jsx` - Stylized auth card component
- `BackgroundElements.jsx` - Decorative background effects

#### Navigation Components
- `TopNavBar.jsx` - Main top navigation
- `SideNavBar.jsx` - Collapsible sidebar navigation
- `Dock.jsx` - Bottom dock navigation

#### Task Management Components
- `TaskPanel.jsx` - Task details and editing
- `TaskOverlay.jsx` - Modal for task operations

#### Team Management Components
- `TeamPanel.jsx` - Team details and settings
- `TeamOverlay.jsx` - Modal for team operations
- `MemberPanel.jsx` - Member management interface
- `MemberOverlay.jsx` - Modal for member operations

#### Invitation Components
- `InvitationCard.jsx` - Individual invitation display
- `InvitationList.jsx` - List of received invitations
- `SentInvitationList.jsx` - Outgoing invitations
- `InvitationBadge.jsx` - Badge indicator for invitations
- `InvitationOverlay.jsx` - Modal for invitation actions

#### Notification System
- `NotificationBell.jsx` - Notification indicator
- `NotificationDropdown.jsx` - Notification menu
- `NotificationItem.jsx` - Individual notification item
- `NotificationPreferences.jsx` - Notification settings

#### Landing Page Components
- `HeroSection.jsx` - Main hero section
- `FeaturesSection.jsx` - Feature showcase
- `CTASection.jsx` - Call-to-action section
- `VisionSection.jsx` - Vision and mission
- `FooterSection.jsx` - Footer content
- `TaskSchematic.jsx` - Task visualization
- `TeamSchematic.jsx` - Team visualization
- `LampComputer.jsx` - Decorative computer illustration
- `LandingNav.jsx` - Landing page navigation

#### Primitive Components
- `Badge.jsx` - Generic badge component
- `Button.jsx` - Button variants
- Additional reusable primitives

#### UI Overlays
- `ErrorBoundary.jsx` - Error handling and fallback UI

### Views (`src/views/`)

Page-level components representing application routes:

- `LandingView.jsx` - Public landing page
- `AuthView.jsx` - Login/register page
- `DashboardView.jsx` - Main dashboard
- `TasksView.jsx` - Tasks listing and management
- `TeamsView.jsx` - Teams listing and management
- `InvitationsView.jsx` - Invitations overview
- `ProfileView.jsx` - User profile and settings
- `NotificationsView.jsx` - Notifications page
- `AcceptInvitationView.jsx` - Invitation acceptance
- `DeclineInvitationView.jsx` - Invitation decline
- `InvitationConfirmationView.jsx` - Confirmation page
- `VerifyEmailView.jsx` - Email verification
- `ResetPasswordView.jsx` - Password reset flow

### Hooks (`src/hooks/`)

Custom React hooks for common functionality:

- `useNotificationPoller.js` - Polls notification API at intervals
- `useRouteSearch.js` - Search functionality across routes

### Utilities (`src/utils/`)

Helper functions for common operations:

- `avatar.js` - Avatar generation and management
- `cx.js` - Class name composition utility
- `formatDate.js` - Date formatting utilities
- `search.js` - Search and filtering logic
- `validation.js` - Form validation rules

### Animations (`src/animations/`)

Animation configuration and components:

- `authVariants.js` - Framer Motion variants for auth flows
- `transitions.js` - Transition animations
- `variants.js` - Reusable animation variants
- `LiquidMercury.jsx` - Liquid morphic animation component

### Theming (`src/theme/`)

- `tokens.js` - Design system tokens (colors, spacing, typography)

### Configuration (`src/config/`)

- `env.js` - Environment variable management
- `searchScopes.js` - Search configuration and scopes

### Layouts (`src/layouts/`)

- `Shell.jsx` - Main application shell with navigation
- `Panel.jsx` - Panel layout component

## Data Flow Architecture

### Authentication Flow
1. User submits credentials via AuthView
2. API client sends request via `auth.js`
3. Backend validates and returns session token
4. Token stored in HTTP-only cookie
5. AuthStore updated with user information
6. Protected routes verify authentication

### Task Management Flow
1. TasksView renders task list from taskStore
2. User creates/updates task via TaskOverlay
3. Request sent through `tasks.js` API client
4. Backend persists changes
5. TaskStore updated with new state
6. Components re-render with updated data

### State Update Pattern
1. Component triggers action/event
2. API call made through service module
3. Response received and processed
4. Store context updated
5. Subscribed components re-render

## Installation and Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running and accessible

### Setup Steps

```bash
# Clone repository
git clone <repository-url>
cd wabbitwork-frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Configure environment variables
# Update .env with backend API endpoints

# Start development server
npm run dev
```

### Environment Configuration

Configure the following in `.env`:
- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_APP_NAME` - Application name
- Additional service endpoints as needed

## Build and Deployment

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement on http://localhost:5173

### Production Build

```bash
npm run build
```

Creates optimized production bundle in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing

### Code Quality

```bash
npm run lint
```

Runs ESLint to check code quality and style consistency

## Development Patterns

### Component Development
- Functional components with React hooks
- Props validation and documentation
- Reusable component composition
- Component-level state vs. global state decisions

### State Management
- Context API for global state
- Store hooks for component subscription
- Minimal re-render optimization
- Clear action/state separation

### API Integration
- Service layer abstraction
- Centralized error handling
- Request/response interceptors
- Loading and error states in components

### Styling
- Tailwind utility classes for styling
- DaisyUI components for common patterns
- Theme tokens for consistency
- Responsive design utilities

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Responsive design for mobile devices

## Animations and Graphics

### Animation Framework

The frontend implements sophisticated animations using **Framer Motion**, a production-ready animation library built on top of React. Animations are organized into reusable variants and transitions stored in the `src/animations/` directory.

#### Framer Motion Variants

**Authentication Transitions** (`authVariants.js`):
- Card entrance/exit with 3D flip effects (rotateX transforms)
- Scale and opacity transforms for smooth appearance
- Staggered form field animations (0.06s stagger)
- Exit animations with reverse stagger timing
- Custom easing curves for brutalist design feel

**Page Transitions** (`variants.js`):
- "Building effect" page entry with rotateX and scale
- Modern brutalist easing functions: `[0.23, 1, 0.32, 1]` for snappy starts and smooth finishes
- Shutter/wipe transitions for high-impact page changes
- Staggered child animations for sequential element appearance
- Exit animations with inverse transforms

**Transition Configurations** (`transitions.js`):
- Fast (150ms) transitions for UI feedback
- Normal (200ms) for standard interactions
- Smooth (300ms) for content changes
- Slow smooth (500ms) for emphasis
- Spring physics with configurable damping and stiffness
- Gentle spring for subtle bounce effects
- Bouncy spring for energetic interactions

#### Heavy Graphics - Three.js Liquid Mercury Component

The **LiquidMercury** (`LiquidMercury.jsx`) is a sophisticated WebGL component featuring advanced physics simulations rendered with Three.js:

**Technical Specifications**:
- **Multi-Threaded Physics**: Offloaded to dedicated [Web Workers](src/animations/physics.worker.js) to keep the main UI thread responsive.
- **Particle System**: Dynamic scaling (10,000+ for Desktop, ~800 for Mobile) using instanced meshes.
- **Physics Engine**:
  - Zero-copy data transfer via **Transferable Objects** (ArrayBuffers) at 60Hz.
  - Repulsion forces with 1.5 unit radius and spring-back dynamics.
  - 3D Simplex noise flow fields and organic wave propagation.
  - "Void Entry" system: Particles spawn in the deep background ($z = -100$) for a premium entry effect.

**Advanced Features**:
- Simplex noise (3D) for natural flow generation
- Ray-casting for mouse interaction
- Click-based particle repulsion with decay
- Viewport-aware particle generation
- Phase-offset particle motion for organic movement
- Origin spring-back for particle clustering

**Rendering Pipeline**:
- Canvas-based Three.js renderer with React Three Fiber
- Particle instancing for performance optimization
- Custom shader-based particle updates
- Environmental lighting integration
- Real-time frame updates (useFrame hook)

**Performance Characteristics**:
- **Consistent 60 FPS**: Achieved through multi-threading and GPU-accelerated rendering.
- **Hardware-Aware Scaling**: Automatic adjustment of geometry quality and particle count based on CPU core count.
- **Mobile-Specific Tuning**: 
  - `mediump` precision fragment shaders for faster mobile pixel processing.
  - Locked Device Pixel Ratio (DPR=1.0) on mobile to prevent GPU thermal throttling.
  - Antialiasing disabled on high-PPI screens to reduce fragment shader overhead.
- **Efficient Memory**: Reusable geometries and memoized materials to minimize Garbage Collection (GC) pauses.

### Visual Graphics Components

#### TaskSchematic (`TaskSchematic.jsx`)

Minimalist task matrix visualization:
- Grid-based layout (12 cells in 4x3 configuration)
- Animated pulse indicator on select cells
- Responsive sizing with `clamp()` for fluid scaling
- Hover scale transform (1.02x) for interactivity
- Typography overlay with "MATRIX" text
- Border styling with theme-aware colors
- Background gradient effects

#### TeamSchematic (`TeamSchematic.jsx`)

Team engine visualization with motion:
- Avatar cluster display with negative margin overlap
- Animated "SYNCED" status badge with pulse effect
- Framer Motion progress bar with infinite reverse animation
- Throughput percentage display with dynamic calculations
- Abstract geometric corner accent (border-based)
- Responsive layout adapting to screen sizes
- Horizontal flow animation representing team synchronization

#### LampComputer (`LampComputer.jsx`)

Stylized brutalist terminal aesthetic:
- CSS-based lamp neck structure with border styling
- Terminal screen with:
  - Realistic scan lines using CSS gradients
  - RGB color channel separation effect
  - Glow overlay for CRT monitor feel
  - System status header with animated indicator
  - Multiple rectangular panel placeholders
  - Monospace typography for authentic terminal look
- Motion entry animation (fade + y-offset)
- Shadow effects for depth
- Theme-aware color schemes
- Fully responsive sizing using `clamp()` for fluidity

### CSS Visual Effects

**Scan Lines Effect**:
```css
background: linear-gradient(
  rgba(18,16,16,0) 50%,
  rgba(0,0,0,0.25) 50%
),
linear-gradient(
  90deg,
  rgba(255,0,0,0.06),
  rgba(0,255,0,0.02),
  rgba(0,0,255,0.06)
)
```
Creates authentic CRT monitor scan line appearance with RGB separation.

**Animations Applied**:
- `animate-pulse` - Pulsing opacity for status indicators
- Custom Framer Motion sequences for staggered reveals
- Hover transforms for interactive feedback
- Gradient background shifts for hover states

### Animation Performance Optimization

The application implements a "Performance-First" architecture for its sophisticated visual elements.

**Techniques Implemented**:
- **Web Worker Offloading**: All heavy physics and matrix calculations for the Liquid Mercury system are moved to a background thread.
- **Zero-Copy Transfers**: Uses `ArrayBuffer` transfers between threads to eliminate serialization overhead.
- **Device-Based Degradation**: Real-time detection of low-power devices to scale down animation complexity.
- **GPU Acceleration**: Heavy reliance on CSS `transform` and WebGL shaders to ensure smooth 60fps movement.
- **Lazy Loading & Suspense**: 3D assets and heavy components are loaded only when needed, ensuring the main UI is interactive instantly.
- **Resource Pooling**: Geometries and materials are cached and reused across the application.
- **Reduced Motion Support**: Full compliance with `prefers-reduced-motion` media queries.

For a deep dive into the technical implementation of these optimizations, see the [Optimization Report](OPTIMIZATION_REPORT.md).

### User Experience with Motion

Animations serve functional purposes:
- **Loading States**: Subtle pulse animations indicate pending actions
- **Feedback**: Scale and opacity changes confirm user interactions
- **Guidance**: Staggered animations draw attention to sequential steps
- **Hierarchy**: Motion emphasis highlights important elements
- **Polish**: Micro-interactions create refined, professional feel

## Performance Considerations

- Code splitting at route level
- Lazy loading of components
- Image optimization via Vite
- CSS tree-shaking with Tailwind
- HTTP-only cookies for session security

## Security Measures

- Session-based authentication with HTTP-only cookies
- CSRF protection through backend
- Input validation in forms
- Protected API endpoints
- Secure password handling

## Maintenance and Troubleshooting

### Common Issues

**Development server not starting**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure port 5173 is available

**API connection errors**
- Verify backend is running
- Check environment variables in `.env`
- Verify CORS configuration on backend

**Build failures**
- Clear build cache: `rm -rf dist`
- Update dependencies: `npm install`
- Check Node.js version compatibility

## Project Status

This project fulfills comprehensive requirements for full-stack team management:

- Complete authentication system with session management
- Multi-team workspace support with role-based access
- Full task management with CRUD operations
- Member management and team collaboration
- Advanced filtering and search capabilities
- Responsive and accessible UI design
- Production-ready code quality standards