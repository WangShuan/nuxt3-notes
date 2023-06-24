---
tags: Vue.js
---

# Nuxt3-project6 Notes

原始碼：https://github.com/WangShuan/nuxt3-notes
線上連結：https://xuan-nuxt3-note.js-app.life/

## 建立與啟動 Nuxt 專案

開啟終端機，`cd` 到桌面或任何希望創建該專案的位置
執行命令： 
```shell
npx nuxi init 06-notes
```

完成後，根據提示
先 `cd` 到專案目錄 `06-notes` 中
執行命令：
```shell
npm install
```
安裝所有依賴項目
此時會發現專案目錄中**生成了 `node_modules` 資料夾**

確認您的專案已成功安裝好所有依賴後
即可執行命令：
```shell
npm run dev
```
啟動 Nuxt 應用程序。

## 專案說明

本專案將結合使用 [supabase](https://supabase.com/) 製作一個可登入、註冊的筆記應用程式

首先請先到[supabase 官網](https://supabase.com/)註冊帳號(可以使用 GitHub 快速註冊)
接著點擊建立 supabase 專案，輸入隨意的名稱比如 nuxt3-notes 然後設置一個高級密碼、選擇伺服器位置(新加坡或東京)

## 安裝與設定 supabase

請在專案中執行命令：
```shell
npm install @nuxtjs/supabase --save-dev
```
> 參考說明：https://supabase.nuxtjs.org/get-started

接著修改根目錄中的 `nuxt.config.ts` 檔案：
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'], // 使用 modules
})
```

最後在項目根目錄中新增 `.env` 檔案存放 url 與 key：
```
SUPABASE_URL="從 supabase 專案的設定中點選 API 即可看到 Project URL"
SUPABASE_KEY="從 supabase 專案的設定中點選 API 即可看到 Project API keys"
```
## 使用 supabase 中的 Authentication

首先將登入、註冊與登出三種方法作為 composables
在項目根目錄中新增資料夾 composables
並在裡面新增檔案 `useAuth.ts` 開始撰寫登入與註冊等事件

Authentication 說明文檔：https://supabase.nuxtjs.org/usage/composables/use-supabase-auth-client#signin

>預設 supabase 的 auth 會開啟信箱驗證的機制
>註冊後需要到信箱中收信並點擊驗證信箱後才能開通帳號
>如果希望取消驗證信的機制，可以在 supabase 的專案頁面中點擊 auth 
>接著點進左側的 Providers 將 Confirm email 關閉後再點擊右下角 Save 即可

`useAuth.ts` 檔案最終如下：
```typescript
const useAuth = () => {
  const supabase = useSupabaseClient(); // 引入使用 supabase
  const user = useSupabaseUser() // supabase 提供的獲取當前 user 資料
  
  const SignUp = async (userData: UserData, name: string) => { // 註冊
    const { data: u, error } = await supabase.auth.signUp({ // 調用 supabase.auth.signUp 方法
      ...userData, // 傳入 email 與 password
      options: { // 可選參數，這邊用來保存用戶姓名
        data: {
          name: name,
        }
      }
    })

    if (error) throw error
    return u
  };

  const LogIn = async (userData: UserData) => { // 登入
    const { data: u, error } = await supabase.auth.signInWithPassword(userData) // 調用 supabase.auth.signInWithPassword 方法，傳入 email 與 password
    if (error) throw error
    return u
  }

  const LogOut = async () => { // 登出
    const { error } = await supabase.auth.signOut() // 調用 supabase.auth.signOut 方法
    if (error) throw error
  }

  const ResetPassword = async (pwd: string) => { // 重設密碼
    const { data: u, error } = await supabase.auth.updateUser({ password: pwd }) // 調用 supabase.auth.updateUser 方法，傳入 password
    if (error) throw error
    return u
  }

  return { user, SignUp, LogIn, LogOut, ResetPassword } // 將所有功能導出
}

export default useAuth;
```

接著即可開始建立登入/註冊頁面
首先於根目錄中新增 pages 資料夾，並新增 `sign-in.vue` 檔案
於 `sign-in.vue` 檔案中撰寫登入與註冊畫面
並通過 `const { SignUp, LogIn, user } = useAuth()` 引入登入、註冊方法以及當前用戶資料

接著新增元件 `Navbar.vue` 放置在 `components` 資料夾中
在 navbar 中放置一個登出的按鈕 並通過 `const { user, LogOut } = useAuth()` 引入登出方法以及當前用戶資料
這邊可以通過 `user.user_metadata.name` 獲取當前用戶的姓名(註冊時藉由 `options` 保存的 `name`)
藉由 user 判斷當前是否有人登入，並將 navbar 右側的登入按鈕改為顯示用戶姓名+分頁選單(所有文章、我的文章、更改密碼、登出)

## 使用 supabase 中的 database

接下來我們將開始建立筆記，並將筆記保存到 supabase 的 database 中
在 supabase 中使用的是 `PostgreSQL` 的資料庫
首先需要進入 supabase 的專案頁面中點擊 `Database`
接著於 Table 中點擊右上角的 `+ New Table` 建立資料表
這邊輸入 name 為 `notes`
然後把 `Enable Row Level Security (RLS)` 取消勾選(這樣所有人都可以公開讀寫此資料表)
最後設置好 Columns：
id 用預設的即可、created_at 也是預設即可
接著新增 title 為 text 保存筆記標題
新增 note 為 text 保存筆記內容
新增 user_id 為 UUID 保存用戶 id
新增 user_name 為 text 保存用戶姓名

完成後即可開始建立新增筆記與所有筆記的頁面
首先於 pages 資料夾中新增檔案 `/note/new.vue` 用作新增筆記的頁面
接著將首頁 `/pages/index.vue` 拿來用於顯示所有筆記

以首頁來說，使用 database 獲取所有筆記的方式如下：
```typescript
const isLoading = ref(true) // 建立 isLoading 用於切換顯示載入中畫面
const notes = ref() // 建立 notes 用於存放所有筆記
if (process.client) { // 判斷如果當前是客戶端渲染才執行
  notes.value = await supabase.from('notes') // 使用 supabase.from('table 名稱') 對資料表進行操作
    .select() // 接著用 .select() 方法獲取所有欄位資料
    .order('created_at', { ascending: false }); // 最後用 order 方法設定排序根據 created_at 遞減
  isLoading.value = false // 將 isLoading 設為結束以顯示資料
}
```

以新增筆記來說，使用 database 插入數據的方式如下：
```typescript
const supabase = useSupabaseClient();
const { user } = useAuth();
const submitNote = async () => {
  if (!notesInput.title || !notesInput.note) { // 用於顯示欄位不得為空的錯誤提示
    errMsg.title = !notesInput.title ? true : false;
    errMsg.note = !notesInput.note ? true : false;
    return;
  }
  errMsg.title = false; // 清除錯誤提示
  errMsg.note = false; // 清除錯誤提示
  
  await supabase.from('notes') // 使用 supabase.from('table 名稱') 對資料表進行操作
    .insert({ // 接著用 .insert() 方法插入資料
      title: notesInput.title, // 傳入 title 欄位的值
      note: notesInput.note, // 傳入 note 欄位的值
      user_id: user.value?.id, // 傳入 user id
      user_name: user.value.user_metadata.name // 傳入 user name
    });
  navigateTo('/'); // 跳轉至首頁
};
```

## middleware 使用路由守衛

在 Nuxt 中可以通過於根目錄中建立 middleware 資料夾新增路由守衛
舉例來說，如果要新增筆記，由於需保存 user_id 以及 user_name 所以需要確保當前有登入帳號
此時就可以通過 middleware 來設定路由守衛，將尚未登入的用戶，導連至登入/註冊頁面

建立方式：
於項目根目錄中新增檔案 /middleware/auth.ts：
```typescript
export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();
  if (!user.value) {
    return navigateTo('/sign-in')
  }
})
```

## 專案升級，添加 Editor.js

首先，安裝 Editor.js：
開啟終端機，執行命令 `npm i @editorjs/editorjs --save`

接著安裝 Editor.js 中的段落、標題、圖片上傳等需要用到的工具：
開啟終端機，執行命令 `npm i --save @editorjs/header @editorjs/list @editorjs/paragraph @editorjs/image`

完成後於項目中新增一個元件 `Editor.vue` 用來放編輯器(記得放在 `components` 資料夾裡面)：
```htmlembedded
<template>
  <!-- 新增一個設定好 id 的空元素用來指定 editor.js 生成的地方 -->
  <div id="editorjs-container"></div>
</template>

<script setup>
// 引入 editor.js
import EditorJS from '@editorjs/editorjs';
// 引入安裝的其他工具，這邊安裝最常用的標題、段落文字、列表、圖片上傳這四項
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';

// 開始創建 editor
const editor = new EditorJS({
  holder: 'editorjs-container', // 這邊傳入上方 template 中設置好的元素 id
  autofocus: true, // 是否要再生成後自動 focus
  minHeight: 0, // 取消整個 editor 的 padding-bottom: 300px
  tools: { // 選用引入的工具
    header: Header, // 標題工具對應 import 的 Header
    paragraph: Paragraph, // 段落公居對應 import 的 Paragraph
    list: List, // 列表工具對應 import 的 List
    image: { // 圖片工具
      class: ImageTool, // 對應 import 的 ImageTool
      config: { // 針對圖片工具的其他設定
        uploader: { 
          // 這裡用來設定圖片檔案上傳功能的 function
        }
      }
    }
  },
});
</script>
```

### 使用 storage 上傳&獲取圖片網址

接下來我們將設定上傳圖片的功能，並將圖片保存到 supabase 的 storage 中
首先需要進入 supabase 的專案頁面中點擊 `Storage`
接著於 Storage 中點擊左上角的 `+ New bucket` 建立儲存桶
這邊輸入 name 為 `note-images`
然後把 `Public bucket` 設為開啟(這樣所有人都可以公開使用此儲存桶)
完成後即可開始撰寫上傳圖片的 function

Storage 說明文件參考：https://supabase.com/docs/guides/storage/quickstart

首先我們使用的圖片工具是：https://github.com/editor-js/image
根據該工具的說明，在 image 底下的 uploader 中可設置圖片上傳到後端的功能
其中又分為通過純網址上傳、通過自定義函數上傳
這邊我們採用自定義函數上傳的方式撰寫如下：
```javascript
image: {
  class: ImageTool,
  inlineToolbar: true,
  config: {
    uploader: { 
      // 主要新增程式碼
      async uploadByFile(file) { // 函數名稱必須是 uploadByFile
        const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1); // 獲取上傳的檔案副黨名
        const name = `${new Date().getTime()}.${fileExtension}`; // 重設圖片保存的名稱(因為上傳中文檔名會報錯，所以改用當前時間當作檔案名稱)
        const { data } = await supabase.storage // 使用 supabase 提供的 storage API 進行上傳圖片
          .from('note-images') // from 括號中的內容為 Supabase 存儲桶的名稱
          .upload(name, file); // upload 括號中第一個值為 檔案保存的名稱，第二個值為上傳的檔案

        const uploadedImageUrl = await supabase.storage.from('note-images').getPublicUrl(data.path); // 接著通過 getPublicUrl API 獲取圖片對外網址
        return { // 最後回傳成功＆圖片網址用以顯示圖片
          success: true,
          file: {
            url: uploadedImageUrl.data.publicUrl,
          }
        };
      }
    }
  }
}
```

### 保存與顯示 Editor 內容的方法

在新增文章與編輯文章中分別需要保存與顯示 Editor 的內容

#### 保存 Editor 的內容方法

在新增文章中，原本用來保存 Content 的是 textarea
這邊將 textarea 整塊刪除，改為放置 `<div id="editor-container"></div>`
並於 script 中設置 editor
完成後將送出按鈕綁定的事件進行改寫：
```javascript
const submitNote = async () => {
  if (!title.value) {
    errMsg.value = true;
    return;
  }
  errMsg.value = false;
  const savedData = await editor.save(); // 獲取 editor 的內容
  const contentJson = JSON.stringify(savedData); // 將內容轉為 json 格式保存到資料庫中以便下次讀取使用
  
  let note = ''; // 新增空字符串用以保存要顯示的 html 內容
  savedData.blocks.forEach(item => { // savedData.blocks 為每個新增的 editor 內容區塊，這邊進行遍歷已改為 html 格式
    if (item.type === "paragraph") { // 判斷如果類型為 paragraph 段落，則回傳 p 標籤
      note += `<p>${item.data.text}</p>`;
    }
    if (item.type === 'image') { // 判斷如果類型為 image 圖片，則根據是否有邊框、是否填滿寬度、是否有背景進行 class 設定並回傳 img 標籤
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
    if (item.type === "header") { // 判斷如果類型為 header 標題，則根據其 level 回傳對應的 h1~h6 標籤
      const tag = `h${item.data.level}`;
      note += `<${tag} class="fs-${item.data.level}">${item.data.text}</${tag}>`;
    }
    if (item.type === 'list') { // 判斷如果類型為 list 列表，則根據其 style 回傳對應的 ol 或 ul 標籤
      const tag = item.data.style === 'unordered' ? 'ul' : 'ol';
      const lis = '';
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
      note: note, // 將 html 內容保存到 note 中
      content: contentJson, // 在 Table 中新增 column 名為 content 保存 editor 完整的內容
      user_id: user.value?.id,
      user_name: user.value.user_metadata.name
    });

  router.push('/');
};
```

最後將原本的 `NoteCard.vue` 以及顯示文章的 `/notes/[id].vue` 檔案
改為用 v-html 顯示 note 內容即完成(原本是用 textarea 保存並用 pre 顯示純文字)

#### 顯示 Editor 的內容方法

在保存 Editor 的內容時通過 `editor.save()` 獲取到了所有數據資料
並藉由 JSON 格式保存到資料庫中

顯示則將提取到的內容重新轉為 JSON 格式
並通過在 `new EditorJS({})` 中添加 `data` 選項為轉換後的 JSON 內容即完成

這邊我們將稍早新增的 Editor.vue 元件進行改寫
並在 `/pages` 中新增檔案 `/edit/[id].vue` 用來進行編輯文章的功能
於編輯文章時取用顯示 Editor 的內容方法再結合保存 Editor 的內容方法完成整個專案升級

supabase 中編輯資料庫的方法：
```javascript
await supabase
  .from('notes')
  .update({ // 通過 update 方法傳入需要更新的欄位與對應的內容
    title: title.value,
    note: content,
    content: contentJson,
  })
  .eq('id', route.params.id); // 指定更新的項目為 id 相等者
```