FROM nginx:alpine
COPY ping.conf /etc/nginx/conf.d/ping.conf
COPY dist   /var/www/html