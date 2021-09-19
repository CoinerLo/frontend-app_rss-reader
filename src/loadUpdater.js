/* eslint no-param-reassign: ["error", { "props": false }] */
import _ from 'lodash';
import loadRSS from './downloader';

const updateRSS = (state) => {
  const { feeds, posts } = state;
  const allUrls = feeds.map(({ url }) => url);
  const urlsChunks = _.chunk(allUrls, 10);

  const promises = (urls) => {
    const promisesUrls = urls.map(loadRSS);
    return Promise.all(promisesUrls)
      .then((results) => {
        const flatPosts = results.flatMap((result) => result.posts);
        const allPosts = _.union(flatPosts, posts);
        const newPosts = _.differenceBy(allPosts, posts, 'postLink');
        if (newPosts.length > 0) {
          state.posts = [...newPosts, ...posts];
        }
      })
      .finally(() => {
        setTimeout(() => updateRSS(state), 10000); // update time
      });
  };

  urlsChunks.forEach((chunkUrls) => promises(chunkUrls));

  promises(allUrls);
};

export default updateRSS;
