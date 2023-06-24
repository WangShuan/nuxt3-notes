<template>
  <NuxtLayout name="form">
    <Title>Notes - {{ isLogin ? 'Login' : 'Sign Up' }}</Title>
    <form class="px-3 px-md-5 pt-4 form border rounded bg-white">
      <h1 class="h3 mb-4 text-center">Please {{ isLogin ? 'Login' : 'Sign Up' }}</h1>
      <div v-if="!isLogin" class="mb-3">
        <label for="name">Name</label>
        <input v-model="name" required type="text" class="form-control" id="name">
      </div>
      <div class="mb-3">
        <label for="email">Email</label>
        <input v-model="email" required type="email" class="form-control" id="email">
      </div>
      <div class="mb-3">
        <label for="password">Password</label>
        <input v-model="password" required type="password" class="form-control" id="password">
      </div>
      <button class="w-100 btn btn-dark" @click.prevent="submitAuth" type="submit">確認</button>
      <p class="my-2 text-center">
        {{ isLogin ? "Don't have" : "Already had" }} an account?
        <a @click.prevent="isLogin = !isLogin" href="#" class="link-dark fw-bold">{{ isLogin ? "Sign Up" : "Login" }}</a>
      </p>
      <p v-if="authError" class="small my-2 text-danger text-center">{{ authError }}</p>
      <p class="text-muted mb-4 mt-4 small text-center">&copy; 2023 / 僅供學習不含商業用途</p>
    </form>
  </NuxtLayout>
</template>

<script setup>
const router = useRouter();
const isLogin = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const authError = ref("");
const { SignUp, LogIn, user } = useAuth();

const submitAuth = async () => {
  try {
    const userData = {
      email: email.value,
      password: password.value
    };
    if (isLogin.value) {
      await LogIn(userData);
    } else {
      await SignUp(userData, name.value);
    }
    router.push('/');
  } catch (error) {
    authError.value = error;
  }
};

definePageMeta({
  layout: false
});
</script>

<style scoped>
.form {
  max-width: 400px;
  width: 100%;
  margin: auto;
}
</style>