import * as yup from 'yup';

export default (link, feeds) => {
  const urls = feeds.map((url) => url);

  const schema = yup
    .string()
    .required('errorEmptyField')
    .url('errorUrl')
    .notOneOf(urls, 'errorDouble');

  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.message;
  }
};
