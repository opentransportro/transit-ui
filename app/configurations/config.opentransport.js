/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'opentransport';
const APP_TITLE = 'CityRadar - sursa de informatii pentru orasul tau';
const API_URL = process.env.API_URL || 'https://api.opentransport.ro';
const MAP_URL = process.env.MAP_URL || 'https://api.opentransport.ro';
const MAP_TOKEN = process.env.MAP_TOKEN || 'pk.eyJ1IjoiZ25vbWUtbWFwcyIsImEiOiJjaXF3a3lwbXkwMDJwaTBubmZlaGk4cDZ6In0.8aukTfgjzeqATA8eNItPJA&';
const GEOCODING_BASE_URL = `${API_URL}/geocoding/v1`;
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
      default: `https://api.mapbox.com/styles/v1/vladvesa/ck9sy09li0awb1ip824j78jc1/tiles/`,
      token: MAP_TOKEN
    },
    STOP_MAP: `${MAP_URL}/map/v1/romania-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v1/romania-citybike-map/`,

    PELIAS: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/place`,
  },

  title: APP_TITLE,

  availableLanguages: ['ro', 'en'],
  defaultLanguage: 'ro',

  // This timezone data will expire on 31.12.2020
  timezoneData:
    'Europe/Bucharest|EET EEST|-20 -30|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 ' +
    'WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5',

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
    primary: '#fff',
  },

  sprites: 'assets/svg-sprite.opentransport.svg',

  agency: {
    show: false,
  },

  mainMenu: {
    showDisruptions: true,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,

    image: {
      url: '/img/cityradar-social-share.png',
      width: 800,
      height: 751,
    },

    // twitter: {
    //   card: 'summary',
    //   site: '@opentransportro',
    // },
  },


  meta: {
    description: APP_DESCRIPTION,
    keywords: 'cityradar, informatii, opentransport, timisoara, cluj, bucuresti, sibiu, constanta, romania, routing, planificator, rute',
  },


  streetModes: {
    car_park: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'car_park-withoutBox',
    },

    car: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car-withoutBox',
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

  defaultOrigins: [
    {
      icon: 'icon-icon_city',
      label: 'Timișoara',
      lat: 45.76693919705344,
      lon: 21.22649788856506
    },
    // {
    //   icon: 'icon-icon_city',
    //   label: 'Cluj Napoca',
    //   lat: 46.772722,
    //   lon: 23.5913713
    // },
    // {
    //   icon: 'icon-icon_city',
    //   label: 'Sibiu',
    //   lat: 45.7916218,
    //   lon: 24.1379915
    // },
    // {
    //   icon: 'icon-icon_city',
    //   label: 'București',
    //   lat: 44.4378043,
    //   lon: 26.0245983
    // },
    // {
    //   icon: 'icon-icon_city',
    //   label: 'Constanța',
    //   lat: 44.1761039,
    //   lon: 28.6317739
    // }
  ],

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
          'This service is provided by Opentransport for route planning in Opentransport region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Digitransit platform',
        paragraphs: [
          'The Digitransit service platform is an open source routing platform developed by HSL and Traficom.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          "Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are downloaded from Traficom's national public transit database.",
        ],
      },
    ],
    ro: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Opentransport for route planning in Opentransport region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Digitransit platform',
        paragraphs: [
          'The Digitransit service platform is an open source routing platform developed by HSL and Traficom.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          "Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are downloaded from Traficom's national public transit database.",
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
            icon: 'icon-icon_city',
            label: 'Spitalul Judetean',
            lat: 45.737180,
            lon: 21.242349,
          },
          {
            icon: 'icon-icon_city',
            label: 'Piata Unirii',
            lat: 45.757502,
            lon: 21.228801
          },
          {
            icon: 'icon-icon_city',
            label: 'Stadionul Dan Paltinisanu',
            lat: 45.740508,
            lon: 21.244028,
          },
          {
            icon: 'icon-icon_city',
            label: 'Universitatea Politehnica',
            lat: 45.747390,
            lon: 21.226669,
          },
          {
            icon: 'icon-icon_city',
            label: 'Gara de nord',
            lat: 45.751562,
            lon: 21.207828,
          },
          {
            icon: 'icon-icon_city',
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
        lon:  23.597136,
        icon: 'icon-icon_city-cluj',
        origins: [
          {
            icon: 'icon-icon_city',
            label: 'Cluj Arena',
            lat: 46.768435,
            lon: 23.572722
          },
          {
            icon: 'icon-icon_city',
            label: 'Belvedere',
            lat: 46.775283,
            lon: 23.582504,
          },
          {
            icon: 'icon-icon_city',
            label: 'Spitalul Judetean',
            lat: 46.765357,
            lon: 23.583503,
          },
          {
            icon: 'icon-icon_city',
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
            icon: 'icon-icon_city',
            label: 'Muzeul national de arta',
            lat: 44.432007,
            lon: 26.099853,
          },
          {
            icon: 'icon-icon_city',
            label: 'Ateneul Roman',
            lat: 44.441255,
            lon: 26.097236,
          },
          {
            icon: 'icon-icon_city',
            label: 'Palatul Parlamentului',
            lat: 44.427513,
            lon: 26.088870,
          },
          {
            icon: 'icon-icon_city',
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
            icon: 'icon-icon_city',
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
            icon: 'icon-icon_city',
            label: 'Piața Mare',
            lat: 45.7965443,
            lon: 24.1499947
          },
          {
            icon: 'icon-icon_city',
            label: 'Hospital',
            lat: 45.795204,
            lon: 24.156961,
          },
          {
            icon: 'icon-icon_city',
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
            icon: 'icon-icon_city',
            label: 'Faleza Constanta',
            lat: 44.173023,
            lon: 28.664930,
          },
          {
            icon: 'icon-icon_city',
            label: 'Spitalul Clinic Județean',
            lat: 44.185846,
            lon: 28.642427,
          },
          {
            icon: 'icon-icon_city',
            label: 'Delfinariul Constanta',
            lat: 44.205682,
            lon: 28.643303,
          }
        ],
      }
    ]
  }
});
