import axios from 'axios';
import parse from './parser.js';

const routes = {
  allOrigins: (url) => {
    const request = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
    request.searchParams.set('url', url);
    request.searchParams.set('disableCache', 'true');
    return request.toString();
  },
};

export default (url) => axios.get(routes.allOrigins(url))
  .then((response) => parse(response.data.contents));
