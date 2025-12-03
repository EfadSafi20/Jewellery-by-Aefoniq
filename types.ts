export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Ring' | 'Necklace' | 'Earring';
  metal: 'Gold' | 'Rose Gold' | 'Platinum';
  gem: 'Diamond' | 'Ruby' | 'Sapphire' | 'Emerald';
  gemColor: string; // Hex for 3D model
  metalColor: string; // Hex for 3D model
  modelUrl?: string; // Optional: URL to the .glb file
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for the item in cart (allows duplicates with different configs)
}

export interface ShopContextType {
  products: Product[]; // Changed from just 'cart' to include the full catalog list
  cart: CartItem[];
  addToCart: (product: Product) => void;
  addProduct: (product: Product) => void; // Admin function
  removeProduct: (id: string) => void; // Admin function
  isConfiguratorOpen: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (isOpen: boolean) => void;
  activeProduct: Product | null;
  openConfigurator: (product: Product) => void;
  closeConfigurator: () => void;
}