import onChange from 'on-change';
import { handlePosts } from './handlers.js';

export default (state, i18n) => {
  const elements = {
    button: document.querySelector('button[type="submit"]'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('.rss-form'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    fullArticle: document.querySelector('a.full-article'),
  };
  /* Активация-дезактивация формы */
  const activationForm = (is) => {
    if (is) {
      elements.input.removeAttribute('readOnly');
      elements.button.removeAttribute('disabled');
    } else {
      elements.input.setAttribute('readOnly', true);
      elements.button.setAttribute('disabled', true);
    }
  };
  /* Рендерим состояние ошибки */
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
      elements.feedback.textContent = i18n.t(`state.form.${error}`);
    }
  };
  /* Рендерим изменение процессов -загрузка-ошибка-успешно- */
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
  /* Рендерим список фидов */
  const renderFeeds = (feeds) => {
    elements.feeds.innerHTML = '';
    const feedsCard = document.createElement('div');
    feedsCard.classList.add('card', 'border-0');
    feedsCard.innerHTML = `
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('feeds')}</h2>
      </div>
    `;
    elements.feeds.append(feedsCard);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'boreder-0', 'border-end-0');
      li.innerHTML = `
        <h3 class="h6 m-0">${feed.title}</h3>
        <p class="m-0 small text-black-50">${feed.description}</p>
      `;
      ul.append(li);
    });
    feedsCard.append(ul);
  };
  /* Рендерим посты с сылками и кнопками */
  const renderPosts = (posts) => {
    elements.posts.innerHTML = '';
    const postsCard = document.createElement('div');
    postsCard.classList.add('card', 'border-0');
    postsCard.innerHTML = `
      <div class="card-body">
        <h2 class="card-title h4>${i18n.t('posts')}</h4>
      </div>
    `;

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    posts.forEach((post) => {
      const {
        postId,
        postTitle,
        postDescription,
        postLink,
      } = post;
      const li = document.createElement('li');
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      );

      const isViewed = state.viewedPosts.includes(postId);
      const classesA = isViewed ? 'fw-normal link-secondaty' : 'fw-bold';
      li.innerHTML = `
        <a href="${postLink}" class="${classesA}" data-id=${postId} target="_blank" rel="noopener noreferrer">
          ${postTitle}
        </a>
      `;

      const previewButton = document.createElement('button');
      previewButton.type = 'button';
      previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      previewButton.dataset.bsToggle = 'modal';
      previewButton.dataset.bsTarget = '#modal';
      previewButton.dataset.id = postId;
      previewButton.textContent = i18n.t('previewButton');
      li.append(previewButton);

      const a = li.querySelector('a');
      a.addEventListener('click', () => {
        if (!isViewed) {
          handlePosts(state, post);
          a.classList.remove('fw-bold');
          a.classList.add('fw-normal', 'link-secondary');
        }
      });

      previewButton.addEventListener('click', () => {
        if (!isViewed) {
          handlePosts(state, post);
          a.classList.remove('fw-bold');
          a.classList.add('fw-normal', 'link-secondary');
        }
        elements.modalTitle.textContent = postTitle;
        elements.modalBody.textContent = postDescription;
        elements.fullArticle.setAttribute('href', postLink);
      });
      ul.append(li);
    });

    postsCard.append(ul);
    elements.posts.append(postsCard);
  };
  /* Вотчер состояния */
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
      case 'posts':
        renderPosts(value);
        break;
      default:
        throw new Error(`Unexpected path to state: ${path}`);
    }
  });
  return watchedState;
};
