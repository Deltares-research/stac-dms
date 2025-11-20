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

### Creating Dummy Collections (Development Only)

For development and testing purposes, you can use the `create-dummy-collections.js` script to create test collections with dummy data and assign permissions to a user.

**Prerequisites:**
- The application must be running (see above)
- You must be logged in via SSO in your browser

**Steps:**

1. **Get your authentication token:**
   - Open your browser and navigate to the frontend (e.g., `http://localhost:3000`)
   - Log in via SSO
   - Open browser DevTools (F12) → Application/Storage tab → Cookies
   - Find the cookie named `DMS_TOKEN` and copy its value

2. **Run the script:**

   **Using Command Prompt (cmd):**
   ```cmd
   cd deltares-fairdata
   set DMS_TOKEN=your-token-value
   set USER_EMAIL=your-email@deltares.nl
   node scripts/create-dummy-collections.js
   ```

   **Using PowerShell:**
   ```powershell
   cd deltares-fairdata
   $env:DMS_TOKEN="your-token-value"
   $env:USER_EMAIL="your-email@deltares.nl"
   node scripts/create-dummy-collections.js
   ```

   **Or pass the values as arguments directly:**
   ```cmd
   cd deltares-fairdata
   node scripts/create-dummy-collections.js http://localhost:8000/api your-email@deltares.nl your-token-value
   ```

**What the script does:**
- Creates 3 dummy collections (`test-collection-1`, `test-collection-2`, `test-collection-3`)
- Gets or creates a user group for the logged-in user
- Assigns `COLLECTION_DATA_STEWARD` role to the group for each collection (giving full edit rights)
- Uploads 5 dummy STAC items per collection (15 items total)

**Environment variables:**
- `API_URL`: Base URL for the API (default: `http://localhost:8000/api`)
- `USER_EMAIL`: Email of the user to grant access 
- `DMS_TOKEN`: Authentication cookie value (required)

**Note:** This script is for development purposes only. It will use the actual logged-in user's email from the authentication token, so the email parameter is mainly for documentation purposes.

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
