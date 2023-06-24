<template>
  <div class="container fix-nav-padding">
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

<style scoped>
.fix-nav-padding {
  padding-top: 90px;
  padding-bottom: 30px;
}
</style>