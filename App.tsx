import React from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Section/Hero';
import { Showcase } from './components/Section/Showcase';
import { AIConcierge } from './components/Section/AIConcierge';
import { ShopProvider, useShop } from './context/ShopContext';
import { Configurator } from './components/Overlay/Configurator';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Lock } from 'lucide-react';

// Sub-component to access admin context safely
const AdminTrigger = () => {
    const { setIsAdminOpen } = useShop();
    return (
        <button 
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-gold-600 transition-colors flex items-center gap-2"
        >
            <Lock size={12} /> <span className="text-[10px] uppercase tracking-widest">Staff Access</span>
        </button>
    );
}

function App() {
  return (
    <ShopProvider>
        <div className="min-h-screen bg-luxury-black text-zinc-100 font-sans selection:bg-gold-600 selection:text-black">
          <Navbar />
          
          <main>
            <Hero />
            <Showcase />
            
            {/* About Section */}
            <section className="py-24 bg-zinc-900 border-t border-zinc-800">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[500px] w-full bg-[url('https://images.unsplash.com/photo-1573408301185-a1d31e66c547?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000">
                        <div className="absolute inset-0 border border-gold-600/30 m-4"></div>
                    </div>
                    <div className="space-y-8">
                        <span className="text-gold-600 font-serif italic">Our Heritage</span>
                        <h2 className="font-display text-4xl text-white leading-tight">Crafting Eternity Since 1924</h2>
                        <p className="font-serif text-zinc-400 leading-relaxed">
                            Every piece at Aurum & Stone is a testament to meticulous craftsmanship. We source only the rarest gems from conflict-free zones, ensuring that your symbol of luxury is also a symbol of integrity.
                        </p>
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
                            <div>
                                <h4 className="font-display text-2xl text-gold-200">24k</h4>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Pure Gold</p>
                            </div>
                            <div>
                                <h4 className="font-display text-2xl text-gold-200">VVS1</h4>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Clarity</p>
                            </div>
                            <div>
                                <h4 className="font-display text-2xl text-gold-200">100%</h4>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Handmade</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-zinc-900">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                    <div className="font-display text-xl text-zinc-400 mb-4 md:mb-0">AURUM & STONE</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gold-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gold-600 transition-colors">Terms</a>
                        <AdminTrigger />
                    </div>
                    <div className="mt-4 md:mt-0 font-serif italic">
                        © 2024 Luxury Digital
                    </div>
                </div>
            </footer>
          </main>

          <Configurator />
          <AdminPanel />
          <AIConcierge />
        </div>
    </ShopProvider>
  );
}

export default App;