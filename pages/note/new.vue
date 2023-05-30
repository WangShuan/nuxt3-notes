<template>
  <div class="container py-5">
    <h1>New Notes</h1>
    <form class="border rounded bg-white p-5 mt-5">
      <div class="mb-3">
        <label class="fw-bold h4" for="title">Title</label>
        <input v-model.trim="notesInput.title" type="text" class="form-control" id="title">
        <span v-if="errMsg.title" class="text-danger">標題不得為空！</span>
      </div>
      <div class="mb-3">
        <label class="fw-bold h4" for="content">Content</label>
        <textarea v-model.trim="notesInput.note" type="text" rows="15" class="form-control" id="content"></textarea>
        <span v-if="errMsg.note" class="text-danger">內容不得為空！</span>
      </div>
      <button @click.prevent="submitNote" class="btn btn-dark px-5 d-block mx-auto">送出</button>
    </form>
  </div>
</template>

<script setup lang="js">
useHead({
  title: 'Notes - New Note'
});

const notesInput = reactive({
  title: "",
  note: "",
});
const errMsg = reactive({
  title: false,
  note: false
});

const supabase = useSupabaseClient();
const { user } = useAuth();
const submitNote = async () => {
  if (!notesInput.title || !notesInput.note) {
    errMsg.title = !notesInput.title ? true : false;
    errMsg.note = !notesInput.note ? true : false;
    return;
  }
  errMsg.title = false;
  errMsg.note = false;
  await supabase
    .from('notes')
    .insert({
      title: notesInput.title,
      note: notesInput.note,
      user_id: user.value?.id,
      user_name: user.value.user_metadata.name
    });
  navigateTo('/');
};

definePageMeta({
  middleware: "auth"
});
</script>