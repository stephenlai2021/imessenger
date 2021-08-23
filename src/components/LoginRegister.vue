<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      class="q-mb-md"
      outlined
      v-model="formData.name"
      label="Name"
      required
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.email"
      type="email"
      label="Email"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.password"
      type="password"
      label="Password"
    />
    <p style="color: red">{{ store.state.errorMessage }}</p>
    <div class="row justify-end">
      <q-btn
        color="secondary"
        label="Reset"
        class="q-mr-sm"
        @click="resetData"
      />
      <q-btn color="primary" :label="tab" type="submit" />
    </div>
  </q-form>
</template>

<script>
import { ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  props: ["tab"],
  setup(props) {
    const store = inject("store");

    const route = useRoute();
    const router = useRouter();

    const formData = ref({
      name: "me",
      email: "me@test.com",
      password: "123456",
    });

    const submitForm = () => {
      if (props.tab === "login") {
        store.state.login = true
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
      store,

      formData,
      submitForm,
      resetData,
    };
  },
};
</script>

<style lang="scss" scoped></style>
