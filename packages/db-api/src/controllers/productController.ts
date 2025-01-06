import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';

// Helper function to select fields based on role
const productSelect = (role: string) => {
  if (role === 'ADMIN') {
    return {
      id: true,
      name: true,
      description: true,
      price: true,
      quantity: true,
      supplierId: true,
      supplier: true,
      isOwnedByShop: true,
      purchaseCost: true,
      dimensions: true,
      images: true,
      salesDetails: true,
      purchases: true,
    };
  }
  return {
    id: true,
    name: true,
    description: true,
    price: true,
    quantity: true,
    dimensions: true,
    images: true,
  };
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  const { role } = req.body.user;

  try {
    const { name, price, isOwnedByShop, supplierId, skip, take } = req.query;

    const products = await readPrisma.product.findMany({
      where: {
        name: name
          ? { contains: name as string, mode: 'insensitive' }
          : undefined,
        price: price ? { equals: parseFloat(price as string) } : undefined,
        isOwnedByShop: isOwnedByShop ? isOwnedByShop === 'true' : undefined,
        supplierId: supplierId?.toString(),
        deletedAt: null,
      },
      select: productSelect(role),
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 10,
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch products',
      'productController.getAllProducts',
    );
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { role } = req.body.user;
  const { id } = req.params;

  try {
    const product = await readPrisma.product.findUnique({
      where: { id: id, deletedAt: null },
      select: productSelect(role),
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Create a product
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    quantity,
    supplierId,
    isOwnedByShop,
    purchaseCost,
    dimensions,
    images,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    await writePrisma.$transaction(async (transaction) => {
      const product = await transaction.product.create({
        data: {
          name,
          description,
          price,
          quantity: quantity ?? 1,
          supplierId,
          isOwnedByShop: isOwnedByShop ?? true,
          purchaseCost,
        },
      });

      if (dimensions) {
        const { width, length, height, diameter } = dimensions;
        await transaction.productDimension.create({
          data: {
            productId: product.id,
            width,
            length,
            height,
            diameter,
          },
        });
      }

      if (images && images.length > 0) {
        await transaction.productImage.createMany({
          data: images.map((url: string) => ({
            productId: product.id,
            url,
          })),
        });
      }

      return product;
    });

    return res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    quantity,
    supplierId,
    isOwnedByShop,
    purchaseCost,
    dimensions,
    images,
  } = req.body;

  const { id } = req.params;

  try {
    await writePrisma.$transaction(async (transaction) => {
      const product = await transaction.product.update({
        where: { id: id },
        data: {
          name,
          description,
          price,
          quantity,
          supplierId,
          isOwnedByShop,
          purchaseCost,
        },
      });

      if (dimensions) {
        const { width, length, height, diameter } = dimensions;
        await transaction.productDimension.upsert({
          where: { productId: product.id },
          update: { width, length, height, diameter },
          create: { productId: product.id, width, length, height, diameter },
        });
      }

      if (images && images.length > 0) {
        await transaction.productImage.deleteMany({
          where: { productId: product.id },
        });

        await transaction.productImage.createMany({
          data: images.map((url: string) => ({
            productId: product.id,
            url,
          })),
        });
      }

      return product;
    });

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await writePrisma.product.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete product', error });
  }
};
