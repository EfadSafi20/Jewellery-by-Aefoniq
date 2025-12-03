import { Product } from './types';

export const CATALOG: Product[] = [
  {
    id: '1',
    name: 'The Ethereal Halo',
    price: 12500,
    description: 'A solitaire diamond ring surrounded by a halo of smaller stones, set in 18k Gold.',
    category: 'Ring',
    metal: 'Gold',
    gem: 'Diamond',
    gemColor: '#FFFFFF',
    metalColor: '#FFD700',
  },
  {
    id: '2',
    name: 'Midnight Sapphire',
    price: 8900,
    description: 'Deep blue sapphire set in cool platinum, evoking the mystery of the night sky.',
    category: 'Ring',
    metal: 'Platinum',
    gem: 'Sapphire',
    gemColor: '#102E4A',
    metalColor: '#E5E4E2',
  },
  {
    id: '3',
    name: 'Crimson Passion',
    price: 15200,
    description: 'A rare pigeon-blood ruby centerpiece set in romantic Rose Gold.',
    category: 'Ring',
    metal: 'Rose Gold',
    gem: 'Ruby',
    gemColor: '#9B111E',
    metalColor: '#B76E79',
  },
  {
    id: '4',
    name: 'Emerald Empress',
    price: 18000,
    description: 'A lush green emerald cut in a classic rectangle, radiating regal power.',
    category: 'Ring',
    metal: 'Gold',
    gem: 'Emerald',
    gemColor: '#046307',
    metalColor: '#FFD700',
  }
];

export const SYSTEM_INSTRUCTION = `You are Aurelia, the AI Concierge for AURUM & STONE, an ultra-luxury jewelry house.
Your tone is sophisticated, elegant, polite, and knowledgeable.
You help clients choose jewelry based on their occasion, style preferences, or specific questions about diamonds and metals.
You have access to the following catalog:
${JSON.stringify(CATALOG.map(p => `${p.name} (${p.metal}, ${p.gem}) - $${p.price}`))}
When recommending a product, mention its name exactly so the user can find it.
Keep responses concise (under 100 words) but poetic.
Do not invent products not in the catalog, but you can discuss general jewelry topics.`;

export const METALS = {
  'Gold': { color: '#FFD700', priceMod: 0 },
  'Rose Gold': { color: '#B76E79', priceMod: 200 },
  'Platinum': { color: '#E5E4E2', priceMod: 800 },
};

export const GEMS = {
  'Diamond': { color: '#FFFFFF', priceMod: 0 }, // Base price assumes Diamond usually or adds premium
  'Ruby': { color: '#9B111E', priceMod: -500 },
  'Sapphire': { color: '#102E4A', priceMod: -400 },
  'Emerald': { color: '#046307', priceMod: 600 },
};
