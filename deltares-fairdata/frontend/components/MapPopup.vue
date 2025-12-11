<template>
  <div style="display: none;">
    <!-- This component doesn't render anything, it just manages the Mapbox popup -->
  </div>
</template>

<script setup>
  import { watch, onBeforeUnmount, ref, unref, nextTick } from 'vue'
  import { useMap } from '@studiometa/vue-mapbox-gl'
  import mapboxgl from 'mapbox-gl'
  import { formatDate, firstAssetHref } from '~/utils/helpers'

  const props = defineProps({
    selectedFeature: {
      type: Object,
      default: null,
    },
    coordinates: {
      type: Array,
      default: null,
      validator: (value) => {
        if (!value) return true
        return Array.isArray(value) && value.length === 2
      },
    },
    anchor: {
      type: [String, Array],
      default: undefined, // Changed: undefined lets Mapbox auto-position
    },
    offset: {
      type: Array,
      default: () => [0, 0], // Changed: neutral offset, let Mapbox handle positioning
    },
    maxWidth: {
      type: String,
      default: '420px',
    },
    closeButton: {
      type: Boolean,
      default: false,
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    closeOnMove: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['close'])

  const { map } = useMap()
  const popupInstance = ref(null)

  function createPopupHTML(feature) {
    if (!feature) return ''

    const title = feature.properties?.title || feature.id || 'Untitled'
    const description = feature.properties?.description || 'No description.'
    const assetHref = firstAssetHref(feature)
    const date = formatDate(feature)
    const viewDetailsUrl = `/register/${feature.id}/view`

    return `
      <div class="popup-content">
        <div class="popup-title">${escapeHtml(title)}</div>
        <div class="popup-body">
          <p class="description">${escapeHtml(description)}</p>
          <p class="asset-link">
            ${assetHref ? `<a href="${escapeHtml(assetHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(assetHref)}</a>` : '—'}
          </p>
          <p class="view-details">
            <a href="${escapeHtml(viewDetailsUrl)}">View details</a>
          </p>
          <p class="date">${escapeHtml(date)}</p>
        </div>
      </div>
    `
  }

  function escapeHtml(text) {
    if (!text) return ''
    if (typeof text !== 'string') {
      text = String(text)
    }
    // Simple HTML escaping
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function removePopup() {
    if (popupInstance.value) {
      popupInstance.value.remove()
      popupInstance.value = null
    }
  }

  function createPopup() {
    const mapInstance = unref(map)
    if (!mapInstance || !props.selectedFeature || !props.coordinates) {
      return
    }

    // Remove existing popup first
    removePopup()

    const [lng, lat] = props.coordinates

    // Build popup options - only include anchor if specified
    const popupOptions = {
      closeButton: props.closeButton,
      closeOnClick: props.closeOnClick,
      closeOnMove: props.closeOnMove,
      maxWidth: props.maxWidth,
    }

    // Only add anchor if explicitly provided (undefined = auto-position)
    if (props.anchor !== undefined) {
      popupOptions.anchor = props.anchor
    }

    // Only add offset if provided and not default
    if (props.offset && (props.offset[0] !== 0 || props.offset[1] !== 0)) {
      popupOptions.offset = props.offset
    }

    const html = createPopupHTML(props.selectedFeature)

    popupInstance.value = new mapboxgl.Popup(popupOptions)
      .setLngLat([lng, lat])
      .setHTML(html)
      .addTo(mapInstance)

    // Listen for close event
    popupInstance.value.on('close', () => {
      emit('close')
      popupInstance.value = null
    })

    // Reset scroll position to top after popup is rendered
    nextTick(() => {
      if (popupInstance.value) {
        const popupElement = popupInstance.value.getElement()
        if (popupElement) {
          const scrollContainer = popupElement.querySelector('.mapboxgl-popup-content')
          if (scrollContainer) {
            scrollContainer.scrollTop = 0
          }
        }
      }
    })
  }

  // Watch for changes to selectedFeature or coordinates
  watch(
    () => [props.selectedFeature, props.coordinates],
    () => {
      if (props.selectedFeature && props.coordinates) {
        createPopup()
      } else {
        removePopup()
      }
    },
    { immediate: true, deep: true }
  )

  // Cleanup on unmount
  onBeforeUnmount(() => {
    removePopup()
  })
</script>

<style>
  .mapboxgl-popup-content {
    width: 100%;
    max-width: 420px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0;
  }

  .popup-content {
    padding: 0;
  }

  .popup-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 2rem;
    padding: 16px 16px 0 16px;
    word-wrap: break-word;
  }

  .popup-body {
    padding: 16px;
  }

  .popup-body p {
    margin: 0 0 12px 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .popup-body p:last-child {
    margin-bottom: 0;
  }

  .description {
    margin-bottom: 12px;
  }

  .asset-link {
    margin-bottom: 12px;
  }

  .asset-link a {
    color: #1976d2;
    text-decoration: underline;
    word-break: break-all;
  }

  .view-details {
    margin-bottom: 12px;
  }

  .view-details a {
    color: #1976d2;
    text-decoration: underline;
    cursor: pointer;
  }

  .date {
    color: #666;
  }
</style>
