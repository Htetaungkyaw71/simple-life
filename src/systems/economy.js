import { CROPS } from '../data/crops.js';
export function buySeed(s) {
  const d = CROPS.tomato;
  if (s.money < d.seedPrice) return 'Not enough coins. Each seed costs 10.';
  if (s.inventory.seed >= 9999) return 'Seed bag is full.';
  s.money -= d.seedPrice; s.inventory.seed++; return 'One tomato seed tucked into your bag.';
}
export function sellProduce(s) {
  const count = s.inventory.tomato;
  if (!count) return 'Bring your harvested tomatoes here to sell.';
  const earned = count * CROPS.tomato.sellPrice;
  s.inventory.tomato = 0; s.money += earned; s.sold += count;
  return `Sold ${count} tomatoes for ${earned} coins. Your little farm is growing!`;
}
