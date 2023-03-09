FROM node:lts-alpine
ARG ENV
ARG SES_KEY
ARG SES_SECRET
ARG S3_KEY
ARG S3_SECRET
ARG RDS_DB
ARG RDS_PASSWORD
ARG JWT_SECRET

ENV ENV=${ENV}
ENV SES_KEY=${SES_KEY}
ENV SES_SECRET=${SES_SECRET}
ENV S3_KEY=${S3_KEY}
ENV S3_SECRET=${S3_SECRET}
ENV RDS_DB=${RDS_DB}
ENV RDS_PASSWORD=${RDS_PASSWORD}
ENV JWT_SECRET=${JWT_SECRET}

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app/data
USER node
CMD ["npm", "start"]
