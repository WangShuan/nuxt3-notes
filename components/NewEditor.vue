<template>
  <form class="border rounded bg-white p-5 mt-5 max-w">
    <div class="mb-3">
      <label class="fw-bold h4" for="title">Title</label>
      <input v-model.trim="title" type="text" class="form-control" id="title">
      <small v-if="errMsg" class="text-danger">請輸入標題！</small>
    </div>
    <div id="editorjs"></div>
    <button @click.prevent="submitNote" class="btn btn-dark px-5 d-block mx-auto mt-3">送出</button>
  </form>
</template>

<script setup lang="js">
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';

const editor = new EditorJS({
  holder: 'editorjs',
  autofocus: true,
  minHeight: 175,
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      inlineToolbar: true,
      config: {
        uploader: {
          async uploadByFile(file) {
            const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
            const name = `${new Date().getTime()}.${fileExtension}`;
            const { data } = await supabase.storage
              .from('note-images') // 替換為您Supabase存儲桶的名稱
              .upload(name, file);

            const uploadedImageUrl = await supabase.storage.from('note-images').getPublicUrl(data.path);
            console.log(uploadedImageUrl.data.publicUrl);
            return {
              success: true,
              file: {
                url: uploadedImageUrl.data.publicUrl,
              }
            };
          }
        }
      }
    }
  },
});

const title = ref('');
const errMsg = ref(false);

const supabase = useSupabaseClient();
const { user } = useAuth();
const router = useRouter();

const submitNote = async () => {
  if (!title.value) {
    errMsg.value = true;
    return;
  }
  errMsg.value = false;
  const savedData = await editor.save();
  const contentJson = JSON.stringify(savedData);
  let note = '';
  savedData.blocks.forEach(item => {
    if (item.type === "paragraph") {
      note += `<p>${item.data.text}</p>`;
    }
    if (item.type === 'image') {
      let classes = 'img-fluid';
      if (item.data.withBorder) {
        classes += ' border';
      }
      if (item.data.stretched) {
        classes += ' w-100';
      }
      note += `<div class="image-block${item.data.withBackground ? ' img-withBackground' : ''}">
          <img class="${classes}" src="${item.data.file.url}" alt="${item.data.caption}" />
        </div>
        <p class="image-description">${item.data.caption}</p>`;
    }
    if (item.type === "header") {
      const tag = `h${item.data.level}`;
      note += `<${tag} class="fs-${item.data.level}">${item.data.text}</${tag}>`;
    }
    if (item.type === 'list') {
      const tag = item.data.style === 'unordered' ? 'ul' : 'ol';
      let lis = '';
      item.data.items.forEach(li => lis += `<li>${li}</li>`);
      note += `<${tag}>
        ${lis}
      </${tag}>`;
    }
  });

  await supabase
    .from('notes')
    .insert({
      title: title.value,
      note: note,
      content: contentJson,
      user_id: user.value?.id,
      user_name: user.value.user_metadata.name
    });

  router.push('/');
};

useHead({
  title: 'Notes - New Note'
});

definePageMeta({
  middleware: "auth"
});
</script>

<style>
.fix-nav-padding {
  padding-top: 90px;
  padding-bottom: 30px;
}

.max-w,
.ce-block__content,
.ce-toolbar__content,
.ce-block--stretched .ce-block__content {
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
}
</style>