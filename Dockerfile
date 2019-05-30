FROM nginx:alpine

ENV VIRTUAL_HOST=hyppier.com
ENV LETSENCRYPT_HOST=hyppier.com
ENV LETSENCRYPT_EMAIL=remi.caillot@edu.gobelins.fr

COPY ./build /usr/share/nginx/html
