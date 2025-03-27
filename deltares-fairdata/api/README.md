# API

This folder contains the API backend for the project. It is a FastAPI application that uses the stac-fastapi library to provide a STAC compliant API. It uses OpenSearch to store the STAC objects and Postgres to store information about users.

The following Python libraries are used in this project:

- [FastAPI](https://fastapi.tiangolo.com/)
    - To generate the API including openapi documentation
- [stac-fastapi-opensearch]
    - The base Stac API backed by OpenSearch
- [SQLAlchemy](https://www.sqlalchemy.org/)
    - To interact with the Postgres database
- [alembic](https://alembic.sqlalchemy.org/en/latest/)
    - To manage database migrations
- [sqlmodel](https://sqlmodel.tiangolo.com/)
    - To define the database models that are Pydantic compatible allowing them to be returned by the FastAPI endpoints


## Database

To run the API you will need to have a Postgres database running. You can use the following command to start a Postgres database using Docker:

```bash
docker compose up postgres -d
```

This will start a Postgres database running on port 5432 with the username and password set to `postgres`.

To create the database tables you can run the following command:

```bash
docker compose exec backend alembic upgrade head
```

### Migrations

When developing new database models, you will need to create a new migration. You can do this by running the following command:
 (replace `Add new table` with a description of the migration)
```bash
docker compose exec backend alembic revision --autogenerate -m "Add new table"
```

This will create a new migration file in the `alembic/versions` folder. You can then apply this migration by running:

```bash
docker compose exec backend alembic upgrade head
```
