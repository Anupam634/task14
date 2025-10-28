# Take-Home Assessment Solution

## Overview
This solution addresses the intentional issues in the Node.js backend and React frontend by refactoring blocking I/O, optimizing performance, adding tests, fixing memory leaks, implementing pagination and search, and improving UI/UX.

## Backend (Node.js) Changes

### 1. Refactor Blocking I/O
- **Issue**: `src/routes/items.js` used `fs.readFileSync`, causing blocking operations.
- **Solution**: Replaced with async `fs.readFile` using promises. Updated all routes to handle async operations.
- **Trade-off**: Slightly more complex code due to async/await, but improves scalability and responsiveness.

### 2. Performance Optimization for /api/stats
- **Issue**: Stats recalculated on every request without caching.
- **Solution**: Implemented in-memory caching with 1-minute expiration. Added `fs.watchFile` to invalidate cache on data changes. Utilized `utils/stats.js` for mean calculation.
- **Trade-off**: Memory usage for cache, but significantly reduces CPU load for frequent requests.

### 3. Unit Tests
- **Added**: `tests/items.test.js` with Jest, covering happy paths and error cases for GET /, GET /:id, POST /.
- **Trade-off**: Test setup time, but ensures reliability and prevents regressions.

## Frontend (React) Changes

### 4. Memory Leak Fix
- **Issue**: `Items.js` setState after component unmount if fetch was slow.
- **Solution**: Used `active` flag to prevent state updates after unmount.
- **Trade-off**: Minimal performance impact, ensures component stability.

### 5. Pagination & Search
- **Issue**: No server-side pagination or search.
- **Solution**: Added `page` and `limit` params to backend. Updated frontend to handle pagination and search input. Modified `DataContext` to support query params.
- **Trade-off**: More complex state management, but improves user experience for large datasets.

### 6. Performance (Virtualization)
- **Issue**: Large lists could cause UI lag.
- **Solution**: Attempted to integrate `react-window`, but skipped due to dependency conflicts (React version mismatch). Used CSS `maxHeight` and `overflowY: auto` as alternative.
- **Trade-off**: Not as performant as virtualization, but functional for moderate datasets.

### 7. UI/UX Polish
- **Added**: Loading states, search input, pagination controls, basic styling.
- **Trade-off**: Increased bundle size slightly, but enhances usability.

## Testing
- Backend tests pass with `npm test` in backend directory.
- Frontend tests can be run with `npm test` in frontend directory.

## Trade-offs Summary
- **Performance vs. Complexity**: Caching and async I/O improve performance but add code complexity.
- **Dependencies**: Skipped `react-window` due to version conflicts; used CSS scrolling instead.
- **Validation**: Payload validation for POST items not implemented (as per original omission).
- **Virtualization**: Replaced with simple scrolling to avoid installation issues.

## Running the Application
1. Backend: `cd backend && npm install && npm start`
2. Frontend: `cd frontend && npm install && npm start`
3. Tests: `cd backend && npm test` for backend; `cd frontend && npm test` for frontend.
