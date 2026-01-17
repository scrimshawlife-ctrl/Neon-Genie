/**
 * Elder Futhark Rune System
 *
 * Complete Elder Futhark rune system with meanings, divination,
 * and integration with the Neon Genie ideation engine.
 *
 * The Elder Futhark consists of 24 runes organized into three aetts (families).
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Rune {
  name: string;
  character: string;
  phoneme: string;
  meaning: string;
  keywords: string[];
  upright: {
    interpretation: string;
    qualities: string[];
  };
  reversed: {
    interpretation: string;
    qualities: string[];
  };
  aett: 'Freya' | 'Heimdall' | 'Tyr';
  element?: 'fire' | 'water' | 'air' | 'earth' | 'ice';
  associations: string[];
}

export interface RuneCast {
  runes: DrawnRune[];
  spread: string;
  question?: string;
  interpretation: string;
  guidance: string;
  energies: {
    dominant: string[];
    supportive: string[];
    challenging: string[];
  };
}

export interface DrawnRune {
  rune: Rune;
  position: string;
  reversed: boolean;
  interpretation: string;
}

export interface RuneReading {
  primary: Rune;
  secondary: Rune[];
  message: string;
  action: string;
  warning?: string;
}

// ============================================================================
// Elder Futhark Rune Definitions
// ============================================================================

export const ELDER_FUTHARK: Rune[] = [
  // Freya's Aett (First Eight)
  {
    name: 'Fehu',
    character: 'ᚠ',
    phoneme: 'F',
    meaning: 'Cattle, Wealth',
    keywords: ['abundance', 'prosperity', 'success', 'energy'],
    upright: {
      interpretation: 'Material and spiritual abundance, success, energy flowing freely',
      qualities: ['prosperity', 'fulfillment', 'mobility', 'manifestation']
    },
    reversed: {
      interpretation: 'Loss, frustration, delays, greed, wastefulness',
      qualities: ['loss', 'stagnation', 'frustration', 'greed']
    },
    aett: 'Freya',
    element: 'fire',
    associations: ['wealth', 'cattle', 'gold', 'new beginnings']
  },
  {
    name: 'Uruz',
    character: 'ᚢ',
    phoneme: 'U',
    meaning: 'Aurochs, Strength',
    keywords: ['strength', 'vitality', 'primal power', 'health'],
    upright: {
      interpretation: 'Physical and mental strength, vitality, power, formation of new patterns',
      qualities: ['strength', 'health', 'courage', 'freedom']
    },
    reversed: {
      interpretation: 'Weakness, obsession, misdirected force, domination',
      qualities: ['weakness', 'illness', 'inconsistency', 'brutality']
    },
    aett: 'Freya',
    element: 'earth',
    associations: ['wild ox', 'vital force', 'manifestation', 'perseverance']
  },
  {
    name: 'Thurisaz',
    character: 'ᚦ',
    phoneme: 'TH',
    meaning: 'Giant, Thorn',
    keywords: ['protection', 'conflict', 'breakthrough', 'transformation'],
    upright: {
      interpretation: 'Gateway, catalyst, directed force, protection, breakthrough after conflict',
      qualities: ['protection', 'defense', 'breakthrough', 'catalyst']
    },
    reversed: {
      interpretation: 'Danger, betrayal, helplessness, compulsion, spite',
      qualities: ['betrayal', 'danger', 'malice', 'vulnerability']
    },
    aett: 'Freya',
    element: 'fire',
    associations: ['Thor', 'lightning', 'thorn', 'reactive force']
  },
  {
    name: 'Ansuz',
    character: 'ᚨ',
    phoneme: 'A',
    meaning: 'God, Mouth',
    keywords: ['communication', 'wisdom', 'inspiration', 'signals'],
    upright: {
      interpretation: 'Communication, wisdom, divine inspiration, signals and messages',
      qualities: ['wisdom', 'communication', 'insight', 'revelation']
    },
    reversed: {
      interpretation: 'Misunderstanding, manipulation, delusion, blocked communication',
      qualities: ['miscommunication', 'manipulation', 'vanity', 'ignorance']
    },
    aett: 'Freya',
    element: 'air',
    associations: ['Odin', 'divine breath', 'wisdom', 'eloquence']
  },
  {
    name: 'Raidho',
    character: 'ᚱ',
    phoneme: 'R',
    meaning: 'Journey, Wheel',
    keywords: ['journey', 'rhythm', 'movement', 'progress'],
    upright: {
      interpretation: 'Journey, both physical and spiritual, rhythm, right action, natural order',
      qualities: ['journey', 'rhythm', 'progress', 'alignment']
    },
    reversed: {
      interpretation: 'Disruption, delays, crisis, rigidity, injustice',
      qualities: ['disruption', 'stagnation', 'chaos', 'breakdown']
    },
    aett: 'Freya',
    element: 'air',
    associations: ['travel', 'wagon', 'cosmic order', 'ritual']
  },
  {
    name: 'Kenaz',
    character: 'ᚲ',
    phoneme: 'K',
    meaning: 'Torch, Fire',
    keywords: ['knowledge', 'creativity', 'inspiration', 'clarity'],
    upright: {
      interpretation: 'Knowledge, creativity, controlled fire, illumination, transformation',
      qualities: ['creativity', 'knowledge', 'inspiration', 'transformation']
    },
    reversed: {
      interpretation: 'Disease, lack of creativity, ignorance, exposure',
      qualities: ['darkness', 'ignorance', 'instability', 'disease']
    },
    aett: 'Freya',
    element: 'fire',
    associations: ['torch', 'knowledge', 'craft', 'regeneration']
  },
  {
    name: 'Gebo',
    character: 'ᚷ',
    phoneme: 'G',
    meaning: 'Gift, Exchange',
    keywords: ['partnership', 'exchange', 'balance', 'generosity'],
    upright: {
      interpretation: 'Gift, exchange, partnership, balance, generosity, sacrifice',
      qualities: ['partnership', 'generosity', 'balance', 'unity']
    },
    reversed: {
      interpretation: 'Not reversible - represents balance itself',
      qualities: ['balance', 'harmony', 'reciprocity', 'obligation']
    },
    aett: 'Freya',
    associations: ['gift', 'hospitality', 'sacred exchange', 'partnership']
  },
  {
    name: 'Wunjo',
    character: 'ᚹ',
    phoneme: 'W',
    meaning: 'Joy, Perfection',
    keywords: ['joy', 'harmony', 'success', 'fellowship'],
    upright: {
      interpretation: 'Joy, pleasure, harmony, prosperity, fellowship, shared goals',
      qualities: ['joy', 'harmony', 'success', 'fellowship']
    },
    reversed: {
      interpretation: 'Sorrow, alienation, disappointment, intoxication, mania',
      qualities: ['sorrow', 'alienation', 'disappointment', 'delusion']
    },
    aett: 'Freya',
    element: 'air',
    associations: ['joy', 'harmony', 'clan', 'glory']
  },

  // Heimdall's Aett (Second Eight)
  {
    name: 'Hagalaz',
    character: 'ᚺ',
    phoneme: 'H',
    meaning: 'Hail, Disruption',
    keywords: ['disruption', 'change', 'crisis', 'transformation'],
    upright: {
      interpretation: 'Disruption, uncontrolled forces, crisis leading to transformation',
      qualities: ['disruption', 'crisis', 'transformation', 'evolution']
    },
    reversed: {
      interpretation: 'Not reversible - represents primal disruption',
      qualities: ['destruction', 'chaos', 'radical change', 'testing']
    },
    aett: 'Heimdall',
    element: 'ice',
    associations: ['hail', 'disruption', 'weather', 'awakening']
  },
  {
    name: 'Nauthiz',
    character: 'ᚾ',
    phoneme: 'N',
    meaning: 'Need, Necessity',
    keywords: ['necessity', 'constraint', 'resistance', 'endurance'],
    upright: {
      interpretation: 'Need, necessity, constraint, resistance, endurance, self-reliance',
      qualities: ['necessity', 'constraint', 'endurance', 'innovation']
    },
    reversed: {
      interpretation: 'Deprivation, lack, poverty, emotional hunger',
      qualities: ['deprivation', 'suffering', 'want', 'desperation']
    },
    aett: 'Heimdall',
    element: 'fire',
    associations: ['need-fire', 'constraint', 'friction', 'patience']
  },
  {
    name: 'Isa',
    character: 'ᛁ',
    phoneme: 'I',
    meaning: 'Ice, Stillness',
    keywords: ['stillness', 'patience', 'freezing', 'concentration'],
    upright: {
      interpretation: 'Stillness, ice, concentration, self-preservation, waiting',
      qualities: ['stillness', 'patience', 'focus', 'preservation']
    },
    reversed: {
      interpretation: 'Not reversible - represents absolute stillness',
      qualities: ['freezing', 'stagnation', 'delay', 'patience']
    },
    aett: 'Heimdall',
    element: 'ice',
    associations: ['ice', 'ego', 'self', 'contraction']
  },
  {
    name: 'Jera',
    character: 'ᛃ',
    phoneme: 'J',
    meaning: 'Year, Harvest',
    keywords: ['harvest', 'cycle', 'reward', 'completion'],
    upright: {
      interpretation: 'Harvest, natural cycles, reward for efforts, peace, abundance',
      qualities: ['harvest', 'cycles', 'reward', 'completion']
    },
    reversed: {
      interpretation: 'Not reversible - represents natural cycles',
      qualities: ['seasons', 'patience', 'timing', 'fruition']
    },
    aett: 'Heimdall',
    element: 'earth',
    associations: ['year', 'harvest', 'seasons', 'cycles']
  },
  {
    name: 'Eihwaz',
    character: 'ᛇ',
    phoneme: 'EI',
    meaning: 'Yew Tree, Defense',
    keywords: ['protection', 'endurance', 'reliability', 'trustworthiness'],
    upright: {
      interpretation: 'Protection, reliability, trustworthiness, endurance, initiation',
      qualities: ['protection', 'endurance', 'reliability', 'defense']
    },
    reversed: {
      interpretation: 'Not reversible - represents the world tree axis',
      qualities: ['strength', 'defense', 'mysteries', 'immortality']
    },
    aett: 'Heimdall',
    associations: ['yew tree', 'life-death', 'protection', 'vertical axis']
  },
  {
    name: 'Perthro',
    character: 'ᛈ',
    phoneme: 'P',
    meaning: 'Lot Cup, Mystery',
    keywords: ['mystery', 'secrets', 'hidden things', 'divination'],
    upright: {
      interpretation: 'Mystery, hidden things, secrets revealed, initiation, fate',
      qualities: ['mystery', 'fate', 'secrets', 'chance']
    },
    reversed: {
      interpretation: 'Secrets, occult knowledge, stagnation, addiction',
      qualities: ['hidden dangers', 'stagnation', 'addiction', 'loneliness']
    },
    aett: 'Heimdall',
    element: 'water',
    associations: ['lot cup', 'fate', 'womb', 'mysteries']
  },
  {
    name: 'Algiz',
    character: 'ᛉ',
    phoneme: 'Z',
    meaning: 'Elk, Protection',
    keywords: ['protection', 'shield', 'sanctuary', 'connection'],
    upright: {
      interpretation: 'Protection, sanctuary, higher self, divine connection, defense',
      qualities: ['protection', 'sanctuary', 'connection', 'defense']
    },
    reversed: {
      interpretation: 'Hidden danger, warning, vulnerability, consumption by divine',
      qualities: ['warning', 'vulnerability', 'taboo', 'forbidden']
    },
    aett: 'Heimdall',
    element: 'air',
    associations: ['elk', 'protection', 'higher self', 'valkyrie']
  },
  {
    name: 'Sowilo',
    character: 'ᛊ',
    phoneme: 'S',
    meaning: 'Sun, Success',
    keywords: ['success', 'vitality', 'clarity', 'honor'],
    upright: {
      interpretation: 'Success, vitality, clarity, honor, victory, wholeness',
      qualities: ['success', 'vitality', 'clarity', 'honor']
    },
    reversed: {
      interpretation: 'Not reversible - represents the sun itself',
      qualities: ['light', 'energy', 'guidance', 'honor']
    },
    aett: 'Heimdall',
    element: 'fire',
    associations: ['sun', 'victory', 'success', 'life force']
  },

  // Tyr's Aett (Third Eight)
  {
    name: 'Tiwaz',
    character: 'ᛏ',
    phoneme: 'T',
    meaning: 'Tyr, Warrior',
    keywords: ['justice', 'sacrifice', 'leadership', 'victory'],
    upright: {
      interpretation: 'Justice, leadership, victory through sacrifice, rational mind, honor',
      qualities: ['justice', 'leadership', 'sacrifice', 'victory']
    },
    reversed: {
      interpretation: 'Injustice, defeat, blocked communication, mental paralysis',
      qualities: ['injustice', 'defeat', 'imbalance', 'conflict']
    },
    aett: 'Tyr',
    element: 'air',
    associations: ['Tyr', 'justice', 'sacrifice', 'warrior']
  },
  {
    name: 'Berkano',
    character: 'ᛒ',
    phoneme: 'B',
    meaning: 'Birch, Growth',
    keywords: ['growth', 'fertility', 'nurturing', 'new beginnings'],
    upright: {
      interpretation: 'Growth, fertility, new beginnings, nurturing, regeneration',
      qualities: ['growth', 'fertility', 'nurturing', 'renewal']
    },
    reversed: {
      interpretation: 'Family problems, anxiety, carelessness, loss',
      qualities: ['stagnation', 'anxiety', 'loss', 'neglect']
    },
    aett: 'Tyr',
    element: 'earth',
    associations: ['birch', 'goddess', 'fertility', 'spring']
  },
  {
    name: 'Ehwaz',
    character: 'ᛖ',
    phoneme: 'E',
    meaning: 'Horse, Movement',
    keywords: ['movement', 'partnership', 'trust', 'progress'],
    upright: {
      interpretation: 'Movement, partnership, trust, cooperation, gradual progress',
      qualities: ['movement', 'partnership', 'trust', 'loyalty']
    },
    reversed: {
      interpretation: 'Betrayal, disloyalty, recklessness, haste',
      qualities: ['betrayal', 'restlessness', 'confinement', 'mistrust']
    },
    aett: 'Tyr',
    element: 'earth',
    associations: ['horse', 'partnership', 'marriage', 'movement']
  },
  {
    name: 'Mannaz',
    character: 'ᛗ',
    phoneme: 'M',
    meaning: 'Human, Self',
    keywords: ['humanity', 'self', 'community', 'intelligence'],
    upright: {
      interpretation: 'Humanity, self, divine structure, intelligence, cooperation',
      qualities: ['humanity', 'intelligence', 'community', 'self-awareness']
    },
    reversed: {
      interpretation: 'Depression, delusion, manipulation, mortality, cunning',
      qualities: ['isolation', 'depression', 'manipulation', 'mortality']
    },
    aett: 'Tyr',
    element: 'air',
    associations: ['human', 'mind', 'divine structure', 'community']
  },
  {
    name: 'Laguz',
    character: 'ᛚ',
    phoneme: 'L',
    meaning: 'Water, Flow',
    keywords: ['water', 'intuition', 'flow', 'dreams'],
    upright: {
      interpretation: 'Water, intuition, flow, dreams, psychic ability, the unconscious',
      qualities: ['intuition', 'flow', 'dreams', 'psychic']
    },
    reversed: {
      interpretation: 'Confusion, poor judgment, obsession, lack of creativity',
      qualities: ['confusion', 'madness', 'obsession', 'deception']
    },
    aett: 'Tyr',
    element: 'water',
    associations: ['water', 'lake', 'unconscious', 'intuition']
  },
  {
    name: 'Ingwaz',
    character: 'ᛜ',
    phoneme: 'NG',
    meaning: 'Ing, Fertility',
    keywords: ['fertility', 'internal growth', 'gestation', 'completion'],
    upright: {
      interpretation: 'Fertility, internal growth, completion, rest, new beginnings',
      qualities: ['fertility', 'completion', 'gestation', 'potential']
    },
    reversed: {
      interpretation: 'Not reversible - represents stored potential',
      qualities: ['gestation', 'internal', 'completion', 'rest']
    },
    aett: 'Tyr',
    element: 'earth',
    associations: ['Ing', 'fertility god', 'gestation', 'peace']
  },
  {
    name: 'Dagaz',
    character: 'ᛞ',
    phoneme: 'D',
    meaning: 'Day, Breakthrough',
    keywords: ['breakthrough', 'transformation', 'clarity', 'hope'],
    upright: {
      interpretation: 'Breakthrough, transformation, clarity, awakening, hope',
      qualities: ['breakthrough', 'transformation', 'clarity', 'balance']
    },
    reversed: {
      interpretation: 'Not reversible - represents the moment of awakening',
      qualities: ['awakening', 'paradox', 'transformation', 'light']
    },
    aett: 'Tyr',
    element: 'fire',
    associations: ['day', 'dawn', 'awakening', 'transformation']
  },
  {
    name: 'Othala',
    character: 'ᛟ',
    phoneme: 'O',
    meaning: 'Ancestral Property, Heritage',
    keywords: ['heritage', 'inheritance', 'home', 'foundations'],
    upright: {
      interpretation: 'Heritage, inheritance, home, ancestral power, foundations',
      qualities: ['heritage', 'inheritance', 'home', 'foundations']
    },
    reversed: {
      interpretation: 'Lack of customary order, totalitarianism, slavery, poverty',
      qualities: ['loss', 'homelessness', 'prejudice', 'bad karma']
    },
    aett: 'Tyr',
    element: 'earth',
    associations: ['homeland', 'ancestors', 'property', 'sacred enclosure']
  }
];

// ============================================================================
// Rune System Class
// ============================================================================

export class RuneSystem {
  private runes: Map<string, Rune>;

  constructor() {
    this.runes = new Map();
    ELDER_FUTHARK.forEach(rune => {
      this.runes.set(rune.name.toLowerCase(), rune);
      this.runes.set(rune.character, rune);
      this.runes.set(rune.phoneme.toLowerCase(), rune);
    });
  }

  /**
   * Get a rune by name, character, or phoneme
   */
  getRune(identifier: string): Rune | undefined {
    return this.runes.get(identifier.toLowerCase());
  }

  /**
   * Get all runes
   */
  getAllRunes(): Rune[] {
    return ELDER_FUTHARK;
  }

  /**
   * Get runes by aett
   */
  getRunesByAett(aett: 'Freya' | 'Heimdall' | 'Tyr'): Rune[] {
    return ELDER_FUTHARK.filter(rune => rune.aett === aett);
  }

  /**
   * Cast runes for divination
   */
  castRunes(question: string, spread: 'single' | 'three' | 'five' = 'three'): RuneCast {
    const count = spread === 'single' ? 1 : spread === 'three' ? 3 : 5;
    const positions = this.getSpreadPositions(spread);

    // Randomly select runes (deterministic based on question for consistency)
    const seed = this.hashString(question);
    const drawnRunes: DrawnRune[] = [];
    const used = new Set<number>();

    for (let i = 0; i < count; i++) {
      let idx: number;
      do {
        idx = this.seededRandom(seed + i) % ELDER_FUTHARK.length;
      } while (used.has(idx));
      used.add(idx);

      const rune = ELDER_FUTHARK[idx];
      const reversed = this.seededRandom(seed + i + 1000) % 2 === 0;

      drawnRunes.push({
        rune,
        position: positions[i],
        reversed,
        interpretation: reversed ? rune.reversed.interpretation : rune.upright.interpretation
      });
    }

    const interpretation = this.generateInterpretation(drawnRunes, question);
    const guidance = this.generateGuidance(drawnRunes);
    const energies = this.analyzeEnergies(drawnRunes);

    return {
      runes: drawnRunes,
      spread,
      question,
      interpretation,
      guidance,
      energies
    };
  }

  /**
   * Get a rune reading for a concept
   */
  getReading(text: string): RuneReading {
    const seed = this.hashString(text);
    const primaryIdx = seed % ELDER_FUTHARK.length;
    const primary = ELDER_FUTHARK[primaryIdx];

    const secondary: Rune[] = [];
    for (let i = 1; i <= 2; i++) {
      const idx = (seed + i * 7) % ELDER_FUTHARK.length;
      if (idx !== primaryIdx) {
        secondary.push(ELDER_FUTHARK[idx]);
      }
    }

    const message = `${primary.meaning}: ${primary.upright.interpretation}`;
    const action = `Embody the qualities of ${primary.keywords.join(', ')}`;
    const warning = primary.reversed.interpretation;

    return {
      primary,
      secondary,
      message,
      action,
      warning
    };
  }

  /**
   * Encode text as runes
   */
  encodeText(text: string): string {
    return text
      .toLowerCase()
      .split('')
      .map(char => {
        const rune = this.findRuneByPhoneme(char);
        return rune ? rune.character : char;
      })
      .join('');
  }

  /**
   * Convert text to phonetic runes
   */
  toPhoneticRunes(text: string): string {
    const phoneticMap: { [key: string]: string } = {
      'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
      'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
      'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
      's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛊ',
      'y': 'ᛃ', 'z': 'ᛉ', ' ': ' '
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => phoneticMap[char] || char)
      .join('');
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private getSpreadPositions(spread: 'single' | 'three' | 'five'): string[] {
    if (spread === 'single') {
      return ['Present'];
    } else if (spread === 'three') {
      return ['Past', 'Present', 'Future'];
    } else {
      return ['Foundation', 'Challenge', 'Present', 'Guidance', 'Outcome'];
    }
  }

  private generateInterpretation(runes: DrawnRune[], question: string): string {
    const primary = runes[0];
    const parts: string[] = [];

    parts.push(`The runes speak to your question: "${question}"`);
    parts.push('');

    if (runes.length === 1) {
      parts.push(`${primary.rune.name} appears, bringing the energy of ${primary.rune.meaning.toLowerCase()}.`);
      parts.push(primary.interpretation);
    } else if (runes.length === 3) {
      parts.push(`Past: ${runes[0].rune.name} - ${runes[0].rune.meaning}`);
      parts.push(`Present: ${runes[1].rune.name} - ${runes[1].rune.meaning}`);
      parts.push(`Future: ${runes[2].rune.name} - ${runes[2].rune.meaning}`);
    } else {
      runes.forEach(drawn => {
        parts.push(`${drawn.position}: ${drawn.rune.name} - ${drawn.rune.meaning}`);
      });
    }

    return parts.join('\n');
  }

  private generateGuidance(runes: DrawnRune[]): string {
    const keywords: string[] = [];
    runes.forEach(drawn => {
      const qualities = drawn.reversed ? drawn.rune.reversed.qualities : drawn.rune.upright.qualities;
      keywords.push(...qualities);
    });

    return `Focus on: ${keywords.slice(0, 5).join(', ')}. The path forward requires balance and awareness.`;
  }

  private analyzeEnergies(runes: DrawnRune[]): RuneCast['energies'] {
    const dominant: string[] = [];
    const supportive: string[] = [];
    const challenging: string[] = [];

    runes.forEach(drawn => {
      if (!drawn.reversed) {
        dominant.push(...drawn.rune.keywords.slice(0, 2));
      } else {
        challenging.push(...drawn.rune.reversed.qualities.slice(0, 2));
      }
    });

    return {
      dominant: [...new Set(dominant)],
      supportive: [...new Set(supportive)],
      challenging: [...new Set(challenging)]
    };
  }

  private findRuneByPhoneme(char: string): Rune | undefined {
    return ELDER_FUTHARK.find(rune =>
      rune.phoneme.toLowerCase() === char.toLowerCase()
    );
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * 1000000);
  }
}
