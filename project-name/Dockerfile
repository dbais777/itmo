FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "node wait-for-postgres.js && npm run start:prod"]
