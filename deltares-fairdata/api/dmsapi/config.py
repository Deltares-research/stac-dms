import ssl
from typing import Any, Dict, Optional, Set

import certifi
from opensearchpy import AsyncOpenSearch, OpenSearch
from stac_fastapi.opensearch.config import OpensearchSettings


def _es_config(settings: "DMSAPISettings") -> Dict[str, Any]:
    # Determine the scheme (http or https)
    use_ssl = settings.es_use_ssl.lower() == "true"
    scheme = "https" if use_ssl else "http"

    # Configure the hosts parameter with the correct scheme
    hosts = [f"{scheme}://{settings.es_host}:{settings.es_port}"]

    # Initialize the configuration dictionary
    config = {
        "hosts": hosts,
        "headers": {"accept": "application/json", "Content-Type": "application/json"},
    }

    # Explicitly exclude SSL settings when not using SSL
    if not use_ssl:
        return config

    # Include SSL settings if using https
    config["ssl_version"] = ssl.PROTOCOL_SSLv23  # type: ignore
    config["verify_certs"] = settings.es_verify_certs.lower() != "false"  # type: ignore

    # Include CA Certificates if verifying certs
    if config["verify_certs"]:
        config["ca_certs"] = settings.curl_ca_bundle or certifi.where()

    # Handle authentication
    if (u := settings.es_user) and (p := settings.es_pass):
        config["http_auth"] = (u, p)

    if api_key := settings.es_api_key:
        if isinstance(config["headers"], dict):
            headers = {**config["headers"], "x-api-key": api_key}

        else:
            config["headers"] = {"x-api-key": api_key}

        config["headers"] = headers

    return config


_forbidden_fields: Set[str] = {"type"}


class DMSAPISettings(OpensearchSettings):
    """API settings.

    Adds configuration of SSO
    """

    azure_app_client_id: str = ""
    azure_app_client_secret: str = ""
    azure_tenant_id: str = ""
    app_domain: str = ""
    app_secret_key: str = ""
    db_connection_url: str = ""
    environment: str = "local"
    es_use_ssl: str = "true"
    es_host: str = "0.0.0.0"
    es_port: str = "9200"
    es_verify_certs: str = "true"
    curl_ca_bundle: Optional[str] = None
    es_user: Optional[str] = None
    es_pass: Optional[str] = None
    es_api_key: Optional[str] = None

    @property
    def create_client(self):
        """Create es client."""
        return OpenSearch(**_es_config(self))


class AsyncDMSAPISettings(OpensearchSettings):
    """API settings.

    Adds configuration of SSO
    """

    azure_app_client_id: str = ""
    azure_app_client_secret: str = ""
    azure_tenant_id: str = ""
    app_domain: str = ""
    app_secret_key: str = ""
    db_connection_url: str = ""
    environment: str = "local"
    es_use_ssl: str = "true"
    es_host: str
    es_port: str
    es_verify_certs: str = "true"
    curl_ca_bundle: Optional[str] = None
    es_user: Optional[str] = None
    es_pass: Optional[str] = None
    es_api_key: Optional[str] = None

    @property
    def create_client(self):
        """Create es client."""
        return AsyncOpenSearch(**_es_config(self))
