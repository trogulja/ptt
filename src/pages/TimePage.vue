<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-row class="flex-grow-0 mb-2" dense>
      <v-col cols="12">
        <personal-work-calendar />
      </v-col>
    </v-row>
    <v-row class="flex-grow-0" dense>
      <v-col cols="12" md="8">
        <work-record-details is-new class="h-full" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { db } from '@/db';
// import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import PersonalWorkCalendar from '@/components/time/PersonalWorkCalendar';
import WorkRecordDetails from '@/components/time/WorkRecordDetails';

export default {
  components: {
    PersonalWorkCalendar,
    WorkRecordDetails,
  },

  data() {
    return {
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    };
  },

  computed: {
    // ...mapState(['jobs']),
  },

  created() {
    this.bindJobs();
  },

  beforeDestroy() {
    this.unbindJobs();
  },

  methods: {
    // ...mapActions(['bindJobs', 'unbindJobs']),
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    getDurationFromMinutes(minutes) {
      const output = moment.duration(minutes, 'minutes');
      const h = Math.floor(output.get('hours')) || 0;
      const m = Math.floor(output.get('minutes')) || 0;
      const s = Math.floor(output.get('seconds')) || 0;
      return `${h}h${m}m${s}s`;
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

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
          details:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus dicta, facilis quidem suscipit harum quam nisi libero molestiae ducimus delectus. Magnam est pariatur dignissimos nostrum eligendi voluptas quos quo ducimus?',
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
