<script setup lang="ts">
import { computed, ref } from "vue"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  LinkIcon,
  FileIcon,
  InfoIcon,
  UsersIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-vue-next"
import ItemMap from "~/components/items/ItemMap.vue"
import startCase from "lodash/startCase"

interface Asset {
  key: string
  title: string
  href: string
  type: string
  description: string
  roles: string[]
}

interface Provider {
  name: string
  description?: string
  role?: string[]
  url?: string
}

interface Property {
  key: string
  value: any
}

interface AssetGroups {
  [key: string]: Asset[]
}

const props = defineProps<{
  item: any
}>()

// Extract key information for easy access
const id = computed(() => props.item?.id || "Unknown ID")
const title = computed(() => props.item?.properties?.title || "Untitled Item")
const description = computed(
  () => props.item?.properties?.description || "No description available",
)
const datetime = computed(() => {
  const date = props.item?.properties?.datetime
  return date ? new Date(date).toLocaleString() : "Unknown date"
})
const updatedDate = computed(() => {
  const date = props.item?.properties?.updated
  return date ? new Date(date).toLocaleString() : null
})
const createdDate = computed(() => {
  const date = props.item?.properties?.created
  return date ? new Date(date).toLocaleString() : null
})

// Check if item has geometry
const hasGeometry = computed(() => !!props.item?.geometry)
const hasBbox = computed(
  () => !!props.item?.bbox && props.item.bbox.length >= 4,
)

// Get properties in a more accessible format
const properties = computed<Property[]>(() => {
  if (!props.item?.properties) return []

  // Filter out some properties that we show elsewhere
  const excluded = ["title", "description", "datetime", "updated", "created"]
  return Object.entries(props.item.properties)
    .filter(([key]) => !excluded.includes(key))
    .map(([key, value]) => ({ key, value }))
})

// Format assets into a more accessible format
const assets = computed<Asset[]>(() => {
  if (!props.item?.assets) return []

  return Object.entries(props.item.assets).map(
    ([key, asset]: [string, any]) => ({
      key,
      title: asset.title || key,
      href: asset.href || "",
      type: asset.type || "Unknown type",
      description: asset.description || "",
      roles: asset.roles || [],
    }),
  )
})

// For providers information
const providers = computed<Provider[]>(
  () => props.item?.properties?.providers || [],
)

// Group assets by role
const groupedAssets = computed<AssetGroups>(() => {
  const groups: AssetGroups = {}

  assets.value.forEach((asset) => {
    if (asset.roles && asset.roles.length > 0) {
      asset.roles.forEach((role) => {
        if (!groups[role]) groups[role] = []
        groups[role].push(asset)
      })
    } else {
      if (!groups["uncategorized"]) groups["uncategorized"] = []
      groups["uncategorized"].push(asset)
    }
  })

  return groups
})

// UI state for expandable sections
interface SectionState {
  properties: boolean
  assets: boolean
  metadata: boolean
  providers: boolean
}

const expandedSections = ref<SectionState>({
  properties: true,
  assets: true,
  metadata: false,
  providers: false,
})

const toggleSection = (section: keyof SectionState) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// Format a value for display
const formatValue = (value: any): string => {
  if (value === null) return "None"
  if (value === undefined) return "Undefined"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// Check if a string is a URL
const isUrl = (value: any): boolean => {
  if (typeof value !== "string") return false
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

// Store which asset URLs have been copied recently
const copiedAssets = ref<Record<string, boolean>>({})

// Copy text to clipboard
const copyToClipboard = async (text: string, assetKey: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Set copied state for this asset
    copiedAssets.value[assetKey] = true
    // Reset after 2 seconds
    setTimeout(() => {
      copiedAssets.value[assetKey] = false
    }, 2000)
  } catch (err) {
    console.error("Failed to copy text: ", err)
  }
}

// Format date-like strings
const formatDate = (value: any): string => {
  if (!value || typeof value !== "string") return String(value)

  // Check for ISO date pattern
  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/
  if (isoDatePattern.test(value)) {
    try {
      return new Date(value).toLocaleString()
    } catch {
      return value
    }
  }
  return value
}
</script>

<template>
  <div class="stac-item-view">
    <!-- Simplified header without gradient -->
    <div class="border-b pb-6 mb-6">
      <h1 class="text-2xl font-bold mb-3">{{ title }}</h1>
      <div class="flex flex-wrap text-sm text-gray-600 gap-4">
        <div class="flex items-center">
          <TagIcon class="w-4 h-4 mr-1" />
          <span>ID: {{ id }}</span>
        </div>
        <div class="flex items-center">
          <CalendarIcon class="w-4 h-4 mr-1" />
          <span>{{ datetime }}</span>
        </div>
        <div v-if="updatedDate" class="flex items-center">
          <ClockIcon class="w-4 h-4 mr-1" />
          <span>Updated: {{ updatedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div>
      <!-- Description -->
      <div class="mb-8">
        <p class="text-gray-700 whitespace-pre-line">{{ description }}</p>
      </div>

      <!-- Map if available -->
      <div v-if="hasGeometry || hasBbox">
        <ClientOnly>
          <ItemMap :geometry="props.item?.geometry" :bbox="props.item?.bbox" />
        </ClientOnly>
      </div>

      <!-- Assets Section -->
      <div class="mb-8 border rounded overflow-hidden">
        <div
          @click="toggleSection('assets')"
          class="bg-gray-50 px-4 py-3 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        >
          <div class="flex items-center">
            <FileIcon class="w-5 h-5 mr-2 text-gray-600" />
            <h2 class="font-semibold">Assets</h2>
          </div>
          <span>{{ expandedSections.assets ? "▼" : "▶" }}</span>
        </div>

        <div v-if="expandedSections.assets" class="p-4">
          <div v-if="assets.length === 0" class="text-gray-500 italic">
            No assets available
          </div>

          <div v-else>
            <div
              v-for="(assets, role) in groupedAssets"
              :key="role"
              class="mb-6 last:mb-0"
            >
              <h3 class="font-medium text-indigo-700 mb-2 capitalize">
                {{ role }}
              </h3>

              <div class="space-y-4">
                <div
                  v-for="asset in assets"
                  :key="asset.key"
                  class="border rounded p-4 hover:bg-gray-50"
                >
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">{{ asset.title }}</h4>
                    <div
                      class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                      {{ asset.type }}
                    </div>
                  </div>

                  <p
                    v-if="asset.description"
                    class="text-gray-600 text-sm mt-1 mb-3"
                  >
                    {{ asset.description }}
                  </p>

                  <!-- Display asset href -->
                  <div class="text-sm text-gray-600 mb-3 break-all">
                    <div class="flex items-center">
                      <LinkIcon class="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{{ asset.href }}</span>
                    </div>
                  </div>

                  <div class="flex space-x-2">
                    <!-- HTTP URL: Open in new tab -->
                    <a
                      v-if="isUrl(asset.href)"
                      :href="asset.href"
                      target="_blank"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <LinkIcon class="w-4 h-4 mr-1" />
                      Open
                    </a>

                    <!-- Non-HTTP URL: Copy to clipboard -->
                    <button
                      v-else
                      @click="copyToClipboard(asset.href, asset.key)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <CheckIcon
                        v-if="copiedAssets[asset.key]"
                        class="w-4 h-4 mr-1 text-green-500"
                      />
                      <CopyIcon v-else class="w-4 h-4 mr-1" />
                      {{ copiedAssets[asset.key] ? "Copied!" : "Copy" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Properties Section -->
      <div class="mb-8 border rounded overflow-hidden">
        <div
          @click="toggleSection('properties')"
          class="bg-gray-50 px-4 py-3 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        >
          <div class="flex items-center">
            <InfoIcon class="w-5 h-5 mr-2 text-gray-600" />
            <h2 class="font-semibold">Properties</h2>
          </div>
          <span>{{ expandedSections.properties ? "▼" : "▶" }}</span>
        </div>

        <div v-if="expandedSections.properties" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="prop in properties"
                :key="prop.key"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ startCase(prop.key) }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  <template v-if="isUrl(prop.value)">
                    <a
                      :href="prop.value"
                      target="_blank"
                      class="text-blue-500 hover:underline flex items-center"
                    >
                      {{ prop.value }}
                      <LinkIcon class="w-3 h-3 ml-1" />
                    </a>
                  </template>
                  <template v-else>
                    {{ formatDate(prop.value) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Providers Section (if available) -->
      <div
        v-if="providers.length > 0"
        class="mb-8 border rounded overflow-hidden"
      >
        <div
          @click="toggleSection('providers')"
          class="bg-gray-50 px-4 py-3 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        >
          <div class="flex items-center">
            <UsersIcon class="w-5 h-5 mr-2 text-gray-600" />
            <h2 class="font-semibold">Providers</h2>
          </div>
          <span>{{ expandedSections.providers ? "▼" : "▶" }}</span>
        </div>

        <div v-if="expandedSections.providers" class="p-4">
          <div class="space-y-4">
            <div
              v-for="(provider, index) in providers"
              :key="index"
              class="border rounded p-4 hover:bg-gray-50"
            >
              <h4 class="font-medium text-gray-800">{{ provider.name }}</h4>

              <p v-if="provider.description" class="text-gray-600 text-sm mt-1">
                {{ provider.description }}
              </p>

              <div v-if="provider.url" class="mt-2">
                <a
                  :href="provider.url"
                  target="_blank"
                  class="text-blue-500 hover:underline text-sm flex items-center"
                >
                  <LinkIcon class="w-4 h-4 mr-1" />
                  {{ provider.url }}
                </a>
              </div>

              <div
                v-if="provider.role && provider.role.length > 0"
                class="mt-2 flex flex-wrap gap-2"
              >
                <span
                  v-for="role in provider.role"
                  :key="role"
                  class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {{ role }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
