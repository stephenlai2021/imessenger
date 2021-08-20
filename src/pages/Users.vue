<template>
  <q-page
    class="flex q-pa-sm"
    transition-show="slide-right"
    transition-hide="slide-left"
  >
    <div class="spinner" v-if="!store.state.users.length">
      <q-spinner color="primary" size="3em" />
    </div>
    <q-list v-else class="full-width">
      <q-input
        outlined
        rounded
        v-model="search"
        label="Search"
        dense
        bg-color="white"
        class="q-mx-sm q-mt-sm q-mb-md"
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
          <q-item-label>{{ user.email }}</q-item-label>
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
import { ref, onMounted, computed, inject, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const search = ref("");

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
      // router.push(`/chat/${user.userId}`)
    };

    // computed
    // const matchingNames = computed(() => {
    //   return names.value.filter((name) => {
    //     return name.includes(search.value);
    //   });
    // });

    const matchingUsers = computed(() => {
      return store.getters.filteredUsers().filter((user) => {
        return user.name.includes(search.value);
      });
    });

    // watch
    watch(() => {
      console.log("all users | watch: ", store.state.users);
    });

    onMounted(() => {
      store.methods.getUsers();
      console.log("all users: ", store.state.users);
    });

    return {
      store,

      // ref
      search,

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
