<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          {{ title }}
          <!-- <q-spinner-dots
            v-if="
              store.state.typing.typing &&
              route.fullPath.includes(
                `/chat/${route.params.from}/${route.params.to}`
              )
            "
            size="2rem"
          /> -->
        </q-toolbar-title>

        <q-avatar
          v-if="store.state.userDetails.name"
          font-size="24px"
          icon="people"
          @click="router.push('/')"
        />
        <q-avatar
          v-if="store.state.userDetails.name"
          font-size="24px"
          icon="logout"
          @click="store.methods.logoutUser()"
        />
        <q-avatar v-if="store.state.userDetails.name">
          <img
            style="width: 24px; height: 24px"
            :src="store.state.userDetails.avatar"
            alt="my avatar"
          />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="store.state.leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <!-- <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" :name="link.icon" />
          </q-item-section>

          <q-item-section>{{ link.title }}</q-item-section>
        </q-item> -->

        <!-- <q-item
          v-if="store.state.userDetails.name"
          clickable
          v-ripple
          @click="router.push('/')"
          class="q-mx-lg"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="people" />
          </q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>

        <q-item
          v-if="!store.state.userDetails.name"
          clickable
          v-ripple
          @click="router.push('/auth')"
          class="q-mx-lg"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="login" />
          </q-item-section>
          <q-item-section>Login/Register</q-item-section>
        </q-item>

        <q-item
          v-if="store.state.userDetails.name"
          clickable
          v-ripple
          @click="store.methods.logoutUser()"
          class="q-mx-lg"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="logout" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const links = ref([
      {
        title: "Users",
        icon: "people",
      },
      {
        title: "Login/Register",
        icon: "login",
      },
      {
        title: "Logout",
        icon: "logout",
      },
    ]);

    const leftDrawerOpen = ref(false);

    // computed
    const title = computed(() => {
      let currentPath = route.fullPath;
      if (currentPath === "/") return "SmackChat";
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

    const sayHi = () => {
      console.log("hi");
    };

    return {
      store,
      links,
      title,
      route,
      router,
      leftDrawerOpen,
      toggleLeftDrawer,
      sayHi,
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
.q-item {
}
.q-item__section {
  // text-align: center;
}
</style>
