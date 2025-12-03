import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { JewelryModel } from '../3d/JewelryModel';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

export const Showcase: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { products, openConfigurator } = useShop();

  return (
    <section id="collection" className="py-24 bg-luxury-black relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-20">
            <span className="text-gold-600 font-serif italic mb-2">The Collection</span>
            <h2 className="font-display text-4xl text-white text-center">Curated Brilliance</h2>
            <div className="w-24 h-[1px] bg-gold-600 mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isActive={activeId === product.id}
              onInteraction={(state) => setActiveId(state ? product.id : null)}
              onConfigure={() => openConfigurator(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onInteraction: (active: boolean) => void;
  onConfigure: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isActive, onInteraction, onConfigure }) => {
  return (
    <div 
      className="group relative h-[400px] w-full bg-zinc-900/50 border border-zinc-800 hover:border-gold-600/50 transition-all duration-500 overflow-hidden flex flex-col"
      onMouseEnter={() => onInteraction(true)}
      onMouseLeave={() => onInteraction(false)}
    >
      {/* 3D Viewport */}
      <div className="flex-grow relative w-full h-full cursor-grab active:cursor-grabbing">
         <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <spotLight position={[5, 5, 5]} intensity={1.5} />
            <JewelryModel 
                metalColor={product.metalColor} 
                gemColor={product.gemColor} 
                modelUrl={product.modelUrl}
                hovered={isActive}
            />
         </Canvas>
      </div>

      {/* Info Overlay - slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-display text-lg text-white mb-1">{product.name}</h3>
        <p className="font-serif text-gold-400 mb-2">${product.price.toLocaleString()}</p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-col gap-2">
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                {product.description}
            </p>
            <button 
                onClick={onConfigure}
                className="text-xs text-white uppercase tracking-widest border-b border-gold-600 self-start mt-2 pb-1 hover:text-gold-400 transition-colors"
            >
                Configure
            </button>
        </div>
      </div>
    </div>
  );
};