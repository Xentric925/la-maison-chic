cd ./packages/db-api
npm run db:reset
npm run db:migrate
cd ../..
docker compose restart db-api
cd ./packages/db-api
npm run db:seed
