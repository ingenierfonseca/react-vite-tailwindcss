# Auth feature

Authentication is split into domain contracts, application use cases, an HTTP adapter, and React presentation. The host app supplies its API client, endpoint paths, and token storage at its composition root.

```tsx
const tokenStorage = browserTokenStorage;
configureApiAuth({ tokenStorage, endpoints: ENDPOINTS.AUTH });

const auth = createAuthModule(
  createHttpAuthRepository(api, ENDPOINTS.AUTH),
  tokenStorage,
);

<AuthProvider auth={auth}>
  <App />
</AuthProvider>
```

The host app owns the branded login page and routing. `LoginForm` is the reusable presentation component; it accepts a submit handler and optional labels. `AuthProvider` does not navigate and can be paired with the host app's router.

The HTTP adapter currently maps this project's `/auth/login`, `/auth/me`, and `/auth/logout` contract. When reusing the feature with another backend, supply its endpoint configuration and update or replace the adapter's DTO mapping.

The UI expects React, React Hook Form, Zod, `@hookform/resolvers`, `lucide-react`, and Tailwind CSS utilities. Tailwind theme tokens (such as `primary`) can be replaced in the form styles when copying it into a project with a different design system.
