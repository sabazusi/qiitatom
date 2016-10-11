'use babel';

import Qiita from 'qiita-js';

const API_BASE_URL = 'https://qiita.com'

class QiitaClient {
  constructor(token) {
    Qiita.setEndpoint(API_BASE_URL);
  }

  updateToken(token) {
    Qiita.setToken(token);
  }

  auth() {
    return Qiita.Resources.AuthenticatedUser.get_authenticated_user({})
      .then((response) => response.type !== 'unauthorized')
      .catch(() => false);
  }

  searchByKeyword(query, page=1) {
    return Qiita.Resources.Item.list_items({
      query,
      page
    });
  }

  searchByTitle(query, page=1) {
    return Qiita.Resources.Item.list_items({
      query: `title:${query}`,
      page
    });
  }

  searchByTag(tag, page=1) {
    return Qiita.Resources.Item.list_tag_items({
      page
    });
  }

  post(body, title, isPublic) {
    return Qiita.Resources.Item.create_item({
      title,
      body,
      private: !isPublic,
      tags: [{"name" : "test"}]
    });
  }
}

export default new QiitaClient();
