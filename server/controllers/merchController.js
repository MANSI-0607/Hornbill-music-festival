import MerchItem from '../models/MerchItem.js';
import jwt from 'jsonwebtoken';
import CartSession from "../models/CartSession.js";
import CategoryShowcase from "../models/CategoryShowcase.js";
import { randomBytes } from "crypto";

// Simple admin token check (uses the same admin token as /api/admin/login)
export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.admin = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const listMerch = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const items = await MerchItem.find(filter).sort({ position: 1, createdAt: -1 });

    const normalized = items.map((i) => {
      const doc = i.toObject();

      // Normalize images (no artificial limit)
      if ((!doc.images || doc.images.length === 0) && doc.imageUrl) {
        doc.images = [doc.imageUrl];
      } else if (!doc.images) {
        doc.images = [];
      }

      // Normalize designs
      if (!Array.isArray(doc.designs)) {
        doc.designs = [];
      }

      // Normalize colours
      if (!Array.isArray(doc.colours)) {
        doc.colours = [];
      }

      // Normalize sizes
      if (!Array.isArray(doc.sizes)) {
        doc.sizes = [];
      }

      // Normalize combination-specific variant images
      if (!Array.isArray(doc.variantImages)) {
        doc.variantImages = [];
      } else {
        doc.variantImages = doc.variantImages.map((vi) => ({
          design: String(vi.design || '').trim(),
          colour: String(vi.colour || '').trim(),
          imageUrl: String(vi.imageUrl || '').trim(),
          images: Array.isArray(vi.images) ? vi.images.filter(Boolean) : (vi.imageUrl ? [vi.imageUrl] : []),
        }));
      }

      if (!doc.sizeChartUrl) doc.sizeChartUrl = '';
      if (!doc.productCode) doc.productCode = '';
      if (!doc.category) doc.category = 'T-Shirts';
      if (!doc.fabric) doc.fabric = '';
      if (!doc.weight) doc.weight = '';
      if (!doc.fit) doc.fit = '';
      if (typeof doc.hasPackOption !== 'boolean') doc.hasPackOption = false;
      if (typeof doc.packPrice !== 'number') doc.packPrice = 0;
      if (!doc.packLabel) doc.packLabel = 'Pack of 10';
      if (typeof doc.position !== 'number') doc.position = 0;

      return doc;
    });

    res.json(normalized);
  } catch (err) {
    console.error("Failed to fetch merchandise:", err);
    res.status(500).json({ message: "Failed to fetch merchandise" });
  }
};

export const createMerch = async (req, res) => {
  try {
    const {
      name,
      productCode = '',
      category = 'T-Shirts',
      description = '',
      fabric = '',
      weight = '',
      fit = '',
      price,
      hasPackOption = false,
      packPrice = 0,
      packLabel = 'Pack of 10',
      imageUrl = '',
      images = [],
      variantImages = [],
      designs = [],
      colours = [],
      sizes = [],
      sizeChartUrl = '',
      stock = 100,
      position = 0,
      isActive = true
    } = req.body || {};

    if (!name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Name and numeric price are required' });
    }

    // Unlimited images
    let imagesArr = Array.isArray(images) ? images.filter(Boolean) : [];
    if (imagesArr.length === 0 && imageUrl) imagesArr = [imageUrl];

    // Normalize sizes
    let sizesArr = Array.isArray(sizes)
      ? sizes.map((s) => String(s).trim()).filter(Boolean)
      : [];

    // Normalize designs
    let designsArr = Array.isArray(designs)
      ? designs
          .filter((d) => d && (d.name || typeof d === 'string'))
          .map((d) =>
            typeof d === 'string'
              ? { name: d.trim(), code: '' }
              : { name: String(d.name || '').trim(), code: String(d.code || '').trim() }
          )
      : [];

    // Normalize colours
    let coloursArr = Array.isArray(colours)
      ? colours
          .filter((c) => c && (c.name || typeof c === 'string'))
          .map((c) =>
            typeof c === 'string'
              ? { name: c.trim(), hex: '#000000' }
              : { name: String(c.name || '').trim(), hex: String(c.hex || '#000000').trim() }
          )
      : [];

    // Normalize combination variant images
    let variantImagesArr = Array.isArray(variantImages)
      ? variantImages
          .filter((vi) => vi && (vi.design || vi.colour))
          .map((vi) => ({
            design: String(vi.design || '').trim(),
            colour: String(vi.colour || '').trim(),
            imageUrl: String(vi.imageUrl || (Array.isArray(vi.images) && vi.images[0]) || '').trim(),
            images: Array.isArray(vi.images) ? vi.images.filter(Boolean) : (vi.imageUrl ? [vi.imageUrl] : [])
          }))
      : [];

    const primaryImage = imagesArr[0] || (variantImagesArr[0]?.imageUrl) || imageUrl || '';

    const created = await MerchItem.create({
      name: name.trim(),
      productCode: String(productCode).trim().toUpperCase(),
      category: ['T-Shirts', 'Winterwear', 'Accessories', 'General'].includes(category)
        ? category
        : 'T-Shirts',
      description: String(description).trim(),
      fabric: String(fabric).trim(),
      weight: String(weight).trim(),
      fit: String(fit).trim(),
      price: Number(price),
      hasPackOption: Boolean(hasPackOption),
      packPrice: Number(packPrice || 0),
      packLabel: String(packLabel || 'Pack of 10').trim(),
      imageUrl: primaryImage,
      images: imagesArr,
      variantImages: variantImagesArr,
      designs: designsArr,
      colours: coloursArr,
      sizes: sizesArr,
      sizeChartUrl: typeof sizeChartUrl === 'string' ? sizeChartUrl.trim() : '',
      stock: Number(stock || 0),
      position: Number(position) || 0,
      isActive: Boolean(isActive)
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create merch item:", err);
    res.status(500).json({ message: 'Failed to create item', error: err?.message });
  }
};

export const updateMerch = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const update = { ...body };

    if (update.name) update.name = update.name.trim();
    if (update.productCode !== undefined) update.productCode = String(update.productCode).trim().toUpperCase();
    if (update.description !== undefined) update.description = String(update.description).trim();
    if (update.fabric !== undefined) update.fabric = String(update.fabric).trim();
    if (update.weight !== undefined) update.weight = String(update.weight).trim();
    if (update.fit !== undefined) update.fit = String(update.fit).trim();
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.position !== undefined) update.position = Number(update.position) || 0;
    if (update.hasPackOption !== undefined) update.hasPackOption = Boolean(update.hasPackOption);
    if (update.packPrice !== undefined) update.packPrice = Number(update.packPrice);
    if (update.packLabel !== undefined) update.packLabel = String(update.packLabel).trim();

    // Images (no limit)
    if (update.images && Array.isArray(update.images)) {
      update.images = update.images.filter(Boolean);
      if (update.images.length > 0) {
        update.imageUrl = update.images[0];
      }
    } else if (update.imageUrl && (!update.images || update.images.length === 0)) {
      update.images = [update.imageUrl];
    }

    // Sizes
    if (update.sizes && Array.isArray(update.sizes)) {
      update.sizes = update.sizes.map((s) => String(s).trim()).filter(Boolean);
    }

    // Designs
    if (update.designs && Array.isArray(update.designs)) {
      update.designs = update.designs
        .filter((d) => d && (d.name || typeof d === 'string'))
        .map((d) =>
          typeof d === 'string'
            ? { name: d.trim(), code: '' }
            : { name: String(d.name || '').trim(), code: String(d.code || '').trim() }
        );
    }

    // Colours
    if (update.colours && Array.isArray(update.colours)) {
      update.colours = update.colours
        .filter((c) => c && (c.name || typeof c === 'string'))
        .map((c) =>
          typeof c === 'string'
            ? { name: c.trim(), hex: '#000000' }
            : { name: String(c.name || '').trim(), hex: String(c.hex || '#000000').trim() }
        );
    }

    // Combination variant images
    if (update.variantImages && Array.isArray(update.variantImages)) {
      update.variantImages = update.variantImages
        .filter((vi) => vi && (vi.design || vi.colour))
        .map((vi) => ({
          design: String(vi.design || '').trim(),
          colour: String(vi.colour || '').trim(),
          imageUrl: String(vi.imageUrl || (Array.isArray(vi.images) && vi.images[0]) || '').trim(),
          images: Array.isArray(vi.images) ? vi.images.filter(Boolean) : (vi.imageUrl ? [vi.imageUrl] : [])
        }));
    }

    if (update.sizeChartUrl !== undefined) {
      update.sizeChartUrl = typeof update.sizeChartUrl === 'string' ? update.sizeChartUrl.trim() : '';
    }

    const updated = await MerchItem.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update merch item:", err);
    res.status(500).json({ message: 'Failed to update item', error: err?.message });
  }
};

export const deleteMerch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MerchItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error("Failed to delete merch item:", err);
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

export const createCartSession = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Cart cannot be empty" });

    let verifiedTotal = 0;
    const verifiedItems = [];

    for (const i of items) {
      const qty =
        typeof i.quantity === 'number' && i.quantity > 0
          ? Math.min(Math.floor(i.quantity), 99)
          : 1;

      // Look up product in MongoDB to verify active price and prevent client-side tampering
      let dbItem = null;
      if (i.productId) {
        try {
          dbItem = await MerchItem.findById(i.productId);
        } catch {
          // invalid objectId fallback
        }
      }

      if (!dbItem && i.productCode) {
        dbItem = await MerchItem.findOne({
          productCode: String(i.productCode).trim().toUpperCase(),
        });
      }

      const isPack = String(i.packOption || '').toLowerCase().includes('pack');
      let unitPrice = typeof i.price === 'number' && i.price >= 0 ? i.price : 0;

      if (dbItem) {
        if (isPack && dbItem.hasPackOption && dbItem.packPrice && dbItem.packPrice > 0) {
          unitPrice = dbItem.packPrice;
        } else if (dbItem.price && dbItem.price > 0) {
          unitPrice = dbItem.price;
        }
      }

      verifiedTotal += unitPrice * qty;

      const designStr = typeof i.design === 'string' ? i.design.trim() : '';
      const colourStr = typeof i.colour === 'string' ? i.colour.trim() : '';
      const sizeStr = typeof i.size === 'string' ? i.size.trim() : '';
      const packStr = typeof i.packOption === 'string' ? i.packOption.trim() : '';

      // Clean humanized variant descriptor for AHIBI order review
      const variantDesc = [designStr, colourStr, sizeStr ? `Size: ${sizeStr}` : '', packStr]
        .filter(Boolean)
        .join(' · ');

      verifiedItems.push({
        productId: dbItem?._id || i.productId,
        itemId: String(i.itemId || i.sku || dbItem?._id || i.productId),
        productCode: dbItem?.productCode || (typeof i.productCode === 'string' ? i.productCode.trim() : ''),
        sku: typeof i.sku === 'string' ? i.sku.trim() : '',
        name: dbItem?.name || (typeof i.name === 'string' ? i.name.trim() : 'Hornbill Merchandise'),
        design: designStr,
        colour: colourStr,
        size: sizeStr,
        variant: variantDesc,
        packOption: packStr,
        quantity: qty,
        price: unitPrice,
        image: typeof i.image === 'string' ? i.image.trim() : (dbItem?.imageUrl || ''),
      });
    }

    const sessionId = randomBytes(16).toString("hex");

    await CartSession.create({
      sessionId,
      items: verifiedItems,
      totalAmount: verifiedTotal,
      currency: "INR",
    });

    return res.status(200).json({ sessionId, totalAmount: verifiedTotal });
  } catch (err) {
    console.error("Failed to create cart session:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }
    
    const session = await CartSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Invalid or expired session" });
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        items: session.items,
        totalAmount: session.totalAmount,
        currency: session.currency || "INR",
        notes: "",
        createdAt: session.createdAt
      }
    });

  } catch (err) {
    console.error("Failed to fetch cart session:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listCategoryShowcases = async (req, res) => {
  try {
    const list = await CategoryShowcase.find({});
    const categories = ['T-Shirts', 'Winterwear', 'Accessories', 'General'];
    const map = {};
    for (const item of list) {
      map[item.category] = item.toObject();
    }
    const result = categories.map((cat) => {
      if (map[cat]) return map[cat];
      return {
        category: cat,
        title: `${cat} Collection`,
        description: `Official Hornbill Festival ${cat} catalogue`,
        images: [],
      };
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Failed to list category showcases:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveCategoryShowcase = async (req, res) => {
  try {
    const { category, title, description, images } = req.body;
    if (!category || !['T-Shirts', 'Winterwear', 'Accessories', 'General'].includes(category)) {
      return res.status(400).json({ message: 'Valid category is required' });
    }
    const imagesArr = Array.isArray(images)
      ? images.map((u) => String(u).trim()).filter(Boolean)
      : [];

    const updated = await CategoryShowcase.findOneAndUpdate(
      { category },
      {
        category,
        title: typeof title === 'string' ? title.trim() : `${category} Collection`,
        description: typeof description === 'string' ? description.trim() : '',
        images: imagesArr,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Failed to save category showcase:', err);
    return res.status(500).json({ message: 'Failed to save category showcase' });
  }
};

export const OFFICIAL_CATALOG_ITEMS = [
  {
    productCode: 'HMF-RNT',
    name: 'Classic Round-Neck Tee',
    category: 'T-Shirts',
    position: 1,
    price: 535,
    fabric: '100% cotton, bio-washed',
    weight: '180 GSM',
    fit: 'Regular, round neck',
    description: 'Soft, bio-washed cotton with a small chest mark and one big back print.',
    designs: [
      { name: 'This Way to Kisama', code: 'KISAMA' },
      { name: 'Dance Floor', code: 'DANCE' },
      { name: 'Good Vibes', code: 'VIBES' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'All Access', code: 'ACCESS' },
    ],
    colours: [
      { name: 'Black', hex: '#111111' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#18233C' },
      { name: 'Cream', hex: '#F4EEDD' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-OST',
    name: 'Oversized Tee',
    category: 'T-Shirts',
    position: 2,
    price: 585,
    fabric: '100% cotton, bio-washed',
    weight: '180 GSM',
    fit: 'Oversized, drop shoulder',
    description: 'Drop-shoulder, boxy and roomy: the streetwear cut for the big back print.',
    designs: [
      { name: 'This Way to Kisama', code: 'KISAMA' },
      { name: 'Dance Floor', code: 'DANCE' },
      { name: 'Good Vibes', code: 'VIBES' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'All Access', code: 'ACCESS' },
    ],
    colours: [
      { name: 'Black', hex: '#111111' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-HD320',
    name: 'Pullover Hoodie',
    category: 'Winterwear',
    position: 3,
    price: 999,
    fabric: 'Poly-cotton 3-thread fleece',
    weight: '320 GSM',
    fit: 'Regular pullover',
    description: 'Warm 320 GSM fleece with a kangaroo pocket for cold Kisama evenings.',
    designs: [
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'Main Stage', code: 'STAGE' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'All Access', code: 'ACCESS' },
    ],
    colours: [
      { name: 'Black', hex: '#111111' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Off-white', hex: '#EDE7D9' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-SWT',
    name: 'Crew Sweatshirt',
    category: 'Winterwear',
    position: 4,
    price: 800,
    fabric: 'Cotton 3-thread fleece',
    weight: '320 GSM',
    fit: 'Regular crew neck',
    description: 'Soft brushed fleece with ribbed cuffs and hem.',
    designs: [
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'Main Stage', code: 'STAGE' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'All Access', code: 'ACCESS' },
    ],
    colours: [
      { name: 'Black', hex: '#111111' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-TOTE',
    name: 'Tote Bag',
    category: 'Accessories',
    position: 5,
    price: 370,
    fabric: 'Cotton canvas (16 × 14 in / 40 × 35 cm)',
    weight: 'Heavy canvas',
    fit: 'Long shoulder straps · Front print only',
    description: 'A sturdy canvas tote for the festival grounds and every day after. 16 × 14 in (40 × 35 cm).',
    designs: [
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'Main Stage', code: 'STAGE' },
      { name: 'This Way to Kisama', code: 'KISAMA' },
    ],
    colours: [
      { name: 'Black', hex: '#111111' },
      { name: 'Natural', hex: '#E9E3D3' },
    ],
    sizes: ['16 × 14 in'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-MUG',
    name: 'Coffee Mug',
    category: 'Accessories',
    position: 6,
    price: 420,
    fabric: 'White ceramic, glossy',
    weight: 'Glossy ceramic',
    fit: 'Full colour signboard print · Hand wash',
    description: 'White ceramic mug with the yellow Hornbill Music Festival signboard.',
    designs: [
      { name: 'Hornbill Music Festival signboard', code: 'SIGN' },
    ],
    colours: [
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['Standard'],
    hasPackOption: false,
    packPrice: 0,
    packLabel: 'Pack of 10',
    stock: 100,
    isActive: true,
  },
  {
    productCode: 'HMF-BDG',
    name: 'Round Pin Badge',
    category: 'Accessories',
    position: 7,
    price: 35,
    hasPackOption: true,
    packPrice: 470,
    packLabel: 'Pack of 10 (One of each 10 designs · Shipping included)',
    fabric: '58 mm round with safety pin',
    weight: 'Glossy finish',
    fit: '58 mm pin badge',
    description: 'Ten pin badges from the Music Festival artwork. Single (any design): ₹35 (add-on to any order), Pack of 10: ₹470 (one of each of the 10 designs, shipping included).',
    designs: [
      { name: 'Dance Floor', code: 'DANCE' },
      { name: 'Good Vibes', code: 'VIBES' },
      { name: 'Double Screen', code: 'PAIR' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'This Way to Kisama', code: 'KISAMA' },
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'Main Stage', code: 'STAGE' },
      { name: 'Fest This Way', code: 'SIGN' },
      { name: '#HMF', code: 'HEX' },
      { name: 'The Fun Starts Here', code: 'FUN' },
    ],
    colours: [
      { name: 'Glossy Pin', hex: '#E2E8F0' },
    ],
    sizes: ['58 mm'],
    stock: 200,
    isActive: true,
  },
  {
    productCode: 'HMF-STK',
    name: 'Die-cut Sticker',
    category: 'Accessories',
    position: 8,
    price: 15,
    hasPackOption: true,
    packPrice: 270,
    packLabel: 'Pack of 10 (One of each 10 designs · Shipping included)',
    fabric: 'Die-cut vinyl up to 3 × 3 in',
    weight: 'Waterproof vinyl',
    fit: 'Die-cut to shape with white border',
    description: 'Every sign from the Music Festival artwork, cut to shape. Single (any design): ₹15 (add-on to any order), Pack of 10: ₹270 (one of each of the 10 designs, shipping included).',
    designs: [
      { name: 'Dance Floor', code: 'DANCE' },
      { name: 'Good Vibes', code: 'VIBES' },
      { name: 'Double Screen', code: 'PAIR' },
      { name: "Don't Stop the Music", code: 'STOP' },
      { name: 'This Way to Kisama', code: 'KISAMA' },
      { name: 'Headliner', code: 'HEADLINER' },
      { name: 'Main Stage', code: 'STAGE' },
      { name: 'Fest This Way', code: 'SIGN' },
      { name: '#HMF', code: 'HEX' },
      { name: 'The Fun Starts Here', code: 'FUN' },
    ],
    colours: [
      { name: 'White Border', hex: '#FFFFFF' },
    ],
    sizes: ['Up to 3 × 3 in'],
    stock: 200,
    isActive: true,
  },
];

export const seedOfficialCatalog = async (req, res) => {
  try {
    const results = [];
    for (const item of OFFICIAL_CATALOG_ITEMS) {
      // Find existing item by productCode or create new
      const existing = await MerchItem.findOne({ productCode: item.productCode });
      if (existing) {
        // Update product specifications and options, preserving existing images and variant images
        existing.name = item.name;
        existing.category = item.category;
        existing.price = item.price;
        existing.fabric = item.fabric;
        existing.weight = item.weight;
        existing.fit = item.fit;
        existing.description = item.description;
        existing.designs = item.designs;
        existing.colours = item.colours;
        existing.sizes = item.sizes;
        existing.hasPackOption = item.hasPackOption;
        existing.packPrice = item.packPrice;
        existing.packLabel = item.packLabel;
        existing.position = item.position;
        existing.isActive = true;
        await existing.save();
        results.push(existing);
      } else {
        const created = await MerchItem.create(item);
        results.push(created);
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Official Hornbill Music Festival catalogue synced successfully',
      count: results.length,
      items: results,
    });
  } catch (err) {
    console.error('Failed to seed official catalogue:', err);
    return res.status(500).json({ message: 'Failed to seed official catalogue', error: err?.message });
  }
};

const fetchFromAhibi = async (pathWithQuery, options = {}) => {
  const baseUrls = [
    process.env.AHIBI_API_BASE_URL,
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5000'] : []),
    'https://www.ahibi.in',
  ].filter(Boolean).map((u) => u.replace(/\/+$/, ''));

  const uniqueBaseUrls = [...new Set(baseUrls)];
  let lastError = null;
  let lastStatus = null;

  for (const base of uniqueBaseUrls) {
    try {
      const url = `${base}/api/hornbill-merch${pathWithQuery}`;
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, data };
      }
      const errData = await res.json().catch(() => ({}));
      lastStatus = res.status;
      lastError = errData.message || `AHIBI returned ${res.status} (${url})`;
      // If AHIBI responded with a valid JSON 404/400 (e.g. Order not found), no need to overwrite with connection errors
      if (errData && typeof errData.success === 'boolean') {
        break;
      }
    } catch (err) {
      if (!lastStatus) {
        lastError = err?.message || 'Connection failed';
      }
    }
  }

  return { ok: false, status: lastStatus || 502, error: lastError || 'AHIBI endpoint not found' };
};

export const getAhibiMerchOrders = async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const path = `/orders${queryString ? `?${queryString}` : ''}`;
    const result = await fetchFromAhibi(path);

    if (!result.ok) {
      return res.status(200).json({
        success: true,
        data: { orders: [], pagination: { total: 0, pages: 0 } },
        warning: result.error,
      });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    console.error('Failed to proxy orders from AHIBI:', err);
    return res.status(200).json({
      success: true,
      data: { orders: [], pagination: { total: 0, pages: 0 } },
      warning: err?.message,
    });
  }
};

export const getAhibiMerchOrderStats = async (req, res) => {
  try {
    const result = await fetchFromAhibi('/orders/stats');
    if (!result.ok) {
      return res.status(200).json({
        success: true,
        data: { totalOrders: 0, paidOrders: 0, pendingOrders: 0, failedOrders: 0, totalRevenue: 0 },
        warning: result.error,
      });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error('Failed to proxy order stats from AHIBI:', err);
    return res.status(200).json({
      success: true,
      data: { totalOrders: 0, paidOrders: 0, pendingOrders: 0, failedOrders: 0, totalRevenue: 0 },
      warning: err?.message,
    });
  }
};

export const getAhibiMerchOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await fetchFromAhibi(`/orders/${encodeURIComponent(orderId)}`);
    if (!result.ok) {
      return res.status(404).json({ success: false, message: result.error });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error('Failed to proxy order details from AHIBI:', err);
    return res.status(500).json({ success: false, message: err?.message });
  }
};

export const getAhibiOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await fetchFromAhibi(`/track/${encodeURIComponent(orderId)}`);
    if (!result.ok) {
      return res.status(404).json({ success: false, message: result.error || 'Tracking details not found' });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error('Failed to proxy order tracking from AHIBI:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
};

export const updateAhibiOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await fetchFromAhibi(`/orders/${encodeURIComponent(orderId)}/tracking`, {
      method: 'PUT',
      body: req.body,
    });
    if (!result.ok) {
      return res.status(400).json({ success: false, message: result.error || 'Failed to update tracking' });
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error('Failed to proxy order tracking update to AHIBI:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
};
