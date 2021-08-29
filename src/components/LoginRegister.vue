<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      class="q-mb-md"
      outlined
      v-model="formData.name"
      :label="t('name')"
      required
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.email"
      type="email"
      :label="t('email')"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.password"
      type="password"
      :label="t('password')"
    />
    <!-- <q-file
      v-if="tab === 'register'"
      label="Choose your avatar image"
      accept="image/*"
      outlined
      v-model="file"
    >
      <template v-slot:prepend>
        <q-icon name="eva-attach-outline" />
      </template>
      <template v-slot:append>
        <q-icon name="eva-trash-outline" @click="file = null" />
      </template>
    </q-file> -->
    <p style="color: red">{{ store.state.errorMessage }}</p>
    <div class="row justify-end">
      <q-btn
        color="secondary"
        :label="t('reset')"
        class="q-mr-sm"
        @click="resetData"
      />
      <q-btn color="primary" :label="t('register')" type="submit" />
    </div>
  </q-form>
</template>

<script>
import { ref, inject, watch, watchEFfect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useStorage from "../composables/useStorage";

export default {
  props: ["tab"],
  setup(props) {
    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    // const file = ref(null);

    const formData = ref({
      name: "me",
      email: "me@test.com",
      password: "123456",
    });

    // watch
    // watch(
    //   () => [file.value, store.state.url],
    //   ([newA, newB], [oldA, oldB]) => {
    //     console.log("file: ", newA);
    //     console.log("url: ", newB);
    //   }
    // );

    // methods
    const submitForm = () => {
      if (props.tab === "login") {
        store.state.login = true;
        store.methods.loginUser(formData.value);

        if (store.state.successMessage === "user login successfully") {
          router.push("/");
        }
      }
      if (props.tab === "register") {
        // store.methods.upLoadFile(file.value);

        // const { url } = useStorage();

        // store.methods.registerUser({ ...formData.value, avatar: store.state.url });
        store.methods.registerUser(formData.value);

        // store.state.url = url

        if (store.state.successMessage === "user register successfully") {
          router.push("/");
        }
      }
    };

    const resetData = () => {
      formData.value = "";
      store.state.errorMessage = "";
      // file.value = null;
    };

    return {
      // i18n
      t,
      locale,

      // others
      store,

      // ref
      file,
      formData,

      // methods
      submitForm,
      resetData,
    };
  },
};
</script>

<style lang="scss" scoped></style>
