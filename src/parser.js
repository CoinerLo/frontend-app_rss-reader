import _ from 'lodash';

export default (contents) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(contents, 'application/xml');

  const id = _.uniqueId();

  const channel = data.querySelector('channel');

  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const channelItems = [...channel.querySelectorAll('item')];
  const posts = channelItems.map((item) => {
    const postId = _.uniqueId();
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    return {
      postId,
      postTitle,
      postDescription,
      postLink,
    };
  });
  return {
    feedInfo: {
      id,
      title,
      description,
    },
    posts,
  };
};
