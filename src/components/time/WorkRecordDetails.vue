<template>
  <v-card :color="cardColor" :width="cardWidth" :flat="cardFlat">
    <v-toolbar :color="color" dark dense>{{ cardTitle }}</v-toolbar>
    <v-form ref="jobForm" v-model="valid" lazy-validation>
      <v-card-text>
        <v-row v-if="isNew" dense>
          <v-col cols="12">
            <v-autocomplete
              v-model="product"
              :items="products"
              :rules="[v => !!v || 'Product is required']"
              item-text="text"
              item-value="value"
              label="Proizvod"
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
                  :rules="[v => !!v || 'Date is required']"
                  label="Date"
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
                <v-btn text color="primary" @click="modalDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialogDate.save(date)">Ok</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols" class="d-flex flex-grow-1">
            <v-spacer />
            <v-text-field v-model="durationHours" class="mr-1" label="hours" type="number" min="0" max="23" outlined dense @input="detectHours" />
            <v-text-field v-model="durationMinutes" label="minutes" type="number" min="0" max="60" outlined dense @input="detectMinutes" />
            <v-spacer />
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols">
            <v-dialog ref="dialogStart" v-model="modalStart" :return-value.sync="start" presistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="start"
                  :rules="[v => !!v || 'Start time is required']"
                  label="Start"
                  append-icon="mdi-clock-time-four-outline"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker v-model="start" format="24hr" scrollable full-width @input="detectStart">
                <v-spacer />
                <v-btn text color="primary" @click="modalStart = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialogStart.save(start)">Ok</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6" :md="cardMDCols">
            <v-dialog ref="dialogEnd" v-model="modalEnd" :return-value.sync="end" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="end"
                  :rules="[v => v !== start || 'End time must be larger than Start time', v => !!v || 'End time is required']"
                  label="End"
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
                <v-btn text color="primary" @click="modalEnd = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialogEnd.save(end)">Ok</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="note" label="Note" outlined dense clearable />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <template v-if="isNew">
          <v-spacer />
          <v-btn color="primary" class="mx-1" @click="submitNew">Add new record</v-btn>
          <v-btn color="orange darken-4" class="mx-1" dark @click="reset">Reset</v-btn>
          <v-spacer />
        </template>
        <template v-else>
          <v-btn text color="Primary" @click="submitEdit">Save</v-btn>
          <v-btn text color="Secondary" @click="$emit('close')">Cancel</v-btn>
          <v-spacer />
          <v-btn text color="Primary" @click="submitDelete">Delete</v-btn>
        </template>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    color: { type: String, default: 'primary' },
    isNew: { type: Boolean, default: false },
    data: { type: Object, default: () => {} },
  },

  data() {
    return {
      valid: true,
      modalDate: null,
      modalStart: null,
      modalEnd: false,
      product: undefined,
      durationHours: null,
      durationMinutes: null,
      date: null,
      start: null,
      end: null,
      note: '',
    };
  },

  computed: {
    ...mapState(['services', 'timeEntries']),
    products() {
      // Create array of services from { id1: name1, id2: name2 } object
      return Object.keys(this.services).map(s => ({ text: `${s} - ${this.services[s]}`, value: { id: s, name: this.services[s] } }));
    },
    cardColor() {
      return this.isNew ? undefined : 'grey lighten-4';
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
      return this.isNew ? 'Add new work record' : `${this.data?.name}`;
    },
  },

  watch: {
    data(newValue) {
      console.log('data is changed', newValue);
      setTimeout(() => {
        this.reset();
      }, 10);
    },
  },

  mounted() {
    // debug - TODO: remove this
    console.log(this.isNew ? 'Creating add new work record component' : 'Showing details from existing event');
    console.log({ data: this.data });
  },

  methods: {
    detectStart() {
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
      this.start = null;
      this.end = null;
      this.product = null;
      this.productHint = '';
      this.$refs.jobForm.resetValidation();
    },
    updateParent() {
      this.$emit('update', data);
    },
    submitNew() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      // TODO - dodaj novi time event
    },
    submitEdit() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      // TODO - promijeni postojeći time event
    },
    submitDelete() {

      // TODO - obriši postojeći time event
      // TODO - pitaj da li su sigurni
    },
    dateToString(date) {
      new Date().getDate;
      const yyyy = '' + date.getFullYear();
      const m = date.getMonth() + 1;
      const mm = m < 10 ? `0${m}` : '' + m;
      const d = date.getDate();
      const dd = d < 10 ? `0${d}` : '' + d;
      return `${yyyy}-${mm}-${dd}`;
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
  },
};
</script>
