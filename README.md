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

