FROM node:24-alpine

# create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# copy package manifests first to leverage layer cache for npm install
COPY package.json package-lock.json ./
# ensure /app is owned by appuser before installing
RUN chown -R appuser:appgroup /app

# install dependencies as non-root user
USER appuser
RUN npm install

# copy source files as non-root and build
# use --chown so files are owned by the non-root user
USER root
COPY --chown=appuser:appgroup . ./
USER appuser
RUN npm run build

EXPOSE 3000

# run as non-root user
CMD ["sh", "-c", "node wait-for-postgres.js && npm run start:prod"]
