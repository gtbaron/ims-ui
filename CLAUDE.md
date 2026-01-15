# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Inventory Management System (IMS) UI built with React 19, TypeScript, Vite, and Redux Toolkit. The application manages items, parts, and pick lists with a backend API at `http://localhost:8080`.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production (runs TypeScript compiler then Vite build)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### State Management (Redux Toolkit)

The application uses Redux Toolkit for centralized state management configured in `src/main.tsx`:

- **Store slices** (in `src/store/slices/`):
  - `ItemsSlice.tsx` - Manages inventory items
  - `PartsSlice.tsx` - Manages individual parts
  - `PickListSlice.tsx` - Manages pick lists
  - `ShopSlice.tsx` - Manages shop-related state

- **Typed hooks** (in `src/store/hooks.tsx`):
  - Use `useAppDispatch()` instead of plain `useDispatch()`
  - Use `useAppSelector` instead of plain `useSelector()`

- **Async data fetching**: All slices use `createAsyncThunk` for API calls (e.g., `fetchItems`, `fetchParts`, `fetchPickLists`). These are dispatched in `App.tsx` on mount to load initial data.

- **Slice pattern**: Each slice follows a consistent pattern:
  - Defines state shape with TypeScript types
  - Provides synchronous reducers (add, update, remove, setSelected)
  - Uses `extraReducers` to handle async thunk states (pending/fulfilled/rejected)
  - Tracks loading status using `LoadingStatus` enum

### API Integration

- **Client configuration** (`src/services/ImsClient.tsx`):
  - Shared Axios instance with base URL `http://localhost:8080`
  - All API services import this `api` instance

- **Service layer** (in `src/services/`):
  - `ItemsService.tsx` - Item CRUD, item-parts relationships, cost calculations
  - `PartsService.tsx` - Parts CRUD operations
  - `PickListService.tsx` - Pick list operations
  - All services follow pattern: `callGetX`, `callCreateX`, `callUpdateX`, `callDeleteX`
  - Services unwrap API responses with shape `ApiResponse<T>` which contains `data` and `success` fields

### Component Structure

```
src/components/
├── items/          # Item management (list, details, financials, parts)
├── parts/          # Parts management (list, details)
├── pickLists/      # Pick list management (list, details)
├── modals/         # Reusable modal dialogs (Add/Edit/Confirm/MissingParts)
└── wrappers/       # Table cell wrappers (Actions, Currency)
```

**Key patterns**:
- **Page components** end with `Page` (e.g., `ItemListPage`, `ItemDetailsPage`)
- **Detail pages** manage local state for editing, then sync to Redux on save
- **ItemDetailsPage** is the most complex component:
  - Manages item metadata, financials, and associated parts
  - Tracks separate lists for new parts (`newItemParts`) and parts to delete (`itemPartsToDelete`)
  - Calculates cost of parts dynamically
  - Uses multiple sub-components: `ItemOverview`, `ItemFinancials`, `ItemPartsList`

### Routing

React Router v7 is configured in `App.tsx`:
- `/items` - Item list page
- `/item-details` - Item details/edit page (receives selected item from Redux state)
- `/parts` - Parts list page
- `/pick-lists` - Pick lists page

Navigation uses `setSelectedItem` action to set the item being viewed, then navigates to `/item-details`.

### Styling

- **Tailwind CSS v4** with Vite plugin
- **Flowbite React** component library for UI elements (Sidebar, Table, Modal, Button, etc.)
- **React Icons** (`react-icons/hi` and `react-icons/hi2`) for iconography

### Path Aliases

TypeScript and Vite are configured with `@/` alias pointing to `src/`:
```typescript
import { Item } from "@/components/items/Item"
import { useAppDispatch } from "@/store/hooks"
```

## Important Notes

- **HMR is unreliable**: Hot Module Replacement does not work correctly in this project. When making frontend changes:
  1. Delete any stale `.js` files in `src/` (run `find src -name "*.js" -type f -delete`)
  2. Clear Vite cache (`rm -rf node_modules/.vite`)
  3. Kill and restart the dev server (`npm run dev`)

- **Dev server configuration**: Vite dev server runs on `0.0.0.0:5173` with polling enabled for Docker/WSL compatibility. HMR uses WebSocket on `localhost:5173`.

- **Type safety**: The project uses TypeScript strict mode. All Redux state and props should be properly typed.

- **File extensions**: Component files use `.tsx` extension even when not exporting React components (e.g., service files, utility files).

- **API response structure**: Backend API returns responses in format:
  ```typescript
  { data: T[], success: boolean }
  ```
  Services typically access `response.data.data` or `response.data.data[0]`.
