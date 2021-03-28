import fetchClient from './fetchClient.js';
import AppConstants from '../appConstants.js';
import BaseApi from './baseApi.js';

class PostApi extends BaseApi {
  getResourceName() {
    return 'posts';
  }

  getAll(params = { _page: AppConstants.DEFAULT_PAGE, _limit: AppConstants.DEFAULT_LIMIT }) {

    const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    return fetchClient.get(url, params);
  }

  // getDetail(postId) {
  //   const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
  //   return fetchClient.get(url);
  // }

  // add(post) {
  //   const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
  //   return fetchClient.post(url, post);
  // }

  // update(post) {
  //   const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
  //   return fetchClient.patch(url, post);
  // }

  // remove(postId) {
  //   const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
  //   return fetchClient.delete(url);
  // }
}

const postApi = new PostApi();
export default postApi;
