# Nuxt3-project6 Notes

原始碼：https://github.com/WangShuan/nuxt3-06-notes

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

說明文檔：https://supabase.nuxtjs.org/usage/composables/use-supabase-auth-client#signin

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

>預設 supabase 的 auth 會開啟信箱驗證的機制
>註冊後需要到信箱中收信並點擊驗證信箱後才能開通帳號
>如果希望取消驗證信的機制，可以在 supabase 的專案頁面中點擊 auth 
>接著點進左側的 Providers 將 Confirm email 關閉後再點擊右下角 Save 即可

## 使用 supabase 中的 database

接下來我們將開始建立筆記，並將筆記保存到 supabase 的 database 中
在 supabase 中使用的是 PostgreSQL 的資料庫
首先需要進入 supabase 的專案頁面中點擊 Database
接著於 Table 中點擊右上角的 + New Table 建立資料表
這邊輸入 name 為 notes
然後把 `Enable Row Level Security (RLS)` 取消勾選(這樣所有人都可以公開讀寫此資料表)
最後設置好 Columns：
id 用預設的即可、created_at 也是預設即可
接著新增 title 為 text 保存筆記標題
新增 note 為 text 保存筆記內容
新增 user_id 為 UUID 保存用戶 id
新增 user_name 為 text 保存用戶姓名

完成後即可開始建立新增筆記與所有筆記的頁面
首先於 pages 資料夾中新增檔案 `/note/new.vue` 用於新增筆記
接著將首頁拿來用於顯示所有筆記

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