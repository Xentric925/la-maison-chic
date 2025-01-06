FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY schema.prisma ./

RUN npx prisma generate

COPY . .

COPY wait-for-postgres.sh ./
COPY migrations ./migrations/

RUN chmod +x ./wait-for-postgres.sh


RUN apk --no-cache update && \
    apk --no-cache add postgresql-client

RUN apk add --no-cache openssl

RUN apk add --no-cache dos2unix
RUN dos2unix -f ./wait-for-postgres.sh


EXPOSE 5000

CMD sh ./wait-for-postgres.sh && npm run dev