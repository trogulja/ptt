import ProductiveService from '@/services/productive.service';

const showToast = ({ state, commit }, message) => {
  if (state.toast.show) commit('hideToast');

  setTimeout(() => {
    commit('showToast', {
      color: 'black',
      message,
      timeout: 3000,
    });
  });
};

const showError = ({ state, commit }, { message = 'Failed!', error }) => {
  if (state.toast.show) commit('hideToast');
  console.log('error object is', error);

  setTimeout(() => {
    commit('showToast', {
      color: 'error',
      message: message + ' ' + error.message,
      timeout: 10000,
    });
  });
};

const showSuccess = ({ state, commit }, message) => {
  if (state.toast.show) commit('hideToast');

  setTimeout(() => {
    commit('showToast', {
      color: 'success',
      message,
      timeout: 3000,
    });
  });
};

const fetchOrganizationMembership = ({ state, commit }) => {
  ProductiveService.getOrganizationMembership(state.organizationID).then(data => {
    const person_id = data.data[0].id;
    const me = data.included.filter(el => el.id === person_id && el.type === 'people')[0].attributes;
    const person = {
      person_id,
      user_id: me.user_id,
      avatar_url: me.avatar_url,
      email: me.email,
      first_name: me.first_name,
      last_name: me.last_name,
    };
    commit('setPerson', person);
    console.log(person);
  });
};

export default {
  showToast,
  showError,
  showSuccess,
  fetchOrganizationMembership,
};
