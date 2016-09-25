'use babel';

import axios from 'axios';

const API_BASE_URL = 'https://qiita.com'
export default class {
  search(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query,
        page
      }
    });
  }
}
