npm install
cp packages/db-api/schema.prisma packages/jobs/
docker compose up --build -d
rm packages/jobs/schema.prisma
