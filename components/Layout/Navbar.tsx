import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useShop();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-luxury-black/90 backdrop-blur-md py-4 border-b border-zinc-800' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Left Menu */}
        <div className="flex items-center gap-6">
            <button className="text-white hover:text-gold-400 transition-colors">
                <Menu size={24} strokeWidth={1} />
            </button>
            <div className="hidden md:flex gap-6 text-xs tracking-widest text-zinc-300">
                <a href="#" className="hover:text-white transition-colors">RINGS</a>
                <a href="#" className="hover:text-white transition-colors">NECKLACES</a>
                <a href="#" className="hover:text-white transition-colors">BESPOKE</a>
            </div>
        </div>

        {/* Logo */}
        <div className={`absolute left-1/2 -translate-x-1/2 font-display text-2xl text-white tracking-widest transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
            AURUM
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-white">
            <button className="hover:text-gold-400 transition-colors">
                <Search size={22} strokeWidth={1} />
            </button>
            <button className="hover:text-gold-400 transition-colors relative group">
                <ShoppingBag size={22} strokeWidth={1} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-600 rounded-full text-[8px] flex items-center justify-center text-black font-bold animate-pulse">
                    {cart.length}
                  </span>
                )}
                {/* Mini Cart Preview */}
                <div className="absolute right-0 top-full mt-4 w-64 bg-zinc-900 border border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl p-4">
                  <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2">Shopping Bag</h4>
                  {cart.length === 0 ? (
                    <p className="text-zinc-500 text-sm py-4 text-center italic">Your bag is empty.</p>
                  ) : (
                    <ul className="space-y-3">
                      {cart.map((item) => (
                        <li key={item.cartId} className="flex justify-between items-start text-sm">
                          <div>
                            <p className="text-white font-display">{item.name}</p>
                            <p className="text-xs text-zinc-500">{item.metal} / {item.gem}</p>
                          </div>
                        </li>
                      ))}
                      <div className="pt-3 border-t border-zinc-800 mt-2">
                        <button className="w-full py-2 bg-gold-600 text-black text-xs uppercase tracking-widest hover:bg-gold-500">Checkout</button>
                      </div>
                    </ul>
                  )}
                </div>
            </button>
        </div>
      </div>
    </nav>
  );
};
