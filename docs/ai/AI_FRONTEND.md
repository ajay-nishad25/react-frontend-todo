# AI Frontend Documentation

## 1. Purpose and Scope

This document describes the frontend architecture of the Todo application as it relates to AI integration. The backend owns the AI agent, tools, memory, authorization, and AI provider credentials. The frontend's role is limited to:

- Sending user messages to authenticated backend AI endpoints.
- Rendering AI responses in the UI.
- Triggering todo CRUD actions based on AI agent output (via existing Redux actions).

---

## 2. Current Frontend Architecture

**Framework**: React 19 with Create React App (`react-scripts 5.0.1`)

```
src/
├── api/                     # Axios-based API layer
│   ├── config.js            # Base URL from env with local fallback
│   ├── interceptor.js       # Shared Axios instance (token attach, 401 handling)
│   ├── authApi.js           # login, signup, logout, reset-password, update-theme
│   └── todoApi.js           # create, get, update, delete todos
├── redux/
│   ├── store.js             # createStore + redux-thunk (classic Redux, not Toolkit)
│   ├── types.js             # Action type constants
│   ├── actions/             # authAction.js, todoAction.js (thunk creators)
│   └── reducer/             # authReducer.js, todoReducer.js, rootReducer.js
├── pages/
│   ├── Login.js             # Public login page
│   ├── Signup.js            # Public signup page
│   └── TodoBoard.js         # Protected main dashboard (~675 lines, app core)
├── components/
│   ├── CreateTodo/          # Create todo modal with side drawer
│   ├── UpdateTodo/          # Update modal + delete confirmation
│   ├── TodoList/            # Card/list view renderer
│   ├── Settings/            # Settings modal (Profile, Appearance, Security tabs)
│   └── EmptyState.js        # Animated empty state
├── layout/
│   ├── Layout.js            # Auth guard (token check) + Navbar + Outlet
│   └── Navbar.js            # Top bar with profile dropdown → Settings
├── utils/
│   ├── theme.js             # Light/dark via data-theme attribute + localStorage
│   ├── useMediaQuery.js     # Responsive breakpoint hook
│   └── getValidEmailCheck.js # Email validation
├── styles/                  # Per-component CSS files
└── assets/                  # SVG icons
```

**Key libraries**: `axios`, `react-redux`, `redux`, `redux-thunk`, `react-router-dom v7`.

---

## 3. State Management

| Layer | What it stores | Mechanism |
|---|---|---|
| **Redux** | `authReducer` (login/signup/logout/reset state), `todoReducer` (createTodo, todoData, deleteTodo) | `createStore` + `redux-thunk` |
| **localStorage** | `token`, `userData`, `selectedTheme`, `todoFilters`, `todoViewMode`, `pageSize` | Direct read/write |
| **Component state** | Form data, loading flags, error messages, modal open/close, search input, pagination | `useState` per component |

- Redux stores API response payloads. Loading and error states are **not** in Redux — they live in component-level `useState`.
- Filters and view preferences are persisted to localStorage and restored on mount.

---

## 4. Authentication and Token Flow

| Step | Detail |
|---|---|
| **Login** | `POST /api/login/` → response contains `{ token, user_data }` → stored in `localStorage` as `token` and `userData` |
| **Token format** | Django Token auth: `Authorization: Token <value>` |
| **Token attachment** | Request interceptor in `src/api/interceptor.js` reads `localStorage.getItem("token")` and attaches it to every request |
| **Auth guard** | `src/layout/Layout.js` checks for token in localStorage; redirects to `/login` if absent |
| **401 response** | Response interceptor removes token from localStorage but does **not** redirect (page stays until next navigation or refresh) |
| **Logout** | `POST /api/logout/` → clears `token`, `userData`, `selectedTheme`, `todoFilters`, `todoViewMode`, `pageSize` from localStorage → navigates to `/login` |

---

## 5. API Communication

**Axios instance** (`src/api/interceptor.js`):
- `baseURL`: from `REACT_APP_API_BASE_URL` env var (fallback: `http://127.0.0.1:8000/api`)
- `timeout`: 15000ms
- `Content-Type`: always `application/json`
- Request interceptor: attaches `Authorization: Token <value>` header
- Response interceptor: clears token on 401

**Current endpoints consumed**:

| Method | Endpoint | Used in |
|---|---|---|
| POST | `/login/` | `authApi.loginApi()` |
| POST | `/signup/` | `authApi.signUpApi()` |
| POST | `/logout/` | `authApi.logoutApi()` |
| POST | `/reset-password/` | `authApi.resetPasswordApi()` |
| POST | `/update-theme/` | `authApi.updateThemeApi()` |
| POST | `/create-todo/` | `todoApi.createTodoApi()` |
| GET | `/get-todos/` | `todoApi.getTodosApi()` |
| PATCH | `/update-todo/` | `todoApi.updateTodoApi()` |
| DELETE | `/delete-todo/` | `todoApi.deleteTodoApi()` |

**Pattern for adding new API calls**: Create a function in a new or existing `src/api/*.js` file that uses the shared `api` instance from `interceptor.js`. Wrap it in a Redux thunk in `src/redux/actions/`. The interceptor handles auth automatically.

---

## 6. Environment and API Configuration

| Variable | Value | File |
|---|---|---|
| `REACT_APP_API_BASE_URL` | `https://django-backend-todo-c1v4.onrender.com/api` | `.env` |
| Fallback | `http://127.0.0.1:8000/api` | `src/api/config.js` |

- The `.env` file is committed to the repository (contains only the backend URL, no secrets).
- No other environment variables are currently used.
- CRA exposes only `REACT_APP_*` prefixed variables to the browser bundle.

---

## 7. Current Todo User Flows Relevant to AI

These are the actions an AI agent could trigger or assist with:

### Create Todo
User clicks "Create New" → `CreateTodo` modal → enters title (required), description, optional status/tag/archive/due date → `dispatch(createTodo(payload))` → `POST /create-todo/` → list refreshes.

### Read/Search/Filter Todos
On mount and on filter/search change → `dispatch(getTodos(page, search, status, order, tag, archive, dueDate, batchSize))` → `GET /get-todos/` with query params. Search is debounced at 600ms. Filters persist in localStorage.

### Update Todo
User clicks a todo → `UpdateTodo` modal pre-filled → edits fields → `dispatch(updateTodo(payload))` → `PATCH /update-todo/` → list refreshes.

### Delete Todo
User clicks delete icon → `DeleteConfirmationModel` → confirms → `dispatch(deleteTodo(todoId))` → `DELETE /delete-todo/` → list refreshes.

### Todo Data Shape (from API)
```
{
  id, title, description, is_completed, tag, is_archived,
  due_date, created_at
}
```

### Tag System
Hardcoded in frontend (duplicated in `TodoBoard.js`, `CreateTodo.js`, `UpdateTodo.js`, `TodoList.js`):
```
[
  { label: "Urgent", id: 1 },
  { label: "Highest Priority", id: 2 },
  { label: "Mid Priority", id: 3 },
  { label: "Low Priority", id: 4 },
  { label: "Someday/Maybe", id: 5 }
]
```

---

## 8. Planned AI Integration Boundary

The frontend will communicate with the backend's AI endpoints. The backend handles all AI logic.

### New files to create (when implementing):

| File | Purpose |
|---|---|
| `src/api/aiApi.js` | API functions for AI endpoints using the shared Axios interceptor |
| `src/redux/types.js` | Add AI-related action type constants |
| `src/redux/actions/aiAction.js` | Thunk action creators for AI operations |
| `src/redux/reducer/aiReducer.js` | Reducer for AI state (chat messages, loading, errors) |
| `src/redux/reducer/rootReducer.js` | Register `aiReducer` in `combineReducers` |
| `src/components/AiChat/` | Chat UI component(s) |

### Integration points in existing code:

| Location | Integration |
|---|---|
| `TodoBoard.js` | Add AI chat trigger button in the toolbar area |
| `Routes.js` | Only if a dedicated AI page is needed; otherwise, overlay on TodoBoard |
| `Layout.js` | No changes needed — AI routes are already protected by existing auth guard |

### What the frontend does NOT handle:
- AI model selection, prompts, or tool definitions
- AI agent memory or conversation persistence
- AI provider API keys or credentials
- Authorization of AI actions (the backend validates every request)

---

## 9. Rules for Future AI-Related Frontend Changes

1. **Do not store AI API keys in the frontend.** All AI provider credentials belong in the backend.
2. **Use the existing Axios interceptor** (`src/api/interceptor.js`) for all AI API calls. Do not create a separate HTTP client.
3. **Follow the existing Redux pattern**: types in `types.js`, thunks in `actions/`, reducer in `reducer/`, register in `rootReducer.js`.
4. **Do not bypass the auth guard.** AI features must be behind the same token-based authentication.
5. **Keep AI chat state in Redux** for consistency with the existing architecture. Use component-level `useState` only for ephemeral UI state (e.g., input field value, modal open/close).
6. **Do not modify existing todo CRUD logic** to accommodate AI. The AI chat component should dispatch the same existing Redux actions (`createTodo`, `updateTodo`, `deleteTodo`, `getTodos`) when the AI agent performs todo operations.
7. **Sanitize AI responses before rendering.** AI-generated content may contain HTML or markdown — render it safely (see `AI_FRONTEND_SECURITY.md`).
8. **Do not add AI logic to the frontend.** No prompt engineering, tool definitions, or response parsing beyond what's needed for display. The backend is the single source of AI logic.
9. **Match existing UI patterns.** Use the same modal/drawer/animation patterns used by `CreateTodo`, `UpdateTodo`, and `SettingsModal`.
10. **Keep CSS in `src/styles/`.** Follow the existing convention of one CSS file per major component.
