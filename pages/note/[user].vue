<template>
  <div class="container py-5">
    <div class="d-flex align-items-center mb-4">
      <h1 class="mb-0 me-3">My Notes</h1>
      <NuxtLink class="btn btn-dark" to="/note/new">新增筆記</NuxtLink>
    </div>
    <ul v-if="!isLoading" class="list-unstyled row g-3">
      <li class="col-md-6 col-xxl-4" v-for="note in notes" :key="note.id">
        <NoteCard :note="note" />
      </li>
    </ul>
    <div v-else class="spinner-border m-5" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const supabase = useSupabaseClient();
const notes = ref()
const isLoading = ref(true)
if (process.client) {
  await supabase
    .from('notes').select('*')
    .eq('user_id', user.value?.id)
    .order('created_at', { ascending: false })
    .then(res => {
      notes.value = res.data
    })
  isLoading.value = false
}

useHead({
  title: 'Notes - My Notes'
})
</script>

<style scoped>
.dropdown-menu-dark .dropdown-item.active,
.dropdown-menu-dark .dropdown-item:active {
  background: #808080;
}

.navbar-expand .navbar-nav .dropdown-menu {
  padding: 0;
  overflow: hidden;
}
</style>