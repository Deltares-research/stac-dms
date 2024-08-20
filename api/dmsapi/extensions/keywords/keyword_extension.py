from dmsapi.extensions.keywords.keyword_client import KeywordClient
from fastapi import APIRouter, FastAPI, Path
from stac_pydantic.shared import MimeTypes
from sqlalchemy.engine import Engine
from stac_fastapi.types.extension import ApiExtension

from dmsapi.database.models import (  # type: ignore
    ErrorResponse,
    Facility,
    Keyword,
    Keyword_GroupPublic,
    OKResponse,
)


class KeywordExtension(ApiExtension):
    """Extension for managing and retrieving keywords

    The keyword extension adds the ability to create, retrieve, update, and delete keywords:

    Manage facilities:
        POST /facility
        GET /facilities
        GET /facility/{facility_id}
        PUT /facility/{facility_id}
        DELETE /facility/{facility_id}

    Link and unlink keyword groups to facilities:
        POST /facility_keyworkgroup_link
        DELETE /facility_keyworkgroup_link

    Manage keyword groups:
        POST /keywordgroup
        GET /keywordgroups
        GET /keywordgroup/{keywordgroup_id}
        DELETE /keywordgroup/{keywordgroup_id}

    Manage keywords:
        POST /keyword
        PUT /keyword/{keyword_id}
        DELETE /keywordgroup/{keywordgroup_id}/keyword/{keyword_id}

    Get keywords:
        GET /keywords?facility_id={facility_id}
        GET /keywords?keywordgroup_id={keywordgroup_id}

    Args:
        ApiExtension (_type_): _description_
    """

    client: KeywordClient
    router: APIRouter

    def __init__(self, db_engine: Engine):
        """Initialize the extension."""
        self.client = KeywordClient(db_engine)
        self.router = APIRouter()

    def register(self, app: FastAPI) -> None:
        """Register the extension with a FastAPI application.

        Args:
            app: target FastAPI application.

        Returns:
            None
        """
        self.router.prefix = app.state.router_prefix
        self.add_create_facility()
        self.add_get_facility()
        self.add_get_facilities()
        self.add_delete_facility()
        self.add_link_keyword_group_to_facility()
        self.add_unlink_keyword_group_from_facility()
        self.add_create_keyword_group()
        self.add_get_keyword_group()
        self.add_delete_keyword_group()
        self.add_create_keyword()
        self.add_get_keyword()
        app.include_router(self.router, tags=["Keyword Extension"])

    def add_create_facility(self):
        self.router.add_api_route(
            name="Create Facility",
            path="/facility",
            endpoint=self.client.create_facility,
            response_model=Facility,
            methods=["POST"],
        )

    def add_get_facility(self):
        self.router.add_api_route(
            name="Get Facility",
            path="/facility/{facility_id}",
            response_model=Facility,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": Facility,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            endpoint=self.client.get_facility,
            methods=["GET"],
        )

    def add_get_facilities(self):
        self.router.add_api_route(
            name="Get Facilities",
            path="/facilities",
            response_model=list[Facility],
            endpoint=self.client.get_facilities,
            methods=["GET"],
        )

    def add_delete_facility(self):
        self.router.add_api_route(
            name="Delete Facility",
            path="/facility/{facility_id}",
            response_model=OKResponse,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": OKResponse,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            endpoint=self.client.delete_facility,
            methods=["DELETE"],
        )

    def add_link_keyword_group_to_facility(self):
        self.router.add_api_route(
            name="Link Keyword Group to Facility",
            path="/facility_keywordgroup_link",
            endpoint=self.client.link_keywordgroup_to_facility,
            response_model=OKResponse,
            methods=["POST"],
        )

    def add_unlink_keyword_group_from_facility(self):
        self.router.add_api_route(
            name="Unlink Keyword Group from Facility",
            path="/facility_keywordgroup_link",
            endpoint=self.client.unlink_keywordgroup_from_facility,
            response_model=OKResponse,
            methods=["DELETE"],
        )

    def add_create_keyword_group(self):
        self.router.add_api_route(
            name="Create Keyword Group",
            path="/keywordgroup",
            endpoint=self.client.create_keywordgroup,
            response_model=Keyword_GroupPublic,
            methods=["POST"],
        )

    def add_get_keyword_group(self):
        self.router.add_api_route(
            name="Get Keyword Group",
            path="/keywordgroup/{keywordgroup_id}",
            response_model=Keyword_GroupPublic,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": Keyword_GroupPublic,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            endpoint=self.client.get_keyword_group,
            methods=["GET"],
        )

    def add_delete_keyword_group(self):
        self.router.add_api_route(
            name="Delete Keyword Group",
            path="/keywordgroup/{keywordgroup_id}",
            response_model=OKResponse,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": OKResponse,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            endpoint=self.client.delete_keyword_group,
            methods=["DELETE"],
        )

    def add_create_keyword(self):
        self.router.add_api_route(
            name="Create Keyword",
            path="/keyword",
            endpoint=self.client.create_keyword,
            response_model=Keyword,
            methods=["POST"],
        )

    def add_get_keyword(self):
        self.router.add_api_route(
            name="Get Keyword",
            path="/keyword/{keyword_id}",
            response_model=Keyword,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": Keyword,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            endpoint=self.client.get_keyword,
            methods=["GET"],
        )
