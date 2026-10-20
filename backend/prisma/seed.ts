import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createIshaProducts, ishaCategories } from './ishaLifeSampleData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ShopNest database with comprehensive multi-category catalogue...');

  // Clean existing tables (in order of relations)
  await prisma.inventoryAdjustment.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users (Both shopnest.com and eesha.com for full compatibility)
  const adminPassword = await bcrypt.hash('AdminPassword123!', 10);
  const customerPassword = await bcrypt.hash('CustomerPassword123!', 10);

  const adminShopNest = await prisma.user.create({
    data: {
      email: 'admin@shopnest.com',
      passwordHash: adminPassword,
      firstName: 'Aarav',
      lastName: 'Mehta',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  // Alias for test suite
  await prisma.user.create({
    data: {
      email: 'admin@eesha.com',
      passwordHash: adminPassword,
      firstName: 'Aarav',
      lastName: 'Mehta',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@shopnest.com',
      passwordHash: customerPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91 91234 56789',
      role: 'CUSTOMER',
    },
  });

  // Alias for test suite
  await prisma.user.create({
    data: {
      email: 'customer@eesha.com',
      passwordHash: customerPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91 91234 56789',
      role: 'CUSTOMER',
    },
  });

  // Seed default address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      fullName: 'Priya Sharma',
      phone: '+91 91234 56789',
      street: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true,
    },
  });

  // 2. Seed Multi-Categories
  const legacyCategoriesData = [
    {
      name: 'Electronics & Audio',
      slug: 'electronics',
      description: 'Precision engineered sound equipment, high-fidelity transducers, studio monitors, and mechanical instruments.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'Audio & Acoustics',
      slug: 'audio-acoustics',
      description: 'High-fidelity acoustic monitoring, open-back headphones, and room audio elements.',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'Pure organic combed cotton, heavyweight linen overshirts, and tailored merino knitwear.',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'Apparel & Textiles',
      slug: 'apparel-textiles',
      description: 'Tailored minimalist garments crafted from sustainable organic materials.',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Handcrafted stoneware ceramics, sculptural lighting, and cast iron artisanal home objects.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      name: 'Beauty & Grooming',
      slug: 'beauty',
      description: 'Cold-pressed botanical oils, restorative facial elixirs, and niche artisanal fragrances.',
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
    {
      name: 'Sports & Fitness',
      slug: 'sports',
      description: 'All-terrain adventure bicycles, natural tree cork yoga mats, and vacuum double-wall hydration.',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      sortOrder: 7,
    },
    {
      name: 'Books & Stationery',
      slug: 'books',
      description: 'Hardcover architectural monographs, machined brass fountain pens, and archival cotton sketchbooks.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 8,
    },
    {
      name: 'Toys & Hobbies',
      slug: 'toys',
      description: 'Architectural beechwood building blocks, kinetic brass planetary models, and heirloom games.',
      imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      sortOrder: 9,
    },
    {
      name: 'Gourmet & Groceries',
      slug: 'groceries',
      description: 'Cold-pressed single-estate olive oil, ceremonial grade Japanese matcha, and high-altitude coffees.',
      imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
      sortOrder: 10,
    },
    {
      name: 'Timepieces & Horology',
      slug: 'timepieces',
      description: 'Minimalist automatic watches, vegetable-tanned leather straps, and precision chronographs.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      sortOrder: 11,
    },
    {
      name: 'Workspace & Leather',
      slug: 'workspace-leather',
      description: 'Full-grain leather carry, brass writing instruments, and solid oak desktop organizers.',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      sortOrder: 12,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of legacyCategoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
  }
  for (const cat of ishaCategories) {
    if (!createdCategories[cat.slug]) {
      const created = await prisma.category.create({ data: cat });
      createdCategories[cat.slug] = created.id;
    }
  }

  // 3. Seed Comprehensive Real Products across all categories
  const legacyProducts = [
    // Electronics & Audio
    {
      title: 'Aethel Studio Master Reference Headphones',
      slug: 'aethel-studio-master-headphones',
      description: 'A masterpiece in acoustic purity. Featuring custom 50mm beryllium-plated dynamic transducers tuned for analytical clarity, memory foam earpads wrapped in perforated lambskin, and an open-back milled aerospace aluminum architecture.',
      price: 24999.0,
      compareAtPrice: 28999.0,
      sku: 'AUD-AET-001',
      categoryId: createdCategories['audio-acoustics'],
      isFeatured: true,
      stock: 18,
      lowStockThreshold: 4,
      specifications: JSON.stringify({
        'Transducer Type': '50mm Beryllium-coated Dynamic',
        'Frequency Response': '5 Hz – 48,000 Hz',
        'Impedance': '32 Ohms at 1kHz',
        'Weight': '370 grams',
        'Cable': '2.0m Braided Monocrystalline Copper with gold adapter',
      }),
      highlights: 'Beryllium Drivers, Lambskin Cushions, Open-back CNC Aluminum, Detachable Braided Cable',
      rating: 4.9,
      reviewCount: 38,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
          altText: 'Aethel Reference Headphones in studio setting',
          isPrimary: true,
          sortOrder: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85',
          altText: 'Side angle detailing milled aluminum earcups',
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      title: 'Nova 65% Wireless Mechanical Keyboard',
      slug: 'nova-65-mechanical-keyboard',
      description: 'Machined from a solid block of 6063 anodized aluminum with gasket mounting, brass weight bar, lubed pre-travel switches, and seamless Bluetooth 5.2 / 2.4GHz connectivity.',
      price: 12499.0,
      compareAtPrice: 14999.0,
      sku: 'ELE-NOV-002',
      categoryId: createdCategories['electronics'],
      isFeatured: true,
      stock: 22,
      lowStockThreshold: 5,
      specifications: JSON.stringify({
        'Layout': '65% Compact (68 keys)',
        'Case Material': 'CNC 6063 Anodized Aluminum',
        'Mounting Style': 'Silicone Gasket Mount',
        'Switches': 'Custom Factory Lubed Linear (45g)',
        'Battery Life': 'Up to 240 hours without RGB',
      }),
      highlights: 'CNC Aluminum Case, Hot-swappable PCB, Gasket Mount, Tri-mode Wireless',
      rating: 4.8,
      reviewCount: 29,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85',
          altText: 'Nova Mechanical Keyboard on dark oak desk',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Acoustic Pro Nearfield Studio Monitor Pair',
      slug: 'acoustic-pro-nearfield-monitors',
      description: 'Active bi-amplified 5-inch studio monitors with Kevlar low-frequency drivers and natural silk dome tweeters for pristine nearfield sound reproduction.',
      price: 34500.0,
      compareAtPrice: 39999.0,
      sku: 'AUD-MON-003',
      categoryId: createdCategories['electronics'],
      isFeatured: false,
      stock: 9,
      lowStockThreshold: 3,
      specifications: JSON.stringify({
        'Amplifier Class': 'Class D Bi-Amp (70W LF + 30W HF)',
        'Frequency Response': '43 Hz – 24,000 Hz',
        'Inputs': 'Balanced XLR, 1/4" TRS, and RCA',
      }),
      highlights: 'Woven Kevlar Woofers, Silk Dome Tweeters, Room Acoustic Tuning Controls',
      rating: 4.9,
      reviewCount: 15,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
          altText: 'Nearfield studio monitors on isolation pads',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Fashion & Apparel
    {
      title: 'Atelier Heavyweight Raw Linen Overshirt',
      slug: 'atelier-raw-linen-overshirt',
      description: 'Tailored from 280 GSM undyed Normandy flax linen. Features French seams, horn buttons sourced sustainably, and a relaxed chore silhouette that softens gracefully with wear.',
      price: 7499.0,
      compareAtPrice: null,
      sku: 'FAS-LIN-001',
      categoryId: createdCategories['fashion'],
      isFeatured: true,
      stock: 14,
      lowStockThreshold: 3,
      specifications: JSON.stringify({
        'Fabric': '100% Certified Normandy Flax Linen',
        'Weight': '280 GSM Heavyweight',
        'Buttons': 'Real Corozo Nut Buttons',
        'Care': 'Machine wash cold on gentle, hang dry in shade',
      }),
      highlights: '100% Normandy Linen, Double-needle Stitching, Natural Corozo Buttons',
      rating: 4.8,
      reviewCount: 22,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=85',
          altText: 'Textured linen overshirt on neutral background',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Tailored Italian Merino Knit Sweater',
      slug: 'tailored-merino-knit-sweater',
      description: 'Spun from ultra-fine 19.5 micron Zegna Baruffa merino wool in Northern Italy. Impeccable temperature regulation, naturally odor-resistant, and hand-linked at the collar.',
      price: 8999.0,
      compareAtPrice: 10499.0,
      sku: 'FAS-MER-002',
      categoryId: createdCategories['fashion'],
      isFeatured: false,
      stock: 16,
      lowStockThreshold: 4,
      specifications: JSON.stringify({
        'Yarn': '100% Extra-fine Italian Merino Wool (19.5µm)',
        'Gauge': '12-Gauge Plain Knit',
        'Origin': 'Biella, Italy',
      }),
      highlights: '100% Italian Merino Wool, Hand-linked Collar, Natural Breathability',
      rating: 4.9,
      reviewCount: 19,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
          altText: 'Merino knit sweater folded with exquisite texture',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Home & Living
    {
      title: 'Kiso River Stoneware Ceramic Tea Set',
      slug: 'kiso-stoneware-tea-set',
      description: 'Hand-thrown on a traditional kick wheel in Gifu prefecture. Unglazed exterior with rich iron speckles, complemented by a smooth celadon glazed interior and stainless steel strainer.',
      price: 4899.0,
      compareAtPrice: 5499.0,
      sku: 'HOM-TEA-001',
      categoryId: createdCategories['home-living'],
      isFeatured: true,
      stock: 20,
      lowStockThreshold: 4,
      specifications: JSON.stringify({
        'Set Includes': '1 Teapot (650ml) + 4 Tasting Cups (120ml)',
        'Clay Body': 'High-iron Gifu Stoneware',
        'Firing': 'Wood-fired Noborigama kiln for 72 hours',
      }),
      highlights: 'Hand-thrown Stoneware, Celadon Interior, Wood-fired Character',
      rating: 4.9,
      reviewCount: 31,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
          altText: 'Ceramic teapot and cups with steam rising',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Nambu Tekki Japanese Cast Iron Kettle',
      slug: 'nambu-tekki-cast-iron-kettle',
      description: 'Cast in Morioka using four-century-old sand mold techniques. The traditional kettle softens water minerals, enhancing the flavor of pour-over coffees and rare teas.',
      price: 7999.0,
      compareAtPrice: null,
      sku: 'HOM-KET-002',
      categoryId: createdCategories['home-living'],
      isFeatured: false,
      stock: 8,
      lowStockThreshold: 2,
      specifications: JSON.stringify({
        'Capacity': '1.2 Liters',
        'Material': 'High-density Japanese Cast Iron (Nambu Tekki)',
        'Internal Finish': 'Traditional Urushi High-heat Baking Enamel',
      }),
      highlights: 'Sand-cast Iron, Mineral Enriched Water, Hand-hammered Spout',
      rating: 4.9,
      reviewCount: 14,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
          altText: 'Cast iron kettle on a wooden kitchen counter',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Beauty & Grooming
    {
      title: 'Botanical Squalane & Rosehip Restorative Facial Oil',
      slug: 'botanical-squalane-rosehip-oil',
      description: 'A potent, non-comedogenic elixir blending 100% plant-derived sugarcane squalane with cold-pressed organic Chilean rosehip and sea buckthorn berry extract for barrier repair.',
      price: 2499.0,
      compareAtPrice: 2999.0,
      sku: 'BEA-OIL-001',
      categoryId: createdCategories['beauty'],
      isFeatured: true,
      stock: 35,
      lowStockThreshold: 8,
      specifications: JSON.stringify({
        'Volume': '50ml (1.7 fl oz)',
        'Key Actives': 'Sugarcane Squalane, Cold-pressed Rosehip, Sea Buckthorn CO2',
        'Formulation': '100% Clean, Fragrance-Free, Vegan & Cruelty-Free',
      }),
      highlights: 'Cold-pressed Botanicals, Rapid Absorption, Moisture Barrier Repair',
      rating: 4.8,
      reviewCount: 42,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1608248597359-25d482fa89b8?auto=format&fit=crop&w=1200&q=85',
          altText: 'Amber glass dropper bottle with botanical facial oil',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Atelier Atlas Cedarwood & Vetiver Eau De Parfum',
      slug: 'atlas-cedarwood-vetiver-parfum',
      description: 'An evocative olfactory portrait of high Atlas mountain cedar groves, crushed black peppercorn, Haitian vetiver root, and smoky amber resin. Concentrated at 22% oil.',
      price: 5800.0,
      compareAtPrice: null,
      sku: 'BEA-PRF-002',
      categoryId: createdCategories['beauty'],
      isFeatured: false,
      stock: 15,
      lowStockThreshold: 3,
      specifications: JSON.stringify({
        'Volume': '100ml / 3.4 fl oz',
        'Concentration': 'Eau de Parfum (22% Extrait)',
        'Top Notes': 'Pink Peppercorn, Bergamot, Cardamom',
        'Base Notes': 'Atlas Cedar, Haitian Vetiver, Amber',
      }),
      highlights: 'Artisanal Batch Distillation, High Extrait Concentration, French Flacon',
      rating: 4.9,
      reviewCount: 27,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85',
          altText: 'Architectural flacon bottle of artisanal eau de parfum',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Sports & Fitness
    {
      title: 'Kinetic All-Terrain Matte Gravel Bike',
      slug: 'kinetic-matte-gravel-bike',
      description: 'Built around a triple-butted chromoly steel frame with internal cable routing, hydraulic flat-mount disc brakes, and tubeless-ready 700x42c gravel tires for city streets and backcountry trails.',
      price: 54999.0,
      compareAtPrice: 62000.0,
      sku: 'SPO-BIK-001',
      categoryId: createdCategories['sports'],
      isFeatured: true,
      stock: 5,
      lowStockThreshold: 2,
      specifications: JSON.stringify({
        'Frame': 'Seamless 4130 Chromoly Steel',
        'Drivetrain': '1x11 Wide-Range Gravel Groupset (40T x 11-42T)',
        'Brakes': 'Dual-piston Hydraulic Flat-Mount Disc',
        'Weight': '10.8 kg',
      }),
      highlights: '4130 Chromoly Steel Frame, Hydraulic Disc Brakes, Tubeless Compatible',
      rating: 5.0,
      reviewCount: 11,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85',
          altText: 'Matte gravel bike resting in mountain forest trail',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Natural Tree Cork & Rubber Yoga Mat',
      slug: 'natural-cork-rubber-yoga-mat',
      description: 'Manufactured with sustainably harvested Mediterranean cork over a dense non-slip biodegradable natural tree rubber base. Antimicrobial surface provides superior grip with sweat.',
      price: 3200.0,
      compareAtPrice: null,
      sku: 'SPO-YOG-002',
      categoryId: createdCategories['sports'],
      isFeatured: false,
      stock: 24,
      lowStockThreshold: 6,
      specifications: JSON.stringify({
        'Dimensions': '183 cm x 66 cm x 4.5 mm',
        'Materials': '100% Organic Cork Top, Natural Tree Rubber Base',
        'Weight': '2.6 kg',
      }),
      highlights: 'Sustainable Mediterranean Cork, Zero PVC or Toxic Glues, Non-slip Grip',
      rating: 4.8,
      reviewCount: 36,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=85',
          altText: 'Rolled organic cork yoga mat on wooden floor',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Books & Stationery
    {
      title: 'The Architecture of Silence: Minimalist Monograph',
      slug: 'architecture-of-silence-monograph',
      description: 'A cloth-bound hardcover volume examining residential architecture and tactile materials across Scandinavia, Japan, and the Mediterranean. Features 320 pages of archival offset printing.',
      price: 3499.0,
      compareAtPrice: null,
      sku: 'BOK-ARC-001',
      categoryId: createdCategories['books'],
      isFeatured: true,
      stock: 28,
      lowStockThreshold: 5,
      specifications: JSON.stringify({
        'Format': 'Hardcover with Raw Linen Bookcloth & Foil Deboss',
        'Pages': '320 pages on 150 GSM FSC-certified Munken paper',
        'Dimensions': '24.5 x 31.5 cm',
      }),
      highlights: 'Linen Cloth Binding, 300+ High-resolution Photographs, FSC Paper',
      rating: 4.9,
      reviewCount: 18,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85',
          altText: 'Open hardcover art and architecture book',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Solid Brass Machined Fountain Pen & Nib Set',
      slug: 'solid-brass-fountain-pen',
      description: 'Precision lathe-turned from solid marine brass. Uncoated to allow a deep, unique patina to develop over decades. Equipped with a German-made Bock #6 iridium-tipped nib.',
      price: 4200.0,
      compareAtPrice: 4800.0,
      sku: 'BOK-PEN-002',
      categoryId: createdCategories['books'],
      isFeatured: false,
      stock: 19,
      lowStockThreshold: 4,
      specifications: JSON.stringify({
        'Material': 'Solid C36000 Marine Brass',
        'Nib': 'German Bock #6 Stainless Steel & Iridium (Fine/Medium)',
        'Filling Mechanism': 'International Standard Converter or Cartridge',
      }),
      highlights: 'Machined Marine Brass, German Bock Nib, Develops Living Patina',
      rating: 4.9,
      reviewCount: 25,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=85',
          altText: 'Heavy solid brass fountain pen beside ink bottle',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Toys & Hobbies
    {
      title: 'Bauhaus Architectural Beechwood Building Blocks',
      slug: 'bauhaus-beechwood-blocks',
      description: 'Precision milled from sustainable European solid beechwood with rounded safety bevels and finished in non-toxic organic beeswax. Inspired by 1920s Weimar geometric architecture.',
      price: 3899.0,
      compareAtPrice: null,
      sku: 'TOY-BAU-001',
      categoryId: createdCategories['toys'],
      isFeatured: true,
      stock: 17,
      lowStockThreshold: 3,
      specifications: JSON.stringify({
        'Pieces': '48 Geometric Solid Wood Elements',
        'Wood': 'FSC Certified Alpine Beechwood',
        'Finish': 'Pure Beeswax and Jojoba Oil Polish',
      }),
      highlights: 'Solid Alpine Beech, Organic Beeswax Polish, Heirloom Durability',
      rating: 4.8,
      reviewCount: 20,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
          altText: 'Minimalist wooden geometric architectural building blocks',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Gourmet & Groceries
    {
      title: 'Cold-Pressed Early Harvest Single-Estate Olive Oil',
      slug: 'single-estate-extra-virgin-olive-oil',
      description: 'First cold extraction within 4 hours of hand harvest from 300-year-old Koroneiki olive groves in southern Peloponnese. Acidity under 0.2% with intense notes of green artichoke and peppery polyphenols.',
      price: 2199.0,
      compareAtPrice: 2599.0,
      sku: 'GRO-OIL-001',
      categoryId: createdCategories['groceries'],
      isFeatured: true,
      stock: 30,
      lowStockThreshold: 6,
      specifications: JSON.stringify({
        'Volume': '500ml Dark UV Glass Bottle',
        'Acidity': '< 0.19%',
        'Harvest': 'Early October Hand-Picked',
        'Polyphenols': 'High concentration (> 450 mg/kg)',
      }),
      highlights: 'Early Harvest Koroneiki Olives, Sub-0.2% Acidity, UV-protective Glass',
      rating: 4.9,
      reviewCount: 33,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=85',
          altText: 'Dark glass bottle of extra virgin olive oil with fresh green olives',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Ceremonial Grade Uji Japanese Organic Matcha',
      slug: 'ceremonial-uji-organic-matcha',
      description: 'Stone-milled from spring first-flush shaded tencha tea leaves in Uji, Kyoto. Vibrant electric emerald hue, silky sweet umami profile with zero bitterness.',
      price: 2850.0,
      compareAtPrice: null,
      sku: 'GRO-MAT-002',
      categoryId: createdCategories['groceries'],
      isFeatured: false,
      stock: 25,
      lowStockThreshold: 5,
      specifications: JSON.stringify({
        'Weight': '100g Sealed Nitrogen-flushed Aluminum Tin',
        'Origin': 'Uji, Kyoto Prefecture, Japan',
        'Grade': 'First Flush Pinnacle Ceremonial',
      }),
      highlights: 'Stone-ground Uji Tencha, 100% Organic, Shaded 30 Days for Max L-theanine',
      rating: 5.0,
      reviewCount: 40,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
          altText: 'Ceremonial matcha powder whisked into emerald foam with bamboo chasen',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },

    // Timepieces & Horology
    {
      title: 'Kallio Automatic Bauhaus Horology Timepiece',
      slug: 'kallio-automatic-bauhaus-timepiece',
      description: 'Clean Scandinavian horology. Driven by a 24-jewel Japanese Miyota 9015 mechanical automatic movement with 42-hour power reserve, double-domed anti-reflective sapphire crystal, and Swedish Tärnsjö vegetable-tanned leather strap.',
      price: 32000.0,
      compareAtPrice: 36500.0,
      sku: 'HOR-KAL-001',
      categoryId: createdCategories['timepieces'],
      isFeatured: true,
      stock: 12,
      lowStockThreshold: 3,
      specifications: JSON.stringify({
        'Movement': 'Miyota 9015 Automatic (28,800 vph, 24 Jewels)',
        'Case': '38mm x 9.8mm 316L Surgical Stainless Steel',
        'Glass': 'Double-domed Sapphire with Inner AR Coating',
        'Water Resistance': '5 ATM / 50 Meters',
        'Strap': '20mm Vegetable-tanned Swedish Leather with Quick-release',
      }),
      highlights: 'Miyota 9015 Movement, Sapphire Crystal, 316L Steel, Tärnsjö Leather',
      rating: 4.9,
      reviewCount: 26,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
          altText: 'Kallio Automatic Watch resting on slate stone',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'Tuscan Full-Grain Vegetable-Tanned Briefcase',
      slug: 'tuscan-full-grain-leather-briefcase',
      description: 'Hand-assembled by master leather smiths outside Florence. Thick 2.2mm Tuscan vegetable-tanned bridle leather with hand-burnished edges, solid brass hardware, and dedicated padded laptop compartment.',
      price: 18500.0,
      compareAtPrice: 21999.0,
      sku: 'LEA-BRI-002',
      categoryId: createdCategories['workspace-leather'],
      isFeatured: true,
      stock: 11,
      lowStockThreshold: 2,
      specifications: JSON.stringify({
        'Leather': 'Full-grain Italian Vegetable-Tanned Cowhide',
        'Hardware': 'Solid Sand-cast Antiqued Brass',
        'Laptop Pocket': 'Fits up to 16" MacBook Pro / Ultrabook',
        'Dimensions': '40 cm x 29 cm x 9 cm',
      }),
      highlights: 'Full-grain Tuscan Leather, Solid Brass Hardware, Hand-stitched Stress Points',
      rating: 4.9,
      reviewCount: 31,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
          altText: 'Full-grain leather briefcase on limestone bench',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
  ];

  const products = [...legacyProducts, ...createIshaProducts(createdCategories)];
  for (const prod of products) {
    const { images, ...productData } = prod;
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
    }

    // Record initial inventory adjustment log
    await prisma.inventoryAdjustment.create({
      data: {
        productId: createdProduct.id,
        changeQuantity: productData.stock,
        previousStock: 0,
        newStock: productData.stock,
        reason: 'INITIAL_SEED',
        adminUserId: adminShopNest.id,
      },
    });
  }

  // 4. Create sample customer completed order to demonstrate genuine order history
  const sampleProduct = await prisma.product.findFirst({
    where: { slug: 'moringa-bar-single' },
    include: { images: true },
  });

  if (sampleProduct) {
    const orderNumber = 'SHOPNEST-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = sampleProduct.price;
    const taxTotal = Math.round(subtotal * 0.18);
    const shippingFee = 0; // free over threshold
    const grandTotal = subtotal + taxTotal + shippingFee;

    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: customer.id,
        status: 'DELIVERED',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'DEVELOPMENT_MOCK',
        subtotal,
        taxTotal,
        shippingFee,
        discountTotal: 0,
        grandTotal,
        currency: 'INR',
        shippingAddress: JSON.stringify({
          fullName: 'Priya Sharma',
          phone: '+91 91234 56789',
          street: '42, Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        }),
        billingAddress: JSON.stringify({
          fullName: 'Priya Sharma',
          phone: '+91 91234 56789',
          street: '42, Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        }),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: sampleOrder.id,
        productId: sampleProduct.id,
        productTitle: sampleProduct.title,
        productSku: sampleProduct.sku,
        unitPrice: sampleProduct.price,
        quantity: 1,
        totalAmount: sampleProduct.price,
        productImage: sampleProduct.images[0]?.url || null,
        snapshotData: JSON.stringify({
          title: sampleProduct.title,
          sku: sampleProduct.sku,
          price: sampleProduct.price,
          description: sampleProduct.description,
        }),
      },
    });
  }

  console.log('ShopNest multi-category database seeding finished successfully!');
  console.log('Demo Credentials:');
  console.log('Admin: admin@shopnest.com (or admin@eesha.com) / AdminPassword123!');
  console.log('Customer: customer@shopnest.com (or customer@eesha.com) / CustomerPassword123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
