FROM node:16.15.1-alpine3.16 AS BASEIMAGE

WORKDIR /app
COPY package*.json ./
COPY . .
RUN if [[ ! -d ./node_modules ]]; then npm ci; fi;
RUN npm run build
RUN npm ci --omit=dev

FROM node:16.15.1-alpine3.16

WORKDIR /app
COPY --from=BASEIMAGE /app /app

# Set Timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta

EXPOSE 3000

CMD ["node", "dist/main.js"]

