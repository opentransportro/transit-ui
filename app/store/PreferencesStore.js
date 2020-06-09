import Store from 'fluxible/addons/BaseStore';
import reactCookie from 'react-cookie';
import { isLangMockEn } from '../util/browser';
import {
  getCityPreferenceStorage,
  setCityPreferenceStorage,
} from './localStorage';

/* Language is stored in cookie, server should set the language based on browser
 * accepted languages
 */
class PreferencesStore extends Store {
  static storeName = 'PreferencesStore';

  constructor(dispatcher) {
    super(dispatcher);

    const { config } = dispatcher.getContext();
    this.availableLanguages = config.availableLanguages;
    this.defaultLanguage = config.defaultLanguage;

    if (isLangMockEn) {
      this.setLanguage('en');
    }

    const language = reactCookie.load('lang');
    if (this.availableLanguages.indexOf(language) === -1) {
      // illegal selection, use default
      this.language = this.defaultLanguage;
    } else {
      this.language = language;
    }

    this.preferedCityInfo = getCityPreferenceStorage();
  }

  getLanguage() {
    return this.language;
  }

  setLanguage(language) {
    if (this.availableLanguages.indexOf(language) === -1) {
      return;
    }

    reactCookie.save('lang', language, {
      // Good up to one year
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });
    this.language = language;
    this.emitChange();
  }

  getPreferredCity() {
    return this.preferedCityInfo;
  }

  setPreferredCity(city) {
    this.preferedCityInfo = city;
    setCityPreferenceStorage(this.preferedCityInfo);
    this.emitChange();
  }

  static handlers = {
    SetLanguage: 'setLanguage',
    SetPreferredCity: 'setPreferredCity',
  };
}

export default PreferencesStore;
