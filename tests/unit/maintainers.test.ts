import { describe, expect, it } from 'vitest';
import { tradePresentation } from '@/lib/maintainers';

describe('tradePresentation', () => {
  it.each([
    ['Plumber', { colour: 'cyan', icon: 'droplets' }],
    ['Senior Electrician', { colour: 'amber', icon: 'zap' }],
    ['HVAC Technician', { colour: 'sky', icon: 'wind' }],
    ['Air Conditioning Engineer', { colour: 'sky', icon: 'wind' }],
    ['Cleaning Supervisor', { colour: 'violet', icon: 'sparkles' }],
    ['Lift Technician', { colour: 'indigo', icon: 'settings' }],
    ['Security Officer', { colour: 'emerald', icon: 'shield' }],
    ['Carpenter', { colour: 'slate', icon: 'wrench' }],
  ])('assigns a uniform presentation to %s', (trade, expected) => {
    expect(tradePresentation(trade)).toEqual(expected);
  });
});
