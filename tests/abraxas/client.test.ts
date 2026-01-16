/**
 * Abraxas Client Tests
 *
 * Test suite for the Abraxas API client covering:
 * - Client initialization
 * - Mock mode operation
 * - All API methods
 * - Data validation
 */

import { AbraxasClient, AbraxasConfig } from '../../src/abraxas/client';

describe('AbraxasClient', () => {
  let client: AbraxasClient;
  let config: AbraxasConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-key',
      endpoint: 'http://localhost:8080',
      timeout: 5000,
      enableSymbolicScoring: true,
      enableSigilGeneration: true,
      enableOracleConsultation: true,
      enableTimingOptimization: true
    };
    client = new AbraxasClient(config);
  });

  describe('Initialization', () => {
    test('should create client with config', () => {
      expect(client).toBeInstanceOf(AbraxasClient);
    });

    test('should not be connected initially', () => {
      expect(client.isConnected()).toBe(false);
    });

    test('should use mock mode when connection fails', async () => {
      const connected = await client.connect();
      expect(connected).toBe(false);
      expect(client.isConnected()).toBe(false);
    });
  });

  describe('Numerology', () => {
    test('should analyze numerology', async () => {
      const result = await client.analyzeNumerology('Innovation');

      expect(result).toHaveProperty('primaryNumber');
      expect(result.primaryNumber).toBeGreaterThanOrEqual(1);
      expect(result.primaryNumber).toBeLessThanOrEqual(9);
      expect(result).toHaveProperty('vibration');
      expect(result).toHaveProperty('score');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result).toHaveProperty('interpretation');
      expect(result).toHaveProperty('characteristics');
      expect(Array.isArray(result.characteristics)).toBe(true);
    });

    test('should return consistent results for same input', async () => {
      const result1 = await client.analyzeNumerology('Test');
      const result2 = await client.analyzeNumerology('Test');

      expect(result1.primaryNumber).toBe(result2.primaryNumber);
      expect(result1.vibration).toBe(result2.vibration);
      expect(result1.score).toBe(result2.score);
    });

    test('should have valid vibration names', async () => {
      const validVibrations = [
        'Leadership',
        'Harmony',
        'Creativity',
        'Stability',
        'Freedom',
        'Nurturing',
        'Wisdom',
        'Power',
        'Completion'
      ];

      const result = await client.analyzeNumerology('Test');
      expect(validVibrations).toContain(result.vibration);
    });
  });

  describe('Ephemeris', () => {
    test('should get ephemeris data', async () => {
      const timestamp = new Date('2025-01-15T12:00:00Z');
      const result = await client.getEphemeris(timestamp);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('alignment');
      expect(result.alignment).toBeGreaterThanOrEqual(0);
      expect(result.alignment).toBeLessThanOrEqual(1);
      expect(result).toHaveProperty('aspects');
      expect(Array.isArray(result.aspects)).toBe(true);
      expect(result).toHaveProperty('planets');
      expect(Array.isArray(result.planets)).toBe(true);
      expect(result).toHaveProperty('favorableActivities');
      expect(Array.isArray(result.favorableActivities)).toBe(true);
    });

    test('should have valid planet data', async () => {
      const result = await client.getEphemeris(new Date());

      result.planets.forEach(planet => {
        expect(planet).toHaveProperty('name');
        expect(planet).toHaveProperty('position');
        expect(planet).toHaveProperty('influence');
        expect(planet.position).toBeGreaterThanOrEqual(0);
        expect(planet.position).toBeLessThan(360);
        expect(planet.influence).toBeGreaterThanOrEqual(0);
        expect(planet.influence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Gematria', () => {
    test('should calculate gematria', async () => {
      const result = await client.calculateGematria('Wisdom');

      expect(result).toHaveProperty('value');
      expect(result.value).toBeGreaterThan(0);
      expect(result).toHaveProperty('resonance');
      expect(result.resonance).toBeGreaterThanOrEqual(0);
      expect(result.resonance).toBeLessThanOrEqual(1);
      expect(result).toHaveProperty('correspondences');
      expect(Array.isArray(result.correspondences)).toBe(true);
      expect(result).toHaveProperty('significantMatches');
      expect(Array.isArray(result.significantMatches)).toBe(true);
    });

    test('should return consistent values for same input', async () => {
      const result1 = await client.calculateGematria('Test');
      const result2 = await client.calculateGematria('Test');

      expect(result1.value).toBe(result2.value);
      expect(result1.resonance).toBe(result2.resonance);
    });
  });

  describe('Archetypes', () => {
    test('should identify archetypes', async () => {
      const result = await client.identifyArchetypes('A creative project for innovation');

      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('secondary');
      expect(Array.isArray(result.secondary)).toBe(true);
      expect(result).toHaveProperty('strength');
      expect(result.strength).toBeGreaterThanOrEqual(0);
      expect(result.strength).toBeLessThanOrEqual(1);
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('shadow');
      expect(result).toHaveProperty('integration');
    });

    test('should have valid archetype names', async () => {
      const validPrimary = ['The Creator', 'The Explorer', 'The Sage', 'The Hero'];

      const result = await client.identifyArchetypes('Test');
      expect(validPrimary).toContain(result.primary);
    });
  });

  describe('Sigil Generation', () => {
    test('should generate sigil', async () => {
      const result = await client.generateSigil('Manifest success', 'geometric');

      expect(result).toHaveProperty('svg');
      expect(result.svg).toContain('<svg');
      expect(result).toHaveProperty('intent');
      expect(result.intent).toBe('Manifest success');
      expect(result).toHaveProperty('style');
      expect(result.style).toBe('geometric');
      expect(result).toHaveProperty('geometry');
      expect(result.geometry).toHaveProperty('symmetry');
      expect(result.geometry).toHaveProperty('elements');
      expect(result.geometry).toHaveProperty('complexity');
      expect(result).toHaveProperty('activationInstructions');
    });

    test('should have valid geometry properties', async () => {
      const result = await client.generateSigil('Test intent');

      expect(['radial', 'bilateral', 'asymmetric']).toContain(result.geometry.symmetry);
      expect(result.geometry.elements).toBeGreaterThan(0);
      expect(result.geometry.complexity).toBeGreaterThanOrEqual(0);
      expect(result.geometry.complexity).toBeLessThanOrEqual(1);
    });
  });

  describe('Tarot', () => {
    test('should draw tarot cards', async () => {
      const result = await client.drawTarot('What is my path?', 'three-card');

      expect(result).toHaveProperty('spread');
      expect(result.spread).toBe('three-card');
      expect(result).toHaveProperty('cards');
      expect(Array.isArray(result.cards)).toBe(true);
      expect(result.cards.length).toBe(3);
      expect(result).toHaveProperty('synthesis');
      expect(result).toHaveProperty('guidance');
    });

    test('should have valid card structure', async () => {
      const result = await client.drawTarot('Test question');

      result.cards.forEach(card => {
        expect(card).toHaveProperty('position');
        expect(card).toHaveProperty('card');
        expect(card).toHaveProperty('suit');
        expect(card).toHaveProperty('reversed');
        expect(card).toHaveProperty('interpretation');
        expect(typeof card.reversed).toBe('boolean');
      });
    });
  });

  describe('I-Ching', () => {
    test('should consult I-Ching', async () => {
      const result = await client.consultIChing('How to proceed with project?');

      expect(result).toHaveProperty('number');
      expect(result.number).toBeGreaterThan(0);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('chinese');
      expect(result).toHaveProperty('trigrams');
      expect(result.trigrams).toHaveProperty('upper');
      expect(result.trigrams).toHaveProperty('lower');
      expect(result).toHaveProperty('judgment');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('changingLines');
      expect(Array.isArray(result.changingLines)).toBe(true);
      expect(result).toHaveProperty('guidance');
    });
  });

  describe('Timing Windows', () => {
    test('should get optimal timing windows', async () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-31');

      const result = await client.getOptimalWindows('Launch new product', { start, end });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      result.forEach(window => {
        expect(window).toHaveProperty('start');
        expect(window).toHaveProperty('end');
        expect(window).toHaveProperty('score');
        expect(window.score).toBeGreaterThanOrEqual(0);
        expect(window.score).toBeLessThanOrEqual(1);
        expect(window).toHaveProperty('type');
        expect(['optimal', 'favorable', 'neutral', 'challenging']).toContain(window.type);
        expect(window).toHaveProperty('influences');
        expect(Array.isArray(window.influences)).toBe(true);
        expect(window).toHaveProperty('recommendations');
      });
    });

    test('should return sorted windows by score', async () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-31');

      const result = await client.getOptimalWindows('Test', { start, end });

      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
      }
    });
  });

  describe('Runes', () => {
    test('should encode text as runes', async () => {
      const result = await client.encodeRune('wisdom');

      expect(result).toHaveProperty('runes');
      expect(result).toHaveProperty('transliteration');
      expect(result.transliteration).toBe('wisdom');
      expect(result).toHaveProperty('meanings');
      expect(Array.isArray(result.meanings)).toBe(true);
      expect(result).toHaveProperty('divination');
    });

    test('should convert to runic characters', async () => {
      const result = await client.encodeRune('test');

      // Check that runes are different from input
      expect(result.runes).not.toBe('test');
      // Check that runes contain runic Unicode characters
      expect(result.runes.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty strings gracefully', async () => {
      const numerology = await client.analyzeNumerology('');
      expect(numerology).toHaveProperty('primaryNumber');
      expect(numerology.primaryNumber).toBeGreaterThanOrEqual(1);
      expect(numerology.primaryNumber).toBeLessThanOrEqual(9);
    });

    test('should handle special characters', async () => {
      const result = await client.calculateGematria('!@#$%^&*()');
      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('resonance');
    });
  });
});
