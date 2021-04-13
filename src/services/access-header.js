import store from '@/store';

export default function accessHeader() {
  const token = store.getters['getToken'];
  const organizationID = store.getters['getOrganizationID'];
  return {
    'X-Auth-Token': token,
    'X-Organization-Id': organizationID,
    'Content-Type': 'application/vnd.api+json',
  };
}
