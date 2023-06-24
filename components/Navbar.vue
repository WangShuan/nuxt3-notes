<template>
  <header class="fixed-top">
    <nav class="navbar navbar-dark bg-dark navbar-expand">
      <div class="container">
        <NuxtLink class="navbar-brand" to="/">
          Notes
        </NuxtLink>
        <ul v-if="user" class="navbar-nav flex-row align-items-center">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Hi, {{ user?.user_metadata.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <NuxtLink class="dropdown-item" :class="{ 'active': route.path === '/' }" to="/">所有筆記</NuxtLink>
              </li>
              <li>
                <NuxtLink class="dropdown-item" :class="{ 'active': route.path === `/note/${user.id}` }" :to="`/note/${user.id}`">我的筆記</NuxtLink>
              </li>
              <li>
                <NuxtLink class="dropdown-item" :class="{ 'active': route.path === '/reset-password' }" to="/reset-password">重設密碼</NuxtLink>
              </li>
              <li>
                <a href="#" @click.prevent="() => LogoutConfirm()" class="dropdown-item">登出</a>
              </li>
            </ul>
          </li>
        </ul>
        <ul v-else class="navbar-nav flex-row align-items-center">
          <li>
            <NuxtLink class="nav-link" to="/sign-in">登入</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { user, LogOut } = useAuth()
console.log(user)
const LogoutConfirm = async () => {
  try {
    if (!confirm('確定登出嗎？')) {
      return
    }
    await LogOut()
    router.push('/')
  } catch (error) {
    alert(error)
  }
}
</script>

<style>
.navbar {
  height: 60px;
}
</style>