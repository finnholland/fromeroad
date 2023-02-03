FROM node:lts-alpine
ENV NODE_ENV=production
ENV SECRET=e99a4deca0aa32edc0d24d9a8aaae9941099749d6def0493284d7a96f1f9e2e1baf83320f415e8d3058a29987e1a7b70061ddba763c9aaeffab3d47b521c419b
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 80
EXPOSE 443
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
