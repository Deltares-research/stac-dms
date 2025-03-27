from enum import Enum


class Permission(str, Enum):
    # object permissions
    ItemCreate = "item:create"
    ItemUpdate = "item:update"
    ItemDelete = "item:delete"
    CollectionCreate = "collection:create"
    CollectionUpdate = "collection:update"
    CollectionDelete = "collection:delete"

    # global permissions
    KeywordAll = "keyword:all"

    CollectionGroupRoleAssign = "collection:group_role:assign"
    GroupCreate = "group:create"
    GroupRead = "group:read"
    GroupUpdate = "group:update"
    GroupDelete = "group:delete"
    GlobalGroupRoleAssign = "global:group_role:assign"


class Role(str, Enum):
    # object roles
    DATA_STEWARD = "data_steward"
    DATA_PRODUCER = "data_producer"

    # global roles
    ADMIN = "admin"
    KEYWORD_EDITOR = "keyword_editor"


role_permissions = {
    Role.ADMIN: [
        # Admin has all permissions
        Permission.ItemCreate,
        Permission.ItemUpdate,
        Permission.ItemDelete,
        Permission.CollectionCreate,
        Permission.CollectionUpdate,
        Permission.CollectionDelete,
        Permission.KeywordAll,
        Permission.CollectionGroupRoleAssign,
        Permission.GroupCreate,
        Permission.GroupRead,
        Permission.GroupUpdate,
        Permission.GroupDelete,
        Permission.GlobalGroupRoleAssign,
    ],
    Role.KEYWORD_EDITOR: [
        Permission.KeywordAll,
    ],
    Role.DATA_STEWARD: [
        Permission.ItemCreate,
        Permission.ItemUpdate,
        Permission.ItemDelete,
        Permission.CollectionCreate,
        Permission.CollectionUpdate,
        Permission.CollectionDelete,
        Permission.CollectionGroupRoleAssign,
    ],
    Role.DATA_PRODUCER: [
        Permission.ItemCreate,
        Permission.ItemUpdate,
    ],
}


GLOBAL_SCOPE = "__GLOBAL__"
