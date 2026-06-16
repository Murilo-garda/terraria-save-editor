// Database de itens do Terraria com IDs
const TERRARIA_ITEMS = {
    // Espadas
    1: { name: 'Wooden Sword', type: 'sword', icon: '⚔️' },
    2: { name: 'Iron Shortsword', type: 'sword', icon: '⚔️' },
    3: { name: 'Lead Shortsword', type: 'sword', icon: '⚔️' },
    4: { name: 'Silver Shortsword', type: 'sword', icon: '⚔️' },
    5: { name: 'Gold Shortsword', type: 'sword', icon: '⚔️' },
    6: { name: 'Tungsten Shortsword', type: 'sword', icon: '⚔️' },
    7: { name: 'Platinum Shortsword', type: 'sword', icon: '⚔️' },
    8: { name: 'Iron Pickaxe', type: 'tool', icon: '⛏️' },
    9: { name: 'Lead Pickaxe', type: 'tool', icon: '⛏️' },
    10: { name: 'Silver Pickaxe', type: 'tool', icon: '⛏️' },
    
    // Arcos
    40: { name: 'Wooden Bow', type: 'bow', icon: '🏹' },
    41: { name: 'Iron Bow', type: 'bow', icon: '🏹' },
    42: { name: 'Lead Bow', type: 'bow', icon: '🏹' },
    43: { name: 'Silver Bow', type: 'bow', icon: '🏹' },
    44: { name: 'Gold Bow', type: 'bow', icon: '🏹' },
    
    // Pociones
    102: { name: 'Lesser Healing Potion', type: 'potion', icon: '🧪' },
    103: { name: 'Healing Potion', type: 'potion', icon: '🧪' },
    104: { name: 'Greater Healing Potion', type: 'potion', icon: '🧪' },
    105: { name: 'Lesser Mana Potion', type: 'potion', icon: '🧪' },
    106: { name: 'Mana Potion', type: 'potion', icon: '🧪' },
    107: { name: 'Greater Mana Potion', type: 'potion', icon: '🧪' },
    
    // Munição
    1: { name: 'Wooden Arrow', type: 'ammo', icon: '→' },
    2: { name: 'Flaming Arrow', type: 'ammo', icon: '→' },
    3: { name: 'Frostburn Arrow', type: 'ammo', icon: '→' },
    
    // Acessórios
    141: { name: 'Cloud in a Bottle', type: 'accessory', icon: '☁️' },
    142: { name: 'Hermes Boots', type: 'accessory', icon: '👢' },
    143: { name: 'Band of Regeneration', type: 'accessory', icon: '💍' },
    
    // Materials/Recursos
    70: { name: 'Copper Ore', type: 'ore', icon: '⚒️' },
    71: { name: 'Tin Ore', type: 'ore', icon: '⚒️' },
    72: { name: 'Iron Ore', type: 'ore', icon: '⚒️' },
    73: { name: 'Lead Ore', type: 'ore', icon: '⚒️' },
    74: { name: 'Silver Ore', type: 'ore', icon: '⚒️' },
    75: { name: 'Tungsten Ore', type: 'ore', icon: '⚒️' },
    76: { name: 'Gold Ore', type: 'ore', icon: '⚒️' },
    77: { name: 'Platinum Ore', type: 'ore', icon: '⚒️' },
    
    // Grama/Blocos
    1: { name: 'Dirt Block', type: 'block', icon: '■' },
    2: { name: 'Stone Block', type: 'block', icon: '■' },
    3: { name: 'Grass Block', type: 'block', icon: '■' },
};

// Lista de bosses do Terraria
const TERRARIA_BOSSES = [
    { id: 'slime_king', name: 'Slime King' },
    { id: 'eye_of_cthulhu', name: 'Eye of Cthulhu' },
    { id: 'eater_of_worlds', name: 'Eater of Worlds' },
    { id: 'brain_of_cthulhu', name: 'Brain of Cthulhu' },
    { id: 'queen_bee', name: 'Queen Bee' },
    { id: 'skeletron', name: 'Skeletron' },
    { id: 'wall_of_flesh', name: 'Wall of Flesh' },
    { id: 'queen_slime', name: 'Queen Slime' },
    { id: 'twins', name: 'The Twins' },
    { id: 'bone_serpent', name: 'The Bone Serpent' },
    { id: 'mechanical_worm', name: 'The Mechanical Worm' },
    { id: 'skeleton_prime', name: 'Skeleton Prime' },
    { id: 'plantera', name: 'Plantera' },
    { id: 'empress_of_light', name: 'Empress of Light' },
    { id: 'golem', name: 'Golem' },
    { id: 'duke_fishron', name: 'Duke Fishron' },
    { id: 'cultist', name: 'Lunatic Cultist' },
    { id: 'moon_lord', name: 'Moon Lord' },
];

// Função para obter item por ID
function getItemById(id) {
    return TERRARIA_ITEMS[id] || { name: `Unknown Item ${id}`, type: 'unknown', icon: '?' };
}

// Função para obter todos os itens de um tipo
function getItemsByType(type) {
    return Object.entries(TERRARIA_ITEMS)
        .filter(([_, item]) => item.type === type)
        .map(([id, item]) => ({ id: parseInt(id), ...item }));
}

// Função para procurar item por nome
function searchItem(query) {
    const lowerQuery = query.toLowerCase();
    return Object.entries(TERRARIA_ITEMS)
        .filter(([_, item]) => item.name.toLowerCase().includes(lowerQuery))
        .map(([id, item]) => ({ id: parseInt(id), ...item }));
}

// Dados padrão para novo save
const DEFAULT_SAVE_DATA = {
    player: {
        name: 'Player',
        level: 1,
        class: 'melee',
        health: 100,
        maxHealth: 100,
        mana: 0,
        maxMana: 20,
        difficulty: 0,
        hardcore: false,
    },
    inventory: Array(50).fill(null).map(() => ({ itemId: 0, quantity: 0 })),
    equipment: {
        head: 0,
        chest: 0,
        legs: 0,
        accessory1: 0,
        accessory2: 0,
        accessory3: 0,
        accessory4: 0,
        accessory5: 0,
    },
    stats: {
        deaths: 0,
        enemiesDefeated: 0,
        bossesDefeated: 0,
        playTime: 0,
        bossesFallen: {},
    },
    world: {
        name: 'World',
        size: 'medium',
        difficulty: 0,
        evil: false,
        seed: '',
    },
};

// Inicializar bosses como não derrotados
TERRARIA_BOSSES.forEach(boss => {
    DEFAULT_SAVE_DATA.stats.bossesFallen[boss.id] = false;
});