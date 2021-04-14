<template>
  <v-card class="d-flex flex-grow-1">
    <!-- loading spinner -->
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- calendar -->
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">{{ $t('time.today') }}</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('time.overview') }} - {{ getCalTitle }}</v-toolbar-title>
          <v-spacer />
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel(type) }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>{{ $t('time.month') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>{{ $t('time.week') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>{{ $t('time.day') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600" class="px-2 pb-2">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :locale="getLocale"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        />
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" max-width="460px" offset-x>
          <work-record-details :data="selectedEvent" @close="selectedOpen = false" @update="updateSelectedEvent($event)" />
        </v-menu>
      </v-sheet>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import WorkRecordDetails from './WorkRecordDetails';

export default {
  components: {
    WorkRecordDetails,
  },

  data() {
    return {
      loading: false,
      calendarTitle: '',
      focus: '2020-10-31',
      valid: true,
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      modalDate: false,
      modalStart: false,
      modalEnd: false,
      events: [],
      start: null,
      end: null,
    };
  },

  computed: {
    ...mapState(['services', 'timeEntries', 'person']),
    getLocale() {
      return this.$i18n.locale;
    },
    getCalTitle() {
      return moment(this.start?.date, 'YYYY-MM-DD').format('MMMM YYYY') || '';
    },
  },

  watch: {
    timeEntries() {
      if (!this.start || !this.end || !this.person.person_id) return;

      // Introduce slight lag if services are still loading...
      if (Object.keys(this.services).length) {
        this.prepareEvents();
      } else {
        setTimeout(() => {
          this.prepareEvents();
        }, 500);
      }
    },
    person() {
      // When refreshing the page, race condition can occur and we will not get person.person_id in time
      // So, to fix this, setTimeout and call prepare events again.
      setTimeout(() => {
        this.fetchTimeEntries({ start: this.start.date, end: this.end.date });
      }, 500);
    },
    getLocale() {
      this.prepareEvents();
    }
  },

  mounted() {
    // this.$refs.calendar.checkChange();
  },

  created() {
    this.fetchServices();
  },

  beforeDestroy() {},

  methods: {
    ...mapActions(['fetchServices', 'fetchTimeEntries']),
    typeToLabel(value) {
      return this.$t(`time.${value}`);
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
      if (!this.person.person_id) return;
      this.fetchTimeEntries({ start: start.date, end: end.date });
    },
    prepareEvents() {
      const events = [];
      moment.locale(this.$i18n.locale);
      for (const e of this.timeEntries) {
        const timed = !!e.started_at;
        events.push({
          name: `${this.services[e.service_id]} (${e.service_id}) - ${moment.duration(e.time, 'minutes').humanize()}`,
          start: timed ? this.getStartTime(e.started_at) : e.date,
          end: timed ? this.getEndTime(e.started_at, e.time) : e.date,
          color: 'orange',
          timed,
          id: e.id,
          date: e.date,
          time: e.time,
          started_at: e.started_at,
          note: e.note,
          service_id: e.service_id,
          service_name: this.services[e.service_id],
        });
      }
      this.events = events;
    },
    getStartTime(date) {
      console.log(date);
      const hours = Number(date.getHours());
      const minutes = Number(date.getMinutes());
      return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}`;
    },
    getEndTime(start, duration) {
      const totalMinutes = start.getHours() * 60 + start.getMinutes() + duration;
      const td = moment.duration(totalMinutes, 'minutes');
      const h = Math.floor(td.get('hours')) || 0;
      const m = Math.floor(td.get('minutes')) || 0;
      return `${h > 9 ? '' : '0'}${h}:${m > 9 ? '' : '0'}${m}`;
    },
    updateSelectedEvent(event) {
      console.log('Setting selectedEvent.amount as', event.amount);
      this.selectedEvent = cloneDeep(event);
      console.log('selectedEvent.amount is now', this.selectedEvent.amount);
    },
  },
};
</script>
