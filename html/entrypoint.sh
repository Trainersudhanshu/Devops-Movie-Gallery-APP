#!/bin/sh

# Use envsubst to replace placeholders with environment variables in the HTML files
envsubst '${API_URL}' < /usr/share/nginx/html/gallery.html > /usr/share/nginx/html/gallery.tmp.html
mv /usr/share/nginx/html/gallery.tmp.html /usr/share/nginx/html/gallery.html

# Start Nginx
nginx -g 'daemon off;'
