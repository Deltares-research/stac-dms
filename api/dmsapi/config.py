from typing import Any, Dict, Set
from stac_fastapi.opensearch.config import OpensearchSettings


class DMSAPISettings(OpensearchSettings):
    """API settings.

    Adds configuration of SSO
    """

    azure_app_client_id: str
    azure_app_client_secret: str
    azure_tenant_id: str
    app_domain: str
    app_secret_key: str
