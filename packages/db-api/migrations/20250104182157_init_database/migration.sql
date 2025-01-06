-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "jobs";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "jobs"."JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED', 'RETRY');

-- CreateEnum
CREATE TYPE "jobs"."JobType" AS ENUM ('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'SLACK');

-- CreateEnum
CREATE TYPE "private"."SaleStatus" AS ENUM ('PENDING', 'COMPLETED', 'PARTIAL_PAYMENT');

-- CreateEnum
CREATE TYPE "private"."PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'PARTIAL_PAYMENT');

-- CreateTable
CREATE TABLE "public"."Details" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."UserAuth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginToken" TEXT,
    "refreshToken" TEXT,
    "sessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs"."Job" (
    "id" TEXT NOT NULL,
    "type" "jobs"."JobType" NOT NULL,
    "status" "jobs"."JobStatus" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "failureCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "supplierId" TEXT,
    "isOwnedByShop" BOOLEAN NOT NULL DEFAULT true,
    "purchaseCost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductDimension" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductDimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Carpet" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "supplierId" TEXT,
    "productId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Carpet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."Sale" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "private"."SaleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."SalesDetail" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "soldPrice" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SalesDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."Purchase" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "status" "private"."PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."PurchaseDetail" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PurchaseDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saleId" TEXT,
    "purchaseId" TEXT,
    "customerId" TEXT,
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Details_email_key" ON "public"."Details"("email");

-- CreateIndex
CREATE INDEX "Details_firstName_lastName_idx" ON "public"."Details"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "Details_email_idx" ON "public"."Details"("email");

-- CreateIndex
CREATE INDEX "Details_phone_idx" ON "public"."Details"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_userId_key" ON "private"."UserAuth"("userId");

-- CreateIndex
CREATE INDEX "UserAuth_loginToken_idx" ON "private"."UserAuth"("loginToken");

-- CreateIndex
CREATE INDEX "UserAuth_refreshToken_idx" ON "private"."UserAuth"("refreshToken");

-- CreateIndex
CREATE INDEX "UserAuth_sessionId_idx" ON "private"."UserAuth"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_detailsId_key" ON "public"."User"("detailsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_detailsId_key" ON "public"."Customer"("detailsId");

-- CreateIndex
CREATE INDEX "Customer_detailsId_idx" ON "public"."Customer"("detailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_detailsId_key" ON "public"."Supplier"("detailsId");

-- CreateIndex
CREATE INDEX "Supplier_detailsId_idx" ON "public"."Supplier"("detailsId");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "public"."Product"("name");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "public"."Product"("price");

-- CreateIndex
CREATE INDEX "Product_quantity_idx" ON "public"."Product"("quantity");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "public"."Product"("supplierId");

-- CreateIndex
CREATE INDEX "Product_isOwnedByShop_idx" ON "public"."Product"("isOwnedByShop");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "public"."ProductImage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDimension_productId_key" ON "public"."ProductDimension"("productId");

-- CreateIndex
CREATE INDEX "ProductDimension_productId_idx" ON "public"."ProductDimension"("productId");

-- CreateIndex
CREATE INDEX "Carpet_code_idx" ON "public"."Carpet"("code");

-- CreateIndex
CREATE INDEX "Carpet_supplierId_idx" ON "public"."Carpet"("supplierId");

-- CreateIndex
CREATE INDEX "Carpet_productId_idx" ON "public"."Carpet"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Carpet_code_supplierId_key" ON "public"."Carpet"("code", "supplierId");

-- CreateIndex
CREATE INDEX "Sale_customerId_idx" ON "private"."Sale"("customerId");

-- CreateIndex
CREATE INDEX "Sale_status_idx" ON "private"."Sale"("status");

-- CreateIndex
CREATE INDEX "SalesDetail_saleId_idx" ON "private"."SalesDetail"("saleId");

-- CreateIndex
CREATE INDEX "SalesDetail_productId_idx" ON "private"."SalesDetail"("productId");

-- CreateIndex
CREATE INDEX "Purchase_supplierId_idx" ON "private"."Purchase"("supplierId");

-- CreateIndex
CREATE INDEX "Purchase_status_idx" ON "private"."Purchase"("status");

-- CreateIndex
CREATE INDEX "Purchase_dueDate_idx" ON "private"."Purchase"("dueDate");

-- CreateIndex
CREATE INDEX "PurchaseDetail_purchaseId_idx" ON "private"."PurchaseDetail"("purchaseId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_productId_idx" ON "private"."PurchaseDetail"("productId");

-- CreateIndex
CREATE INDEX "Payment_saleId_idx" ON "private"."Payment"("saleId");

-- CreateIndex
CREATE INDEX "Payment_purchaseId_idx" ON "private"."Payment"("purchaseId");

-- CreateIndex
CREATE INDEX "Payment_customerId_idx" ON "private"."Payment"("customerId");

-- CreateIndex
CREATE INDEX "Payment_supplierId_idx" ON "private"."Payment"("supplierId");

-- CreateIndex
CREATE INDEX "Payment_date_idx" ON "private"."Payment"("date");

-- AddForeignKey
ALTER TABLE "private"."UserAuth" ADD CONSTRAINT "UserAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "public"."Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "public"."Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supplier" ADD CONSTRAINT "Supplier_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "public"."Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductDimension" ADD CONSTRAINT "ProductDimension_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Carpet" ADD CONSTRAINT "Carpet_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Carpet" ADD CONSTRAINT "Carpet_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."SalesDetail" ADD CONSTRAINT "SalesDetail_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "private"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."SalesDetail" ADD CONSTRAINT "SalesDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Purchase" ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."PurchaseDetail" ADD CONSTRAINT "PurchaseDetail_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "private"."Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."PurchaseDetail" ADD CONSTRAINT "PurchaseDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "private"."Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Payment" ADD CONSTRAINT "Payment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "private"."Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Payment" ADD CONSTRAINT "Payment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
