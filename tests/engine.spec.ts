import { test, expect } from '@playwright/test';
import { getTwinPerfumeRecommendations, getQuizRecommendations } from '../src/lib/recommendation-engine';
import perfumesData from '../src/data/perfumes.json';
import { Perfume } from '../src/types/perfume';

test.describe('Recommendation Engine Mathematical & Logic Unit Tests', () => {
  const perfumes = perfumesData as Perfume[];

  test('Single perfume recommendation calculates high score and reasons', () => {
    const target = perfumes[0]; // e.g. Afnan 9 PM
    const results = getTwinPerfumeRecommendations(perfumes, [target], 6);

    expect(results.length).toBe(6);
    expect(results[0].matchScore).toBeGreaterThanOrEqual(60);
    expect(results[0].reasons.length).toBeGreaterThanOrEqual(1);
    // Should not recommend the target perfume itself
    expect(results.some(r => r.perfume.id === target.id)).toBe(false);
  });

  test('Dual blend perfume recommendation fuses notes and returns top matches', () => {
    const p1 = perfumes[0];
    const p2 = perfumes[1];
    const results = getTwinPerfumeRecommendations(perfumes, [p1, p2], 6);

    expect(results.length).toBe(6);
    expect(results[0].matchScore).toBeGreaterThanOrEqual(55);
    // Neither p1 nor p2 should be in the recommendations
    expect(results.some(r => r.perfume.id === p1.id || r.perfume.id === p2.id)).toBe(false);
  });

  test('Quiz Sommelier filters strictly according to user preferences', () => {
    const results = getQuizRecommendations(perfumes, {
      gender: 'Hombre',
      family: 'Amaderada',
      budget: 'Económico (< $40.000)'
    }, 4);

    expect(results.length).toBeGreaterThan(0);
    results.forEach(p => {
      expect(['Hombre', 'Unisex']).toContain(p.gender);
      expect(p.family).toBe('Amaderada');
      expect(p.price).toBeLessThan(40000);
    });
  });

  test('Empty selection gracefully returns empty recommendations', () => {
    const results = getTwinPerfumeRecommendations(perfumes, [], 6);
    expect(results).toEqual([]);
  });
});
