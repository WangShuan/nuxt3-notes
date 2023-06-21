<template>
  <div v-if="notes" class="container py-5">
    <div class="d-flex align-items-center mb-4">
      <h1 class="mb-0 me-3">{{ route.params.user === user?.id ? 'My' : notes[0]?.user_name + "'s" }} Notes</h1>
      <NuxtLink v-if="route.params.user === user?.id" class="btn btn-dark" to="/note/new">新增筆記</NuxtLink>
    </div>
    <ul v-if="!isLoading" class="list-unstyled row g-3">
      <li class="col-md-6 col-xxl-4" v-for="note in notes" :key="note.id">
        <NoteCard :note="note" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { user } = useAuth();
const notes = ref()
const isLoading = ref(true)
const route = useRoute();

if (process.client) {
  await supabase
    .from('notes').select('*')
    .eq('user_id', route.params.user)
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