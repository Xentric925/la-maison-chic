FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY schema.prisma ./

RUN npx prisma generate

COPY . .

COPY wait-for-postgres.sh ./

RUN chmod +x ./wait-for-postgres.sh

RUN apk update && \
    apk add postgresql-client

RUN apk add dos2unix && \
    dos2unix ./wait-for-postgres.sh

CMD sh ./wait-for-postgres.sh && npm run dev
