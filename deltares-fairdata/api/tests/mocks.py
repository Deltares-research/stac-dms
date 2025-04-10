from stac_fastapi.opensearch.database_logic import (
    DatabaseLogic,
)


class MockCollectionSerializer:
    """Mock serializer for converting between STAC and database formats."""

    def stac_to_db(self, stac_data: dict, request=None) -> dict:
        """Mock conversion from STAC to database format."""
        return stac_data

    def db_to_stac(self, db_data: dict, request=None) -> dict:
        """Mock conversion from database to STAC format."""
        return db_data


class MockDatabaseLogic(DatabaseLogic):
    """Mock class for DatabaseLogic to use in tests.

    This mock class overrides the DatabaseLogic class from stac-fastapi-opensearch
    to avoid actual OpenSearch operations during testing.
    """

    def __init__(self):
        """Initialize the mock database logic."""
        self.extensions = []
        self.collections = {}
        self.items = {}
        self.collection_serializer = MockCollectionSerializer()
        self.item_serializer = MockCollectionSerializer()  # Using same mock for items

    async def get_collection(self, collection_id: str, **kwargs):
        """Mock getting a collection."""
        if collection_id in self.collections:
            return self.collections[collection_id]
        return None

    async def get_collections(self, **kwargs):
        """Mock getting all collections."""
        return list(self.collections.values())

    async def create_collection(self, collection, **kwargs):
        """Mock creating a collection."""
        self.collections[collection["id"]] = collection  # type: ignore
        return collection

    async def delete_collection(self, collection_id: str, **kwargs):
        """Mock deleting a collection."""
        if collection_id in self.collections:
            del self.collections[collection_id]
        return True

    async def update_collection(self, collection_id: str, collection: dict, **kwargs):
        """Mock updating a collection.

        Args:
            collection_id: ID of the collection to update
            collection: Updated collection data
            **kwargs: Additional arguments

        Returns:
            Updated collection if successful, None if collection not found
        """
        if collection_id in self.collections:
            self.collections[collection_id] = collection
            return collection
        return None

    async def get_item(self, item_id: str, collection_id: str, **kwargs):
        """Mock getting an item."""
        items = self.items.get(collection_id, {})
        return items.get(item_id)

    async def get_items(self, collection_id: str, **kwargs):
        """Mock getting all items in a collection."""
        return list(self.items.get(collection_id, {}).values())

    async def create_item(self, item, **kwargs):
        """Mock creating an item."""
        collection_id = item["collection"]  # type: ignore
        if collection_id not in self.items:
            self.items[collection_id] = {}
        self.items[collection_id][item["id"]] = item  # type: ignore
        return item

    async def delete_item(self, item_id: str, collection_id: str, **kwargs):
        """Mock deleting an item."""
        if collection_id in self.items and item_id in self.items[collection_id]:  # type: ignore
            del self.items[collection_id][item_id]  # type: ignore
        return True
