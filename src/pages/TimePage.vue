<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-row class="flex-grow-0 mb-2" dense>
      <v-col cols="12">
        <personal-work-calendar />
      </v-col>
    </v-row>
    <v-row class="flex-grow-0" dense>
      <v-col cols="12">
        <work-record-details is-new class="h-full" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { mapActions } from 'vuex';
import PersonalWorkCalendar from '@/components/time/PersonalWorkCalendar';
import WorkRecordDetails from '@/components/time/WorkRecordDetails';

export default {
  components: {
    PersonalWorkCalendar,
    WorkRecordDetails,
  },

  data() {
    return {};
  },

  created() {},
};
</script>
