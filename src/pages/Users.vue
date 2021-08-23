<template>
  <q-page
    class="flex q-pa-sm"
    transition-show="slide-right"
    transition-hide="slide-left"
  >
    <div class="spinner" v-if="!store.state.users.length && !noUserMessages">
      <q-spinner color="primary" size="3em" />
    </div>
    <div
      v-else-if="!store.state.users.length && noUserMessages"
      class="spinner"
    >
      <p class="text-center text-h6 text-primary border">
        Sorry, we can't find any user in database, please try again later !
      </p>
    </div>
    <q-list v-else class="full-width">
      <q-input
        outlined
        rounded
        v-model="search"
        label="Search"
        dense
        bg-color="white"
        class="q-mx-sm q-mt-xs q-mb-md"
      >
        <template v-slot:prepend>
          <q-icon name="search" @click="findUser" style="cursor: pointer" />
        </template>
      </q-input>
      <q-item
        v-for="(user, index) in matchingUsers"
        :key="index"
        class="q-my-sm"
        clickable
        v-ripple
        @click="goChat(user)"
      >
        <q-item-section avatar>
          <q-avatar size="50px" style="position: relative">
            <img :src="user.avatar" alt="user avatar" />
          </q-avatar>
          <q-badge
            rounded
            class="float-right"
            style="position: absolute; left: 55px; top: 45px"
            :color="user.online ? 'light-green-5' : 'grey-4'"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle2">{{ user.name }}</q-item-label>
          <!-- <q-item-label>{{ user.email }}</q-item-label> -->
        </q-item-section>

        <q-item-section side>
          <q-badge :color="user.online ? 'light-green-5' : 'grey-4'">{{
            user.online ? "Online" : "Offline"
          }}</q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref, onMounted, computed, inject, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const search = ref("");
    const noUserMessages = ref(false);

    // methods
    const findUser = () => {
      console.log("search: ", search.value);
      store.getters.filteredUsers().filter((user) => {
        return user.name.includes(search.value);
      });
    };

    const goChat = (user) => {
      store.state.online = user.online;
      store.state.user = user;
      store.state.avatar = user.avatar;

      router.push(`/chat/${store.state.userDetails.name}/${user.name}`);
    };

    const matchingUsers = computed(() => {
      return store.getters.filteredUsers().filter((user) => {
        return user.name.includes(
          search.value.toLowerCase() || search.value.toUpperCase()
        );
      });
    });

    // watch
    watchEffect(() => {
      console.log("all users | watch: ", store.state.users);

      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;
        }
      }, 10000);
    });

    onMounted(() => {
      store.methods.getUsers();
      console.log("all users: ", store.state.users);

      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;

          router.push("/auth");
        }
      }, 10000);
    });

    return {
      store,

      // ref
      search,
      noUserMessages,

      // computed
      matchingUsers,

      // methods
      goChat,
      findUser,
    };
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  width: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
