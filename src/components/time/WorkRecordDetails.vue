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
              :hint="productHint"
              :rules="[v => !!v || 'Product is required']"
              item-text="text"
              item-value="value"
              label="Proizvod"
              outlined
              dense
              clearable
              @input="changeProduct"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete v-model="type" :items="types" :rules="[v => !!v || 'Type is required']" label="Type" outlined dense />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="amount" :rules="[v => !!v || 'Amount is required']" label="Amount" type="number" outlined dense />
          </v-col>
          <v-col cols="12" md="4" class="d-flex flex-grow-1">
            <v-spacer />
            <v-text-field v-model="durationHours" class="mr-1" label="hours" type="number" min="0" max="23" outlined dense @input="detectHours" />
            <v-text-field v-model="durationMinutes" label="minutes" type="number" min="0" max="60" outlined dense @input="detectMinutes" />
            <v-spacer />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
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
              <v-date-picker v-model="date" :allowed-dates="allowedDates" locale="hr" :first-day-of-week="1" scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="modalDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialogDate.save(date)">Ok</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="4">
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
          <v-col cols="12" md="4">
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
// import { mapState } from 'vuex';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
import { cloneDeep } from 'lodash';
// import { db } from '@/db';

export default {
  props: {
    color: { type: String, default: 'primary' },
    isNew: { type: Boolean, default: false },
    data: { type: Object, default: () => {} },
  },
  data() {
    return {
      types: ['standard', 'cutout', 'montage', 'layout', 'ostalo'],
      valid: true,
      modalDate: null,
      modalStart: null,
      modalEnd: false,
      productHint: '',
      product: undefined,
      amount: 1,
      durationHours: null,
      durationMinutes: null,
      type: 'standard',
      date: null,
      start: null,
      end: null,
      note: '',
      oldJob: null,
    };
  },
  computed: {
    // ...mapState(['configuration', 'jobs', 'userExtra']),
    products() {
      let i = 0;
      for (const conf of this.configuration) {
        if (conf.id === 'clients') break;
        i++;
        if (i >= this.configuration.length) i = null;
      }
      const normalizedData = [];
      let id = 0;

      for (const clientGroup in this.configuration[i]) {
        for (const client in this.configuration[i][clientGroup]) {
          for (const productGroup in this.configuration[i][clientGroup][client]) {
            normalizedData.push({ header: `${clientGroup}/${client}/${productGroup}` });
            for (const product of this.configuration[i][clientGroup][client][productGroup]) {
              normalizedData.push({ text: `${product} (${client})`, value: { id, clientGroup, client, productGroup, product } });
              id++;
            }
            normalizedData.push({ divider: true });
          }
        }
      }

      return normalizedData;
    },
    cardColor() {
      return this.isNew ? undefined : 'grey lighten-4';
    },
    cardWidth() {
      return this.isNew ? undefined : '460px';
    },
    cardFlat() {
      return this.isNew ? undefined : true;
    },
    cardTitle() {
      return this.isNew ? 'Add new work record' : `${this.product?.product} (${this.product?.client})`;
    },
  },
  watch: {
    jobs(newValue) {
      if (this.isNew) this.calculateStart();
    },
    data(newValue) {
      console.log('data is changed amount is now', newValue.amount);
      setTimeout(() => {
        this.reset();
      }, 10);
    },
  },
  mounted() {
    if (this.isNew) {
      this.calculateStart();
      this.calculateDate();
    } else if (this.data) {
      this.reset();
    }
  },
  methods: {
    calculateStart() {
      if (this.isNew) {
        // eslint-disable-next-line
        const today = new Date().toLocaleString('sv', { timeZoneName: 'short' }).split(' ')[0];
        const [todayYear, todayMonth, todayDay] = today.split('-');
        let start = this.convertToMinutes('09:00');
        for (const monthly of this.jobs) {
          if (monthly.day.year !== Number(todayYear) || monthly.day.month !== Number(todayMonth)) continue;
          for (const job of monthly.jobs) {
            const frag = job.start
              .toDate()
              .toLocaleString('sv', { timeZoneName: 'short' })
              .split(' ');
            if (today === frag[0]) {
              const timeFrag = frag[1].split(':');
              const jobStart = Number(timeFrag[0]) * 60 + Number(timeFrag[1]);
              const jobEnd = jobStart + Number(job.duration);
              if (jobEnd > start) start = jobEnd;
            }
          }
        }
        this.start = this.convertFromMinutes(start);
      }
    },
    calculateDate() {
      if (this.isNew) {
        const date = new Date();
        date.setHours(date.getHours() - 3); // from midnight - 3am, starting date is yesterday
        this.date = this.dateToString(date);
      }
    },
    changeProduct() {
      if (this.product) this.productHint = `${this.product.clientGroup} / ${this.product.client} / ${this.product.productGroup}`;

      // console.log(this.product);
    },
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
    reset(x) {
      if (this.isNew) {
        if (!x) {
          this.durationHours = null;
          this.durationMinutes = null;
          this.end = null;
          this.product = null;
          this.productHint = '';
          this.type = 'standard';
          this.amount = 1;
          this.calculateStart();
          this.calculateDate();
        } else {
          this.durationHours = null;
          this.durationMinutes = null;
          this.end = null;
          this.productHint = '';
          this.amount = 1;
          if (this.type === 'standard') {
            this.type = 'cutout';
          } else if (this.type === 'cutout') {
            this.type = 'montage';
          } else if (this.type === 'montage') {
            this.type = 'standard';
            this.product = null;
          }
          this.calculateStart();
          this.calculateDate();
        }
      } else {
        // console.log(this.data);
        console.log('Resetting data in the component, amount is', this.data.amount);
        this.product = { clientGroup: this.data.clientGroup, client: this.data.client, productGroup: this.data.productGroup, product: this.data.product };
        this.type = this.data.type;
        this.amount = this.data.amount;
        this.durationHours = this.data.hours;
        this.durationMinutes = this.data.minutes;
        this.start = this.data.jobStart;
        this.end = this.data.jobEnd;
        this.date = this.data.date;
        this.note = this.data.note;
        this.oldJob = this.data.job;
      }
      this.$refs.jobForm.resetValidation();
    },
    prepareJob4Firestore() {
      const { product, type, amount, start, end, date, note } = this;
      const dateEl = date.split('-');
      const timeEl = start.split(':');
      const docID = `${dateEl[0]}-${dateEl[1]}-${firebase.auth().currentUser.uid}`;
      const day = { year: Number(dateEl[0]), month: Number(dateEl[1]) };
      const user = { name: this.userExtra.identity.name, uid: firebase.auth().currentUser.uid };

      const startDate = new Date(Number(dateEl[0]), Number(dateEl[1]) - 1, Number(dateEl[2]), Number(timeEl[0]), Number(timeEl[1]));
      const duration = this.convertToMinutes(end) - this.convertToMinutes(start);
      if (product.id) delete product.id;
      const job = { ...product, type, amount: Number(amount), duration, start: firebase.firestore.Timestamp.fromDate(startDate), note };
      if (job.note === '') delete job.note;
      if (!job.note) delete job.note;

      return { docID, day, user, job };
    },
    updateParent(id, newJob) {
      console.log('Updating parent, sending amount', this.amount);
      const data = cloneDeep(this.data);
      data.client = this.product.client;
      data.clientGroup = this.product.clientGroup;
      data.product = this.product.product;
      data.productGroup = this.product.productGroup;
      data.type = this.type;
      data.amount = this.amount;
      data.hours = this.durationHours;
      data.minutes = this.durationMinutes;
      data.jobStart = this.start;
      data.jobEnd = this.end;
      data.date = this.date;
      data.note = this.note;
      data.id = id;
      data.job = { ...newJob };
      data.start = newJob.start.toDate();
      data.end = new Date(newJob.start.toDate().getTime() + newJob.duration * 60 * 1000);
      this.$emit('update', data);
    },
    submitNew() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      const docNew = this.prepareJob4Firestore();
      const docRef = db.collection('jobs').doc(docNew.docID);

      db.runTransaction(transaction => {
        return transaction
          .get(docRef)
          .then(doc => {
            if (!doc.exists) {
              transaction.set(docRef, { day: docNew.day, user: docNew.user, jobs: [{ ...docNew.job }] });
            } else {
              transaction.update(docRef, { jobs: firebase.firestore.FieldValue.arrayUnion({ ...docNew.job }) });
            }
          })
          .then(() => {
            // TODO - reset the input form
            this.reset(true);
            console.log('Transaction commited!');
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    submitEdit() {
      const valid = this.$refs.jobForm.validate();
      if (!valid) return;

      const docOld = this.data.job;
      const docNew = this.prepareJob4Firestore();
      if (this.data.id !== docNew.docID) return;

      console.log('docOld', docOld);
      console.log('docNew', docNew);

      if (this.data.id === docNew.docID) {
        const docRef = db.collection('jobs').doc(docNew.docID);

        db.runTransaction(transaction => {
          return transaction.get(docRef).then(doc => {
            if (!doc.exists) {
              return Promise.reject(new Error("We can't find the original doc, something is messed up!"));
            }

            return Promise.all([
              transaction.update(docRef, { jobs: firebase.firestore.FieldValue.arrayRemove(docOld) }),
              transaction.update(docRef, { jobs: firebase.firestore.FieldValue.arrayUnion(docNew.job) }),
            ]);
          });
        })
          .then(() => {
            this.updateParent(docNew.docID, docNew.job);
            // this.reset();
            this.$emit('close');
            console.log('Transaction commited - job updated, same doc.');
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const docOldRef = db.collection('jobs').doc(this.data.id);
        const docNewRef = db.collection('jobs').doc(docNew.docID);

        db.runTransaction(transaction => {
          return Promise.all([
            transaction.get(docOldRef).then(doc => {
              if (!doc.exists) {
                return Promise.reject(new Error("We can't find the original doc"));
              } else {
                return transaction.update(docOldRef, { jobs: firebase.firestore.FieldValue.arrayRemove({ ...docOld }) });
              }
            }),
            transaction.get(docNewRef).then(doc => {
              if (!doc.exists) {
                return transaction.set(docNewRef, { day: docNew.day, user: docNew.user, jobs: [{ ...docNew.job }] });
              } else {
                return transaction.update(docNewRef, { jobs: firebase.firestore.FieldValue.arrayUnion({ ...docNew.job }) });
              }
            }),
          ]);
        })
          .then(() => {
            this.reset();
            this.$emit('close');
            console.log('Transaction commited - job updated!');
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    submitDelete() {
      const docNew = this.oldJob;
      console.log('trying to delete');
      console.log(docNew);
      const docRef = db.collection('jobs').doc(this.data.id);

      db.runTransaction(transaction => {
        return transaction
          .get(docRef)
          .then(doc => {
            if (!doc.exists) {
              return Promise.reject(new Error("We can't find document to delete. This should not happen!"));
            } else {
              return transaction.update(docRef, { jobs: firebase.firestore.FieldValue.arrayRemove({ ...docNew }) });
            }
          })
          .then(() => {
            this.reset();
            this.$emit('close');
            console.log('Transaction commited - job deleted!');
          })
          .catch(error => {
            console.log(error);
          });
      });
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
