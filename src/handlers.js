/* eslint-disable no-param-reassign */
import validateURL from './validator.js';

export default (e, state) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url').toString().trim();
  const error = validateURL(url, state.feeds);
  state.form.error = error;

  if (error) {
    state.form.process = 'failing';
  } else {
    state.form.process = 'loading';

    state.feeds.push(url);
  }
};
