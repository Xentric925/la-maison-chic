FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

COPY schema.prisma ./
COPY wait-for-postgres.sh ./
COPY migrations ./migrations/

RUN chmod +x ./wait-for-postgres.sh

RUN npm install
RUN npx prisma generate

RUN apk update && \
    apk add postgresql-client

RUN apk add dos2unix && \
    dos2unix ./wait-for-postgres.sh

EXPOSE 5000

CMD sh ./wait-for-postgres.sh && npm run dev
