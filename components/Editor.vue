<template>
  <div class="mb-3">
    <label class="fw-bold h4" for="title">Title</label>
    <input v-model="title" type="text" class="form-control" id="title">
  </div>
  <div id="editorjs"></div>
  <button @click.prevent="submitNote" class="btn btn-dark px-5 d-block mx-auto mt-3">送出</button>
</template>

<script setup>
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';

const props = defineProps(['note']);
const title = ref('');
title.value = props.note.title;
const editor = new EditorJS({
  autofocus: true,
  holder: 'editorjs',
  minHeight: 0,
  data: JSON.parse(props.note.content),
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

const supabase = useSupabaseClient();
const router = useRouter();
const route = useRoute();
const errMsg = ref(false);

const submitNote = async () => {
  if (!title.value) {
    errMsg.value = true;
    return;
  }
  errMsg.value = false;
  const savedData = await editor.save();
  const contentJson = JSON.stringify(savedData);

  let content = '';
  savedData.blocks.forEach(item => {
    if (item.type === "paragraph") {
      content += `<p>${item.data.text}</p>`;
    }
    if (item.type === 'image') {
      let classes = 'img-fluid';
      if (item.data.withBorder) {
        classes += ' border';
      }
      if (item.data.stretched) {
        classes += ' w-100';
      }
      content += `<div class="image-block${item.data.withBackground ? ' img-withBackground' : ''}">
          <img class="${classes}" src="${item.data.file.url}" alt="${item.data.caption}" />
        </div>
        <p class="image-description">${item.data.caption}</p>`;
    }
    if (item.type === "header") {
      const tag = `h${item.data.level}`;
      content += `<${tag} class="fs-${item.data.level}">${item.data.text}</${tag}>`;
    }
    if (item.type === 'list') {
      const tag = item.data.style === 'unordered' ? 'ul' : 'ol';
      let lis = '';
      item.data.items.forEach(li => lis += `<li>${li}</li>`);
      content += `<${tag}>
        ${lis}
      </${tag}>`;
    }
  });

  await supabase
    .from('notes')
    .update({
      title: title.value,
      note: content,
      content: contentJson,
    })
    .eq('id', route.params.id);

  router.push('/');
};

</script>

<style>
.codex-editor {
  width: 100%;
  margin: auto;
  border: 1px solid #ccc;
  padding: 0 12px;
  border-radius: 4px;
}
</style>