/* eslint no-param-reassign: ["error", { "props": false }] */
import validateURL from './validator.js';
import loadRSS from './downloader';
import updateRSS from './loadUpdater';

export default (e, state) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url').toString().trim();
  const error = validateURL(url, state.feeds);
  state.form.error = error;
  const feedsCount = state.feeds.length;
  if (error) {
    state.form.process = 'failing';
  } else {
    state.form.process = 'loading';
    loadRSS(url)
      .then((feedPars) => {
        feedPars.feedInfo.url = url;
        state.feeds = [feedPars.feedInfo, ...state.feeds];
        state.posts = [...feedPars.posts, ...state.posts];
        state.form.process = 'success';
        if (feedsCount === 0) {
          updateRSS(state);
        }
      })
      .catch((errorDownload) => {
        console.log(errorDownload);
        state.form.process = 'failing';
        if (errorDownload.isAxiosError) {
          state.form.error = 'netError';
        } else {
          state.form.error = 'invalidRss';
        }
      });
  }
};

export const handlePosts = (state, post) => {
  state.viewedPosts = [post.postId, ...state.viewedPosts];
};
