/* eslint-disable dot-notation */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint react/forbid-prop-types: 0 */
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import i18next from 'i18next';
import Icon from '@digitransit-component/digitransit-component-icon';
import styles from './helpers/styles.scss';
import translations from './helpers/translations';

i18next.init({
  lng: 'fi',
  fallbackLng: 'fi',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

function SeparatorLine({ usePaddingBottom20 }) {
  const className = usePaddingBottom20
    ? styles['separator-div2']
    : styles['separator-div'];
  return (
    <div id="SeparatorDiv" className={className}>
      <div id="SeparatorLine" className={styles['separator-line']} />
    </div>
  );
}

SeparatorLine.propTypes = {
  usePaddingBottom20: PropTypes.bool,
};

SeparatorLine.defaultProps = {
  usePaddingBottom20: false,
};

function OriginToDestination({ showTitle, language }) {
  i18next.changeLanguage(language);
  return (
    <div id="OriginToDestination">
      {showTitle && <span>{i18next.t('title-origin-to-destination')}</span>}
      {showTitle && <br />}
      <input
        className={styles['input']}
        placeholder={i18next.t('placeholder-origin')}
      />
      <br />
      <input
        className={styles['input']}
        placeholder={i18next.t('placeholder-destination')}
      />
    </div>
  );
}

OriginToDestination.propTypes = {
  showTitle: PropTypes.bool,
  language: PropTypes.string,
};

OriginToDestination.defaultProps = {
  showTitle: false,
  language: 'fi',
};

/**
 * Show button links to near you page for different travel modes
 *
 * @param {Object} props
 * @param {string[]} props.modes - Names of transport modes to show buttons for. Should be in lower case. Also defines button order
 * @param {string} props.language - Language used for accessible labels
 * @param {string} props.urlPrefix - URL prefix for links. Must end with /lahellasi
 * @param {boolean} props.showTitle - Show title, default is false
 * @param {Object} props.alertsContext
 * @param {function} props.alertsContext.getModesWithAlerts - Function which should return an array of transport modes that have active alerts (e.g. [BUS, SUBWAY])
 * @param {Number} props.alertsContext.currentTime - Time stamp with which the returned alerts are validated with
 * @param {Number} props.alertsContext.feedIds - feedIds for which the alerts are fetched for
 * @param {element} props.LinkComponent - React component for creating a link, default is undefined and normal anchor tags are used
 *
 * @example
 * const alertsContext = {
 *    getModesWithAlerts: () => ({}),
 *    currentTime: 123456789,
 *    feedIds: [HSL]
 * }
 * <CtrlPanel.NearStopsAndRoutes
 *      modes={['bus', 'tram', 'subway', 'rail', 'ferry', 'citybike']}
 *      language="fi"
 *      urlPrefix="http://example.com/lahellasi"
 *      showTitle
 *      alertsContext={alertsContext}
 *    />
 *
 */
function NearStopsAndRoutes({
  modes,
  urlPrefix,
  language,
  showTitle,
  alertsContext,
  LinkComponent,
  origin,
  omitLanguageUrl,
}) {
  const [modesWithAlerts, setModesWithAlerts] = useState([]);
  useEffect(() => {
    Object.keys(translations).forEach(lang => {
      i18next.addResourceBundle(lang, 'translation', translations[lang]);
    });
    if (alertsContext) {
      alertsContext
        .getModesWithAlerts(alertsContext.currentTime, alertsContext.feedIds)
        .then(res => {
          setModesWithAlerts(res);
        });
    }
  }, []);

  const queryString = origin.queryString || '';
  let urlStart;
  if (omitLanguageUrl) {
    urlStart = urlPrefix;
  } else {
    const urlParts = urlPrefix.split('/');
    urlParts.splice(urlParts.length - 1, 0, language);
    urlStart = urlParts.join('/');
  }
  const buttons = modes.map(mode => {
    const withAlert = modesWithAlerts.includes(mode.toUpperCase());
    let url = `${urlStart}/${mode.toUpperCase()}/POS`;
    if (origin.lat && origin.lon) {
      url += `/${encodeURIComponent(origin.address)}::${origin.lat},${
        origin.lon
      }${queryString}`;
    }
    if (LinkComponent) {
      return (
        <LinkComponent to={url} key={mode}>
          <span className={styles['sr-only']}>
            {i18next.t(`pick-mode-${mode}`, { lng: language })}
          </span>
          <span className={styles['transport-mode-icon-container']}>
            <span className={styles['transport-mode-icon-with-icon']}>
              <Icon img={`mode-${mode}`} />
              {withAlert && (
                <span className={styles['transport-mode-alert-icon']}>
                  <Icon img="caution" color="#dc0451" />
                </span>
              )}
            </span>
          </span>
        </LinkComponent>
      );
    }
    return (
      <a href={url} key={mode}>
        <span className={styles['sr-only']}>
          {i18next.t(`pick-mode-${mode}`, { lng: language })}
        </span>
        <span className={styles['transport-mode-icon-container']}>
          <Icon img={`mode-${mode}`} />
          {withAlert && (
            <span className={styles['transport-mode-alert-icon']}>
              <Icon img="caution" color="#dc0451" />
            </span>
          )}
        </span>
      </a>
    );
  });

  return (
    <div className={styles['near-you-container']}>
      {showTitle && (
        <h2 className={styles['near-you-title']}>
          {i18next.t('title-route-stop-station', { lng: language })}
        </h2>
      )}
      <div className={styles['near-you-buttons-container']}>{buttons}</div>
    </div>
  );
}

NearStopsAndRoutes.propTypes = {
  modes: PropTypes.arrayOf(PropTypes.string).isRequired,
  urlPrefix: PropTypes.string.isRequired,
  language: PropTypes.string,
  showTitle: PropTypes.bool,
  alertsContext: PropTypes.shape({
    getModesWithAlerts: PropTypes.func,
    currentTime: PropTypes.number,
    feedIds: PropTypes.arrayOf(PropTypes.string),
  }),
  LinkComponent: PropTypes.object,
  origin: PropTypes.object,
  omitLanguageUrl: PropTypes.bool,
};

NearStopsAndRoutes.defaultProps = {
  showTitle: false,
  language: 'fi',
  LinkComponent: undefined,
  origin: undefined,
  omitLanguageUrl: undefined,
};

/**
 * CtrlPanel gathers multiple components to same area (desktop-size: left or mobile-size: bottom)
 *
 * @example
 * <CtrlPanel language="fi" position="left">
 *    <CtrlPanel.OriginToDestination showTitle />
 *    <CtrlPanel.SeparatorLine />
 *    <CtrlPanel.NearStopsAndRoutes
 *      modes={['bus', 'tram', 'subway', 'rail', 'ferry', 'citybike']}
 *      language="fi"
 *      urlPrefix="http://example.com/lahellasi"
 *      showTitle
 *    />
 *  </CtrlPanel>
 */
class CtrlPanel extends React.Component {
  static NearStopsAndRoutes = NearStopsAndRoutes;

  static OriginToDestination = OriginToDestination;

  static SeparatorLine = SeparatorLine;

  static propTypes = {
    children: PropTypes.node,
    language: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: [],
  };

  render() {
    const className =
      this.props.position === 'bottom'
        ? styles['main-bottom']
        : styles['main-left'];
    const children = React.Children.map(this.props.children, child => {
      if (child) {
        let lang = this.props.language;
        if (lang === undefined) {
          lang = 'fi';
        }
        i18next.changeLanguage(lang);
        return React.cloneElement(child, { lang });
      }
      return null;
    });
    return (
      <Fragment>
        <div key="main" className={className}>
          {children}
        </div>
      </Fragment>
    );
  }
}

export default CtrlPanel;
