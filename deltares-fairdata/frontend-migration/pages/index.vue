<template>
  <v-container fluid class="pa-0 ma-0 two-col-page">
    <v-row no-gutters class="two-col-row">
      <!-- LEFT: Results list (its own scroll) -->
      <v-col :cols="12" :md="6" class="left-col">
        <v-sheet class="left-scroll pa-4">
          <feature-filters
            v-model="filters"
            :options="filterOptions"
            class="mb-4"
          />

          <v-row>
            <v-col cols="12" v-for="f in filteredFeatures" :key="f.id">
              <v-card class="mb-4" variant="elevated">
                <v-card-title class="text-wrap">
                  {{ f.properties?.title || 'Untitled' }}
                </v-card-title>

                <v-card-subtitle class="d-flex align-center flex-wrap gap-2">
                  <v-chip size="small" variant="flat">
                    {{ formatDate(f.properties?.datetime) }}
                  </v-chip>
                </v-card-subtitle>

                <v-card-text>
                  <p class="mb-3 line-clamp-3">
                    {{ f.properties?.description || 'No description.' }}
                  </p>

                  <div class="d-flex align-center">
                    <v-icon class="mr-2" size="small">mdi-link-variant</v-icon>
                    <a
                      v-if="firstAssetHref(f)"
                      :href="firstAssetHref(f)"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ firstAssetHref(f) }}
                    </a>
                    <span v-else>—</span>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    v-if="firstAssetHref(f)"
                    :href="firstAssetHref(f)"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="tonal"
                    density="comfortable"
                    prepend-icon="mdi-open-in-new"
                  >
                    Open asset
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

      <!-- RIGHT: Map (fixed to visible viewport below app bar) -->
      <v-col :cols="12" :md="6" class="right-col">
        <v-sheet class="right-map">
          <ClientOnly>
            <map-component :polygons="polygonFeatures" />
          </ClientOnly>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import FeatureFilters from '@/components/FeatureFilters.vue'

/* -------------------------
   Filters state (v-model)
------------------------- */
const filters = ref({
  collection: 'any',
  language: 'any',
  legal: 'any',
  srs: 'any',
})

/**
 * TEMPORARY: inline copy of search_result.geojson
 */
const searchResult = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "stac_version": "1.0.0",
      "stac_extensions": [],
      "id": "TOs8qjHr5G5jI0bWm6yZs",
      "collection": "Flumes",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-89.64531511692425,43.763399601201655],[-89.43804503749057,43.29263263716034],[-88.80688426929028,43.25989718601839],[-88.53416048056175,43.891223743755916],[-89.64531511692425,43.763399601201655]]]
      },
      "bbox": [-89.64531511692425,43.25989718601839,-88.53416048056175,43.891223743755916],
      "properties": {
        "title": "Determine waterflow conditions Delft-area",
        "description": "This is data related to a magnificent project where we created a WFLOW model from Delft Minnesota USA. Also a high resolution DTM is used and can de re-used",
        "datetime": "2025-03-25T00:00:00Z",
        "updated": "2025-03-25T14:44:11.362851Z",
        "projectNumber": "12345678",
        "spatialReferenceSystem": "EPSG:25831",
        "dataQualityInfoStatement": "Validated with ground truth  doi:123:445,55",
        "dataQualityInfoScore": "dataSet",
        "dateType": "publication",
        "legalRestrictions": "intellectualPropertyRights ",
        "restrictionsOfUse": "Not suitable for water quality purposes",
        "metadataStandardName": "ISO 19115",
        "metadataStandardVersion": "2.1.0",
        "progressCode": "completed",
        "language": "eng",
        "hierarchyLevel": "dataSet",
        "originatorDataEmail": "datasteward@deltares.nl",
        "originatorDataRoleCode": "originator",
        "originatorDataOrganisation": "Deltares",
        "originatorMetaDataOrganisation": "Deltares",
        "originatorMetaDataEmail": "Jelle.vanMiltenburg@deltares.nl",
        "originatorMetaDataRoleCode": "originator",
        "metaDataLanguage": "eng",
        "metaDataDateTime": "2025-03-25T14:44:07.898Z",
        "keywords": [{"nl_keyword":"Hoogte","en_keyword":"Height","external_id":null,"id":"0898e009-a91d-4589-8adc-837178859c73"}],
        "created": "2025-03-25T14:44:11.362851Z"
      },
      "links": [
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes/items/TOs8qjHr5G5jI0bWm6yZs"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets": {
        "3EKB7v5xJ3PEkYXxG16UG": {
          "href": "p:/1234567/data/..",
          "type": "satelite derived data",
          "title": "Soil moisture satelite derived adn DTM",
          "description": "satelite derived sil moisture based on planet/vandersat techniques"
        }
      }
    },
    {
      "type":"Feature",
      "stac_version":"1.0.0",
      "stac_extensions":[],
      "id":"t2zXW7UyJg_-af-tGlpY6",
      "collection":"Flumes",
      "geometry":{"type":"Polygon","coordinates":[[[6.087818732169567,52.51153291540706],[6.092256167975523,52.49356714781513],[6.116556411674811,52.49863983513521],[6.087818732169567,52.51153291540706]]]},
      "bbox":[6.087818732169567,52.49356714781513,6.116556411674811,52.51153291540706],
      "properties":{
        "title":"Cone penetration test Zwolle area",
        "description":"Short description Hanzeweg en Delftweg.",
        "datetime":"2025-03-06T00:00:00Z",
        "created":"2025-03-25T14:24:58.984186Z",
        "updated":"2025-07-01T08:12:57.772868Z",
        "projectNumber":"6574821",
        "publication_datetime":"2025-07-01",
        "spatialReferenceSystem":"EPSG:25831",
        "dataQualityInfoStatement":"validated",
        "dataQualityInfoScore":"dataSet",
        "dateType":"publication",
        "legalRestrictions":"license",
        "restrictionsOfUse":"water quality",
        "metadataStandardName":"ISO 19115",
        "metadataStandardVersion":"2.1.0",
        "progressCode":"completed",
        "language":"eng",
        "hierarchyLevel":"dataSet",
        "originatorDataEmail":"test@deltares.nl",
        "originatorDataRoleCode":"originator",
        "originatorDataOrganisation":"Deltares",
        "originatorMetaDataOrganisation":"Deltares",
        "originatorMetaDataEmail":"GertJan.Schotmeijer@deltares.nl",
        "originatorMetaDataRoleCode":"originator",
        "metaDataLanguage":"eng",
        "metaDataDateTime":"2025-03-25T14:24:44.955Z",
        "keywords":[]
      },
      "links":[
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes/items/t2zXW7UyJg_-af-tGlpY6"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets":{"rpvLnwdJ8HJDDPgR0PaKB":{"href":"P:Zwolle","type":"Field data","title":"Cone penetration measurements Hanzeweg Zwolle","description":"Description"}}
    },
    {
      "type":"Feature",
      "stac_version":"1.0.0",
      "stac_extensions":[],
      "id":"zVEL5FRmYGyyPoxHyzbMo",
      "collection":"Flumes",
      "geometry":{"type":"Polygon","coordinates":[[[4.5437996792731035,51.85911984102647],[4.57584042085402,51.83251227910464],[4.586219816014036,51.84423764537528],[4.559143132987908,51.86453154853599],[4.5437996792731035,51.85911984102647]]]},
      "bbox":[4.5437996792731035,51.83251227910464,4.586219816014036,51.86453154853599],
      "properties":{
        "title":"Hoge Snelheidslijn Barendrecht (fictief)",
        "description":"Resultaten van funderingsberekeningen met MPile ten beheove van de hoge snelheidslijn ter hoogte Barendrecht.",
        "datetime":"2025-02-11T00:00:00Z",
        "projectNumber":"2910354",
        "spatialReferenceSystem":"EPSG:25831",
        "dataQualityInfoStatement":"Data has NOT been validated with measurements, but is reveiwed by Expert Ahmed van Essen",
        "dataQualityInfoScore":"dataSet",
        "dateType":"publication",
        "legalRestrictions":"restricted ",
        "restrictionsOfUse":"Not suitable for setting vibrations tresh holds",
        "metadataStandardName":"ISO 19115",
        "metadataStandardVersion":"2.1.0",
        "progressCode":"completed",
        "language":"dut",
        "hierarchyLevel":"dataSet",
        "originatorDataEmail":"info@deltares.nl",
        "originatorDataRoleCode":"originator",
        "originatorDataOrganisation":"Deltares",
        "originatorMetaDataOrganisation":"Deltares",
        "originatorMetaDataEmail":"GertJan.Schotmeijer@deltares.nl",
        "originatorMetaDataRoleCode":"originator",
        "metaDataLanguage":"eng",
        "metaDataDateTime":"2025-03-25T13:58:08.513Z",
        "keywords":[],
        "created":"2025-03-25T14:04:16.356573Z",
        "updated":"2025-03-25T14:04:16.356573Z"
      },
      "links":[
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes/items/zVEL5FRmYGyyPoxHyzbMo"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets":{"vSxYpBxw7LMTd3gtV582s":{"href":"p:/mPile/HSL/Run_final","type":"Numerical results","title":"MPIle results Barendrecth HSL tarcé","description":"Along the HSL track we dit numerical mPile calculations"}}
    },
    {
      "type":"Feature",
      "stac_version":"1.0.0",
      "stac_extensions":[],
      "id":"klmzBEZGUzI-uhTJByvPj",
      "collection":"Flumes",
      "geometry":{"type":"Point","coordinates":[4.1922997251068805,52.05800897599491]},
      "bbox":[4.1922997251068805,52.05800897599491,4.1922997251068805,52.05800897599491],
      "properties":{
        "title":"Zandmotor",
        "description":"Measurement of dune development",
        "datetime":"2025-01-15T00:00:00Z",
        "created":"2025-03-25T14:21:08.074524Z",
        "updated":"2025-07-29T05:36:50.894762Z",
        "projectNumber":"123",
        "publication_datetime":"2025-07-29",
        "spatialReferenceSystem":"not applicable",
        "dataQualityInfoStatement":"Measurements of Delta Enigma",
        "dataQualityInfoScore":"dataSet",
        "dateType":"publication",
        "legalRestrictions":"license",
        "restrictionsOfUse":"-",
        "metadataStandardName":"ISO 19115",
        "metadataStandardVersion":"2.1.0",
        "progressCode":"completed",
        "language":"eng",
        "hierarchyLevel":"dataSet",
        "originatorDataEmail":"info@deltares.nl",
        "originatorDataRoleCode":"originator",
        "originatorDataOrganisation":"Deltares",
        "originatorMetaDataOrganisation":"Deltares",
        "originatorMetaDataEmail":"Jelle.vanMiltenburg@deltares.nl",
        "originatorMetaDataRoleCode":"originator",
        "metaDataLanguage":"eng",
        "facility_type":"numericalModel",
        "metaDataDateTime":"2025-03-25T14:18:54.308Z",
        "keywords":[{"nl_keyword":"MODFLOW 6","en_keyword":"MODFLOW 6","external_id":null,"id":"4f1cd06f-cfc4-4cc9-963b-02af95b31505"}]
      },
      "links":[
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes/items/klmzBEZGUzI-uhTJByvPj"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets":{"aQOCwZjOe1jpxFxuaY7Kl":{"href":"P://link/to/data","title":"Dataset1","description":"-"}}
    },
    {
      "type":"Feature",
      "stac_version":"1.0.0",
      "stac_extensions":[],
      "id":"dWpmXhpZw9oDa_S8u32P-",
      "collection":"Flumes",
      "geometry":{"type":"Point","coordinates":[4.3805226945734885,51.98559340722323]},
      "bbox":[4.3805226945734885,51.98559340722323,4.3805226945734885,51.98559340722323],
      "properties":{
        "title":"iDlab: flood data analysis",
        "description":"iDlab Deltares project to analyse how flood data can best be visualized",
        "datetime":"2024-12-18T00:00:00Z",
        "updated":"2025-03-25T14:43:59.959617Z",
        "projectNumber":"1234",
        "spatialReferenceSystem":"EPSG:25831",
        "dataQualityInfoStatement":"Sensor x",
        "dataQualityInfoScore":"dataSet",
        "dateType":"publication",
        "legalRestrictions":"license",
        "restrictionsOfUse":"-",
        "metadataStandardName":"ISO 19115",
        "metadataStandardVersion":"2.1.0",
        "progressCode":"completed",
        "language":"eng",
        "hierarchyLevel":"dataSet",
        "originatorDataEmail":"info@deltares.nl",
        "originatorDataRoleCode":"originator",
        "originatorDataOrganisation":"Deltares",
        "originatorMetaDataOrganisation":"Deltares",
        "originatorMetaDataEmail":"Jelle.vanMiltenburg@deltares.nl",
        "originatorMetaDataRoleCode":"originator",
        "metaDataLanguage":"eng",
        "metaDataDateTime":"2025-03-25T14:43:53.914Z",
        "keywords":[{"nl_keyword":"Golven","en_keyword":"Waves","external_id":null,"id":"0747eaa1-61a7-4983-8503-3e292826fcc7"},{"nl_keyword":"Tunnel","en_keyword":"Tube","external_id":null,"id":"7d51d545-e80b-46b3-b6b0-1d2ae732fe60"}],
        "created":"2025-03-25T14:43:59.959617Z"
      },
      "links":[
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes/items/dWpmXhpZw9oDa_S8u32P-"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Flumes"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets":{"lrT_taXZgBc52mePySCHz":{"href":"P://video/location","title":"Video 1","description":"A video of participants"}}
    },
    {
      "type":"Feature",
      "stac_version":"1.0.0",
      "stac_extensions":[],
      "id":"TOQ-UGv4UEtQBOdS7lz86",
      "collection":"Test",
      "geometry":{"type":"Polygon","coordinates":[[[5.014964976209292,50.306841344504676],[5.374767222303041,50.31824511513142],[5.638439097303041,50.23484682031926],[5.505229868787416,50.11696287384922],[4.950420298474916,50.22518073703304],[5.014964976209292,50.306841344504676]]]},
      "bbox":[4.950420298474916,50.11696287384922,5.638439097303041,50.31824511513142],
      "properties":{
        "title":"51651",
        "description":"16651",
        "datetime": null,
        "created":"2025-07-29T06:49:23.250526Z",
        "updated":"2025-07-29T06:51:09.721416Z",
        "start_datetime":"2025-07-13T00:00:00Z",
        "end_datetime":"2025-07-22T00:00:00Z",
        "projectNumber":"56165",
        "publication_datetime":"2025-07-29",
        "spatialReferenceSystem":"EPSG:28992 (Amersfoort / RD New)",
        "dataQualityInfoStatement":"61651",
        "dataQualityInfoScore":"dataSet",
        "dateType":"publication",
        "legalRestrictions":"license",
        "restrictionsOfUse":"65151",
        "metadataStandardName":"ISO 19115",
        "metadataStandardVersion":"2.1.0",
        "progressCode":"completed",
        "language":"eng",
        "hierarchyLevel":"dataSet",
        "originatorDataEmail":"floris.langeraert@deltares.nl",
        "originatorDataRoleCode":"originator",
        "originatorDataOrganisation":"Deltares",
        "originatorMetaDataOrganisation":"Deltares",
        "originatorMetaDataEmail":"floris.langeraert@deltares.nl",
        "originatorMetaDataRoleCode":"originator",
        "metaDataLanguage":"eng",
        "facility_type":"numericalModel",
        "keywords":[{"nl_keyword":"MODFLOW 6","en_keyword":"MODFLOW 6","external_id":null,"id":"4f1cd06f-cfc4-4cc9-963b-02af95b31505"}]
      },
      "links":[
        {"rel":"self","type":"application/geo+json","href":"http://dev.deltares-fairdata.com/api/collections/Test/items/TOQ-UGv4UEtQBOdS7lz86"},
        {"rel":"parent","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Test"},
        {"rel":"collection","type":"application/json","href":"http://dev.deltares-fairdata.com/api/collections/Test"},
        {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"}
      ],
      "assets":{"-u7l-eZvw8pfJANlsRbnP":{"href":"klm","type":"kmlm","title":"klml","description":"klm"}}
    }
  ],
  "links": [
    {"rel":"root","type":"application/json","href":"http://dev.deltares-fairdata.com/api/"},
    {"rel":"self","type":"application/json","href":"http://dev.deltares-fairdata.com/api/search"}
  ],
  "numReturned": 6,
  "numMatched": 6
}

/* Safely list features */
const features = computed(() =>
  Array.isArray(searchResult?.features) ? searchResult.features : []
)

/* Normalizer (trims trailing spaces, handles nulls) */
function norm (v) {
  return typeof v === 'string' ? v.trim() : (v ?? '')
}

/* Build unique option lists from the data */
const filterOptions = computed(() => {
  const col = new Set()
  const lang = new Set()
  const legal = new Set()
  const srs = new Set()

  for (const f of features.value) {
    if (!f) continue
    const p = f.properties || {}

    if (f.collection) col.add(norm(f.collection))
    if (p.language) lang.add(norm(p.language))
    if (p.legalRestrictions) legal.add(norm(p.legalRestrictions))
    if (p.spatialReferenceSystem) srs.add(norm(p.spatialReferenceSystem))
  }

  // Return sorted arrays for predictable order
  const sortAsc = (a, b) => String(a).localeCompare(String(b), 'en')
  return {
    collection: [...col].sort(sortAsc),
    language:   [...lang].sort(sortAsc),
    legal:      [...legal].sort(sortAsc),
    srs:        [...srs].sort(sortAsc),
  }
})

/* Filter the list of features by current selections */
const filteredFeatures = computed(() => {
  const sel = filters.value
  return features.value.filter((f) => {
    const p = f.properties || {}

    const passCollection = sel.collection === 'any' || norm(f.collection) === sel.collection
    const passLanguage   = sel.language   === 'any' || norm(p.language) === sel.language
    const passLegal      = sel.legal      === 'any' || norm(p.legalRestrictions) === sel.legal
    const passSrs        = sel.srs        === 'any' || norm(p.spatialReferenceSystem) === sel.srs

    return passCollection && passLanguage && passLegal && passSrs
  })
})

/* ---- Only the Polygon features (for the map) ---- */
const polygonFeatures = computed(() =>
  filteredFeatures.value.filter(f => f?.geometry?.type === 'Polygon')
)

/* Utilities for UI */
function formatDate (iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(d)
}

function firstAssetHref (feature) {
  const assets = feature?.assets || {}
  const first = Object.values(assets)[0]
  return first?.href || ''
}
</script>

<style>
/* Clamp long descriptions to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 960px) {
  .two-col-page {
    /* Subtract Vuetify's dynamic layout offsets to not exceed v-main */
    height: calc(100vh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px));
    overflow: hidden;
  }
  .two-col-row {
    height: 100%;
    min-height: 0;
  }
  .left-col,
  .right-col {
    height: 100%;
    min-height: 0;
  }

  .left-scroll {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .right-col {
    overflow: hidden;
  }
  .right-map {
    height: 100%;
    overflow: hidden;
  }

  .right-map .mapboxgl-map,
  .right-map > * {
    height: 100%;
  }
}
</style>
