import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { JewelryModel } from '../3d/JewelryModel';
import { Button } from '../UI/Button';
import { ArrowDown } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Hero: React.FC = () => {
  const { setIsAdminOpen } = useShop();

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-luxury-black to-zinc-900 overflow-hidden">
      
      {/* Text Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-gold-200 tracking-[0.3em] text-sm mb-4 animate-fade-in-up">EST. 1924</h2>
        <h1 className="font-display text-5xl md:text-8xl text-white text-center mb-6 tracking-tight drop-shadow-2xl">
          AURUM <span className="text-gold-500">&</span> STONE
        </h1>
        <p className="font-serif text-zinc-400 text-lg md:text-xl max-w-lg text-center mb-10 leading-relaxed">
          Where timeless elegance meets modern artistry. 
          <br/>Experience the brilliance of the impossible.
        </p>
        <div className="pointer-events-auto flex flex-col md:flex-row gap-6 items-center">
             <Button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                View Collection
             </Button>
             <Button variant="outline" onClick={() => setIsAdminOpen(true)}>
                Admin Panel
             </Button>
        </div>
      </div>

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={null}>
             <JewelryModel metalColor="#FFD700" gemColor="#FFFFFF" scale={1.2} />
             <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gold-600/50">
        <ArrowDown size={24} />
      </div>
    </div>
  );
};