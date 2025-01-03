cp ../db-api/schema.prisma ./schema.prisma
docker compose exec jobs npx prisma generate
rm schema.prisma
