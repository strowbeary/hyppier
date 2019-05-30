FROM nginx:alpine

EXPOSE 9004:80

ENV VIRTUAL_HOST=hyppier.com
ENV LETSENCRYPT_HOST=hyppier.com
ENV LETSENCRYPT_EMAIL=remi.caillot@edu.gobelins.fr

COPY ./build /usr/share/nginx/html
