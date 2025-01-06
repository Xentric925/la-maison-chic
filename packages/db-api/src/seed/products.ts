import { writePrisma } from '../prisma';

const products = [
  {
    name: 'Product 1',
    description: 'This is the first product',
    price: 100,
    quantity: 10,
    isOwnedByShop: true,
    purchaseCost: 50,
    dimensions: {
      length: 10,
      width: 10,
      height: 10,
    },
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
  },
  {
    name: 'Product 2',
    description: 'This is the second product',
    price: 200,
    quantity: 20,
    isOwnedByShop: true,
    purchaseCost: 100,
    dimensions: {
      length: 20,
      width: 20,
      height: 20,
    },
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
  },
  {
    name: 'Product 3',
    description: 'This is the third product',
    price: 300,
    quantity: 30,
    isOwnedByShop: true,
    purchaseCost: 150,
    dimensions: {
      length: 30,
      width: 30,
      height: 30,
    },
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
  },
];

export const seedProducts = async () => {
  try {
    await writePrisma.$transaction(async (transaction) => {
      for (const product of products) {
        const { dimensions, images, ...productData } = product;

        const newProduct = await transaction.product.create({
          data: {
            ...productData,
            supplier: {
              create: {
                details: {
                  create: {
                    firstName: 'Supplier',
                    lastName: '1',
                    address: 'Supplier Address',
                    phone: '1234567890',
                  },
                },
              },
            },
          },
        });

        if (dimensions) {
          await transaction.productDimension.create({
            data: {
              productId: newProduct.id,
              ...dimensions,
            },
          });
        }

        if (images && images.length > 0) {
          await transaction.productImage.createMany({
            data: images.map((image) => ({
              productId: newProduct.id,
              url: image,
            })),
          });
        }
      }
    });

    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Failed to seed products', error);
  }
};
