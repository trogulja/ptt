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
          <!-- <work-record-details :data="selectedEvent" @close="selectedOpen = false" @update="updateSelectedEvent($event)" /> -->
        </v-menu>
      </v-sheet>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { cloneDeep } from 'lodash';
// import WorkRecordDetails from './WorkRecordDetails';

export default {
  components: {
    // WorkRecordDetails,
  },

  data() {
    return {
      loading: false,
      calendarTitle: '',
      focus: '',
      valid: true,
      type: 'month',
      types: ['standard', 'cutout', 'montage', 'layout', 'ostalo'],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      modalDate: false,
      modalStart: false,
      modalEnd: false,
      events: [],
      start: null,
      end: null,
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    };
  },

  computed: {
    // ...mapState(['jobs']),
    getLocale() {
      return this.$i18n.locale;
    },
    getCalTitle() {
      return moment(this.start?.date, 'YYYY-MM-DD').format('MMMM YYYY') || '';
    },
  },

  watch: {
    // jobs(newValue) {
    //   console.log('We got an update!');
    //   if (!this.start || !this.end) return;
    //   this.updateRange({ start: this.start, end: this.end });
    // },
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
      const events = [];
      this.start = start;
      this.end = end;

      this.fetchTimeEntries({ start: start.date, end: end.date });
      // for (const monthly of this.jobs) {
      //   for (const job of monthly.jobs) {
      //     if (job.start.toDate().getTime() < min.getTime()) continue;
      //     if (max.getTime() < job.start.toDate().getTime()) continue;

      //     events.push({
      //       name: job.product,
      //       start: job.start.toDate(),
      //       end: new Date(job.start.toDate().getTime() + job.duration * 60 * 1000),
      //       color: this.colors[this.rnd(0, this.colors.length - 1)],
      //       timed: true,
      //       id: monthly.id,
      //       job,
      //       jobStart: this.getStartTime(job.start.toDate()),
      //       jobEnd: this.getEndTime(job.start.toDate(), job.duration),
      //       hours: Math.floor(moment.duration(job.duration, 'minutes').get('hours')) || 0,
      //       minutes: Math.floor(moment.duration(job.duration, 'minutes').get('minutes')) || 0,
      //       date: job.start
      //         .toDate()
      //         .toISOString()
      //         .split('T')[0],
      //       amount: job.amount,
      //       client: job.client,
      //       clientGroup: job.clientGroup,
      //       duration: job.duration,
      //       product: job.product,
      //       productGroup: job.productGroup,
      //       type: job.type,
      //       note: job.note,
      //     });
      //   }
      // }
      this.events = events;
    },
    getStartTime(date) {
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
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    detectStart() {
      if (this.selectedEvent.durationHours || this.selectedEvent.durationMinutes) this.moveEnd();
      else if (this.selectedEvent.jobEnd) this.moveDuration();
    },
    detectEnd() {
      // this.$refs.dialogEnd.save(this.end);
      if (this.selectedEvent.jobStart) this.moveDuration();
    },
    detectHours() {
      if (this.selectedEvent.jobStart) this.moveEnd();
    },
    detectMinutes() {
      if (Number(this.selectedEvent.durationMinutes) === 60) {
        if (Number(this.selectedEvent.durationHours) < 23) {
          this.selectedEvent.durationMinutes = 0;
          this.selectedEvent.durationHours = Number(this.selectedEvent.durationHours) + 1;
        }
      }
      if (this.selectedEvent.start) this.moveEnd();
    },
    moveEnd() {
      const start = this.convertToMinutes(this.start);
      const h = this.durationHours ? this.durationHours : 0;
      const m = this.durationMinutes ? this.durationMinutes : 0;
      const duration = this.convertToMinutes(`${h}:${m}`);
      this.end = this.convertFromMinutes(start + duration);
    },
    moveDuration() {
      const start = this.convertToMinutes(this.start);
      const end = this.convertToMinutes(this.end);
      const duration = this.convertFromMinutes(end - start);
      const arr = duration.split(':');
      const h = Number(arr[0]);
      const m = Number(arr[1]);
      this.durationHours = h;
      this.durationMinutes = m;
    },
    convertToMinutes(str) {
      const arr = str.split(':');
      const h = Number(arr[0]);
      const m = Number(arr[1]);
      return h * 60 + m;
    },
    convertFromMinutes(num) {
      const m = num % 60;
      const h = Math.floor(num / 60);
      return `${h < 10 ? 0 : ''}${h}:${m < 10 ? 0 : ''}${m}`;
    },
    allowedDates(val) {
      const date = new Date();
      const arr = val.split('-'); // 0 = yyyy, 1 = mm, 2 = dd - String!
      if (Number(arr[0]) < date.getFullYear()) return false; // Lock previous years
      if (Number(arr[1]) < date.getMonth() + 1) return false; // Lock previous months

      date.setDate(date.getDate() + 3); // Allow 3 days into the future
      const targetDate = new Date(Number(arr[0]), Number(arr[1]) - 1, Number(arr[2]));
      if (date.getTime() > targetDate.getTime()) return true;

      return false;
    },
    updateSelectedEvent(event) {
      console.log('Setting selectedEvent.amount as', event.amount);
      this.selectedEvent = cloneDeep(event);
      console.log('selectedEvent.amount is now', this.selectedEvent.amount);
    },
  },
};
</script>
