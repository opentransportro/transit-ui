/* eslint-disable */
import configMerger from '../util/configMerger';
import { BIKEAVL_UNKNOWN } from '../util/citybikes';

const CONFIG = 'opentransport';
const APP_TITLE = 'CityRadar - sursa de informatii pentru orasul tau';
const API_URL = process.env.API_URL || 'https://api.opentransport.ro';
const GEOCODING_BASE_URL = process.env.GEOCODING_BASE_URL || `${API_URL}/geocoding/v1`;
const MAP_URL = process.env.MAP_URL || 'https://api.opentransport.ro';
const MAP_TOKEN = process.env.MAP_TOKEN || 'pk.eyJ1IjoiZ25vbWUtbWFwcyIsImEiOiJjaXF3a3lwbXkwMDJwaTBubmZlaGk4cDZ6In0.8aukTfgjzeqATA8eNItPJA&';
const APP_DESCRIPTION = 'Planificator rute ce ofera suport pentru organizarea de calatorii folosind transportul public sau bicicleta.';

const walttiConfig = require('./config.waltti').default;
const STATIC_MESSAGE_URL = process.env.STATIC_MESSAGE_URL || 'https://api.opentransport.ro/messages/';

// romania bounding box coordinates
const minLat = 43.6884447292;
const maxLat = 48.2208812526;
const minLon = 20.2201924985;
const maxLon = 29.62654341;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'opentransport.ro', href: 'http://www.opentransport.ro/' },
  URL: {
    OTP: process.env.OTP_URL || `${API_URL}/routing/v1/routers/romania/`,
    MAP: {
      default: `https://api.maptiler.com/maps/bright/`,
      token: `?key=pDlOqWuZpLlwttR14N8H`
    },
    STOP_MAP: `${MAP_URL}/map/v1/romania-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v1/romania-citybike-map/`,
    PELIAS: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${
      process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL
    }/reverse`,
    PELIAS_PLACE: `${
      process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL
    }/place`,
  },

  title: APP_TITLE,

  availableLanguages: ['ro', 'en'],
  defaultLanguage: 'ro',

  // This timezone data will expire in 2037
  timezoneData:
    'Europe/Bucharest|EET EEST|-20 -30|0101010101010101010101010101010101010|22k10 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5',

  /* Option to disable the "next" column of the Route panel as it can be confusing sometimes: https://github.com/mfdz/digitransit-ui/issues/167 */
  displayNextDeparture: true,

  showAllBusses: false,
  showVehiclesOnStopPage: true,

  itinerary: {
    // How long vehicle should be late in order to mark it delayed. Measured in seconds.
    delayThreshold: 180,
    // Wait time to show "wait leg"? e.g. 180 means over 3 minutes are shown as wait time.
    // Measured in seconds.
    waitThreshold: 180,
    enableFeedback: false,

    showZoneLimits: false,
    // Number of days to include to the service time range from the future (DT-3317)
    serviceTimeRange: 30,
  },

  map: {
    useRetinaTiles: true,
    showScaleBar: true, // DT-3470, DT-3397
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 7,
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

    line: {
      halo: {
        weight: 5,
        thinWeight: 3,
      },

      leg: {
        weight: 4,
        thinWeight: 2,
      },

      passiveColor: '#758993',
    },
  },

  // Navbar logo
  logo: 'opentransport/cityradar-logo.svg',
  favicon: './app/configurations/images/opentransport/cityradar-favicon.png',

  nearbyRoutes: {
    radius: 2000,
    results: 50,
    timeRange: 3600,
  },

  maxWalkDistance: 2500,
  itineraryFiltering: 2.5, // drops 40% worse routes

  showDisclaimer: true,

  // Lowest level for stops and terminals are rendered
  stopsMinZoom: 14,
  mergeStopsByCode: true,

  colors: {
    primary: '#e8aa27',
    hover: '#a07415',
  },

  sprites: 'assets/svg-sprite.opentransport.svg',

  appBarStyle: 'default',

  agency: {
    show: true,
  },

  mainMenu: {
    showDisruptions: false,
    showCitySelect: true,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,

    image: {
      url: '/img/cityradar-social-share.png',
      width: 800,
      height: 751,
    },
  },


  meta: {
    description: APP_DESCRIPTION,
    keywords: 'cityradar, informatii, opentransport, timisoara, cluj, bucuresti, sibiu, constanta, romania, routing, planificator, rute',
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

  textLogo: false,

  showNearYouButtons: true,
  nearYouModes: ['bus', 'tram', 'subway', 'rail', 'citybike'],
  
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
    capacity: BIKEAVL_UNKNOWN,
    networks: {
      velotm: {
        icon: 'citybike',
        name: {
          en: 'VeloTM',
          ro: 'VeloTM',
        },
        type: 'citybike',
        url: {
          en: 'http://velotm.ro/',
          ro: 'http://velotm.ro/',
        },
      },
      clujbike: {
        icon: 'citybike',
        name: {
          en: 'Cluj Bike',
          ro: 'Cluj Bike',
        },
        type: 'citybike',
        url: {
          en: 'https://www.clujbike.eu',
          ro: 'https://www.clujbike.eu',
        },
      },
      blackseabike: {
        icon: 'citybike',
        name: {
          en: 'Blacksea Bike',
          ro: 'Blacksea Bike',
        },
        type: 'citybike',
        url: {
          ro: 'http://www.blackseabike.ro',
          en: 'http://www.blackseabike.ro',
        },
      },
    },
  },

  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
      smallIconZoom: 14,
    },

    rail: {
      availableForSelection: true,
      defaultValue: true,
      smallIconZoom: 14,
    },

    tram: {
      availableForSelection: true,
      defaultValue: true,
      smallIconZoom: 14,
    },

    subway: {
      availableForSelection: true,
      defaultValue: false,
      smallIconZoom: 14,
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
      defaultValue: true, // always false
    },
  },

  redirectReittiopasParams: false,
  queryMaxAgeDays: 14,


  // Minimun distance between from and to locations in meters. User is noticed
  // if distance is less than this.
  minDistanceBetweenFromAndTo: 200,

  footer: {
    content: [
      { label: `© Open Transport ${walttiConfig.YEAR}` },
      {},
      {
        name: 'footer-feedback',
        nameEn: 'Submit feedback',
        href: 'https://www.facebook.com/opentransport.ro/',
        icon: 'icon-icon_speech-bubble',
      },
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/about-this-service',
        icon: 'icon-icon_info',
      },
    ],
  },

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Open Transport Routing S.R.L. for route planning in Timișoara, Cluj Napoca, Bucharest, Constanța and Sibiu cities. The service covers public transport, walking, cycling, and some private car use.',
          'Each data for each city might contain errors so if your willing to do so, please contribute and help us make this service even better.'
        ],
      },
      {
        header: 'Contributors',
        paragraphs: [
          'Thanks to all the contributors that made this project possible: Mihai Balint, Kristian Cseh, Claudiu Groza, Iulia Tamazlicariu, Lucian Mangu, Vlad Luca, Vlad Vesa.',
        ],
        link: 'https://bit.ly/opentransportro'
      },
      {
        header: 'Data sources',
        paragraphs: [
          "Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Public transport routes and timetables are processed internally and created by the informations provided by the transit agencies in each city.",
        ],
      },
    ],
    ro: [
      {
        header: 'Despre acest serviciu',
        paragraphs: [
          'Acest serviciu este furnizat de către Open Transport Routing S.R.L. și oferă posibilitatea de a planifca rute în orașele Timișoara, Cluj Napoca, București, Constanța și Sibiu. Serviciul oferă posibilitatea de a planifica rute folosind transportul public, mersul pe jos, cu bicicleta sau în unele cazuri, utilizarea mașinii personale.',
          'Fiecare set de date este prelucrat individual și poate conține erori. Dacă ești interesat să ne ajuți pentru a imbunătăți informațiile, te rugăm să ne contactezi.'
        ],
      },
      {
        header: 'Oamenii din spatele proiectului',
        paragraphs: [
          'Mulțumim tutoror celor care au contribuit și au făcut acest serviciu posibil: Mihai Balint, Kristian Cseh, Claudiu Groza, Iulia Tamazlicariu, Lucian Mangu, Vlad Luca, Vlad Vesa.',
        ],
        link: 'https://bit.ly/opentransportro'
      },
      {
        header: 'Sursele de date',
        paragraphs: [
          "Hărțile, străzile, clădirile, locațiile pentru stațiile de transport sunt furnizate de către © OpenStreetMap incluzand aici contribuțiile comunității. Informațiile legate de transportul public (rute și programele de circulație) sunt generate si întreținute intern. Acestea sunt create folosind informațiile furnizate de societățile de transport din fiecare oraș menționat.",
        ],
      },
    ],
  },
  staticMessagesUrl: STATIC_MESSAGE_URL,
  multiCity: {
    enabled: true,
    cities: [
      {
        name: 'Timișoara',
        quote: 'Catedrala Mitropolitana',
        lat: 45.751067,
        lon: 21.224414,
        icon: 'icon-icon_city-timisoara',
        origins: [
          {
            icon: 'icon-icon_city-poi-hospital',
            label: 'Spitalul Judetean',
            lat: 45.737180,
            lon: 21.242349,
          },
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Piata Unirii',
            lat: 45.757502,
            lon: 21.228801
          },
          {
            icon: 'icon-icon_city-poi-stadium',
            label: 'Stadionul Dan Paltinisanu',
            lat: 45.740508,
            lon: 21.244028,
          },
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Universitatea Politehnica',
            lat: 45.747390,
            lon: 21.226669,
          },
          {
            icon: 'icon-icon_city-poi-rail-station',
            label: 'Gara de nord',
            lat: 45.751562,
            lon: 21.207828,
          },
          {
            icon: 'icon-icon_city-poi-zoo',
            label: 'Zoo & Pădurea Verde',
            lat: 45.781389,
            lon: 21.268209,
          },
        ],
      },
      {
        name: 'Cluj-Napoca',
        quote: 'Teatrul National "Lucian Blaga"',
        lat: 46.770651,
        lon: 23.597136,
        icon: 'icon-icon_city-cluj',
        origins: [
          {
            icon: 'icon-icon_city-poi-stadium',
            label: 'Cluj Arena',
            lat: 46.768435,
            lon: 23.572722
          },
          {
            icon: 'icon-icon_city-poi-parc',
            label: 'Belvedere',
            lat: 46.775283,
            lon: 23.582504,
          },
          {
            icon: 'icon-icon_city-poi-hospital',
            label: 'Spitalul Judetean',
            lat: 46.765357,
            lon: 23.583503,
          },
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Muzeul de arta',
            lat: 46.770419,
            lon: 23.589988,
          },
        ],
      },
      {
        name: 'București',
        quote: 'Palatul Cec',
        lat: 44.4319626,
        lon: 26.0960873,
        icon: 'icon-icon_city-bucuresti',
        origins: [
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Ateneul Roman',
            lat: 44.441255,
            lon: 26.097236,
          },
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Palatul Parlamentului',
            lat: 44.427513,
            lon: 26.088870,
          },
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Muzeul national de arta',
            lat: 44.439423,
            lon: 26.096102,
          },
          {
            icon: 'icon-icon_airplane',
            label: 'Aeroportul Otopeni',
            lat: 44.573036,
            lon: 26.084485,
          },
          {
            icon: 'icon-icon_city-poi-parc',
            label: 'Lacul Cismigiu',
            lat: 44.436180,
            lon: 26.090322,
          },
        ],
      },
      {
        name: 'Sibiu',
        quote: 'Muzeul National Brukenthal',
        lat: 45.7965443,
        lon: 24.1499947,
        icon: 'icon-icon_city-sibiu',
        origins: [
          {
            icon: 'icon-icon_city-poi-monument',
            label: 'Piața Mare',
            lat: 45.7965443,
            lon: 24.1499947
          },
          {
            icon: 'icon-icon_city-poi-hospital',
            label: 'Hospital',
            lat: 45.795204,
            lon: 24.156961,
          },
          {
            icon: 'icon-icon_city-poi-stadium',
            label: 'Stadion',
            lat: 45.783129,
            lon: 24.144584,
          }
        ],
      },
      {
        name: 'Constanta',
        quote: 'Cazinoul Constanta',
        lat: 44.170476,
        lon: 28.663355,
        icon: 'icon-icon_city-constanta',
        origins: [
          {
            icon: 'icon-icon_city-poi-parc',
            label: 'Faleza Constanta',
            lat: 44.173023,
            lon: 28.664930,
          },
          {
            icon: 'icon-icon_city-poi-hospital',
            label: 'Spitalul Clinic Județean',
            lat: 44.185846,
            lon: 28.642427,
          },
          {
            icon: 'icon-icon_city-poi-parc',
            label: 'Delfinariul Constanta',
            lat: 44.205682,
            lon: 28.643303,
          }
        ],
      }
    ]
  }
});
