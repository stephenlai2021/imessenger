<template>
  <q-page class="flex q-py-sm">
    <q-header class="bg-white" reveal style="border-bottom: 1px solid #eeeeee">
      <q-toolbar class="constraint">
        <span
          class="text-primary text-bold q-ml-sm"
          style="font-size: 18px; width: 100%"
        >
          {{ t("chatRoom") }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            color="primary"
            size="md"
            icon="eva-person-add-outline"
            @click="router.push('/finduser')"
          />
        </div>
      </q-toolbar>
    </q-header>
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
        standout
        :label="t('searchUser')"
        dense
        bg-color="grey-2"
        class="q-mx-md q-mt-sm q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon
            name="eva-search-outline"
            class="q-ml-sm"
            @click="findUser"
            style="cursor: pointer"
          />
        </template>
      </q-input>
      <q-item
        v-for="(user, index) in matchingUsers"
        :key="index"
        clickable
        v-ripple
        @click="goChat(user)"
      >
        <q-item-section avatar>
          <q-avatar size="50px" style="position: relative">
            <img
              :src="user.avatar"
              alt="user avatar"
              :style="{
                border: user.online ? '2px solid #69f0ae' : '2px solid #e0e0e0',
              }"
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
            >{{ user.online ? t('online') : t('offline') }}</q-badge
          >
        </q-item-section>
      </q-item>
    </q-list>
    <q-footer
      class="bg-white constraint"
      reveal
      style="border-top: 1px solid #eeeeee"
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
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, inject, watch, watchEffect } from "vue";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const { t, locale } = useI18n();

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
      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;

          router.push("/auth");
        }
      }, 10000);
    });

    return {
      // i18n
      t,
      locale,

      store,
      router,

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
