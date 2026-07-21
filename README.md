# TODO Web Application - Frontend

This project is the client-side (Frontend) part of a web application designed for task management and personal schedule planning. The interface is built in a modern minimalist style with support for dark and light themes, responsive design, and smooth interactivity.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) - Server and client-side rendering, optimized routing, and bundling.
- **Rendering Library**: React 19 - Modern hooks and reactive UI management.
- **Programming Language**: TypeScript - Complete type safety for data, models, and components.
- **Styling**:
  - TailwindCSS v4 - Utility-first CSS framework for rapid responsive design development.
  - PostCSS - CSS processing and optimization.
- **State Management**: Zustand - Lightweight, reactive client state for tasks and authentication.
- **Network Requests**: Axios - HTTP client configured with Request Interceptors for automatic JWT token injection into authorization headers.
- **Forms and Validation**:
  - React Hook Form - Optimized form state management avoiding unnecessary re-renders.
  - Zod & @hookform/resolvers - Strict client-side data schema validation.
- **Animations**: Framer Motion - Smooth page transitions and modal window animations.
- **Components and Icons**: Lucide React - A comprehensive set of modern vector icons.
- **Notifications**: Sonner - Toast notifications for user feedback on actions.

---

## Features and Functionality

### 1. Landing Page (`/`)
- Presentation landing page for unauthenticated visitors.
- Interactive workspace preview (Dashboard Preview).
- Overview of key system advantages with quick links to register or log in.

### 2. Authentication and Authorization (`/login`, `/register`)
- Real-time interactive form field validation.
- Email availability check prior to form submission.
- "Remember me" functionality: extends the JWT access token lifetime in cookies from 1 day to 30 days.
- Protected Routes (`ProtectedRoute`): automatic redirection of unauthenticated users to the login page.

### 3. Workspace (`/dashboard`)
- **Analytics Panel**: Circular progress indicator (Progress Ring) displaying percentage completed, alongside task counters (Total, Completed, Pending, Overdue).
- **Task Card Layout**: Each task is presented as an informative card containing detailed metadata.
- **Priority System**: Visual priority badges (Low, Medium, High) derived from a 1-10 numerical scale.
- **Deadline Tracking**: Automatic overdue detection highlighting past-due tasks with a red border and an "Overdue" status badge.
- **Modal Windows**: Task creation and editing within pop-up modals without full page reloads.
- **Search & Filtering**: Search bar with auto-debounce filtering by task title, status filters (All, Completed, Pending, Overdue), and sorting by date or priority.
- **Pagination**: Page switching for managing large volumes of tasks.

### 4. User Profile (`/profile`)
- Overview of current user information (Username, Email, Avatar URL).
- Profile updates (modifying username and avatar link).
- Password change with current password verification.
- User logout action.

### 5. Overall UI/UX
- Dark and Light themes with automatic system preference detection.
- Collapsible Sidebar menu to maximize active workspace area.
- Toast notifications providing instant feedback upon task creation, update, status toggle, or deletion.

---

## Environment Variables

For local development or deployment, create a `.env.local` file in the root directory of the frontend project:

```env
NEXT_PUBLIC_API_URL=https://todo-web-application-backend-3xoh.onrender.com/api/v1
```

For connecting to a locally running backend server:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Linting
```bash
npm run lint
```

### 4. Production Build
```bash
npm run build
npm run start
```
