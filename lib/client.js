'use babel';

import axios from 'axios';

const API_BASE_URL = 'https://qiita.com'

class QiitaClient {
  constructor() {
    this.token = '';
  }

  getHeader() {
    return this.token ? {
      Authorization: `Bearer ${this.token}`
    } : {};
  }

  auth(token) {
    this.token = token;
    return axios.get(`${API_BASE_URL}/api/v2/authenticated_user`, {
      headers: this.getHeader()
    })
      .then((response) => response.data.type !== 'unauthorized')
      .catch(() => false);
  }

  clearToken() {
    this.token = '';
  }

  searchByKeyword(query, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query,
        page
      },
      headers: this.getHeader()
    });
  }

  searchByTitle(query, page=1) {
    console.log(this.getHeader);
    return axios.get(`${API_BASE_URL}/api/v2/items`, {
      params: {
        query: `title:${query}`,
        page
      },
      headers: this.getHeader()
    });
  }

  searchByTag(tag, page=1) {
    return axios.get(`${API_BASE_URL}/api/v2/tags/${tag}/items`, {
      params: {page},
      headers: this.getHeader()
    });
  }

  post(body, title, isPublic) {
    return axios.post(`${API_BASE_URL}/api/v2/items`, {
      title,
      body,
      private: !isPublic,
      tags: [{"name" : "test"}]
    }, {
      headers: this.getHeader()
    });
  }
}

export default new QiitaClient();
