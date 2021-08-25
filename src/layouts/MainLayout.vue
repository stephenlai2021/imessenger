<template>
  <q-layout view="lHr lpR lFr">
    <q-header class="bg-white" elevated>
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
          name="eva-arrow-ios-back-outline"
          color="primary"
          size="md"
          @click="checkRoute"
          v-if="
            route.fullPath.includes('/chat') ||
            route.fullPath.includes('/addpost') ||
            route.fullPath.includes('/finduser')
          "
          class="pointer"
        />
        <span class="q-ml-sm text-primary" style="font-size: 18px; width: 100%">
          {{ title }}
        </span>
        <div class="flex row justify-end full-width">
          <q-icon
            name="eva-person-add-outline"
            size="sm"
            @click="router.push('/finduser')"
            class="pointer"
            color="primary"
            v-if="route.fullPath.includes('/users')"
          />
          <q-icon
            name="eva-edit-2-outline"
            size="sm"
            color="primary"
            @click="router.push('/addpost')"
            class="q-mr-md pointer"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat') &&
              !route.fullPath.includes('/auth')
            "
          />
          <q-icon
            name="eva-settings-2-outline"
            size="sm"
            color="primary"
            @click="toggleLeftDrawer"
            class="justify-end pointer"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat') &&
              !route.fullPath.includes('/auth')
            "
          />
          <q-icon
            name="eva-pin-outline"
            size="sm"
            color="primary"
            class="justify-end pointer q-mr-md"
            v-if="route.fullPath.includes('/chat')"
          />
          <q-icon
            name="eva-camera-outline"
            size="sm"
            color="primary"
            class="justify-end pointer"
            v-if="route.fullPath.includes('/chat')"
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
          v-if="store.state.online"
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
            !store.state.online ? "" : "Logout"
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-footer
      class="bg-white constraint"
      elevated
      v-if="
        !route.fullPath.includes('/auth') &&
        !route.fullPath.includes('/finduser') &&
        !route.fullPath.includes('/addpost')
      "
    >
      <q-tabs
        v-model="store.state.tab"
        no-caps
        class="flex row justify-evenly full-width text-primary"
      >
        <q-tab
          name="home"
          icon="eva-home-outline"
          style="width: 50%"
          @click="router.push('/')"
        />
        <q-tab
          name="chat"
          icon="eva-message-circle-outline"
          style="width: 50%"
          @click="router.push('/users')"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <transition-group
        appear
        :enter-active-class="
          route.fullPath.includes('/addpost') ||
          route.fullPath.includes('/finduser')
            ? 'animated fadeIn'
            : ''
        "
        :leave-active-class="
          route.fullPath.includes('/addpost') ||
          route.fullPath.includes('/finduser')
            ? 'animated fadeOut'
            : ''
        "
      >
        <router-view class="constraint" />
      </transition-group>
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
      if (currentPath === "/") return store.state.userDetails.name;
      if (
        currentPath ===
        `/chat/${store.state.userDetails.name}/${route.params.to}`
      )
        return route.params.to;
      if (currentPath === "/auth") return "Smackchat";
      if (currentPath === "/users") return "Chat Room";
      if (currentPath === "/finduser") return "Find User";
      if (currentPath === "/addpost") return "Add Post";
      if (currentPath === "/settings") return "Settings";
      if (currentPath === "/chat") return store.state.user.name;
      return route.params.to;
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

      // if (route.fullPath.includes('/')) store.state.tab = 'home'
      if (route.fullPath.includes('/users')) store.state.tab = 'chat'
    });

    return {
      store,
      title,
      route,
      router,
      online,
      userPage,
      chatPage,
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
.pointer {
  cursor: pointer;
}
</style>
