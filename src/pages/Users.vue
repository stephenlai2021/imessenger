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
      <q-item
        v-for="(user, index) in store.getters.filteredUsers()"
        :key="index"
        class="q-my-sm"
        clickable
        v-ripple
        @click="goChat(user)"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.avatar" alt="user avatar">
          </q-avatar>
          <!-- <q-avatar color="primary" text-color="white">
            {{ user.name.charAt(0) }}
          </q-avatar> -->
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
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
import { ref, onMounted, inject } from "vue";
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = inject("store");

    const router = useRouter()

    const goChat = (user) => {
      // store.state.online = user.online
      store.state.avatar = user.avatar

      router.push(`/chat/${user.name}`)
      // router.push(`/chat/${user.userId}`)
    }

    onMounted(() => {
      store.methods.getUsers();
    });

    return {
      store,

      goChat
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
