import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { routerShape } from 'react-router';
import { FormattedMessage, intlShape } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';

class AboutPage extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    router: routerShape,
    location: PropTypes.object,
    config: PropTypes.object.isRequired,
  };

  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
  };

  goBack = () => {
    this.context.router.push({
      ...this.context.location,
      state: {
        ...this.context.location.state,
        offcanvasVisible: false,
      },
      pathname: '/',
    });
  };

  render() {
    const { config } = this.context;
    const { currentLanguage } = this.props;
    const about = config.aboutThisService[currentLanguage];
    return (
      <div className="about-page fullscreen">
        <div className="page-frame fullscreen momentum-scroll">
          {about.map(
            (section, i) =>
              (section.paragraphs && section.paragraphs.length) ||
              section.link ? (
                <div key={`about-section-${i}`}>
                  <h1 className="about-header">{section.header}</h1>
                  {section.paragraphs &&
                    section.paragraphs.map((p, j) => (
                      <p key={`about-section-${i}-p-${j}`}>{p}</p>
                    ))}
                  {section.link && (
                    <a href={section.link}>
                      <FormattedMessage
                        id="extra-info"
                        defaultMessage="More information"
                      />
                    </a>
                  )}
                </div>
              ) : (
                false
              ),
          )}
          <button
            type="button"
            className="icon-holder noborder cursor-pointer"
            onClick={this.goBack}
            aria-label={this.context.intl.formatMessage({
              id: 'back-button-title',
              defaultMessage: 'Back to front page',
            })}
          >
            <div className="call-to-action-button">
              <FormattedMessage
                id="back-to-front-page"
                defaultMessage="Back to front page"
              />
            </div>
          </button>
        </div>
      </div>
    );
  }
}

const connectedComponent = connectToStores(
  AboutPage,
  ['PreferencesStore'],
  context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  }),
);

export { connectedComponent as default, AboutPage as Component };
