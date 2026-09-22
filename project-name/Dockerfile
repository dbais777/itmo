FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# Use npm install to allow installing dependencies added without regenerating lockfile here
# Install all deps (including dev) so build tools like nest are available
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
