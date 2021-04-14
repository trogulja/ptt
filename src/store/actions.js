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

const fetchOrganizationMembership = ({ state, commit, dispatch }) => {
  ProductiveService.getOrganizationMembership(state.organizationID)
    .then(data => {
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
    })
    .catch(err => {
      // TODO - if failed, log out?
      const error = { message: `${err.errors[0].status} - ${err.errors[0].title}` };
      dispatch('showError', { error, message: 'Error!' });
      console.error(err);
    });
};

const fetchServices = ({ state, commit }) => {
  ProductiveService.getServices(state.person.person_id)
    .then(data => {
      const services = {};
      data.data.forEach(el => {
        services[el.id] = el.attributes.name;
      });
      commit('setServices', services);
    })
    .catch(err => {
      // TODO - if failed, can we get some default value?
      const error = { message: `${err.errors[0].status} - ${err.errors[0].title}` };
      dispatch('showError', { error, message: 'Error!' });
      console.error(err);
    });
};

const fetchTimeEntries = ({ state, commit, dispatch }, { start, end }) => {
  commit('setFilterStart', start);
  commit('setFilterEnd', end);

  ProductiveService.getTimeEntries({ id: state.person.person_id, start, end })
    .then(data => {
      const timeEntries = data.data.map(el => ({
        id: el.id,
        date: el.attributes.date,
        time: el.attributes.time,
        started_at: el.attributes.started_at,
        note: el.attributes.note,
        service_id: el.relationships.service.data.id,
      }));
      commit('setTimeEntries', timeEntries);
    })
    .catch(err => {
      // TODO - if failed, try again after some time?
      const error = { message: `${err.errors[0].status} - ${err.errors[0].title}` };
      dispatch('showError', { error, message: 'Error!' });
      console.error(err);
    });
};

const updateTimeEntry = ({ state, commit, dispatch }, { id, update }) => {
  return ProductiveService.updateTimeEntry({ id, update })
    .then(data => {
      dispatch('showSuccess', 'Updated!');
      commit('updateTimeEntry', { id, update });
      return Promise.resolve(data);
    })
    .catch(err => {
      const error = { message: `${err.errors[0].status} - ${err.errors[0].title}` };
      dispatch('showError', { error, message: 'Error!' });
      return Promise.reject(err);
    });
};

const deleteTimeEntry = ({ state, commit, dispatch }, { id }) => {
  return ProductiveService.deleteTimeEntry({ id })
    .then(data => {
      dispatch('showSuccess', 'Deleted!');
      dispatch('fetchTimeEntries', { start: state.filterStart, end: state.filterEnd });
      return Promise.resolve(data);
    })
    .catch(err => {
      const error = { message: `${err.errors[0].status} - ${err.errors[0].title}` };
      dispatch('showError', { error, message: 'Error!' });
      return Promise.reject(err);
    });
};

const addTimeEntry = ({ state, commit, dispatch }, { attributes, service_id }) => {
  const relationships = {
    person: {
      data: {
        type: 'people',
        id: state.person.person_id,
      },
    },
    service: {
      data: {
        type: 'services',
        id: service_id,
      },
    },
  };
  return ProductiveService.addTimeEntry({ attributes, relationships })
    .then(data => {
      dispatch('showSuccess', 'New Entry added!');
      commit('addTimeEntry', data);
      return Promise.resolve(data);
    })
    .catch(err => {
      console.error(err);
      const error = { message: `${err.data.errors[0].status} - ${err.data.errors[0].title} - ${err.data.errors[0].detail}` };
      dispatch('showError', { error, message: 'Error!' });
      return Promise.reject(err);
    });
};

export default {
  showToast,
  showError,
  showSuccess,
  fetchOrganizationMembership,
  fetchServices,
  fetchTimeEntries,
  updateTimeEntry,
  deleteTimeEntry,
  addTimeEntry,
};
