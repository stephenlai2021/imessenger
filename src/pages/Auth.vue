<template>
  <q-page class="flex q-pa-md">
    <div class="spinner" v-if="store.state.login">
      <q-spinner-ios color="primary" size="3em" />
    </div>
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-register :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <login-register :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { ref, inject } from "vue";

export default {
  components: {
    "login-register": require("components/LoginRegister.vue").default,
  },
  setup() {
    const store = inject('store')

    const tab = ref("login");

    return {
      store,
      tab,
    };
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
