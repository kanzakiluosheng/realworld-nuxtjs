<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
              <li v-for='(error,field) in errors' :key='field'>
                {{field}} {{error}}
              </li>
            <!-- <template v-for='(messages,field) in errors'>
            </template> -->
          </ul>

          <form @submit.prevent="onSumbit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
              v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login,register } from "@/api/user";
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware:'notAuthenticated',
  name: "LoginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  methods: {
    async onSumbit() {
      try {
        const {data}=this.isLogin? await login({ user: this.user }):await register({ user: this.user });
        this.$store.commit('setUser',data.user);
        Cookie.set('user', JSON.stringify(data.user));
        this.$router.push("/");
      } catch (err) {
          console.dir(err)
          this.errors=err.response?.data?.errors||''
      }
    },
  },
};
</script>

<style>

</style>