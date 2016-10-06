'use babel';

import axios from 'axios';
import Qiita from 'qiita-js';

const API_BASE_URL = 'https://qiita.com'

class QiitaClient {
  constructor(token) {
    this.TOKEN = token;
  }
  searchByKeyword(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query,
        page
      },
      headers: {
        Authorization: `Bearer ${this.TOKEN}`
      }
    });
  }

  searchByTitle(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query: `title:${query}`,
        page
      },
      headers: {
        Authorization: `Bearer ${this.TOKEN}`
      }
    });
  }

  searchByTag(tag, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/tags/${tag}/items`, {
      params: {
        page
      },
      headers: {
        Authorization: `Bearer ${this.TOKEN}`
      }
    });
  }

  post(body, title, isPublic) {
    Qiita.setToken(this.TOKEN);
    Qiita.setEndpoint(API_BASE_URL);
    return Qiita.Resources.Item.create_item({
      title,
      body,
      private: !isPublic,
      tags: [{"name" : "test"}]
    });
  }
}


export const getClient = (token) => {
  return new QiitaClient(token);
}
export default new QiitaClient('');
