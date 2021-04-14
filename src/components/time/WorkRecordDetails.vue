<template>
  <v-card :color="cardColor" :width="cardWidth" :flat="cardFlat">
    <v-toolbar :color="titleColor" dark dense>{{ cardTitle }}</v-toolbar>
    <v-form ref="jobForm" v-model="valid" lazy-validation>
      <v-card-text>
        <v-row v-if="isNew" dense>
          <v-col cols="12">
            <v-autocomplete
              v-model="service"
              :items="serviceEntries"
              :rules="[v => !!v || $t('time.service.required')]"
              item-text="text"
              item-value="value"
              :label="$t('time.service.label')"
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="6" :md="cardMDCols">
            <v-dialog ref="dialogDate" v-model="modalDate" :return-value.sync="date" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  :rules="[v => !!v || $t('time.date.required')]"
                  :label="$t('time.date.label')"
                  append-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="date" :locale="$i18n.locale" :first-day-of-week="1" scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="modalDate = false">{{ $t('common.cancel') }}</v-btn>
                <v-btn text color="primary" @click="$refs.dialogDate.save(date)">{{ $t('common.ok') }}</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols" class="d-flex flex-grow-1">
            <v-spacer />
            <v-text-field
              v-model="durationHours"
              class="mr-1"
              :label="$t('time.duration.hours')"
              type="number"
              min="0"
              max="23"
              outlined
              dense
              @input="detectHours"
            />
            <v-text-field v-model="durationMinutes" :label="$t('time.duration.minutes')" type="number" min="0" max="60" outlined dense @input="detectMinutes" />
            <v-spacer />
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols">
            <v-dialog ref="dialogStart" v-model="modalStart" :return-value.sync="start" presistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="start"
                  :label="$t('time.duration.start')"
                  append-icon="mdi-clock-time-four-outline"
                  readonly
                  clearable
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker v-model="start" format="24hr" scrollable full-width @input="detectStart">
                <v-spacer />
                <v-btn text color="primary" @click="modalStart = false">{{ $t('common.cancel') }}</v-btn>
                <v-btn text color="primary" @click="$refs.dialogStart.save(start)">{{ $t('common.ok') }}</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols">
            <v-dialog ref="dialogEnd" v-model="modalEnd" :return-value.sync="end" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="end"
                  :label="$t('time.duration.end')"
                  append-icon="mdi-clock-time-four-outline"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker v-model="end" :min="start" format="24hr" scrollable full-width @input="detectEnd">
                <v-spacer />
                <v-btn text color="primary" @click="modalEnd = false">{{ $t('common.cancel') }}</v-btn>
                <v-btn text color="primary" @click="$refs.dialogEnd.save(end)">{{ $t('common.ok') }}</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="note" :label="$t('time.note')" outlined dense clearable />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <template v-if="isNew">
          <v-spacer />
          <v-btn color="primary" class="mx-1" @click="submitNew">{{ $t('time.addNew') }}</v-btn>
          <v-btn color="orange darken-4" class="mx-1" dark @click="reset">{{ $t('time.reset') }}</v-btn>
          <v-spacer />
        </template>
        <template v-else>
          <v-btn text color="primary" @click="submitEdit">{{ $t('common.save') }}</v-btn>
          <v-btn text color="secondary" @click="submitCancel">{{ $t('common.cancel') }}</v-btn>
          <v-spacer />
          <v-btn text :color="deleteConfirmColor" @click="submitDelete">{{ deleteConfirmText }}</v-btn>
        </template>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';

export default {
  props: {
    isNew: { type: Boolean, default: false },
    data: { type: Object, default: () => {} },
  },

  data() {
    return {
      valid: true,
      modalDate: null,
      modalStart: null,
      modalEnd: false,
      service: undefined,
      durationHours: null,
      durationMinutes: null,
      deleteConfirmation: false,
      deleteConfirmationTimer: undefined,
      date: null,
      start: null,
      end: null,
      note: '',
    };
  },

  computed: {
    ...mapState(['services', 'timeEntries']),
    serviceEntries() {
      // Create array of services from { id1: name1, id2: name2 } object
      return Object.keys(this.services).map(s => ({
        text: `${this.services[s].name} (${this.services[s].deal_name})`,
        value: { id: s, name: this.services[s].name },
      }));
    },
    cardColor() {
      return this.isNew ? undefined : 'grey lighten-4';
    },
    titleColor() {
      return this.isNew ? 'primary' : this.data.color;
    },
    cardWidth() {
      return this.isNew ? undefined : '460px';
    },
    cardMDCols() {
      return this.isNew ? 3 : 6;
    },
    cardFlat() {
      return this.isNew ? undefined : true;
    },
    cardTitle() {
      // TODO - translation
      return this.isNew ? this.$t('time.title') : `${this.data?.name}`;
    },
    deleteConfirmColor() {
      return this.deleteConfirmation ? 'red' : 'primary';
    },
    deleteConfirmText() {
      return this.deleteConfirmation ? this.$t('time.deleteConfirm') : this.$t('time.delete');
    },
  },

  watch: {
    data(newValue) {
      // Will be called when we click on another time entry in main calendar
      // console.log('data for %s is changed', this._uid, newValue);
      this.populateData();
    },
    start(newValue) {
      if (!newValue) {
        this.end = null;
      }
    },
  },

  mounted() {
    // debug - TODO: remove this
    // console.log('Mounted WorkRecordDetails uid %d, as %s component', this._uid, this.isNew ? 'empty' : 'existing');
    // console.log({ data: this.data });
    if (!this.isNew) {
      // Will be called only 1st time we click on time entry in main calendar
      this.populateData();
    }
  },

  methods: {
    ...mapActions(['updateTimeEntry', 'addTimeEntry', 'deleteTimeEntry']),
    detectStart(clear) {
      if (this.durationHours || this.durationMinutes) this.moveEnd();
      else if (this.end) this.moveDuration();
    },
    detectEnd() {
      if (this.start) this.moveDuration();
    },
    detectHours() {
      if (this.start) this.moveEnd();
    },
    detectMinutes() {
      if (Number(this.durationMinutes) === 60) {
        if (Number(this.durationHours) < 23) {
          this.durationMinutes = 0;
          this.durationHours = Number(this.durationHours) + 1;
        }
      }
      if (this.start) this.moveEnd();
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
    reset() {
      this.durationHours = null;
      this.durationMinutes = null;
      this.date = null;
      this.start = null;
      this.end = null;
      this.service = null;
      this.note = '';
      this.$refs.jobForm.resetValidation();
    },
    populateData() {
      this.date = this.data.date;
      this.durationHours = Math.floor(this.data.time / 60);
      this.durationMinutes = this.data.time > 60 ? this.data.time % (this.durationHours * 60) : this.data.time;
      this.start = this.data.timed ? moment(this.data.start).format('HH:mm') : null;
      this.end = this.data.timed ? moment(this.data.end).format('HH:mm') : null;
      this.note = this.data.note;
      this.$refs.jobForm.resetValidation();
    },
    updateParent() {
      // TODO - perhaps easier route to update parent? need to explore
      this.$emit('update', data);
    },
    submitNew() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      const attributes = {
        date: this.date ? this.date : this.data.date,
        time: this.durationHours || this.durationMinutes ? this.durationHours * 60 + this.durationMinutes : 0,
      };

      if (this.note.length) {
        attributes.note = this.note;
      }

      if (this.start) {
        attributes.started_at = moment(`${this.date} ${this.start}`, 'YYYY-MM-DD HH:mm')
          .toDate()
          .toISOString();
      }

      this.addTimeEntry({ attributes, service_id: this.service.id })
        .then(data => {
          this.reset();
        })
        .catch(err => {
          this.reset();
          console.error(err);
        });
    },
    submitEdit() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      const { id } = this.data;

      // Prettier forces some extra newlines for .toDate() and .toISOString() that linter hates. Screw linter. :)
      /* eslint-disable */
      const update = {
        date: this.date ? this.date : this.data.date,
        started_at: this.start
          ? moment(`${this.date} ${this.start}`, 'YYYY-MM-DD HH:mm')
              .toDate()
              .toISOString()
          : null,
        time: this.durationHours || this.durationMinutes ? this.durationHours * 60 + this.durationMinutes : 0,
        note: this.note,
      };
      /* eslint-enable */

      this.updateTimeEntry({ id, update })
        .then(data => {
          this.data.date = update.date;
          this.data.started_at = update.started_at;
          this.data.time = update.time;
          this.data.note = update.note;
          this.populateData();
          this.$emit('close');
        })
        .catch(err => {
          console.error(err);
          this.$emit('close');
        });
    },
    submitDelete() {
      if (!this.deleteConfirmation) {
        // Give user 5 seconds to decide if they want to delete, if not, reverse back
        this.deleteConfirmationTimer = setTimeout(() => {
          this.deleteConfirmation = false;
        }, 5000);
        this.deleteConfirmation = true;
        return;
      }

      clearTimeout(this.deleteConfirmationTimer);

      this.deleteTimeEntry({ id: this.data.id })
        .then(data => {
          this.deleteConfirmation = false;
          this.$emit('delete');
        })
        .catch(err => {
          this.deleteConfirmation = false;
          this.$emit('delete');
          console.error(err);
        });
    },
    submitCancel() {
      // Discard any changes before closing
      this.populateData();
      this.$emit('close');
    },
  },
};
</script>
