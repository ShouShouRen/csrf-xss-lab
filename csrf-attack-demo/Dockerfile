FROM nginx:alpine

# 複製 HTML 文件到 nginx 默認目錄
COPY index.html /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]

