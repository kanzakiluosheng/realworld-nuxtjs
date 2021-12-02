<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSumbit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  disabled
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                  disabled
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>

          <button class="btn btn-outline-danger" @click="lougout()">Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
import {updateUser} from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: ["authenticated","common"],
  name: "SettingsIndex",
  data(){
    return {
      password:'',
    }
  },
  asyncData({store}) {
    return {
      user:Object.assign({},store.state.user)
    }
  },
  methods:{
    ...mapMutations(['setUser']),
    async onSumbit(){
      const user=this.password?{password:this.password,...this.user}:this.user
      await updateUser({user});
      this.setUser(this.user);
      this.$router.push(`/profile/${user.username}`);
    },
    lougout(){
      Cookie.remove('user');
      this.setUser(null);
      this.$router.replace('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
</style>