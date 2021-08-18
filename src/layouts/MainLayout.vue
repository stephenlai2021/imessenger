<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->
        <q-btn
          icon="arrow_back"
          flat
          dense
          to="/"
          v-if="route.fullPath.includes('/chat')"
        />

        <q-toolbar-title class="absolute-center">
          <!-- <q-avatar v-if="route.fullPath.includes('/chat')"> -->
          <!-- <q-avatar>
            <img :src="title" alt="user avatar" />
          </q-avatar> -->
          <!-- <span v-else>
            {{ title }}
          </span> -->

          {{ title }}
        </q-toolbar-title>

        <q-btn
          v-if="!store.state.userDetails.name"
          icon="account_circle"
          flat
          dense
          no-caps
          to="/auth"
          label="Login"
          class="absolute-right q-mr-sm"
        />
        <!-- icon="account_circle" -->
        <!-- icon="logout" -->
        <q-btn
          v-else
          class="absolute-right q-mr-sm"
          no-caps
          dense
          flat
          @click="store.methods.logoutUser()"
        >
          <q-avatar>
            <img :src="store.state.userDetails.avatar" alt="my avatar" />
          </q-avatar>
          <!-- <q-icon name="logout" /> -->

          <span class="logout-text">
            Logout
            <br />
            {{
              store.state.userDetails.name.length >= 6
                ? store.state.userDetails.name.substring(0, 5) + "."
                : store.state.userDetails.name
            }}
          </span>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="store.state.leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: {
    EssentialLink,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const leftDrawerOpen = ref(false);

    // computed
    const title = computed(() => {
      // console.log('route: ', route)
      let currentPath = route.fullPath;
      if (currentPath === "/") return "SmackChat";
      // if (currentPath === "/") return store.state.userDetails.name;
      if (currentPath === `/chat/${route.params.id}`) return route.params.id;
      // if (currentPath === `/chat/${route.params.id}`) return store.state.avatar;
      if (currentPath === "/auth") return "Login";
      return "";
    });

    // methods
    const toggleLeftDrawer = () => {
      // leftDrawerOpen.value = !leftDrawerOpen.value;
      store.state.leftDrawerOpen = !store.state.leftDrawerOpen;
    };

    return {
      store,
      essentialLinks: linksList,
      leftDrawerOpen,
      title,
      route,
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="scss" scoped>
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
}
.title {
  border: 1px solid white;
}
</style>
