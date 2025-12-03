import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { X, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { JewelryModel } from '../3d/JewelryModel';
import { METALS, GEMS } from '../../constants';
import { Button } from '../UI/Button';
import { Product } from '../../types';

export const Configurator: React.FC = () => {
  const { isConfiguratorOpen, activeProduct, closeConfigurator, addToCart } = useShop();
  
  // Local configuration state
  const [config, setConfig] = useState<Product | null>(null);

  // Sync local state when active product changes
  useEffect(() => {
    if (activeProduct) {
      setConfig({ ...activeProduct });
    }
  }, [activeProduct]);

  if (!activeProduct || !config) return null;

  const handleMetalChange = (metal: keyof typeof METALS) => {
    setConfig(prev => prev ? ({
        ...prev,
        metal,
        metalColor: METALS[metal].color
    }) : null);
  };

  const handleGemChange = (gem: keyof typeof GEMS) => {
    setConfig(prev => prev ? ({
        ...prev,
        gem,
        gemColor: GEMS[gem].color
    }) : null);
  };

  const handleAddToCart = () => {
    if (config) {
        addToCart(config);
        closeConfigurator();
    }
  };

  // Calculate dynamic price based on modifiers
  const currentPrice = activeProduct.price + 
    METALS[config.metal].priceMod + 
    GEMS[config.gem].priceMod - 
    METALS[activeProduct.metal].priceMod - // subtract base modifiers to avoid double counting if catalog has base prices
    GEMS[activeProduct.gem].priceMod;


  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isConfiguratorOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md"
        onClick={closeConfigurator}
      ></div>

      {/* Modal Container */}
      <div className={`relative w-full max-w-6xl h-[90vh] bg-zinc-900 grid grid-cols-1 lg:grid-cols-3 shadow-2xl border border-gold-600/30 overflow-hidden transform transition-transform duration-700 ${isConfiguratorOpen ? 'translate-y-0' : 'translate-y-20'}`}>
        
        {/* Close Button */}
        <button 
            onClick={closeConfigurator}
            className="absolute top-6 right-6 z-20 text-zinc-500 hover:text-white transition-colors"
        >
            <X size={32} />
        </button>

        {/* 3D Viewport (Left - Spans 2 cols) */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-zinc-800 to-black h-[50vh] lg:h-full">
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <group position={[0, -0.5, 0]}>
                    <JewelryModel 
                        metalColor={config.metalColor} 
                        gemColor={config.gemColor} 
                        modelUrl={config.modelUrl}
                        scale={1.5}
                        hovered={false} // Disable auto-hover tilt in configurator
                    />
                </group>
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                <Environment preset="city" />
                <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
            <div className="absolute bottom-8 left-8 text-zinc-500 text-xs tracking-widest pointer-events-none">
                DRAG TO ROTATE
            </div>
        </div>

        {/* Controls (Right - Spans 1 col) */}
        <div className="bg-zinc-950 p-8 flex flex-col h-full overflow-y-auto">
            <div className="mb-8">
                <span className="text-gold-600 font-serif italic text-sm">Bespoke Configuration</span>
                <h2 className="font-display text-3xl text-white mt-2">{config.name}</h2>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed">{activeProduct.description}</p>
            </div>

            <div className="space-y-8 flex-1">
                {/* Metal Selection */}
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Precious Metal</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(METALS) as Array<keyof typeof METALS>).map((metal) => (
                            <button
                                key={metal}
                                onClick={() => handleMetalChange(metal)}
                                className={`h-12 border transition-all duration-300 flex items-center justify-center text-xs font-serif
                                    ${config.metal === metal 
                                        ? 'border-gold-600 bg-gold-600/10 text-gold-400' 
                                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                    }`}
                            >
                                {metal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gem Selection */}
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Center Stone</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(GEMS) as Array<keyof typeof GEMS>).map((gem) => (
                            <button
                                key={gem}
                                onClick={() => handleGemChange(gem)}
                                className={`p-3 border transition-all duration-300 flex items-center gap-3
                                    ${config.gem === gem 
                                        ? 'border-gold-600 bg-gold-600/10' 
                                        : 'border-zinc-800 hover:border-zinc-600'
                                    }`}
                            >
                                <div 
                                    className="w-4 h-4 rounded-full shadow-inner" 
                                    style={{ backgroundColor: GEMS[gem].color }}
                                ></div>
                                <span className={`text-sm font-serif ${config.gem === gem ? 'text-gold-400' : 'text-zinc-400'}`}>
                                    {gem}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="pt-8 mt-8 border-t border-zinc-900">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-zinc-500 font-serif">Total Estimation</span>
                    <span className="text-2xl font-display text-white">${currentPrice.toLocaleString()}</span>
                </div>
                <Button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2">
                    Add to Bag
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};