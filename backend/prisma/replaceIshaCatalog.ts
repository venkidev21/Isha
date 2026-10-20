import { PrismaClient } from '@prisma/client';
import { createIshaProducts, ishaCategories } from './ishaLifeSampleData.js';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    throw new Error('Catalog replacement requires an existing admin user.');
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventoryAdjustment.deleteMany();
    await tx.cartItem.deleteMany();
    await tx.productImage.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();

    const categoryIds: Record<string, string> = {};
    for (const category of ishaCategories) {
      const created = await tx.category.create({ data: category });
      categoryIds[category.slug] = created.id;
    }

    for (const product of createIshaProducts(categoryIds)) {
      const { images, ...productData } = product;
      const created = await tx.product.create({ data: productData });

      await tx.productImage.createMany({
        data: images.map((image) => ({
          productId: created.id,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder,
        })),
      });

      await tx.inventoryAdjustment.create({
        data: {
          productId: created.id,
          changeQuantity: productData.stock,
          previousStock: 0,
          newStock: productData.stock,
          reason: 'INITIAL_SEED',
          adminUserId: admin.id,
        },
      });
    }
  });

  console.log(`Replaced the sample catalog with ${createIshaProducts({ 'natural-food': 'preview' }).length} verified products.`);
  console.log('Existing users, orders, and payment records were preserved.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
