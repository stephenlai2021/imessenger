<template>
  <q-page class="flex q-pa-sm">
    <div class="spinner" v-if="!store.state.users.length && !noUserMessages">
      <q-spinner-ios color="primary" size="3em" />
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
        v-model="search"
        rounded
        standout
        label="Search"
        dense
        bg-color="grey-2"
        class="q-mx-sm q-mt-xs q-mb-md"
      >
        <template v-slot:prepend>
          <q-icon name="eva-search-outline" class="q-ml-sm" @click="findUser" style="cursor: pointer" />
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
            <img
              :src="user.avatar"
              alt="user avatar"
              :style="{border: user.online ? '2px solid #69f0ae' : '2px solid #e0e0e0'}"
            />
          </q-avatar>
          <q-badge
            rounded
            class="float-right"
            style="position: absolute; left: 55px; top: 45px"
            :style="{ background: user.online ? '#69f0ae' : '#e0e0e0' }"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle2">{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            class="q-pa-xs"
            :style="{ background: user.online ? '#69f0ae' : '#e0e0e0' }"
            >{{ user.online ? "上線" : "下線" }}</q-badge
          >
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
      // store.methods.getUsers();
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
  width: 100vw;
  height: cal(100vh -98px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
