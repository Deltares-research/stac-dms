export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Landing Page
         * @description Endpoint.
         */
        get: operations["Landing_Page__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conformance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Conformance Classes
         * @description Endpoint.
         */
        get: operations["Conformance_Classes_conformance_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{collection_id}/items/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Item
         * @description Endpoint.
         */
        get: operations["Get_Item_collections__collection_id__items__item_id__get"];
        /**
         * Update Item
         * @description Endpoint.
         */
        put: operations["Update_Item_collections__collection_id__items__item_id__put"];
        post?: never;
        /**
         * Delete Item
         * @description Endpoint.
         */
        delete: operations["Delete_Item_collections__collection_id__items__item_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search
         * @description Endpoint.
         */
        get: operations["Search_search_get"];
        put?: never;
        /**
         * Search
         * @description Endpoint.
         */
        post: operations["Search_search_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Collections
         * @description Endpoint.
         */
        get: operations["Get_Collections_collections_get"];
        put?: never;
        /**
         * Create Collection
         * @description Endpoint.
         */
        post: operations["Create_Collection_collections_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{collection_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Collection
         * @description Endpoint.
         */
        get: operations["Get_Collection_collections__collection_id__get"];
        /**
         * Update Collection
         * @description Endpoint.
         */
        put: operations["Update_Collection_collections__collection_id__put"];
        post?: never;
        /**
         * Delete Collection
         * @description Endpoint.
         */
        delete: operations["Delete_Collection_collections__collection_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{collection_id}/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Itemcollection
         * @description Endpoint.
         */
        get: operations["Get_ItemCollection_collections__collection_id__items_get"];
        put?: never;
        /**
         * Create Item
         * @description Endpoint.
         */
        post: operations["Create_Item_collections__collection_id__items_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{collection_id}/bulk_items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bulk Create Item
         * @description Endpoint.
         */
        post: operations["Bulk_Create_Item_collections__collection_id__bulk_items_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/queryables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Queryables
         * @description Endpoint.
         */
        get: operations["Queryables_queryables_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{collection_id}/queryables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Collection Queryables
         * @description Endpoint.
         */
        get: operations["Collection_Queryables_collections__collection_id__queryables_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/facility": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Facility
         * @description Create a new facility.
         *
         *     Args:
         *         facility: facility to create.
         *
         *     Returns:
         *         created facility.
         */
        post: operations["Create_Facility_facility_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/facility/{facility_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Facility
         * @description Retrieve a facility by ID.
         *
         *     Args:
         *         facility_id: ID of the facility to retrieve.
         *
         *     Returns:
         *         retrieved facility.
         */
        get: operations["Get_Facility_facility__facility_id__get"];
        /**
         * Update Facility
         * @description Update a facility by ID.
         *
         *     Args:
         *         facility_id: ID of the facility to update.
         *         facility: facility to update.
         *     Returns:
         *         updated facility.
         */
        put: operations["Update_Facility_facility__facility_id__put"];
        post?: never;
        /**
         * Delete Facility
         * @description Delete a facility by ID.
         *
         *     Args:
         *         facility_id: ID of the facility to delete.
         *
         *     Returns:
         *         OKResponse
         */
        delete: operations["Delete_Facility_facility__facility_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/facilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Facilities
         * @description Retrieve all facilities.
         *
         *     Returns:
         *         list of all facilities.
         */
        get: operations["Get_Facilities_facilities_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/facility_keywordgroup_link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Link Keyword Group To Facility
         * @description Link a keyword group to a facility.
         *
         *     Args:
         *         facility_keywrdgroup_link: link to create.
         *
         *     Returns:
         *         OKResponse
         */
        post: operations["Link_Keyword_Group_to_Facility_facility_keywordgroup_link_post"];
        /**
         * Unlink Keyword Group From Facility
         * @description Unlink a keyword group from a facility.
         *
         *     Args:
         *         facility_keywrdgroup_link: link to delete.
         *
         *     Returns:
         *         OKResponse
         */
        delete: operations["Unlink_Keyword_Group_from_Facility_facility_keywordgroup_link_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywordgroup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Keyword Group
         * @description Create a new keyword group.
         *
         *     Args:
         *         keywordgroup: keyword group to create.
         *
         *     Returns:
         *         created keyword group.
         */
        post: operations["Create_Keyword_Group_keywordgroup_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywordgroup/{keywordgroup_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Keyword Group
         * @description Retrieve a keyword group by ID.
         *
         *     Args:
         *         keywordgroup_id: ID of the keyword group to retrieve.
         *
         *     Returns:
         *         retrieved keyword group.
         */
        get: operations["Get_Keyword_Group_keywordgroup__keywordgroup_id__get"];
        /**
         * Update Keyword Group
         * @description Update an existing keyword group.
         *
         *     Args:
         *         keywordgroup: updated keyword group.
         *         keywordgroup_id: ID of the keyword group to update.
         */
        put: operations["Update_Keyword_Group_keywordgroup__keywordgroup_id__put"];
        post?: never;
        /**
         * Delete Keyword Group
         * @description Delete a keyword group by ID.
         *
         *     Args:
         *         keywordgroup_id: ID of the keyword group to delete.
         *
         *     Returns:
         *         None
         */
        delete: operations["Delete_Keyword_Group_keywordgroup__keywordgroup_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywordgroups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Keyword Groups
         * @description Retrieve all keyword groups.
         *
         *     Returns:
         *         list of all keyword groups.
         */
        get: operations["Get_Keyword_Groups_keywordgroups_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keyword": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Keyword
         * @description Create a new keyword.
         *
         *     Args:
         *         keyword: keyword to create.
         *
         *     Returns:
         *         created keyword.
         */
        post: operations["Create_Keyword_keyword_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keyword/{keyword_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Keyword
         * @description Retrieve a keyword by ID.
         *
         *     Args:
         *         keyword_id: ID of the keyword to retrieve.
         *
         *     Returns:
         *         retrieved keyword.
         */
        get: operations["Get_Keyword_keyword__keyword_id__get"];
        /**
         * Update Keyword
         * @description Update a keyword by ID.
         *
         *     Args:
         *         keyword_id: ID of the keyword to update.
         *         keyword: keyword to update.
         *
         *     Returns:
         *         updated keyword.
         */
        put: operations["Update_Keyword_keyword__keyword_id__put"];
        post?: never;
        /**
         * Delete Keyword
         * @description Delete a keyword by ID.
         *
         *     Args:
         *         keyword_id: ID of the keyword to delete.
         *
         *     Returns:
         *         OKResponse
         */
        delete: operations["Delete_Keyword_keyword__keyword_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywords": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Keywords
         * @description Retrieve all keywords from a keyword group or facility.
         *
         *     Args:
         *         facility_id: ID of the facility to retrieve keywords for.
         *         keyword_group_id: ID of the keyword group to retrieve the keywords for.
         *
         *     Returns:
         *         keyword groups with keywords, optionally filtered by facility or keyword group.
         */
        get: operations["Get_Keywords_keywords_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Login
         * @description Redirect the user to the Microsoft login page.
         */
        get: operations["login_auth_login_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Logout
         * @description Forget the user's session.
         */
        get: operations["logout_auth_logout_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Login Callback
         * @description Process login and redirect the user to the protected endpoint.
         */
        get: operations["login_callback_auth_callback_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * User Me
         * @description This endpoint will say return the validated claims of the logged in user.
         */
        get: operations["user_me_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/_mgmt/ping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Ping
         * @description Liveliness/readiness probe.
         */
        get: operations["ping__mgmt_ping_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * Asset
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/item-spec/item-spec.md#asset-object
         */
        Asset: {
            /** Href */
            href: string;
            /** Type */
            type?: string | null;
            /** Title */
            title?: string | null;
            /** Description */
            description?: string | null;
            /** Roles */
            roles?: string[] | null;
            [key: string]: unknown;
        };
        /**
         * BulkTransactionMethod
         * @description Bulk Transaction Methods.
         * @enum {string}
         */
        BulkTransactionMethod: "insert" | "upsert";
        /**
         * Collections
         * @description https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/ogcapi-features#endpoints
         *     https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/ogcapi-features#collections-collections
         */
        Collections: {
            links: components["schemas"]["stac_pydantic__api__links__Links"];
            /** Collections */
            collections: components["schemas"]["stac_pydantic__api__collection__Collection"][];
        };
        /**
         * Conformance
         * @description https://github.com/radiantearth/stac-api-spec/blob/master/api-spec.md#ogc-api---features-endpoints
         */
        Conformance: {
            /** Conformsto */
            conformsTo: string[];
        };
        /** ErrorResponse */
        ErrorResponse: {
            /** Code */
            code: string;
            /** Description */
            description: string;
        };
        /**
         * Extent
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#extent-object
         */
        Extent: {
            spatial: components["schemas"]["SpatialExtent"];
            temporal: components["schemas"]["TimeInterval"];
        };
        /** Facility */
        Facility: {
            /** Name */
            name: string;
            /**
             * Id
             * Format: uuid
             */
            id?: string;
        };
        /** FacilityCreate */
        FacilityCreate: {
            /** Name */
            name: string;
        };
        /** FacilityKeywordGroupLink */
        FacilityKeywordGroupLink: {
            /**
             * Facility Id
             * Format: uuid
             */
            facility_id: string;
            /**
             * Keyword Group Id
             * Format: uuid
             */
            keyword_group_id: string;
        };
        /**
         * GeometryCollection
         * @description GeometryCollection Model
         */
        GeometryCollection: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "GeometryCollection";
            /** Geometries */
            geometries: (components["schemas"]["Point"] | components["schemas"]["MultiPoint"] | components["schemas"]["LineString"] | components["schemas"]["MultiLineString"] | components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"] | components["schemas"]["GeometryCollection"])[];
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /**
         * ItemProperties
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/item-spec/item-spec.md#properties-object
         */
        ItemProperties: {
            /** Title */
            title?: string | null;
            /** Description */
            description?: string | null;
            /** Datetime */
            datetime: string | null;
            /** Created */
            created?: string | null;
            /** Updated */
            updated?: string | null;
            /** Start Datetime */
            start_datetime?: string | null;
            /** End Datetime */
            end_datetime?: string | null;
            /** License */
            license?: string | null;
            /** Providers */
            providers?: components["schemas"]["Provider"][] | null;
            /** Platform */
            platform?: string | null;
            /** Instruments */
            instruments?: string[] | null;
            /** Constellation */
            constellation?: string | null;
            /** Mission */
            mission?: string | null;
            /** Gsd */
            gsd?: number | null;
            [key: string]: unknown;
        };
        /** Items */
        Items: {
            /** Items */
            items: Record<string, never>;
            /** @default insert */
            method: components["schemas"]["BulkTransactionMethod"];
        };
        /** ItemsLink */
        ItemsLink: {
            /** Href */
            href: string;
            /**
             * Rel
             * @enum {string}
             */
            rel: "self" | "items";
            /**
             * Type
             * @default application/geo+json
             * @constant
             * @enum {string}
             */
            type: "application/geo+json";
            /** Title */
            title?: string | null;
            /** Label:Assets */
            "label:assets"?: string | null;
            /**
             * Method
             * @default GET
             * @enum {string}
             */
            method: "GET" | "POST";
            /** Headers */
            headers?: Record<string, never> | null;
            /** Body */
            body?: Record<string, never> | null;
            /**
             * Merge
             * @default false
             */
            merge: boolean;
            [key: string]: unknown;
        };
        /** Keyword */
        Keyword: {
            /** Nl Keyword */
            nl_keyword: string;
            /** En Keyword */
            en_keyword: string;
            /** External Id */
            external_id?: string | null;
            /**
             * Group Id
             * Format: uuid
             */
            group_id: string;
            /**
             * Id
             * Format: uuid
             */
            id?: string;
        };
        /** KeywordBase */
        KeywordBase: {
            /** Nl Keyword */
            nl_keyword: string;
            /** En Keyword */
            en_keyword: string;
            /** External Id */
            external_id?: string | null;
            /**
             * Group Id
             * Format: uuid
             */
            group_id: string;
        };
        /** KeywordPublic */
        KeywordPublic: {
            /** Nl Keyword */
            nl_keyword?: string | null;
            /** En Keyword */
            en_keyword?: string | null;
            /** External Id */
            external_id?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /** KeywordUpdate */
        KeywordUpdate: {
            /** Nl Keyword */
            nl_keyword?: string | null;
            /** En Keyword */
            en_keyword?: string | null;
            /** External Id */
            external_id?: string | null;
        };
        /** Keyword_GroupCreate */
        Keyword_GroupCreate: {
            /** Group Name Nl */
            group_name_nl: string;
            /** Group Name En */
            group_name_en: string;
        };
        /** Keyword_GroupPublic */
        Keyword_GroupPublic: {
            /** Group Name Nl */
            group_name_nl: string;
            /** Group Name En */
            group_name_en: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /** Keyword_GroupPublicWithKeywords */
        Keyword_GroupPublicWithKeywords: {
            /** Group Name Nl */
            group_name_nl: string;
            /** Group Name En */
            group_name_en: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Keywords
             * @default []
             */
            keywords: components["schemas"]["KeywordPublic"][];
        };
        /** Keyword_GroupUpdate */
        Keyword_GroupUpdate: {
            /** Group Name Nl */
            group_name_nl?: string | null;
            /** Group Name En */
            group_name_en?: string | null;
        };
        /**
         * LandingPage
         * @description https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/core
         *     https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/ogcapi-features#landing-page-
         *     https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/item-search#link-relations
         */
        LandingPage: {
            /** Id */
            id: string;
            /** Description */
            description: string;
            /**
             * Stac Version
             * @default 1.0.0
             */
            stac_version: string;
            links: components["schemas"]["stac_pydantic__api__links__Links"];
            /**
             * Stac Extensions
             * @default []
             */
            stac_extensions: string[] | null;
            /** Title */
            title?: string | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "Catalog";
            /**
             * Conformsto
             * @default [
             *       "https://api.stacspec.org/v1.0.0/core",
             *       "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core"
             *     ]
             */
            conformsTo: string[];
            [key: string]: unknown;
        };
        /**
         * LineString
         * @description LineString Model
         */
        LineString: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "LineString";
            /** Coordinates */
            coordinates: (components["schemas"]["Position2D"] | components["schemas"]["Position3D"])[];
        };
        /**
         * Link
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#link-object
         */
        Link: {
            /** Href */
            href: string;
            /** Rel */
            rel: string;
            type?: components["schemas"]["MimeTypes"] | null;
            /** Title */
            title?: string | null;
            /** Label:Assets */
            "label:assets"?: string | null;
            [key: string]: unknown;
        };
        /**
         * MimeTypes
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/item-spec/item-spec.md#media-types
         * @enum {string}
         */
        MimeTypes: "image/tiff; application=geotiff" | "image/tiff; application=geotiff; profile=cloud-optimized" | "image/jp2" | "image/png" | "image/jpeg" | "application/geo+json" | "application/geo+json-seq" | "application/geopackage+sqlite3" | "application/vnd.google-earth.kml+xml" | "application/vnd.google-earth.kmz" | "application/x-protobuf" | "application/vnd.mapbox-vector-tile" | "application/x-hdf" | "application/x-hdf5" | "application/xml" | "application/json" | "application/ndjson" | "text/html" | "text/plain" | "application/vnd.oai.openapi+json;version=3.0" | "application/vnd.oai.openapi;version=3.0" | "application/schema+json" | "application/pdf" | "text/csv" | "application/vnd.apache.parquet";
        /**
         * MultiLineString
         * @description MultiLineString Model
         */
        MultiLineString: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "MultiLineString";
            /** Coordinates */
            coordinates: (components["schemas"]["Position2D"] | components["schemas"]["Position3D"])[][];
        };
        /**
         * MultiPoint
         * @description MultiPoint Model
         */
        MultiPoint: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "MultiPoint";
            /** Coordinates */
            coordinates: (components["schemas"]["Position2D"] | components["schemas"]["Position3D"])[];
        };
        /**
         * MultiPolygon
         * @description MultiPolygon Model
         */
        MultiPolygon: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "MultiPolygon";
            /** Coordinates */
            coordinates: (components["schemas"]["Position2D"] | components["schemas"]["Position3D"])[][][];
        };
        /** OKResponse */
        OKResponse: {
            /** Message */
            message: string;
        };
        /**
         * OpenID
         * @description Class (schema) to represent information got from sso provider in a common form.
         */
        OpenID: {
            /** Id */
            id?: string | null;
            /** Email */
            email?: string | null;
            /** First Name */
            first_name?: string | null;
            /** Last Name */
            last_name?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Picture */
            picture?: string | null;
            /** Provider */
            provider?: string | null;
        };
        /**
         * Operator
         * @description Defines the set of operators supported by the API.
         * @enum {string}
         */
        Operator: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
        /**
         * PaginationLink
         * @description https://github.com/radiantearth/stac-api-spec/blob/v1.0.0/item-search/README.md#pagination
         */
        PaginationLink: {
            /** Href */
            href: string;
            /**
             * Rel
             * @enum {string}
             */
            rel: "next" | "prev";
            type?: components["schemas"]["MimeTypes"] | null;
            /** Title */
            title?: string | null;
            /** Label:Assets */
            "label:assets"?: string | null;
            /**
             * Method
             * @default GET
             * @enum {string}
             */
            method: "GET" | "POST";
            /** Headers */
            headers?: Record<string, never> | null;
            /** Body */
            body?: Record<string, never> | null;
            /**
             * Merge
             * @default false
             */
            merge: boolean;
            [key: string]: unknown;
        };
        /**
         * Point
         * @description Point Model
         */
        Point: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Point";
            /** Coordinates */
            coordinates: components["schemas"]["Position2D"] | components["schemas"]["Position3D"];
        };
        /**
         * Polygon
         * @description Polygon Model
         */
        Polygon: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Polygon";
            /** Coordinates */
            coordinates: (components["schemas"]["Position2D"] | components["schemas"]["Position3D"])[][];
        };
        Position2D: [
            number,
            number
        ];
        Position3D: [
            number,
            number,
            number
        ];
        /**
         * PostFieldsExtension
         * @description PostFieldsExtension.
         */
        PostFieldsExtension: {
            /**
             * Include
             * @default []
             */
            include: string[] | null;
            /**
             * Exclude
             * @default []
             */
            exclude: string[] | null;
        };
        /**
         * Provider
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#provider-object
         */
        Provider: {
            /** Name */
            name: string;
            /** Description */
            description?: string | null;
            /** Roles */
            roles?: string[] | null;
            /** Url */
            url?: string | null;
        };
        /**
         * Range
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#stats-object
         */
        Range: {
            /** Minimum */
            minimum: number | string;
            /** Maximum */
            maximum: number | string;
        };
        /**
         * SearchLink
         * @description https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/item-search#link-relations
         */
        SearchLink: {
            /** Href */
            href: string;
            /**
             * Rel
             * @enum {string}
             */
            rel: "self" | "search" | "next" | "prev";
            /**
             * Type
             * @default application/geo+json
             * @constant
             * @enum {string}
             */
            type: "application/geo+json";
            /** Title */
            title?: string | null;
            /** Label:Assets */
            "label:assets"?: string | null;
            /**
             * Method
             * @default GET
             * @enum {string}
             */
            method: "GET" | "POST";
            /** Headers */
            headers?: Record<string, never> | null;
            /** Body */
            body?: Record<string, never> | null;
            /**
             * Merge
             * @default false
             */
            merge: boolean;
            [key: string]: unknown;
        };
        /** SearchPostRequest */
        SearchPostRequest: {
            /** Collections */
            collections?: string[] | null;
            /** Ids */
            ids?: string[] | null;
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /** Intersects */
            intersects?: components["schemas"]["Point"] | components["schemas"]["MultiPoint"] | components["schemas"]["LineString"] | components["schemas"]["MultiLineString"] | components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"] | components["schemas"]["GeometryCollection"] | null;
            /** Datetime */
            datetime?: string | null;
            /**
             * Limit
             * @description Limits the number of results that are included in each page of the response (capped to 10_000).
             * @default 10
             */
            limit: number | null;
            /** @default {
             *       "include": [],
             *       "exclude": []
             *     } */
            fields: components["schemas"]["PostFieldsExtension"] | null;
            /** Query */
            query?: {
                [key: string]: Record<string, never> | undefined;
            } | null;
            /**
             * Sortby
             * @description An array of property (field) names, and direction in form of '{'field': '<property_name>', 'direction':'<direction>'}'
             * @example [
             *       {
             *         "direction": "asc",
             *         "field": "properties.created"
             *       }
             *     ]
             */
            sortby?: components["schemas"]["SortExtension"][] | null;
            /** Token */
            token?: string | null;
            /**
             * Filter
             * @description A CQL filter expression for filtering items.
             * @example {
             *       "args": [
             *         {
             *           "args": [
             *             {
             *               "property": "id"
             *             },
             *             "LC08_L1TP_060247_20180905_20180912_01_T1_L1TP"
             *           ],
             *           "op": "="
             *         },
             *         {
             *           "args": [
             *             {
             *               "property": "collection"
             *             },
             *             "landsat8_l1tp"
             *           ],
             *           "op": "="
             *         }
             *       ],
             *       "op": "and"
             *     }
             */
            filter?: Record<string, never> | null;
            /**
             * Filter-Crs
             * @description The coordinate reference system (CRS) used by spatial literals in the 'filter' value. Default is `http://www.opengis.net/def/crs/OGC/1.3/CRS84`
             */
            "filter-crs"?: string | null;
            /**
             * Filter-Lang
             * @description The CQL filter encoding that the 'filter' value uses.
             * @default cql2-json
             */
            "filter-lang": ("cql-json" | "cql2-json" | "cql2-text") | null;
        };
        /**
         * SortDirections
         * @enum {string}
         */
        SortDirections: "asc" | "desc";
        /**
         * SortExtension
         * @description https://github.com/radiantearth/stac-api-spec/tree/master/extensions/sort#sort-api-extension
         */
        SortExtension: {
            /** Field */
            field: string;
            direction: components["schemas"]["SortDirections"];
        };
        /**
         * SpatialExtent
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#spatial-extent-object
         */
        SpatialExtent: {
            /** Bbox */
            bbox: (number)[][];
        };
        /**
         * TimeInterval
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md#temporal-extent-object
         */
        TimeInterval: {
            /** Interval */
            interval: (string | null)[][];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /**
         * Collection
         * @description https://github.com/radiantearth/stac-api-spec/tree/v1.0.0/ogcapi-features#collection-collectionscollectionid
         */
        stac_pydantic__api__collection__Collection: {
            /** Id */
            id: string;
            /** Description */
            description: string;
            /**
             * Stac Version
             * @default 1.0.0
             */
            stac_version: string;
            links: components["schemas"]["stac_pydantic__links__Links"];
            /**
             * Stac Extensions
             * @default []
             */
            stac_extensions: string[] | null;
            /** Title */
            title?: string | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "Collection";
            /** Assets */
            assets?: {
                [key: string]: components["schemas"]["Asset"] | undefined;
            } | null;
            /** License */
            license: string;
            extent: components["schemas"]["Extent"];
            /** Keywords */
            keywords?: string[] | null;
            /** Providers */
            providers?: components["schemas"]["Provider"][] | null;
            /** Summaries */
            summaries?: {
                [key: string]: (components["schemas"]["Range"] | unknown[] | Record<string, never>) | undefined;
            } | null;
            [key: string]: unknown;
        };
        /** Item */
        stac_pydantic__api__item__Item: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "Feature";
            /** Geometry */
            geometry: Omit<components["schemas"]["Point"] | components["schemas"]["MultiPoint"] | components["schemas"]["LineString"] | components["schemas"]["MultiLineString"] | components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"] | components["schemas"]["GeometryCollection"], "type"> | null;
            properties: components["schemas"]["ItemProperties"];
            /** Id */
            id: string;
            /**
             * Stac Version
             * @default 1.0.0
             */
            stac_version: string;
            /** Assets */
            assets: {
                [key: string]: components["schemas"]["Asset"] | undefined;
            };
            links: components["schemas"]["stac_pydantic__links__Links"];
            /**
             * Stac Extensions
             * @default []
             */
            stac_extensions: string[] | null;
            /** Collection */
            collection?: string | null;
        };
        /**
         * ItemCollection
         * @description https://github.com/radiantearth/stac-api-spec/blob/v1.0.0/fragments/itemcollection/README.md
         *     https://github.com/radiantearth/stac-api-spec/blob/v1.0.0/item-search/README.md#link-relations
         */
        stac_pydantic__api__item_collection__ItemCollection: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "FeatureCollection";
            /** Features */
            features: components["schemas"]["stac_pydantic__api__item__Item"][];
            links?: components["schemas"]["stac_pydantic__api__links__Links"] | null;
            /** Numbermatched */
            numberMatched?: number | null;
            /** Numberreturned */
            numberReturned?: number | null;
        };
        /** Links */
        stac_pydantic__api__links__Links: (components["schemas"]["SearchLink"] | components["schemas"]["PaginationLink"] | components["schemas"]["ItemsLink"] | components["schemas"]["Link"])[];
        /**
         * Collection
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/collection-spec/collection-spec.md
         */
        stac_pydantic__collection__Collection: {
            /** Id */
            id: string;
            /** Description */
            description: string;
            /**
             * Stac Version
             * @default 1.0.0
             */
            stac_version: string;
            links: components["schemas"]["stac_pydantic__links__Links"];
            /**
             * Stac Extensions
             * @default []
             */
            stac_extensions: string[] | null;
            /** Title */
            title?: string | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "Collection";
            /** Assets */
            assets?: {
                [key: string]: components["schemas"]["Asset"] | undefined;
            } | null;
            /** License */
            license: string;
            extent: components["schemas"]["Extent"];
            /** Keywords */
            keywords?: string[] | null;
            /** Providers */
            providers?: components["schemas"]["Provider"][] | null;
            /** Summaries */
            summaries?: {
                [key: string]: (components["schemas"]["Range"] | unknown[] | Record<string, never>) | undefined;
            } | null;
            [key: string]: unknown;
        };
        /**
         * Item
         * @description https://github.com/radiantearth/stac-spec/blob/v1.0.0/item-spec/item-spec.md
         */
        stac_pydantic__item__Item: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "Feature";
            /** Geometry */
            geometry: Omit<components["schemas"]["Point"] | components["schemas"]["MultiPoint"] | components["schemas"]["LineString"] | components["schemas"]["MultiLineString"] | components["schemas"]["Polygon"] | components["schemas"]["MultiPolygon"] | components["schemas"]["GeometryCollection"], "type"> | null;
            properties: components["schemas"]["ItemProperties"];
            /** Id */
            id: string;
            /**
             * Stac Version
             * @default 1.0.0
             */
            stac_version: string;
            /** Assets */
            assets: {
                [key: string]: components["schemas"]["Asset"] | undefined;
            };
            links: components["schemas"]["stac_pydantic__links__Links"];
            /**
             * Stac Extensions
             * @default []
             */
            stac_extensions: string[] | null;
            /** Collection */
            collection?: string | null;
        };
        /**
         * ItemCollection
         * @description This is a less strict implementation of ItemCollection.
         *     It only implements the FeatureCollection Specs
         *     not enforcing required links as specified in STAC-API-FEATURES specs.
         *     Use `stac_pydantic.api.ItemCollection` to enforce link relationships and extra fields.
         */
        stac_pydantic__item_collection__ItemCollection: {
            /** Bbox */
            bbox?: [
                number,
                number,
                number,
                number
            ] | [
                number,
                number,
                number,
                number,
                number,
                number
            ] | null;
            /**
             * Type
             * @constant
             * @enum {string}
             */
            type: "FeatureCollection";
            /** Features */
            features: components["schemas"]["stac_pydantic__item__Item"][];
            links?: components["schemas"]["stac_pydantic__links__Links"] | null;
        };
        /** Links */
        stac_pydantic__links__Links: components["schemas"]["Link"][];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    Landing_Page__get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LandingPage"];
                };
            };
        };
    };
    Conformance_Classes_conformance_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Conformance"];
                };
            };
        };
    };
    Get_Item_collections__collection_id__items__item_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
                /** @description Item ID */
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/geo+json": components["schemas"]["stac_pydantic__api__item__Item"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Update_Item_collections__collection_id__items__item_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
                /** @description Item ID */
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["stac_pydantic__item__Item"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__item__Item"];
                    "application/geo+json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Delete_Item_collections__collection_id__items__item_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
                /** @description Item ID */
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__item__Item"];
                    "application/geo+json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Search_search_get: {
        parameters: {
            query?: {
                /** @description Array of collection Ids to search for items. */
                collections?: string | null;
                /** @description Array of Item ids to return. */
                ids?: string | null;
                /** @description Only return items intersecting this bounding box. Mutually exclusive with **intersects**. */
                bbox?: string | null;
                /** @description Only return items intersecting this GeoJSON Geometry. Mutually exclusive with **bbox**.
                 *
                 *     *Remember to URL encode the GeoJSON geometry when using GET request*. */
                intersects?: string | null;
                /** @description Only return items that have a temporal property that intersects this value.
                 *
                 *     Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots. */
                datetime?: string | null;
                /** @description Limits the number of results that are included in each page of the response (capped to 10_000). */
                limit?: number | null;
                /** @description Include or exclude fields from items body. */
                fields?: string | null;
                /** @description Allows additional filtering based on the properties of Item objects */
                query?: string | null;
                /** @description An array of property names, prefixed by either '+' for ascending or '-' for descending. If no prefix is provided, '+' is assumed. */
                sortby?: string | null;
                token?: string | null;
                /** @description A CQL filter expression for filtering items.
                 *
                 *     Supports `CQL-JSON` as defined in https://portal.ogc.org/files/96288
                 *
                 *     Remember to URL encode the CQL-JSON if using GET */
                filter?: string | null;
                /** @description The coordinate reference system (CRS) used by spatial literals in the 'filter' value. Default is `http://www.opengis.net/def/crs/OGC/1.3/CRS84` */
                "filter-crs"?: string | null;
                /** @description The CQL filter encoding that the 'filter' value uses. */
                "filter-lang"?: ("cql-json" | "cql2-json" | "cql2-text") | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/geo+json": components["schemas"]["stac_pydantic__api__item_collection__ItemCollection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Search_search_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchPostRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/geo+json": components["schemas"]["stac_pydantic__api__item_collection__ItemCollection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Collections_collections_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Collections"];
                };
            };
        };
    };
    Create_Collection_collections_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["stac_pydantic__collection__Collection"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__collection__Collection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Collection_collections__collection_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__api__collection__Collection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Update_Collection_collections__collection_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["stac_pydantic__collection__Collection"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__collection__Collection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Delete_Collection_collections__collection_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__collection__Collection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_ItemCollection_collections__collection_id__items_get: {
        parameters: {
            query?: {
                /** @description Limits the number of results that are included in each page of the response (capped to 10_000). */
                limit?: number | null;
                /** @description Only return items intersecting this bounding box. Mutually exclusive with **intersects**. */
                bbox?: string | null;
                /** @description Only return items that have a temporal property that intersects this value.
                 *
                 *     Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots. */
                datetime?: string | null;
            };
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/geo+json": components["schemas"]["stac_pydantic__api__item_collection__ItemCollection"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Create_Item_collections__collection_id__items_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["stac_pydantic__item__Item"] | components["schemas"]["stac_pydantic__item_collection__ItemCollection"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["stac_pydantic__item__Item"];
                    "application/geo+json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Bulk_Create_Item_collections__collection_id__bulk_items_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Items"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Queryables_queryables_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/schema+json": unknown;
                };
            };
        };
    };
    Collection_Queryables_collections__collection_id__queryables_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Collection ID */
                collection_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/schema+json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Create_Facility_facility_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FacilityCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Facility"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Facility_facility__facility_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                facility_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Facility"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Update_Facility_facility__facility_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                facility_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FacilityCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Facility"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Delete_Facility_facility__facility_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                facility_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OKResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Facilities_facilities_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Facility"][];
                };
            };
        };
    };
    Link_Keyword_Group_to_Facility_facility_keywordgroup_link_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FacilityKeywordGroupLink"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OKResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Unlink_Keyword_Group_from_Facility_facility_keywordgroup_link_delete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FacilityKeywordGroupLink"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OKResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Create_Keyword_Group_keywordgroup_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Keyword_GroupCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword_GroupPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Keyword_Group_keywordgroup__keywordgroup_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keywordgroup_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword_GroupPublic"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Update_Keyword_Group_keywordgroup__keywordgroup_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keywordgroup_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Keyword_GroupUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword_GroupPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Delete_Keyword_Group_keywordgroup__keywordgroup_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keywordgroup_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OKResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Keyword_Groups_keywordgroups_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword_GroupPublic"][];
                };
            };
        };
    };
    Create_Keyword_keyword_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KeywordBase"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Keyword_keyword__keyword_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keyword_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Update_Keyword_keyword__keyword_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keyword_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KeywordUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Delete_Keyword_keyword__keyword_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keyword_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OKResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    Get_Keywords_keywords_get: {
        parameters: {
            query?: {
                facility_id?: string | null;
                keyword_group_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword_GroupPublicWithKeywords"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    login_auth_login_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    logout_auth_logout_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    login_callback_auth_callback_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    user_me_auth_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OpenID"];
                };
            };
        };
    };
    ping__mgmt_ping_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
