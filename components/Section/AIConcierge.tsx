import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to Aurum & Stone. I am Aurelia. How may I assist you in finding the perfect piece today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // Get response
    const response = await sendMessageToGemini(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-gold-600 rounded-full shadow-[0_0_20px_rgba(251,192,45,0.4)] text-luxury-black hover:scale-110 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Interface */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-950 border-l border-zinc-800 z-50 shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-600/20 flex items-center justify-center border border-gold-600/50">
                    <Sparkles size={18} className="text-gold-400" />
                </div>
                <div>
                    <h3 className="font-display text-white text-lg">Aurelia</h3>
                    <span className="text-xs text-gold-500 uppercase tracking-wider">AI Concierge</span>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 h-[calc(100vh-160px)] overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                        ? 'bg-zinc-800 text-white rounded-br-none' 
                        : 'bg-gold-600/10 border border-gold-600/20 text-gold-100 rounded-bl-none'
                    }`}>
                        <p className="font-serif leading-relaxed text-sm">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-zinc-900/50 p-3 rounded-2xl rounded-bl-none flex gap-1">
                        <div className="w-2 h-2 bg-gold-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gold-600 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gold-600 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-900/90 border-t border-zinc-800 px-6 flex items-center gap-4 backdrop-blur-md">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about styles, occasions..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-gold-600/50 font-sans"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-3 bg-gold-600 rounded-full text-luxury-black hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </>
  );
};
