<template>
  <NuxtLayout name="form">
    <form class="px-3 px-md-5 pt-4 form border rounded bg-white">
      <h1 class="h3 mb-4 text-center">Reset Password</h1>
      <div class="mb-3">
        <label for="password">New Password</label>
        <input v-model="password" required type="password" class="form-control" id="password" autocomplete="on">
      </div>
      <button class="w-100 btn btn-dark" @click.prevent="ResetPwd" type="submit">確認</button>
      <p v-if="authError" class="small my-2 text-danger text-center">{{ authError }}</p>
      <p class="text-muted mb-4 mt-4 small text-center">&copy; 2023 / 僅供學習不含商業用途</p>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
const router = useRouter()
const password = ref("")
const { ResetPassword } = useAuth()
const authError = ref("")
const ResetPwd = async () => {
  if (!password.value) {
    return
  }
  try {
    await ResetPassword(password.value)
    router.push('/')
  } catch (error) {
    authError.value = error as string
  }
}

useHead({
  title: 'Notes - Reset Password'
})

definePageMeta({
  layout: false
})
</script>

<style scoped>
.form {
  max-width: 400px;
  width: 100%;
  margin: auto;
}

.fix-nav-height {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
}

.message-alert {
  position: fixed;
  max-width: 80%;
  top: 70px;
  right: 10px;
  z-index: 1100;
}
</style>