import onChange from 'on-change';

export default (state, i18n) => {
  const elements = {
    button: document.querySelector('button[type="submit"]'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('.rss-form'),
  };

  const activationForm = (is) => {
    if (is) {
      elements.input.removeAttribute('readOnly');
      elements.button.removeAttribute('disabled');
    } else {
      elements.input.setAttribute('readOnly', true);
      elements.button.setAttribute('disabled', true);
    }
  };

  const clearErrors = () => {
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('text-danger', 'text-success');
    elements.input.classList.remove('is-invalid');
  };

  const renderError = (error) => {
    clearErrors();
    if (error) {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      console.log(error);
      elements.feedback.textContent = i18n.t(`state.form.${error}`);
    }
  };

  const renderProcess = (process) => {
    switch (process) {
      case 'loading':
        activationForm(false);
        clearErrors();
        break;
      case 'failing':
        activationForm(true);
        // renderError(state.form.error);
        break;
      case 'success':
        activationForm(true);
        clearErrors();
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18n.t('state.form.success');
        elements.form.reset();
        elements.input.focus();
        break;
      default:
        throw new Error(`Unexpected process ${process}`);
    }
  };

  const renderFeeds = (feeds) => {
    console.log(feeds, state);
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.process':
        renderProcess(value);
        break;
      case 'form.error':
        renderError(value);
        break;
      case 'feeds':
        renderFeeds(value);
        break;
      default:
        throw new Error(`Unexpected path to state: ${path}`);
    }
  });
  return watchedState;
};
