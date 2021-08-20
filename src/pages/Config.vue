<template>
  <transition
    appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft"
  >
    <q-page class="flex column page-config">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Menu"
          @click="router.push('/')"
        />
      </q-toolbar>
      <div class="flex row justify-center">
        <img
          :src="store.state.userDetails.avatar"
          alt="my avatar"
          style="width: 90px"
        />
      </div>
      <p class="text-center q-mt-sm text-h5 text-bold">
        {{ store.state.userDetails.name }}
      </p>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon
              color="white"
              name="dark_mode"
              class="icon"
              style="background: black"
            />
          </q-item-section>

          <q-item-section>Dark Mode</q-item-section>
          <q-toggle v-model="store.state.dark" color="black" />
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon
              color="white"
              name="translate"
              class="icon"
              style="background: #2196f3"
            />
          </q-item-section>

          <q-item-section>Chinese</q-item-section>
          <q-toggle v-model="store.state.chinese" color="blue" />
        </q-item>
        <!-- <q-item clickable v-ripple @click="store.methods.logoutUser()"> -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon
              color="white"
              name="logout"
              class="icon"
              style="background: red;"
            />
          </q-item-section>

          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </transition>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    return {
      store,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-config {
  height: 100vh;
  padding-top: 0;
}
.icon {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
</style>
