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

export default {
  props: ["tab"],
  setup(props) {
    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const formData = ref({
      name: "me",
      email: "me@test.com",
      password: "123456",
    });

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
        store.methods.registerUser(formData.value);

        if (store.state.successMessage === "user register successfully") {
          router.push("/");
        }
      }
    };

    const resetData = () => {
      formData.value = "";
      store.state.errorMessage = "";
    };

    return {
      // i18n
      t,
      locale,

      // others
      store,

      // ref
      formData,

      // methods
      submitForm,
      resetData,
    };
  },
};
</script>

<style lang="scss" scoped></style>
