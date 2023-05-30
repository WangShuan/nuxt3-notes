<template>
  <div v-if="!isLoading" class="container py-5">
    <div class="row justify-content-between">
      <Title>Notes - {{ note.title }}</Title>
      <div class="col-md-3">
        <h2 class="mb-3 h4 text-muted">New Notes</h2>
        <ul class="list-unstyled">
          <li class="mt-3" v-for="(note, i) in newset" :key="i">
            <NoteCard :note="note" />
          </li>
        </ul>
      </div>
      <div class="col-md-8">
        <h1 class="mb-1 h2">{{ note.title }}</h1>
        <span>作者: {{ note.user_name }}</span><span class="ms-3">{{ new Date(note.created_at).toISOString().split('T')[0] }}</span>
        <div v-html="note.note.replace(/\n/g, ' <br>')" class="my-4 max-w-800"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const route = useRoute();

const note = ref();
const newset = ref();
const isLoading = ref(true);

if (process.client) {
  await supabase
    .from('notes').select()
    .eq('id', route.params.id)
    .then(res => {
      note.value = res.data[0];
    });
  await supabase
    .from('notes').select()
    .neq('id', route.params.id)
    .limit(3)
    .order('created_at', { ascending: false })
    .then(res => {
      newset.value = res.data;
    });
  isLoading.value = false;
}
</script>


<style>
.max-w-800 {
  max-width: 600px;
}
</style>