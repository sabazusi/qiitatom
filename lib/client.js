'use babel';

import axios from 'axios';

const API_BASE_URL = 'https://qiita.com'
class QiitaClient {
  searchByKeyword(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query,
        page
      }
    });
  }

  searchByTitle(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query: `title:${query}`,
        page
      }
    });
  }

  searchByTag(tag, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/tags/${tag}/items`, {
      params: {
        page
      }
    });
  }
}

export default new QiitaClient();
