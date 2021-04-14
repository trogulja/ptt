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

  getServices(id) {
    return axios.get(`/services?filter[person_id]=${id}&filter[budget_status]=1`, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response.data)
    );
  }

  getTimeEntries({ id, start, end }) {
    return axios.get(`/time_entries?filter[person_id]=${id}&filter[before]=${end}&filter[after]=${start}`, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response.data)
    );
  }

  updateTimeEntry({ id, update }) {
    const body = { data: { type: 'time_entries', attributes: update } };
    return axios.patch(`/time_entries/${id}`, body, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response.data)
    );
  }

  deleteTimeEntry({ id }) {
    return axios.delete(`/time_entries/${id}`, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response.data)
    );
  }

  addTimeEntry({ attributes, relationships }) {
    const body = { data: { type: 'time_entries', attributes, relationships } };
    return axios.post(`/time_entries`, body, { headers: accessHeader(), data: {} }).then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.response)
    );
  }
}

export default new ProductiveAPI();
