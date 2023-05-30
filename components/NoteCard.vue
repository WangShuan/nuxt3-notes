<template>
  <div class="card">
    <div class="card-body">
      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <h2 class="h5 text-truncate">{{ note.title }}</h2>
          <a v-if="route.path == `/note/${user?.id}`" href="#" class="link-danger" @click="() => removeNote(note.id)">刪除</a>
        </div>
        <span class="text-end small">作者: {{ note.user_name }}</span>
      </div>
      <pre class="card-text text-truncate">{{ note.note }}</pre>
    </div>
    <div class="d-flex justify-content-between align-items-center bg-light card-footer">
      <span class="small">{{ new Date(note.created_at).toISOString().split('T')[0] }}</span>
      <NuxtLink :to="`/notes/${note.id}`" class="link-dark fw-bold">
        Read more
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['note'])
const { user } = useAuth()
const supabase = useSupabaseClient();
const route = useRoute()
const removeNote = async (id: number) => {
  if (!confirm('確定要刪除此筆記嗎？該動作不可復原！')) return
  await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .then(() => {
      window.location.reload()
    });
}
</script>