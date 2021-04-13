import axios from '@/plugins/axios';
import accessHeader from './access-header';

class ProductiveAPI {
  getOrganizationMembership(id) {
    // axios removes 'Content-Type' header if data is undefined, so we need this empty object
    return axios.get(`/organization_memberships?filter[organization_id]=${id}`, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response.data)
    );
  }
}

export default new ProductiveAPI();
