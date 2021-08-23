<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar class="constraint">
        <q-avatar
          v-if="
            !route.fullPath.includes('/users') &&
            !route.fullPath.includes('/finduser') &&
            !route.fullPath.includes('/addpost') &&
            !route.fullPath.includes('/settings') &&
            !route.fullPath.includes('/chat')
          "
        >
          <img
            style="width: 30px; height: 30px"
            :src="
              !store.state.userDetails.avatar
                ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                : store.state.userDetails.avatar
            "
            alt="user avatar"
            @click="toggleLeftDrawer"
          />
        </q-avatar>

        <q-icon
          name="chevron_left"
          size="md"
          @click="checkRoute"
          v-if="
            route.fullPath.includes('/chat') ||
            route.fullPath.includes('/addpost') ||
            route.fullPath.includes('/finduser')
          "
        />
        <span
          class="q-ml-sm"
          style="font-size: 21px; width: 100%;"
          v-if="
            route.fullPath.includes('/users') ||
            route.fullPath.includes('/finduser') ||
            route.fullPath.includes('/addpost') ||
            route.fullPath.includes('/settings') ||
            route.fullPath.includes('/chat')
          "
        >
          {{ title }}
        </span>
        <div class="flex row justify-end full-width">
          <q-icon
            name="person_search"
            size="sm"
            @click="router.push('/finduser')"
            class=""
            v-if="route.fullPath.includes('/users')"
          />
          <q-icon
            name="edit"
            size="sm"
            @click="router.push('/addpost')"
            class="q-mr-md"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat')
            "
          />
          <q-icon
            name="settings"
            size="sm"
            @click="toggleLeftDrawer"
            class="justify-end"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat')
            "
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="store.state.rightDrawerOpen"
      side="right"
      bordered
    >
      123
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
          style="width: 90px; border-radius: 50%"
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

    <q-footer elevated>
      <q-tabs v-model="tab" no-caps class="flex row justify-evenly full-width">
        <q-tab name="home" icon="home" style="width: 50%;" @click="router.push('/')" />
        <q-tab name="chat" icon="chat" style="width: 50%;" @click="router.push('/users')" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <!-- <transition enter-active-class="animated fadeIn" appear> -->
      <router-view class="constraint" />
      <!-- </transition> -->
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
    const tab = ref("home");

    // computed
    const title = computed(() => {
      let currentPath = route.fullPath;
      if (currentPath === "/") return store.state.userDetails.name;
      if (
        currentPath ===
        `/chat/${store.state.userDetails.name}/${route.params.to}`
      )
        return route.params.to;
      if (currentPath === "/auth") return "Login";
      if (currentPath === "/users") return "Chat Room";
      if (currentPath === "/finduser") return "Find User";
      if (currentPath === "/addpost") return "Add Post";
      if (currentPath === "/settings") return "Settings";
      if (currentPath === "/chat") return store.state.user.name;
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

    const checkRoute = () => {
      if (route.fullPath.includes("/addpost")) {
        router.push("/");
      }
      if (route.fullPath.includes("/chat")) {
        router.push("/users");
      }
      if (route.fullPath.includes("/finduser")) {
        router.push("/users");
      }
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
      tab,
      checkRoute,
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
.q-tab {
  // margin: 0;
}
.q-tab_content.self-stretch {
  // margin-top: 0;
}
</style>
