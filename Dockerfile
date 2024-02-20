FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

CMD ["pnpm", "start:dev"]
