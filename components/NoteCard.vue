<template>
  <div class="card">
    <div class="card-body">
      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <h2 class="h5 text-truncate">{{ note.title }}</h2>
          <div>
            <NuxtLink v-if="route.path == `/note/${user?.id}`" :to="`/edit/${note.id}`" class="link-primary">編輯</NuxtLink>
            <a v-if="route.path == `/note/${user?.id}`" href="#" class="link-danger ms-2" @click="() => removeNote(note.id)">刪除</a>
          </div>
        </div>
        <span class="text-end small">作者: <NuxtLink class="link-dark" :to="`/note/${note.user_id}`">{{ note.user_name }}</NuxtLink></span>
      </div>
      <p class="card-text">{{ plainText(note.note) }} ...</p>
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

const plainText = (value: string) => {
  const div = document.createElement('div');
  div.innerHTML = value;
  return div?.textContent?.slice(0, 40);
}
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