import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "smartphones", name: "Смартфоны", description: "Apple, Honor, Huawei, Redmi и другие модели" }
];

const products = [
  {
    slug: "honor-x8a",
    name: "Смартфон HONOR X8A 6/128GB",
    brand: "Honor",
    price: 19990,
    oldPrice: null,
    badge: "Хит",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780406944/honor-x8a_c8niv5.png",
    color: "Синий",
    memory: "128 ГБ",
    screen: "6.7 / 1080x2388",
    processor: "8 ядер",
    battery: "20 Вт",
    isFeatured: true,
    isNew: true
  },
  {
    
    slug: "iphone-14-128gb",
    name: "Смартфон Apple iPhone 14 128GB",
    brand: "Apple",
    price: 84999,
    oldPrice: 87999,
    badge: "-4%",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780406998/iphone-14-128gb_lxfkcx.png",
    color: "Белый",
    memory: "128 ГБ",
    screen: "6.1 Super Retina",
    processor: "A15 Bionic",
    battery: "до 20 ч",
    isFeatured: true,
    isNew: false
  },
  {
    slug: "iphone-15-pro",
    name: "Смартфон Apple iPhone 15 Pro 256GB",
    brand: "Apple",
    price: 549990,
    oldPrice: 599990,
    badge: "Pro",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780407008/iphone-15-pro_klj2ek.png",
    color: "Белый титан",
    memory: "256 ГБ",
    screen: "6.1 OLED",
    processor: "A17 Pro",
    battery: "до 23 ч",
    isFeatured: true,
    isNew: true
  },
  {
    slug: "iphone-12-purple",
    name: "Смартфон Apple iPhone 12 128GB",
    brand: "Apple",
    price: 259990,
    oldPrice: 279990,
    badge: "-7%",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780406983/iphone-12-purple_cfgl9b.png",
    color: "Фиолетовый",
    memory: "128 ГБ",
    screen: "6.1 OLED",
    processor: "A14 Bionic",
    battery: "до 17 ч",
    isFeatured: true,
    isNew: false
  },
  {
    slug: "huawei-y6p",
    name: "Смартфон HUAWEI Y6p 64GB",
    brand: "Huawei",
    price: 69990,
    oldPrice: null,
    badge: null,
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780406975/huawei-y6p_gncbxq.png",
    color: "Голубой",
    memory: "64 ГБ",
    screen: "6.3 HD+",
    processor: "8 ядер",
    battery: "5000 мАч",
    isFeatured: false,
    isNew: false
  },
  {
    slug: "huawei-nova-11",
    name: "Смартфон HUAWEI nova 11",
    brand: "Huawei",
    price: 179990,
    oldPrice: 199990,
    badge: "Sale",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780406967/huawei-nova-11_daz9xp.png",
    color: "Зеленый",
    memory: "256 ГБ",
    screen: "6.7 OLED",
    processor: "Snapdragon",
    battery: "4500 мАч",
    isFeatured: false,
    isNew: true
  },
  {
    slug: "redmi-note-12",
    name: "Смартфон Redmi Note 12 128GB",
    brand: "Redmi",
    price: 89990,
    oldPrice: 99990,
    badge: "-10%",
    image: "https://res.cloudinary.com/djwpvlv5d/image/upload/v1780407021/redmi-note-12_gii5se.png",
    color: "Черный",
    memory: "128 ГБ",
    screen: "6.67 AMOLED",
    processor: "Snapdragon",
    battery: "5000 мАч",
    isFeatured: false,
    isNew: false
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: category
    });
  }

  for (const product of products) {
    const { image, ...data } = product;

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        ...data,
        description: `${product.name}. ${product.screen}, память ${product.memory}.`,
        rating: 4.8,
        reviews: 24,
        stock: 12,
        category: { connect: { slug: "smartphones" } }
      },
      update: {
        ...data,
        description: `${product.name}. ${product.screen}, память ${product.memory}.`,
        rating: 4.8,
        reviews: 24,
        stock: 12,
        category: { connect: { slug: "smartphones" } }
      }
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productImage.create({
      data: {
        productId: saved.id,
        url: image,
        alt: product.name,
        position: 0
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
