# Company settings feature

This feature owns the company profile, brand theme, validation, and settings repository contract. `SettingsProvider` loads it at application startup, exposes previews and persistence, and applies the CSS variables consumed by Tailwind and MUI.

The HTTP adapter reads `GET /settings/1`, saves with `PUT /settings/`, and uploads the logo with `POST /settings/logo` as multipart field `file`. The upload endpoint must return `{ "url": "https://..." }`. The DTO supports the legacy fields (`appName`, `appLogoUrl`, color properties) plus company contact fields.

The logo picker accepts PNG, JPEG, or WebP source files up to 8 MB. The browser preserves aspect ratio, constrains the image to 2048 × 1024 px, converts it to WebP, and limits the uploaded file to 2 MB. The sidebar bounds the logo to 80 × 40 px when expanded and 40 × 40 px when collapsed; the login mark is 40 × 40 px. All display contexts use `object-fit: contain`; the favicon remains a URL field. The backend must independently validate file content, dimensions, and size.

The brand theme has separate light/dark company-name colors and an independent background color for the logo container. The DTO maps these to `companyNameColor`, `companyNameColorDark`, and `logoBackgroundColor`; older server responses fall back to the existing sidebar colors.

The sidebar item and route use `PermissionResource.CompanySettings`. Super-admins have access through the existing permission hook; other roles need the backend permission `companysettings.view` and `companysettings.update`.
