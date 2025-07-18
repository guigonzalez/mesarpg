export const mockCharacters = {
  fighter: {
    id: 'test-fighter-id',
    name: 'Test Fighter',
    type: 'PC',
    userId: 'test-player-id',
    campaignId: 'test-campaign-id',
    data: JSON.stringify({
      level: 5,
      class: 'Fighter',
      race: 'Human',
      background: 'Soldier',
      alignment: 'Lawful Good',
      experiencePoints: 6500,
      abilities: {
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 12,
        wisdom: 13,
        charisma: 10,
      },
      skills: {
        acrobatics: { proficient: false, expertise: false, bonus: 0 },
        athletics: { proficient: true, expertise: false, bonus: 0 },
        intimidation: { proficient: true, expertise: false, bonus: 0 },
        perception: { proficient: false, expertise: false, bonus: 0 },
      },
      savingThrows: {
        strength: { proficient: true, bonus: 0 },
        dexterity: { proficient: false, bonus: 0 },
        constitution: { proficient: true, bonus: 0 },
        intelligence: { proficient: false, bonus: 0 },
        wisdom: { proficient: false, bonus: 0 },
        charisma: { proficient: false, bonus: 0 },
      },
      hitPoints: {
        current: 47,
        maximum: 47,
        temporary: 0,
      },
      armorClass: 18,
      initiative: 2,
      speed: 30,
      equipment: {
        weapons: [
          {
            name: 'Longsword',
            damage: '1d8+3',
            ability: 'strength',
            proficient: true,
            attackBonus: 0,
          },
        ],
        armor: [],
        items: [],
        currency: {
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 100,
          pp: 0,
        },
      },
      spells: {
        spellcastingAbility: 'intelligence',
        spellcastingLevel: 0,
        spellSaveDC: 8,
        spellAttackBonus: 0,
        spellSlots: {},
        knownSpells: [],
        preparedSpells: [],
      },
    }),
    templateId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  wizard: {
    id: 'test-wizard-id',
    name: 'Test Wizard',
    type: 'PC',
    userId: 'test-player-id',
    campaignId: 'test-campaign-id',
    data: JSON.stringify({
      level: 3,
      class: 'Wizard',
      race: 'Elf',
      background: 'Sage',
      alignment: 'Neutral Good',
      experiencePoints: 900,
      abilities: {
        strength: 8,
        dexterity: 14,
        constitution: 13,
        intelligence: 16,
        wisdom: 12,
        charisma: 10,
      },
      skills: {
        arcana: { proficient: true, expertise: false, bonus: 0 },
        history: { proficient: true, expertise: false, bonus: 0 },
        investigation: { proficient: true, expertise: false, bonus: 0 },
        perception: { proficient: false, expertise: false, bonus: 0 },
      },
      savingThrows: {
        strength: { proficient: false, bonus: 0 },
        dexterity: { proficient: false, bonus: 0 },
        constitution: { proficient: false, bonus: 0 },
        intelligence: { proficient: true, bonus: 0 },
        wisdom: { proficient: true, bonus: 0 },
        charisma: { proficient: false, bonus: 0 },
      },
      hitPoints: {
        current: 18,
        maximum: 18,
        temporary: 0,
      },
      armorClass: 12,
      initiative: 2,
      speed: 30,
      equipment: {
        weapons: [
          {
            name: 'Quarterstaff',
            damage: '1d6',
            ability: 'strength',
            proficient: true,
            attackBonus: 0,
          },
        ],
        armor: [],
        items: [],
        currency: {
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 50,
          pp: 0,
        },
      },
      spells: {
        spellcastingAbility: 'intelligence',
        spellcastingLevel: 3,
        spellSaveDC: 13,
        spellAttackBonus: 5,
        spellSlots: {
          1: { total: 4, remaining: 4 },
          2: { total: 2, remaining: 2 },
        },
        knownSpells: [
          {
            id: 'magic-missile',
            name: 'Magic Missile',
            level: 1,
            school: 'Evocation',
            damage: '1d4+1',
          },
          {
            id: 'fireball',
            name: 'Fireball',
            level: 3,
            school: 'Evocation',
            damage: '8d6',
          },
        ],
        preparedSpells: ['magic-missile', 'fireball'],
      },
    }),
    templateId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  orc: {
    id: 'test-orc-id',
    name: 'Orc Warrior',
    type: 'CREATURE',
    userId: 'test-gm-id',
    campaignId: 'test-campaign-id',
    data: JSON.stringify({
      level: 1,
      class: 'Barbarian',
      race: 'Orc',
      abilities: {
        strength: 16,
        dexterity: 12,
        constitution: 16,
        intelligence: 7,
        wisdom: 11,
        charisma: 10,
      },
      hitPoints: {
        current: 15,
        maximum: 15,
        temporary: 0,
      },
      armorClass: 13,
      initiative: 1,
      speed: 30,
    }),
    templateId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}