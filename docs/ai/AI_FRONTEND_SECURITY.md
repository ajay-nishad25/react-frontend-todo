# AI Frontend Security Considerations

This document covers security considerations specific to integrating AI features into the Todo frontend. The backend is responsible for AI agent authorization, AI provider credentials, and all AI logic. This document focuses on frontend-side risks.

---

## 1. Authentication and Token Security

- The app uses Django Token auth (`Authorization: Token <value>`).
- The token is stored in `localStorage` and attached to every request by the Axios interceptor (`src/api/interceptor.js`).
- AI API calls **must** use the same shared Axios instance so the token is automatically attached.
- **Do not create a separate HTTP client** for AI endpoints. The interceptor is the single point for auth header injection.
- The token grants access to all user data. AI endpoints on the backend must validate the token and scope AI actions to the authenticated user.

---

## 2. XSS and localStorage Considerations

- `localStorage` is accessible to any JavaScript running on the same origin. If an XSS vulnerability exists, the token, `userData`, and all persisted preferences can be stolen.
- Current stored keys: `token`, `userData` (JSON with `user_name`, `email`, `theme`), `selectedTheme`, `todoFilters`, `todoViewMode`, `pageSize`.
- **AI integration must not introduce new XSS vectors.** Specifically:
  - Do not use `dangerouslySetInnerHTML` to render AI responses without sanitization.
  - Do not inject AI-generated content into DOM attributes (e.g., `href`, `onclick`).
  - Do not `eval()` or `new Function()` any AI-generated content.
- React's JSX escapes text content by default, which provides baseline XSS protection for plain text rendering.

---

## 3. 401 Handling

- The response interceptor clears the token from `localStorage` on a 401 response but does **not** redirect the user.
- This means after a 401, subsequent API calls (including AI calls) will fail silently without auth.
- **AI chat components must handle 401 gracefully**: detect when the token has been cleared and either redirect to `/login` or show a re-authentication prompt.
- Do not retry AI requests in a loop after a 401 — this would generate unauthenticated traffic.

---

## 4. AI Response Rendering Considerations

AI responses from the backend may contain:
- Plain text
- Markdown formatting
- Code snippets
- Structured data (e.g., suggested todo fields)

**Rules for rendering**:

| Content type | Rendering approach |
|---|---|
| Plain text | Render directly in JSX (React auto-escapes) |
| Markdown | Use a markdown renderer library with HTML sanitization enabled. Do not allow raw HTML pass-through. |
| Code blocks | Render inside `<pre><code>` elements. Do not execute. |
| Structured actions (e.g., "create todo with title X") | Parse the structured data and dispatch existing Redux actions (`createTodo`, `updateTodo`, etc.). Do not construct API calls from raw AI text. |
| HTML in responses | **Strip or sanitize.** Never render raw HTML from AI responses. |

- If a markdown library is added, configure it to disallow `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<style>`, and event handler attributes.

---

## 5. AI API Key Protection

- **No AI API keys should exist in the frontend.** The backend communicates with AI providers (OpenAI, Gemini, etc.) using server-side credentials.
- The frontend only communicates with the project's own backend AI endpoints (e.g., `/api/ai/chat/`), authenticated via the user's Django token.
- Do not add `REACT_APP_OPENAI_KEY` or similar variables to `.env`. CRA bundles all `REACT_APP_*` variables into the client-side JavaScript bundle, making them publicly visible.
- The existing `.env` contains only `REACT_APP_API_BASE_URL` (the backend URL). This is not a secret, but it is committed to the repo — verify this is intentional for any new env vars added.

---

## 6. User Data and Privacy Considerations

- `localStorage` contains `userData` with `user_name` and `email`.
- **Do not send user profile data to AI endpoints** unless explicitly required for the feature. The backend should pull user context from the authenticated token, not from frontend-supplied profile data.
- Todo content (titles, descriptions) will be sent to AI endpoints as part of chat context. Users should be aware their todo data is processed by AI.
- **Do not cache AI conversation history in localStorage.** If persistence is needed, store it on the backend behind authentication. localStorage data persists across sessions and is accessible to any script on the origin.
- If the AI chat displays user messages and AI responses, ensure that user-submitted content is also rendered safely (not just AI responses).

---

## 7. Rate Limiting and Request Control

- The current codebase has no frontend rate limiting on CRUD operations (create, update, delete fire immediately on click).
- Search input has a 600ms debounce (`TodoBoard.js`), which is a good pattern to follow.
- **AI chat must implement frontend-side request control**:
  - Disable the send button while an AI request is in-flight.
  - Debounce or throttle rapid submissions.
  - Show a loading state to prevent duplicate sends.
- Backend rate limiting is the authoritative control, but the frontend should prevent unnecessary request volume.
- The Axios instance has a 15-second timeout. AI responses may take longer. **If AI calls are expected to exceed 15 seconds, use a separate Axios instance with a longer timeout** or make the AI API call outside the shared interceptor's timeout (while still using it for auth header injection).

---

## 8. Streaming Considerations

If the backend provides streaming AI responses (e.g., Server-Sent Events or chunked responses):

- The current Axios interceptor forces `Content-Type: application/json` on all requests. **Streaming responses are fine** — the `Content-Type` header on the request side does not affect response parsing.
- However, Axios does not natively support streaming in the browser. For streaming:
  - Use the browser's native `fetch()` API with `ReadableStream`, or
  - Use the `EventSource` API for Server-Sent Events.
- **If using `fetch()` or `EventSource` directly**: manually attach the `Authorization: Token <value>` header by reading from `localStorage`. `EventSource` does not support custom headers natively — the backend may need to accept the token as a query parameter for SSE, which introduces URL-logged credential risk. Prefer `fetch()` with `ReadableStream` over `EventSource` for this reason.
- **Do not render partial/streaming AI responses using `dangerouslySetInnerHTML`.** Accumulate chunks as plain text and render safely.
- If streaming is used, ensure the component handles connection drops, reconnection, and cleanup on unmount.

---

## 9. Rules That Must Never Be Violated

1. **No AI provider API keys in the frontend.** Not in `.env`, not in source code, not in localStorage. All AI provider communication goes through the backend.
2. **No `dangerouslySetInnerHTML` for AI content** without a strict HTML sanitizer (e.g., DOMPurify). Prefer plain text or sanitized markdown rendering.
3. **No `eval()`, `new Function()`, or dynamic script injection** of AI-generated content.
4. **No frontend-side prompt construction.** The frontend sends user messages to the backend. The backend constructs prompts, manages tools, and calls AI providers.
5. **No bypassing the auth guard.** AI endpoints must require authentication. The frontend must use the existing token-based auth flow.
6. **No storing AI conversation history in localStorage.** Use backend persistence if needed.
7. **No retry loops on 401.** If a 401 is received, stop retrying and prompt re-authentication.
8. **No sending user profile data (`userData` from localStorage) to AI endpoints.** The backend should derive user context from the authenticated token.
9. **No AI features on public routes** (`/login`, `/signup`). AI features must be behind the `Layout.js` auth guard.
10. **No direct AI provider URLs in the frontend.** The frontend communicates only with the project's backend (`REACT_APP_API_BASE_URL`). The backend proxies all AI provider communication.
