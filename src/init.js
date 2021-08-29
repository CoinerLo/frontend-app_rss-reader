import i18n from 'i18next';
import ru from './locales/ru.js';
import view from './view.js';
import addFeed from './handlers.js';

export default () => {
  const state = {
    form: {
      process: 'filling',
      error: null,
    },
    feeds: [],
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const watchedState = view(state, i18nInstance);

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => addFeed(e, watchedState));
};
