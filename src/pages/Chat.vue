<template>
  <q-page class="flex column page-chat">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-banner
        v-if="!store.state.online"
        :style="{ marginLeft: store.state.leftDrawerOpen ? '-150px' : '0' }"
        class="bg-grey-4 banner"
      >
        {{ route.params.to }} is {{ store.state.online ? "Online" : "Offline" }}
      </q-banner>
    </transition>

    <div
      ref="chats"
      :class="{ invisible: !showMessages }"
      class="q-pa-md column col justify-end messages"
      :style="{ marginTop: store.state.online ? '0px' : '50px' }"
    >
      <!-- <q-chat-message :label="store.state.today" /> -->
      <q-chat-message
        v-for="message in store.state.messages"
        :key="message.text"
        :name="
          message.from === 'me' ? store.state.userDetails.name : route.params.id
        "
        :avatar="
          message.from === 'me'
            ? store.state.userDetails.avatar
            : store.state.avatar
        "
        :text="[message.text]"
        :sent="message.from === 'me'"
        :stamp="message.createdAt"
        :bg-color="message.from === 'me' ? 'white' : 'light-green-2'"
      >
      </q-chat-message>
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form class="full-width">
          <q-input
            ref="input"
            v-model="newMessage"
            outlined
            rounded
            label="Message"
            dense
            bg-color="white"
            @keydown.enter="sendMessage"
            @keyup="showIndicator()"
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                @click="sendMessage"
                icon="send"
                color="white"
              />
            </template>
          </q-input>
        </q-form>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import {
  ref,
  onUnmounted,
  onMounted,
  inject,
  watch,
  watchEffect,
  onUpdated,
} from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const route = useRoute();

    const chats = ref(null);
    const input = ref(null);
    const newMessage = ref("");
    const showMessages = ref(false);

    watchEffect(() => {
      console.log("online: ", store.state.online);

      setInterval(() => {
        if (store.state.typing) {
          store.state.typing = false;
        }
      }, 5000);
    });

    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 20);
      }
    );

    const showIndicator = () => {
      store.state.typing = true;
    };

    const sendMessage = () => {
      store.methods.sendMessage({
        text: newMessage.value,
        from: "me",
        to: route.params.to,
        createdAt: new Date().toLocaleString(),
      });
      newMessage.value = "";
    };

    onMounted(() => {
      store.methods.getMessages(route.params.from, route.params.to);
      store.methods.getOnlineStatus(route.params.to);
      store.methods.getToday();
    });

    onUnmounted(() => {
      // store.state.online = false
    })

    return {
      store,
      route,
      chats,
      input,
      showMessages,
      newMessage,
      sendMessage,
      showIndicator,
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
.messages {
  margin-top: 50px;
  // margin-bottom: 50px;
}
.page-chat {
  background: #e2dfd5;
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
