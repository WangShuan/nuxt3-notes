<template>
  <div class="container py-5">
    <h1>Edit Notes</h1>
    <form class="border rounded bg-white p-5 mt-5 max-w">
      <Editor :note="note" />
    </form>
  </div>
</template>

<script setup>
const route = useRoute();
const note = ref();
const supabase = useSupabaseClient();

await supabase
  .from('notes').select()
  .eq('id', route.params.id)
  .then(res => {
    note.value = res.data[0];
  });

useHead({
  title: 'Notes - New Note'
});
</script>