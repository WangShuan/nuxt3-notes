# 使用 Node.js 作為基礎映像
FROM node:16.17.0

# 設定工作目錄
WORKDIR /app

# 將 Nuxt.js 的 .output 資料夾複製到工作目錄中
COPY ./.output /app

# 定義埠
EXPOSE 3000

# 定義容器的啟動命令
CMD [ "node", "server/index.mjs" ]
