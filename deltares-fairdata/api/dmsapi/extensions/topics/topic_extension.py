"""Topic Extension for STAC FastAPI."""
import logging
from typing import List

from fastapi import APIRouter, Request
from stac_fastapi.types.extension import ApiExtension
from stac_fastapi.types.config import Settings

from .topic_mapping import get_topic_name

_LOGGER = logging.getLogger(__name__)


class TopicExtension(ApiExtension):
    """Extension to provide topic aggregation endpoint."""

    def __init__(self, topic_field: str = "properties.deltares:topics.keyword", index_name: str = "items"):
        """Initialize TopicExtension.
        
        Args:
            topic_field: The OpenSearch field path for topics (stored as strings)
            index_name: The OpenSearch index name to query
        """
        self.topic_field = topic_field
        self.index_name = index_name
        self.router = APIRouter()
        self.router.add_api_route(
            name="Get Topics",
            path="/topics",
            methods=["GET"],
            endpoint=self.get_topics,
        )

    async def get_topics(self, request: Request):
        """Get aggregated topics with counts.
        
        Returns:
            dict: JSON response with topics and their counts
        """
        client = None
        try:
            from dmsapi.config import AsyncDMSAPISettings, _es_config
            
            settings = Settings.get()
            
            # Create async client using the config
            from opensearchpy import AsyncOpenSearch
            client = AsyncOpenSearch(**_es_config(settings))

            try:
                indices_response = await client.cat.indices(format="json")
                available_indices = [idx['index'] for idx in indices_response if not idx['index'].startswith('.')]
            except Exception as idx_error:
                _LOGGER.error(f"Could not list indices: {idx_error}")
                available_indices = []
            
            # Use the configured index name (can include wildcards)
            index_name = self.index_name
            
            # Simple aggregation - topics are stored as strings
            body = {
                "size": 0,
                "aggs": {
                    "topics": {
                        "terms": {
                            "field": self.topic_field,
                            "size": 1000,  # Adjust based on expected number of topics
                            "order": {"_count": "desc"}
                        }
                    }
                }
            }
            
            # Execute the search
            resp = await client.search(
                index=index_name,
                body=body
            )
            
            # Extract buckets from aggregation
            buckets = resp.get("aggregations", {}).get("topics", {}).get("buckets", [])
            
            # Format response - use mapping to add names
            topics = []
            for bucket in buckets:
                topic_id = bucket["key"]
                topic_name = get_topic_name(topic_id)  # Use mapping to get name
                
                topics.append({
                    "id": topic_id,
                    "name": topic_name,
                    "count": bucket["doc_count"]
                })
            
            return {"topics": topics}
            
        except Exception as e:
            _LOGGER.error(f"Error retrieving topics: {str(e)}", exc_info=True)
            raise
        finally:
            # Close the client connection
            if client is not None:
                await client.close()

    def register(self, app):
        """Register the extension with a FastAPI application.
        
        Args:
            app: The FastAPI application
        """
        app.include_router(self.router, tags=["Topics"])

    @property
    def conformance_classes(self) -> List[str]:
        """Return conformance classes for the extension."""
        return []