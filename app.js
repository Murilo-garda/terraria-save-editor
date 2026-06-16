// Estado global da aplicação
let currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
let originalSaveData = null;
let currentFile = null;

// Elementos do DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const fileInfo = document.getElementById('fileInfo');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const statusMessage = document.getElementById('statusMessage');

// Event Listeners
selectFileBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect();
    }
});

// Tab Navigation
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Save/Reset/Export/Import
saveBtn.addEventListener('click', saveChanges);
resetBtn.addEventListener('click', resetChanges);
exportBtn.addEventListener('click', exportJSON);
importBtn.addEventListener('click', importJSON);

// Funções principais
function handleFileSelect() {
    const file = fileInput.files[0];
    if (!file) return;

    currentFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            // Ler o arquivo como JSON (simulação de parse do save)
            const content = e.target.result;
            
            // Tentar parsear como JSON
            try {
                currentSaveData = JSON.parse(content);
                originalSaveData = JSON.parse(content);
            } catch {
                // Se não for JSON, criar um novo save
                currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
                originalSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
            }

            loadDataToForm();
            showStatus(`Arquivo "${file.name}" carregado com sucesso!`, 'success');
            updateFileInfo(file);
        } catch (error) {
            showStatus(`Erro ao carregar arquivo: ${error.message}`, 'error');
        }
    };

    reader.readAsText(file);
}

function loadDataToForm() {
    // Carregar dados do jogador
    document.getElementById('playerName').value = currentSaveData.player.name;
    document.getElementById('playerLevel').value = currentSaveData.player.level;
    document.getElementById('playerClass').value = currentSaveData.player.class;
    document.getElementById('playerHealth').value = currentSaveData.player.health;
    document.getElementById('playerMana').value = currentSaveData.player.mana;
    document.getElementById('playerDifficulty').value = currentSaveData.player.difficulty;
    document.getElementById('playerHardcore').checked = currentSaveData.player.hardcore;

    // Carregar dados do mundo
    document.getElementById('worldName').value = currentSaveData.world.name;
    document.getElementById('worldSize').value = currentSaveData.world.size;
    document.getElementById('worldDifficulty').value = currentSaveData.world.difficulty;
    document.getElementById('worldEvil').checked = currentSaveData.world.evil;
    document.getElementById('worldSeed').value = currentSaveData.world.seed;

    // Carregar estatísticas
    document.getElementById('statDeaths').value = currentSaveData.stats.deaths;
    document.getElementById('statEnemiesDefeated').value = currentSaveData.stats.enemiesDefeated;
    document.getElementById('statBossesDefeated').value = currentSaveData.stats.bossesDefeated;
    document.getElementById('statPlayTime').value = currentSaveData.stats.playTime;

    // Gerar bosses
    loadBosses();

    // Gerar inventário
    loadInventory();
}

function loadBosses() {
    const bossesGrid = document.getElementById('bossesGrid');
    bossesGrid.innerHTML = '';

    TERRARIA_BOSSES.forEach(boss => {
        const isDefeated = currentSaveData.stats.bossesFallen[boss.id] || false;
        const bossItem = document.createElement('div');
        bossItem.className = 'boss-item';
        bossItem.innerHTML = `
            <input type="checkbox" id="boss-${boss.id}" ${isDefeated ? 'checked' : ''}>
            <label for="boss-${boss.id}">${boss.name}</label>
        `;
        bossesGrid.appendChild(bossItem);

        bossItem.querySelector('input').addEventListener('change', (e) => {
            currentSaveData.stats.bossesFallen[boss.id] = e.target.checked;
        });
    });
}

function loadInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';

    currentSaveData.inventory.forEach((slot, index) => {
        const slotElement = document.createElement('div');
        slotElement.className = 'inventory-slot';
        
        if (slot.itemId > 0) {
            const item = getItemById(slot.itemId);
            slotElement.innerHTML = `
                <div class="inventory-slot-item">${item.icon}</div>
                <div class="inventory-slot-name">${item.name}</div>
                <span>${slot.quantity}</span>
            `;
        } else {
            slotElement.innerHTML = '<span style="color: #ccc;">Vazio</span>';
        }

        slotElement.addEventListener('click', () => editInventorySlot(index));
        inventoryGrid.appendChild(slotElement);
    });
}

function editInventorySlot(index) {
    const itemId = prompt('ID do item (0 para vazio):', currentSaveData.inventory[index].itemId);
    if (itemId === null) return;

    const id = parseInt(itemId);
    if (id < 0) {
        showStatus('ID do item inválido', 'error');
        return;
    }

    if (id === 0) {
        currentSaveData.inventory[index] = { itemId: 0, quantity: 0 };
    } else {
        const quantity = prompt('Quantidade:', currentSaveData.inventory[index].quantity || 1);
        if (quantity === null) return;

        const qty = parseInt(quantity);
        if (qty < 0) {
            showStatus('Quantidade inválida', 'error');
            return;
        }

        currentSaveData.inventory[index] = { itemId: id, quantity: qty };
    }

    loadInventory();
}

function saveChanges() {
    // Atualizar dados do jogador
    currentSaveData.player.name = document.getElementById('playerName').value;
    currentSaveData.player.level = parseInt(document.getElementById('playerLevel').value) || 0;
    currentSaveData.player.class = document.getElementById('playerClass').value;
    currentSaveData.player.health = parseInt(document.getElementById('playerHealth').value) || 0;
    currentSaveData.player.mana = parseInt(document.getElementById('playerMana').value) || 0;
    currentSaveData.player.difficulty = parseInt(document.getElementById('playerDifficulty').value) || 0;
    currentSaveData.player.hardcore = document.getElementById('playerHardcore').checked;

    // Atualizar dados do mundo
    currentSaveData.world.name = document.getElementById('worldName').value;
    currentSaveData.world.size = document.getElementById('worldSize').value;
    currentSaveData.world.difficulty = parseInt(document.getElementById('worldDifficulty').value) || 0;
    currentSaveData.world.evil = document.getElementById('worldEvil').checked;
    currentSaveData.world.seed = document.getElementById('worldSeed').value;

    // Atualizar estatísticas
    currentSaveData.stats.deaths = parseInt(document.getElementById('statDeaths').value) || 0;
    currentSaveData.stats.enemiesDefeated = parseInt(document.getElementById('statEnemiesDefeated').value) || 0;
    currentSaveData.stats.bossesDefeated = parseInt(document.getElementById('statBossesDefeated').value) || 0;
    currentSaveData.stats.playTime = parseInt(document.getElementById('statPlayTime').value) || 0;

    // Contar bosses derrotados
    currentSaveData.stats.bossesDefeated = Object.values(currentSaveData.stats.bossesFallen).filter(v => v).length;
    document.getElementById('statBossesDefeated').value = currentSaveData.stats.bossesDefeated;

    // Baixar o arquivo modificado
    downloadSaveFile();
    showStatus('✅ Save editado e pronto para download!', 'success');
}

function resetChanges() {
    if (confirm('Tem certeza que deseja descartar todas as alterações?')) {
        currentSaveData = JSON.parse(JSON.stringify(originalSaveData || DEFAULT_SAVE_DATA));
        loadDataToForm();
        showStatus('Alterações descartadas', 'info');
    }
}

function downloadSaveFile() {
    const dataStr = JSON.stringify(currentSaveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSaveData.player.name}_${currentSaveData.world.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportJSON() {
    downloadSaveFile();
    showStatus('JSON exportado com sucesso!', 'success');
}

function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                currentSaveData = JSON.parse(event.target.result);
                originalSaveData = JSON.parse(event.target.result);
                loadDataToForm();
                showStatus('JSON importado com sucesso!', 'success');
            } catch (error) {
                showStatus(`Erro ao importar JSON: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Funções auxiliares
function updateFileInfo(file) {
    fileInfo.innerHTML = `
        <p><strong>Arquivo:</strong> ${file.name}</p>
        <p><strong>Tamanho:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
        <p><strong>Última modificação:</strong> ${new Date(file.lastModified).toLocaleString('pt-BR')}</p>
    `;
    fileInfo.classList.remove('hidden');
}

function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.classList.remove('hidden');

    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 5000);
}

// Quick tools para inventário
document.getElementById('fillInventoryBtn').addEventListener('click', () => {
    currentSaveData.inventory.forEach((slot, index) => {
        if (slot.itemId === 0) {
            currentSaveData.inventory[index] = { itemId: 1, quantity: 999 };
        }
    });
    loadInventory();
    showStatus('Inventário preenchido!', 'success');
});

document.getElementById('clearInventoryBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar o inventário?')) {
        currentSaveData.inventory = Array(50).fill(null).map(() => ({ itemId: 0, quantity: 0 }));
        loadInventory();
        showStatus('Inventário limpo!', 'success');
    }
});

// Inicializar com dados padrão
window.addEventListener('load', () => {
    showStatus('👋 Bem-vindo ao Terraria Save Editor! Carregue um arquivo para começar.', 'info');
});