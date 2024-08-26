from stac_fastapi.api.app import StacApi
from dmsapi.core.errors import add_exception_handlers
from stac_fastapi.types.config import ApiSettings, Settings


class StacDmsApi(StacApi):
    """StacApi factory.

    Factory for creating a STAC-compliant FastAPI application.  After
    instantation, the application is accessible from the `StacApi.app` attribute.

    Attributes:
        settings:
            API settings and configuration, potentially using environment
            variables. See https://pydantic-docs.helpmanual.io/usage/settings/.
        client:
            A subclass of `stac_api.clients.BaseCoreClient`.  Defines the
            application logic which is injected into the API.
        extensions:
            API extensions to include with the application.  This may include
            official STAC extensions as well as third-party add ons.
        exceptions:
            Defines a global mapping between exceptions and status codes,
            allowing configuration of response behavior on certain exceptions
            (https://fastapi.tiangolo.com/tutorial/handling-errors/#install-custom-exception-handlers).
        app:
            The FastAPI application, defaults to a fresh application.
        route_dependencies:
            List of tuples of route scope dicts (eg `{'path':
            '/collections', 'method': 'POST'}`) and list of dependencies (e.g.
            `[Depends(oauth2_scheme)]`)).  Applies specified dependencies to
            specified routes. This is useful
            for applying custom auth requirements to routes defined elsewhere in
            the application.
    """

    def __attrs_post_init__(self):
        """Post-init hook.

        Responsible for setting up the application upon instantiation of the class.

        Returns:
            None
        """
        # inject settings
        self.client.extensions = self.extensions
        self.client.stac_version = self.stac_version
        self.client.title = self.title
        self.client.description = self.description

        Settings.set(self.settings)
        self.app.state.settings = self.settings

        # Register core STAC endpoints
        self.register_core()
        self.app.include_router(self.router)

        # keep link to the router prefix value
        router_prefix = self.router.prefix
        self.app.state.router_prefix = router_prefix if router_prefix else ""

        # register extensions
        for ext in self.extensions:
            ext.register(self.app)

        # add health check
        self.add_health_check()

        # register exception handlers
        add_exception_handlers(self.app, status_codes=self.exceptions)

        # customize openapi
        self.app.openapi = self.customize_openapi

        # add middlewares
        if self.middlewares and self.app.middleware_stack is not None:
            raise RuntimeError("Cannot add middleware after an application has started")

        for middleware in self.middlewares:
            self.app.user_middleware.insert(0, middleware)

        # customize route dependencies
        for scopes, dependencies in self.route_dependencies:
            self.add_route_dependencies(scopes=scopes, dependencies=dependencies)
