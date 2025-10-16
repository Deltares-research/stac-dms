// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    answers: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: [],
    },
    cards: [
      { id: 1, title: 'Basic storage P:\\', subtitle: 'Basic storage on the Deltares Network Drive',
        allow: { q1: ['store'], q2: ['share-no'], q3: ['collaborate-no', 'collaborate-internal'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7'], q7: ['interface-network', 'interface-jupyter'] },
        contactOn: { q4: ['size-yes'] },
      },
      { id: 2, title: 'Storage N:\\', subtitle: 'Storage on the Deltares Network Drive',
        allow: { q1: ['archive'], q2: ['share-no'], q3: [], q4: [], q5: ['confidentiality-no'], q6: ['access-na'], q7: ['interface-network'] },
        contactOn: {},
      },

      { id: 3, title: 'MS365 OneDrive', subtitle: 'OneDrive for Business',
        allow: { q1: ['store'], q2: ['share-no'], q3: ['collaborate-no', 'collaborate-internal'], q4: ['size-no'], q5: ['confidentiality-no'], q6: ['access-na'], q7: [] },
        contactOn: {},
      },

      { id: 4, title: 'SURF Research Drive', subtitle: 'SURF Research Drive',
        allow: { q1: ['store'], q2: ['share-yes'], q3: ['collaborate-external'], q4: ['size-no', 'size-yes'], q5: ['confidentiality-no'], q6: ['access-na', 'access-external'], q7: ['interface-http', 'interface-jupyter'] },
        contactOn: {},
      },

      { id: 5, title: 'MinIO', subtitle: 'S3 compatible object storage',
        allow: { q1: ['store'], q2: ['share-yes', 'share-no'], q3: ['collaborate-internal', 'collaborate-external'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: ['interface-http', 'interface-web', 'interface-jupyter'] },
        contactOn: {},
      },

      { id: 6, title: 'Postgres/PostGIS', subtitle: 'Postgres/PostGIS database',
        allow: { q1: ['store', 'archive'], q2: ['share-no'], q3: ['collaborate-external', 'collaborate-internal'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: ['interface-http', 'interface-network', 'interface-web', 'interface-jupyter'] },
        contactOn: { q1: ['archive'], q7: ['interface-web'] },
      },

      { id: 7, title: 'GeoServer', subtitle: 'Geoserver for serving geospatial data',
        allow: { q1: ['store'], q2: ['share-yes', 'share-no'], q3: ['collaborate-external', 'collaborate-internal'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: ['interface-http', 'interface-network', 'interface-web', 'interface-jupyter'] },
        contactOn: {},
      },

      { id: 8, title: 'THREDDS Data Server', subtitle: 'THREDDS Data Server for serving netCDF data',
        allow: { q1: ['store'], q2: ['share-yes', 'share-no'], q3: ['collaborate-internal', 'collaborate-external'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: ['interface-http', 'interface-network', 'interface-web', 'interface-jupyter'] },
        contactOn: {},
      },

      { id: 9, title: 'Cloud Storage', subtitle: 'Cloud Storage',
        allow: { q1: ['store', 'archive'], q2: ['share-yes'], q3: ['collaborate-internal', 'collaborate-external'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: ['interface-http', 'interface-web', 'interface-jupyter'] },
        contactOn: { q1: ['archive'] },
      },

      { id: 10, title: 'SURF Filesender', subtitle: 'Send files to external parties',
        allow: { q1: ['transfer'], q2: [], q3: [], q4: ['size-no'], q5: ['confidentiality-no'], q6: ['access-na'], q7: [] },
        contactOn: {},
      },

      { id: 11, title: 'FTPS', subtitle: 'Secure FTP server',
        allow: { q1: ['transfer'], q2: [], q3: [], q4: ['size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7', 'access-external'], q7: [] },
        contactOn: {},
      },

      { id: 12, title: 'ZENODO', subtitle: 'ZENODO',
        allow: { q1: ['archive'], q2: ['share-yes'], q3: [], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na'], q7: [] },
        contactOn: {},
      },

      { id: 13, title: '4TU.ResearchData repository', subtitle: 'International data repository for science, engineering and design',
        allow: { q1: ['archive'], q2: ['share-yes'], q3: ['collaborate-external'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na'], q7: ['interface-http'] },
        contactOn: {},
      },

      { id: 14, title: 'Deltares Online Archive', subtitle: 'Online Archive on Deltares Campus containing data from previous projects',
        allow: { q1: ['archive'], q2: [], q3: ['collaborate-internal'], q4: ['size-yes', 'size-no'], q5: ['confidentiality-no'], q6: ['access-na', 'access-h7'], q7: ['interface-http', 'interface-web', 'interface-jupyter'] },
        contactOn: {},
      },

    ],
  }),
})
