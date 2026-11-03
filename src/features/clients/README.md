# Clients feature

The feature provides a reusable client directory and form. It depends on a `ClientModule`, not on this application's `CustomerService`, router, or permission model. The host application supplies an adapter and controls terminology, extra fields, profile content, permissions, and avatar URLs.

```tsx
const repository = createHttpClientRepository<Client>(api, {
  endpoint: ENDPOINTS.CUSTOMERS,
  avatarEndpoint: (id) => `${ENDPOINTS.CUSTOMERS}${id}/avatar`,
});
const clients = createClientModule(repository);

<ClientsPage
  module={clients}
  createClient={() => ({ id: 0, firstName: "", lastName: "" })}
  labels={labels}
  canCreate={canCreate}
  canEdit={canEdit}
/>
```

For a patient workflow, extend the host's client model with patient-only attributes and pass them through `renderAdditionalFields`. Keep clinical history, risk dashboards, appointments, and billing in the host app's profile extension rather than adding them to the generic client domain.

The host can provide `renderForm` and `renderProfile` when it needs a project-specific form or detail view, while the feature continues to own the directory, pagination, panel lifecycle, and save flow.
