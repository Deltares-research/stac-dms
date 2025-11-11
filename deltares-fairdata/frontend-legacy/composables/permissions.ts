import type { components } from "#open-fetch-schemas/api"
import { toast } from "~/components/ui/toast"

export async function usePermissions() {
  const { data, refresh } = await useApi("/permissions", {
    headers: useRequestHeaders(),
  })

  const permissions = computed(() => data.value)

  function hasPermission(permission: components["schemas"]["Permission"]) {
    if (!permissions) {
      return false
    }

    return permissions.value?.some((p) => p === permission) ?? false
  }

  function requirePermission(permission: components["schemas"]["Permission"]) {
    if (!hasPermission(permission)) {
      toast({
        title: "You do not have permission to do this.",
        variant: "destructive",
      })

      navigateTo("/")
    }
  }

  return { permissions, hasPermission, requirePermission, refresh }
}

export async function useCollectionPermissions(collectionId: string) {
  const { data, refresh } = await useApi(
    "/collection-permissions/{collection_id}",
    {
      headers: useRequestHeaders(),
      path: { collection_id: collectionId },
    },
  )

  const permissions = computed(() => data.value)

  function hasPermission(permission: components["schemas"]["Permission"]) {
    if (!permissions) {
      return false
    }

    return permissions.value?.some((p) => p === permission) ?? false
  }

  function requirePermission(permission: components["schemas"]["Permission"]) {
    if (!hasPermission(permission)) {
      toast({
        title: "You do not have permission to do this.",
        variant: "destructive",
      })

      navigateTo("/")
    }
  }

  return { permissions, hasPermission, requirePermission, refresh }
}
