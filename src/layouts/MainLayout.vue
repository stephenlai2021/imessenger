<template>
  <q-layout view="lHr Lpr lFr">
    <q-header elevated v-if="!route.fullPath.includes('/config')">
      <!-- <q-toolbar class="q-mx-sm flex"> -->
      <q-toolbar class="">
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Arrow Back"
          @click="router.push('/')"
          v-if="route.fullPath.includes(`/chat`)"
        />
        <q-toolbar-title class="" style="position: relative">
          <span v-if="!route.fullPath.includes(`/auth`)">
            <q-avatar v-if="userPage || !chatPage">
              <!-- :src="
                  store.state.online
                    ? store.state.userDetails.avatar
                    : 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                " -->
              <img
                style="width: 30px; height: 30px; cursor: pointer"
                :src="
                  !store.state.userDetails.avatar
                    ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                    : store.state.userDetails.avatar
                "
                alt="my avatar"
                @click="toggleLeftDrawer"
              />
            </q-avatar>
            <q-avatar v-if="chatPage || !userPage">
              <img
                style="width: 35px; height: 35px"
                :src="
                  !store.state.avatar
                    ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                    : store.state.avatar
                "
                alt="user avatar"
              />
              <q-badge
                rounded
                style="position: absolute; top: 25px"
                :color="store.state.online ? 'light-green-5' : 'grey-4'"
              />
            </q-avatar>
          </span>
          <span class="q-ml-sm">
            {{ title }}
          </span>
          <q-spinner-dots
            class="float-right q-mr-md"
            v-if="store.state.typing.typing && route.fullPath.includes(`/chat`)"
            size="2rem"
          />
        </q-toolbar-title>
        <!-- <q-btn
          flat
          dense
          round
          icon="face"
          aria-label="Face"
          @click="toggleRightDrawer"
          v-if="
            !route.fullPath.includes(`/auth`) &&
            !route.fullPath.includes(`/chat`)
          "
        /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="store.state.rightDrawerOpen"
      side="right"
      bordered
    >
    </q-drawer>

    <q-drawer
      v-model="store.state.leftDrawerOpen"
      show-if-above
      bordered
      side="left"
      class="bg-grey-1"
    >
      <q-toolbar></q-toolbar>
      <div class="flex row justify-center">
        <img
          :src="
            store.state.userDetails.avatar
              ? store.state.userDetails.avatar
              : 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
          "
          alt="my avatar"
          style="width: 90px; border-radius: 50%;"
        />
      </div>

      <p class="text-center q-mt-sm text-h5 text-bold">
        {{ store.state.userDetails.name }}
      </p>

      <q-list class="q-mt-md">
        <span class="q-ml-md text-grey">Settings</span>
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
        <q-item
          clickable
          v-ripple
          @click="
            !store.state.online
              ? router.push('/auth')
              : store.methods.logoutUser()
          "
        >
          <q-item-section avatar>
            <q-icon
              color="white"
              :name="!store.state.online ? 'login' : 'logout'"
              class="icon"
              style="background: red"
            />
          </q-item-section>

          <q-item-section>{{
            !store.state.online ? "Login/Register" : "Logout"
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, inject, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const userPage = ref(false);
    const chatPage = ref(false);
    const online = ref(true);

    // computed
    const title = computed(() => {
      let currentPath = route.fullPath;
      if (currentPath === "/") return "Chat";
      if (
        currentPath ===
        `/chat/${store.state.userDetails.name}/${route.params.to}`
      )
        return route.params.to;
      if (currentPath === "/auth") return "Login";
      return "";
    });

    // methods
    const toggleLeftDrawer = () => {
      store.state.leftDrawerOpen = !store.state.leftDrawerOpen;
    };

    const toggleRightDrawer = () => {
      store.state.rightDrawerOpen = !store.state.rightDrawerOpen;
    };

    const sayHi = () => {
      console.log("hi");
    };

    // watch
    watchEffect(() => {
      if (route.fullPath.includes(`/chat/`)) {
        userPage.value = false;
        chatPage.value = true;
      }
      if (!route.fullPath.includes(`/chat/`)) {
        userPage.value = true;
        chatPage.value = false;
      } 
    });

    return {
      store,
      title,
      route,
      router,
      online,
      userPage,
      chatPage,
      toggleLeftDrawer,
      toggleRightDrawer,
      sayHi,
    };
  },
};
</script>

<style lang="scss" scoped>
.icon {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.q-toolbar__title.ellipsis {
  padding-left: 0;
  // font-size: 1rem;
}
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}
.logout-text {
  margin-left: 5px;
}
.q-badge {
  border: 1px solid white;
  top: -2px;
  right: -5px;
  border-radius: 50%;
}
.title {
  border: 1px solid white;
}
.q-item {
}
.q-item__section {
  // text-align: center;
}
</style>
