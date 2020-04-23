/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'opentransport';
const APP_TITLE = 'Open Transport';
const API_URL = process.env.API_URL || 'https://api.opentransport.ro';
const MAP_URL = process.env.MAP_URL || 'https://api.opentransport.ro';
const MAP_TOKEN = process.env.MAP_TOKEN || '';
const GEOCODING_BASE_URL = `${API_URL}/geocoding/v1`;
const APP_DESCRIPTION = 'Opentransport - finding your way';

const walttiConfig = require('./waltti').default;

const minLat = 43;
const maxLat = 48;
const minLon = 20;
const maxLon = 30;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Opentransport', href: 'http://www.opentransport.ro/' },
  URL: {
    OTP: process.env.OTP_URL || `${API_URL}/routing/v1/routers/romania/`,
    MAP: {
      default: `https://api.mapbox.com/styles/v1/vladvesa/ck9329uuj2q1h1ik4h4am6ogr/tiles/`,
      token: MAP_TOKEN
      // default: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/`, //`${MAP_URL}/map/v1/hsl-map/`,
    },
    STOP_MAP: `${MAP_URL}/map/v1/romania-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v1/romania-citybike-map/`,

    FONT: 'https://fonts.googleapis.com/css?family=Noto+Sans:400,700%7CPT+Sans+Narrow:400,700',
    PELIAS: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/place`,
  },

  contactName: {
    default: 'STPT',
  },

  title: APP_TITLE,

  availableLanguages: ['ro', 'en'],
  defaultLanguage: 'ro',

  // This timezone data will expire on 31.12.2020
  timezoneData:
    'Europe/Bucharest|EET EEST|-20 -30|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 ' +
    'WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5',

  mainMenu: {
    // Whether to show the left menu toggle button at all
    show: true,
    showDisruptions: false,
    showLoginCreateAccount: false,
    showOffCanvasList: true,
  },
  showVehiclesOnStopPage: true,

  itinerary: {
    // How long vehicle should be late in order to mark it delayed. Measured in seconds.
    delayThreshold: 180,
    // Wait time to show "wait leg"? e.g. 180 means over 3 minutes are shown as wait time.
    // Measured in seconds.
    waitThreshold: 180,
    enableFeedback: false,

    timeNavigation: {
      enableButtonArrows: false,
    },

    showZoneLimits: false,
    // Number of days to include to the service time range from the future (DT-3317)
    serviceTimeRange: 30,
  },

  map: {
    useRetinaTiles: true,
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 12,
    maxZoom: 18,
    genericMarker: {
      // Do not render name markers at zoom levels below this value
      nameMarkerMinZoom: 18,

      popup: {
        offset: [106, 16],
        maxWidth: 250,
        minWidth: 250,
      },
    },

    useModeIconsInNonTileLayer: true,
  },
  
  // Navbar logo
  logo: 'opentransport/opentransport-logo.svg',
  favicon: './app/configurations/images/opentransport/opentransport-favicon.svg',

  defaultMapCenter: {
    lat: 45.76567,
    lon: 21.227578,
  },

  nearbyRoutes: {
    radius: 2000,
    bucketSize: 100,
  },

  maxWalkDistance: 2500,
  itineraryFiltering: 2.5, // drops 40% worse routes

  showDisclaimer: true,

  stopsMinZoom: 14,
  mergeStopsByCode: false,

  colors: {
    primary: '#000000',
  },

  sprites: 'assets/svg-sprite.default.svg',

  agency: {
    show: true,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,

    image: {
      url: '/img/hsl-social-share.png',
      width: 400,
      height: 400,
    },

    twitter: {
      card: 'summary',
      site: '@opentransportro',
    },
  },


  meta: {
    description: APP_DESCRIPTION,
    keywords: 'opentransport, timisoara, romania, routing, planificator, rute',
  },


  streetModes: {
    car_park: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'car-withoutBox',
    },

    car: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car_park-withoutBox',
    },
  },

  /*
   * by default search endpoints from all but gtfs sources, correct gtfs source
   * figured based on feedIds config variable
   */
  searchSources: ['oa', 'osm'],

  search: {
    suggestions: {
      useTransportIcons: true,
    },
    usePeliasStops: false,
    mapPeliasModality: false,
    peliasMapping: {},
    peliasLayer: null,
    peliasLocalization: null,
    minimalRegexp: new RegExp('.{2,}'),
    /* identify searches for route numbers/labels: bus | train | metro */
    lineRegexp: new RegExp(
      '(^[0-9]+[a-z]?$|^[yuleapinkrtdz]$|(^m[12]?b?$))',
      'i',
    ),
  },
  // searchParams: {
  //   'boundary.rect.min_lat': minLat,
  //   'boundary.rect.max_lat': maxLat,
  //   'boundary.rect.min_lon': minLon,
  //   'boundary.rect.max_lon': maxLon,
  // },

  textLogo: false,

  feedIds: [],

  areaPolygon: [
    [minLon, minLat],
    [minLon, maxLat],
    [maxLon, maxLat],
    [maxLon, minLat],
  ],

  defaultEndpoint: {
    address: 'Timisoara',
    lat: 45.749558161214544,
    lon: 21.23279571533203,
  },

  cityBike: {
    showCityBikes: true,
  },

  transportModes: {
    rail: {
      availableForSelection: true,
      defaultValue: true,
    },

    tram: {
      availableForSelection: true,
      defaultValue: true,
    },

    subway: {
      availableForSelection: false,
      defaultValue: false,
    },

    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },

    ferry: {
      availableForSelection: false,
      defaultValue: false,
    },

    citybike: {
      availableForSelection: true,
      defaultValue: false, // always false
    },
  },

  redirectReittiopasParams: false,
  queryMaxAgeDays: 14,

  defaultOrigins: [
    {
      icon: 'icon-icon_locate',
      label: 'Iulius Town',
      lat: 45.76693919705344,
      lon: 21.22649788856506
    }
  ],

  footer: {
    content: [
      { label: `© Opentransport ${walttiConfig.YEAR}` },
      {},
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
    ],
  },

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Opentransport for route planning in Opentransport region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],
  },
});
