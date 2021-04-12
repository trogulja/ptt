<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('common.welcome') }}</v-card-title>
      <v-card-subtitle>{{ $t('login.action') }}</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            :label="$t('login.email')"
            name="email"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          />

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="errorMessages"
            :label="$t('login.password')"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          />

          <v-btn :loading="isLoading" :disabled="isSignInDisabled" block x-large color="primary" @click="submit">{{ $t('login.button') }}</v-btn>

          <div class="mt-5">
            <router-link to="/ptt">
              {{ $t('login.forgot') }}
            </router-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      providers: [
        {
          id: 'google',
          label: 'Google',
          isLoading: false,
        },
        {
          id: 'facebook',
          label: 'Facebook',
          isLoading: false,
        },
      ],

      // input rules
      rules: {
        required: value => (value && Boolean(value)) || 'Required',
      },
    };
  },
  computed: mapState(['user']),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        this.isSignInDisabled = true;
        this.signIn(this.email, this.password);
      }
    },
    signIn(email, password) {
      // const thisapp = this
      // console.log(email, password);
      // console.log('current user:', firebase.auth().currentUser);
      this.$router.push('/ptt');
    },
    resetErrors() {
      this.error = false;
      this.errorMessages = '';

      this.errorProvider = false;
      this.errorProviderMessages = '';
    },
  },
};
</script>

<style lang="css" scoped>
.v-card {
  min-width: 420px;
}
</style>