<template>
  <q-page class="page-chat">
    <q-header
      class="bg-transparent"
      style="backdrop-filter: blur(20px); z-index: 500"
    >
      <q-toolbar
        class="constraint"
        style="padding: 0; backdrop-filter: blur(8px)"
      >
        <q-btn
          round
          flat
          color="grey-5"
          size="18px"
          class=""
          style="position: relative; z-index: 500"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
        <span
          class="text-grey-5 text-bold"
          style="font-size: 14px; width: 100%"
          color=""
        >
          <!-- style="font-size: 18px; width: 100%" -->
          <!-- {{ store.state.user.name }} -->
          <!-- {{ route.params.to }} -->
          {{ myId }}
        </span>
        <div class="flex row justify-end full-width">
          <q-spinner-dots
            size="2rem"
            color="grey-5"
            v-if="store.state.typing.typing"
          />
          <!-- v-if="store.state.typing.typing && indicator" -->
          <q-btn
            round
            dense
            color="blue"
            size="md"
            icon="eva-pin-outline"
            class="q-mr-sm"
            @click="router.push('/map')"
          />
          <q-btn
            round
            dense
            color="red"
            size="md"
            icon="eva-phone-outline"
            class="q-mr-sm"
            @click="call"
          />
        </div>
      </q-toolbar>
    </q-header>

    <div class="video-chat"></div>

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

    <q-footer
      class="constraint bg-transparent"
      style="backdrop-filter: blur(20px)"
    >
      <q-form class="flex" :class="{ 'q-mx-sm': inputFocus }">
        <q-btn-group
          v-if="!inputFocus"
          flat
          round
          class="flex row justify-evenly"
          style="width: 50%"
        >
          <q-btn
            round
            dense
            flat
            class="q-ml-lg q-mr-sm"
            color="green-12"
            icon="eva-image-outline"
          />
          <q-btn
            round
            dense
            flat
            class="q-mx-sm"
            color="green-12"
            icon="eva-camera-outline"
          />
          <q-btn
            round
            dense
            flat
            class="q-mr-md q-ma-sm"
            ref="btnEmoji"
            color="green-12"
            icon="eva-smiling-face-outline"
            @click="showEmojiPicker"
          />
        </q-btn-group>

        <div style="width: 50%" :style="{ width: inputFocus ? '100%' : '50%' }">
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-px-md q-py-sm full-width"
            outlined
            rounded
            :label="t('message')"
            dense
            focus="false"
            bg-color=""
            @keydown.enter="sendMessage"
            @keyup="sendTypingIndicator()"
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
      </q-form>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, onMounted, inject, watch, computed } from "vue";
import { EmojiButton } from "@joeattardi/emoji-button";
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

    const btnEmoji = ref(null);
    const chats = ref(null);
    const input = ref(null);
    const picker = ref(null);
    const desktop = ref(false);
    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showMessages = ref(false);
    const to = ref({});

    /* webRTC */
    const myId = ref(null);

    // connect to Peer server
    const peer = new Peer();

    // get a random id assigned by Peer server
    peer.on("open", (id) => {
      myId.value = id;
      store.state.peerId = id;

      // write peer id into firestore
    });

    // remote receiving call
    peer.on("call", (call) => {
      $q.dialog({
        title: "Confirm",
        message: "Would you like to answer this call ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          remoteVideoShow.value = true;

          call.answer(localStream.value);

          call.on("stream", (remoteStream) => {
            remoteVideo.value.srcObject = remoteStream;
          });
        })
        .onCancel(() => {
          console.log(">>>> Cancel");
        });
    });

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
      // () => store.state.typing.typing,
      (newVal, oldVal) => {
        store.methods.getTypingIndicator(route.params.from, route.params.to);
        // newVal = false
      }
    );

    // methods

    /* webRTC */
    const call = () => {
      const call = peer.call(idInput.value, localStream.value);

      remoteVideoShow.value = true;

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
      });
    };

    const hangUp = () => {
      console.log("close connection");

      peer.destroy();
    };

    const pauseVideo = () => {
      console.log("pause video");

      pause.value = true;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    const resumeVideo = () => {
      console.log("resume video");

      pause.value = false;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const toggleVideo = () => {
      videoOn.value = !videoOn.value;

      if (videoOn.value) {
        openCamera();
      }

      if (!videoOn.value) {
        closeCamera();
      }

      console.log("video on: ", videoOn.value);
    };

    const toggleAudio = () => {
      audioOn.value = !audioOn.value;

      if (audioOn.value) {
        openAudio();
      }

      if (!audioOn.value) {
        closeAudio();
      }

      console.log("video on: ", videoOn.value);
    };

    const openCamera = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideo.value.srcObject = localStream.value = stream;

          cameraEnabled.value = true;
          videoOn.value = true;
          audioOn.value = true;

          console.log("local stream: ", stream);
        });
    };

    const closeCamera = () => {
      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.stop();

        cameraEnabled.value = false;
      });
    };

    const openAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const closeAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    /* end of webRTC */

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

      inputFocus.value = false;
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

    // picker.value = new EmojiButton({
    //   position: {
    //     top: '50px',
    //   },
    // });

    picker.value = new EmojiButton();

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      // picker.value.pickerVisible
      //   ? picker.hidePicker()
      //   : picker.value.showPicker(newMessage.value);

      picker.value.togglePicker(btnEmoji.value);
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

      // store.methods.getUsers()
      // to.value = store.state.users.find(user => user.name === route.params.to)
      // to.value = store.getters.filteredUsers().find(user => user.name === route.params.to)
      // console.log('to user: ', to.value)
      // console.log('from url: ', route.params.from)
      // console.log('to url: ', route.params.to)
    });

    return {
      // i18n
      t,
      locale,

      store,
      route,
      router,

      /* ref */
      to,
      chats,
      input,
      desktop,
      btnEmoji,
      indicator,
      inputFocus,

      // webRTC
      myId,

      // computed
      // getUser,

      // methods
      onBlur,
      onFocus,
      call,
      newMessage,
      sendMessage,
      showMessages,
      showEmojiPicker,
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
.page-chat {
  overflow: hidden;
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
