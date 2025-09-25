# Deltares Data Management Suite



## Development

To spin up the resources locally use:

```bash
docker compose up -V --build
```

Using the `-V` flag will recreate the volumes, which is useful when the package dependencies change.

The application can be accessed in the following ways:

- https://localhost
    - This uses the Caddy proxy to host both front and backend under the same URI. It creates a self-signed certificate for the domain `localhost` that must be accepted by the browser.
    - The backend is accessed through the `/api` path.
- http://localhost:3000
    - This is the front-end application directly accessed.
- http://localhost:8000
    - This is the backend application directly accessed.

## Git Workflow

### Branching Strategy
- **Feature/Adjustment Development:**
  Create a new branch from `main` for each new feature or adjustment.
  - **Branch naming:** Use a descriptive name (e.g., `feature/add-login`, `fix/header-styles`).
  - **Commit messages:** Keep them clear and descriptive.

### Pull Requests (PRs)
- **Merging into `main`:**
  Once your branch is ready, open a **Pull Request (PR)** targeting `main`.
  - Ensure all GitHub workflow checks (CI/CD) are **green** before merging.
  - Add a brief description of the changes and reference any related issues (e.g., `Fixes #123`).

- **Merging into `prod`:**
  When ready to release to production, create a **PR from `main` to `prod`**.
  - Tag at least one developers in the PR for review.
  - Include a summary of changes and any deployment notes.

### Deployment
- **`main` Branch:**
  Automatically deploys updates to the **dev version** of the site.
- **`prod` Branch:**
  Represents the **production environment**. Only merge after thorough testing and approval.