export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviews: number;
  stock: number;
  isPopular?: boolean;
  isNew?: boolean;
  discount?: number;
}

export const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'smartwatches', name: 'Smartwatches', icon: '⌚' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'accessories', name: 'Accessories', icon: '🎧' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
];

export const brands = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 'Microsoft', 'ASUS', 'HP', 'Dell'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    originalPrice: 1299,
    category: 'smartphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop'
    ],
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback',
      'Water Resistance': 'IP68'
    },
    features: [
      'Titanium design',
      'Action Button',
      'Advanced camera system',
      'USB-C connectivity',
      '5G capable'
    ],
    rating: 4.8,
    reviews: 2847,
    stock: 15,
    isPopular: true,
    discount: 8
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2499,
    category: 'laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'
    ],
    description: 'Supercharged by M3 Max chip. Built for Apple Intelligence. Liquid Retina XDR display.',
    specifications: {
      'Chip': 'Apple M3 Max',
      'Memory': '36GB unified memory',
      'Storage': '1TB SSD',
      'Display': '16.2" Liquid Retina XDR',
      'Battery': 'Up to 22 hours',
      'Ports': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3'
    },
    features: [
      'M3 Max chip performance',
      'Liquid Retina XDR display',
      'Advanced thermal design',
      'Studio-quality mics',
      'Magic Keyboard with Touch ID'
    ],
    rating: 4.9,
    reviews: 1239,
    stock: 8,
    isNew: true
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299,
    category: 'smartphones',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop'
    ],
    description: 'AI-powered smartphone with S Pen, 200MP camera, and titanium build.',
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Storage': '512GB',
      'Camera': '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
      'Battery': '5000mAh',
      'S Pen': 'Built-in'
    },
    features: [
      'Built-in S Pen',
      'AI photo editing',
      'Titanium frame',
      '100x Space Zoom',
      'All-day battery'
    ],
    rating: 4.7,
    reviews: 1856,
    stock: 22,
    isPopular: true
  },
  {
    id: '4',
    name: 'Apple Watch Series 9',
    price: 429,
    category: 'smartwatches',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop'
    ],
    description: 'Advanced health features, bright Always-On Retina display, and carbon neutral.',
    specifications: {
      'Display': '45mm Always-On Retina',
      'Chip': 'S9 SiP',
      'Storage': '64GB',
      'Battery': 'Up to 18 hours',
      'Water Resistance': '50 meters',
      'Connectivity': 'GPS + Cellular'
    },
    features: [
      'Double Tap gesture',
      'Precision Finding',
      'Advanced health sensors',
      'Always-On Retina display',
      'Carbon neutral'
    ],
    rating: 4.6,
    reviews: 3421,
    stock: 35,
    isNew: true
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    price: 1099,
    category: 'tablets',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'
    ],
    description: 'Ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    specifications: {
      'Display': '12.9" Liquid Retina XDR',
      'Chip': 'Apple M2',
      'Storage': '256GB',
      'Camera': '12MP Wide + 10MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'Connectivity': 'Wi-Fi 6E + 5G'
    },
    features: [
      'M2 chip performance',
      'Liquid Retina XDR display',
      'Apple Pencil (2nd gen) support',
      'Magic Keyboard compatible',
      'Professional cameras'
    ],
    rating: 4.8,
    reviews: 892,
    stock: 18
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    price: 399,
    originalPrice: 429,
    category: 'accessories',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'
    ],
    description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
    specifications: {
      'Driver': '30mm',
      'Frequency Response': '4Hz-40,000Hz',
      'Battery': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2, NFC',
      'Weight': '250g',
      'Microphones': '8 microphones for noise canceling'
    },
    features: [
      'Industry-leading noise canceling',
      '30-hour battery life',
      'Quick Charge (3 min = 3 hours)',
      'Speak-to-Chat technology',
      'Multipoint connection'
    ],
    rating: 4.7,
    reviews: 2156,
    stock: 42,
    isPopular: true,
    discount: 7
  },
  {
    id: '7',
    name: 'Dell XPS 13',
    price: 1299,
    category: 'laptops',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop'
    ],
    description: 'Ultra-portable laptop with stunning InfinityEdge display and premium design.',
    specifications: {
      'Processor': 'Intel Core i7-1360P',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'Display': '13.4" FHD+ InfinityEdge',
      'Graphics': 'Intel Iris Xe',
      'Battery': 'Up to 12 hours'
    },
    features: [
      'InfinityEdge display',
      'Premium materials',
      'Thunderbolt 4 ports',
      'Backlit keyboard',
      'Windows Hello'
    ],
    rating: 4.5,
    reviews: 756,
    stock: 12
  },
  {
    id: '8',
    name: 'Xbox Series X',
    price: 499,
    category: 'gaming',
    brand: 'Microsoft',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop'
    ],
    description: 'Most powerful Xbox ever with 4K gaming, Quick Resume, and Game Pass.',
    specifications: {
      'CPU': 'Custom Zen 2 8-core',
      'GPU': 'Custom RDNA 2',
      'Memory': '16GB GDDR6',
      'Storage': '1TB NVMe SSD',
      'Optical Drive': '4K UHD Blu-ray',
      'Resolution': 'Up to 8K'
    },
    features: [
      '4K gaming at 60fps',
      'Quick Resume',
      'Smart Delivery',
      'Xbox Game Pass',
      'Backward compatibility'
    ],
    rating: 4.8,
    reviews: 3247,
    stock: 25,
    isPopular: true
  },
  {
    id: '9',
    name: 'Google Pixel 8 Pro',
    price: 999,
    category: 'smartphones',
    brand: 'Google',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop'
    ],
    description: 'AI-powered photography, pure Android experience, and 7 years of updates.',
    specifications: {
      'Display': '6.7" LTPO OLED',
      'Processor': 'Google Tensor G3',
      'Storage': '256GB',
      'Camera': '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
      'Battery': '5050mAh',
      'OS': 'Android 14'
    },
    features: [
      'Magic Eraser',
      'Best Take',
      'Night Sight',
      '7 years of updates',
      'Titan M security'
    ],
    rating: 4.6,
    reviews: 1432,
    stock: 29
  },
  {
    id: '10',
    name: 'Samsung Galaxy Tab S9 Ultra',
    price: 1199,
    category: 'tablets',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop'
    ],
    description: 'Ultra-large 14.6" display, S Pen included, perfect for creativity and productivity.',
    specifications: {
      'Display': '14.6" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 2',
      'Memory': '12GB RAM',
      'Storage': '256GB',
      'S Pen': 'Included',
      'Battery': '11200mAh'
    },
    features: [
      'Largest Galaxy Tab display',
      'S Pen included',
      'DeX mode',
      'IP68 water resistance',
      'Quad speakers'
    ],
    rating: 4.7,
    reviews: 543,
    stock: 14,
    isNew: true
  }
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getPopularProducts = () => {
  return products.filter(product => product.isPopular);
};

export const getNewProducts = () => {
  return products.filter(product => product.isNew);
};

export const searchProducts = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};