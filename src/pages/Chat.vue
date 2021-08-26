<template>
  <q-page class="flex column page-chat">
    <q-header class="bg-transparent" style="border-top: 1px solid #eeeeee; backdrop-filter: blur(20px); z-index: 500;">
      <q-toolbar class="constraint" style="padding: 0; backdrop-filter: blur(8px);">
        <q-btn
          round
          dense
          flat
          color="primary"
          size="18px"
          class=""
          style="position: relative; z-index: 500;"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
        <span
          class="text-primary text-bold"
          style="font-size: 18px; width: 100%"
        >
          {{ store.state.user.name }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            color="primary"
            size="md"
            icon="eva-pin-outline"
            class="q-mr-sm"
          />
          <q-btn
            round
            dense
            flat
            color="primary"
            size="md"
            icon="eva-video-outline"
            class="q-mr-sm"
          />
        </div>
      </q-toolbar>
    </q-header>

    <div
      ref="chats"
      :class="{ invisible: !showMessages }"
      class="q-mx-md q-my-md column col justify-end messages"
    >
      <q-chat-message
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :avatar="
          message.from === 'me'
            ? store.state.userDetails.avatar
            : store.state.user.avatar
        "
        :text="[message.text]"
        :sent="message.from === 'me'"
        :stamp="message.createdAt"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-my-md"
      />
    </div>

    <q-footer class="constraint bg-transparent" style="border-top: 1px solid #eeeeee; backdrop-filter: blur(20px);">
      <q-form class="flex row">
        <div class="flex full-width">
          <q-btn-group
            v-if="!inputFocus"
            flat
            round
            class="flex row justify-evenly q-mx-sm"
            style="width: 40%"
          >
            <q-btn round dense flat color="primary" icon="eva-image-outline" />
            <q-btn round dense flat color="primary" icon="eva-camera-outline" />
            <q-btn
              round
              dense
              flat
              color="primary"
              icon="eva-smiling-face-outline"
            />
          </q-btn-group>

          <!-- <div class="" style="width: 60%;"> -->
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-pa-xs"
            style="width: 60%"
            outlined
            rounded
            :label="t('message')"
            dense
            focus="false"
            bg-color="grey-2"
            @keydown.enter="sendMessage"
            @keydown="sendTypingIndicator()"
            @focus="onFocus"
            @blur="onBlur"
            :style="{ width: inputFocus ? '100%' : '50%' }"
          >
            <template v-slot:prepend v-if="inputFocus">
              <q-btn
                icon="navigate_next"
                size="md"
                dense
                flat
                color="primary"
                @click="inputFocus = false"
              />
            </template>
            <template v-slot:append>
              <q-btn
                icon="eva-navigation-2-outline"
                :color="inputFocus ? 'primary' : 'grey-6'"
                size="md"
                dense
                flat
                @click="sendMessage"
              />
            </template>
          </q-input>
        </div>
        <!-- </div> -->
      </q-form>
    </q-footer>
  </q-page>
</template>

<!-- <q-fab
  color="primary"
  icon="list"
  direction="left"
  flat
  padding="2px"
>
  <q-fab-action
    color="primary"
    padding="2px"
    flat
    @click="onClick"
    v-for="item in icons"
    :key="item"
    :icon="item"
  />
</q-fab> -->

<script>
import { ref, onMounted, inject, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDistanceToNow } from "date-fns";
import { timestamp } from "src/boot/firebase";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const desktop = ref(false);
    const indicator = ref(false);
    const inputFocus = ref(false);
    const chats = ref(null);
    const input = ref(null);
    const newMessage = ref("");
    const showMessages = ref(false);
    const him = ref(null);
    const icons = ref(["videocam", "image", "phone", "photo_camera", "place"]);

    // watch
    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          // window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 20);
      }
    );
    watch(
      () => indicator.value,
      (newVal, oldVal) => {
        store.methods.getTypingIndicator(route.params.from, route.params.to);
      }
    );

    // methods
    const sendTypingIndicator = () => {
      indicator.value = true;

      store.methods.sendTypingIndicator({
        from: "me",
        to: route.params.to,
      });
    };

    const sendMessage = () => {
      if (newMessage.value === "") return;

      store.methods.sendMessage({
        text: newMessage.value,
        from: "me",
        to: route.params.to,
        createdAt: timestamp(),
      });

      newMessage.value = "";
    };

    const onFocus = () => {
      if (!store.state.desktop) {
        inputFocus.value = true;
      }
    };

    const onBlur = () => {
      if (!store.state.desktop) {
        inputFocus.value = false;
      }
    };

    // lifecycle
    onMounted(() => {
      store.methods.getMessages(route.params.from, route.params.to);
      store.methods.getOnlineStatus(route.params.to);
      store.methods.getToday();

      if ($q.platform.is.desktop) {
        console.log("you are running on desktop | chat page");
        store.state.desktop = true;
      } else {
        console.log("you are not running on desktop | chat page");
        store.state.desktop = false;
      }
    });

    return {
      // i18n
      t,
      locale,

      store,
      route,
      router,

      // ref
      chats,
      input,
      icons,
      desktop,
      inputFocus,

      // methods
      onFocus,
      onBlur,
      newMessage,
      sendMessage,
      showMessages,
      sendTypingIndicator,
      formatDistanceToNow,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-toolbar {
  padding-right: 0;
}
.banner {
  position: fixed;
  width: 100%;
  opacity: 80%;
  z-index: 500;
  text-align: center;
  padding-left: -300px;
}
// .q-header,
// .q-toolbar,
.page-chat {
  // background: #e2dfd5;
  // background: transparent;
  &:after {
    content: "";
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.1;
    background-image: radial-gradient(
        circle at 100% 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 0 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 50% 100%,
        white 10%,
        silver 10%,
        silver 23%,
        white 23%,
        white 30%,
        silver 30%,
        silver 43%,
        white 43%,
        white 50%,
        silver 50%,
        silver 63%,
        white 63%,
        white 71%,
        transparent 71%,
        transparent
      ),
      radial-gradient(
        circle at 100% 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      ),
      radial-gradient(
        circle at 0 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      );
    background-size: 100px 50px;
  }
}
</style>
