// Constantes e elementos DOM
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadButton = document.getElementById('uploadButton');
const removeButton = document.getElementById('removeButton');
const removeSelectedButton = document.getElementById('removeSelectedButton');
const removeDetectedButton = document.getElementById('removeDetectedButton');
const selectedImage = document.getElementById('selectedImage');
const detectedImage = document.getElementById('detectedImage');
const fileName = document.getElementById('fileName');
const resultsContainer = document.getElementById('resultsContainer');
const diagnosisResult = document.getElementById('diagnosisResult');
const statusMessage = document.getElementById('statusMessage');
const messageText = document.getElementById('messageText');

// Estado da aplicação
let hasImage = false;
let currentImageData = null;

// Função para inicializar a aplicação
function initApp() {
    console.log('Aplicação Biotech inicializada');
    setupEventListeners();
    updateRemoveButtonState();
}

// Configurar event listeners
function setupEventListeners() {
    // Upload area
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // File selection
    fileInput.addEventListener('change', handleFileSelection);
    
    // Buttons
    uploadButton.addEventListener('click', handleUpload);
    removeButton.addEventListener('click', handleRemoveImage);
    removeSelectedButton.addEventListener('click', handleRemoveImage);
    removeDetectedButton.addEventListener('click', clearResults);
}

// Funções de drag and drop
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('bg-blue-50');
}

function handleDragLeave() {
    uploadArea.classList.remove('bg-blue-50');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('bg-blue-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelection();
    }
}

// Manipulação de arquivos
function handleFileSelection() {
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Verificar se é uma imagem
        if (!file.type.match('image.*')) {
            showMessage('Por favor, selecione apenas arquivos de imagem.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            currentImageData = e.target.result;
            
            selectedImage.innerHTML = `
                <img src="${currentImageData}" class="h-full object-contain rounded-lg" alt="Imagem selecionada">
            `;
            fileName.textContent = file.name;
            hasImage = true;
            updateRemoveButtonState();
            
            showMessage('Imagem carregada com sucesso. Clique em "Enviar para Análise".', 'success');
        };
        
        reader.onerror = function() {
            showMessage('Erro ao ler o arquivo.', 'error');
        };
        
        reader.readAsDataURL(file);
    }
}

// Upload e processamento
async function handleUpload() {
    if (!fileInput.files || !fileInput.files[0]) {
        showMessage('Por favor, selecione uma imagem primeiro.', 'error');
        return;
    }
    
    showLoadingIndicator();
    
    try {
        // Simulação de processamento (substituir pela chamada real à API)
        const resultado = await simulateImageProcessing();
        
        // Exibir resultados
        displayResults(resultado);
        
    } catch (error) {
        showMessage('Erro ao processar a imagem.', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// Simulação de processamento (SIMPLES - será substituída pelo algoritmo real)
async function simulateImageProcessing() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Dados simulados simples
            const tiposBacterias = [
                { nome: 'Giardia', confianca: '95.2%' },
                
            ];
            
            const bacteriaDetectada = tiposBacterias[Math.floor(Math.random() * tiposBacterias.length)];
            
            resolve({
                imagemProcessada: currentImageData, // Retorna a mesma imagem
                tipoBacteria: bacteriaDetectada.nome,
                confianca: bacteriaDetectada.confianca,
                descricao: 'Bactéria detectada através de análise de imagem.'
            });
        }, 1500); // 1.5 segundos de simulação
    });
}

// Exibir resultados
function displayResults(resultado) {
    detectedImage.innerHTML = `
        <div class="text-center">
            <img src="${resultado.imagemProcessada}" class="h-56 object-contain rounded-lg mb-2" alt="Imagem processada">
            <p class="text-sm text-gray-600">Resultado da análise</p>
        </div>
    `;
    
    resultsContainer.classList.remove('hidden');
    diagnosisResult.innerHTML = `
        <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">Bactéria Identificada:</h4>
            <div class="bg-green-100 p-3 rounded-lg">
                <p class="text-green-800 font-medium">${resultado.tipoBacteria}</p>
            </div>
        </div>
        <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">Nível de Confiança:</h4>
            <div class="bg-blue-100 p-3 rounded-lg">
                <p class="text-blue-800 font-medium">${resultado.confianca}</p>
            </div>
        </div>
        <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">Descrição:</h4>
            <p class="text-gray-700">${resultado.descricao}</p>
        </div>
    `;
    
    removeDetectedButton.classList.remove('opacity-50', 'cursor-not-allowed');
    removeDetectedButton.disabled = false;
    
    showMessage('Análise concluída com sucesso!', 'success');
}

// Remover imagem
function handleRemoveImage() {
    if (hasImage) {
        resetInterface();
        showMessage('Imagem removida.', 'info');
    }
}

// Limpar resultados
function clearResults() {
    detectedImage.innerHTML = '<span class="text-gray-400">Resultado da análise aparecerá aqui</span>';
    resultsContainer.classList.add('hidden');
    removeDetectedButton.classList.add('opacity-50', 'cursor-not-allowed');
    removeDetectedButton.disabled = true;
    showMessage('Resultados limpos.', 'info');
}

// Resetar interface
function resetInterface() {
    selectedImage.innerHTML = '<span class="text-gray-400">Nenhuma imagem selecionada</span>';
    detectedImage.innerHTML = '<span class="text-gray-400">Resultado da análise aparecerá aqui</span>';
    fileInput.value = '';
    fileName.textContent = '';
    resultsContainer.classList.add('hidden');
    hasImage = false;
    currentImageData = null;
    updateRemoveButtonState();
}

// Atualizar estado dos botões de remoção
function updateRemoveButtonState() {
    const buttons = [removeButton, removeSelectedButton];
    const disabledClass = 'opacity-50 cursor-not-allowed';
    
    buttons.forEach(button => {
        if (hasImage) {
            button.classList.remove(disabledClass);
            button.disabled = false;
        } else {
            button.classList.add(disabledClass);
            button.disabled = true;
        }
    });
}

// Mostrar indicador de carregamento
function showLoadingIndicator() {
    detectedImage.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="loading-spinner mb-3"></div>
            <p class="text-gray-600">Processando imagem...</p>
        </div>
    `;
    uploadButton.disabled = true;
}

// Esconder indicador de carregamento
function hideLoadingIndicator() {
    uploadButton.disabled = false;
}

// Mostrar mensagens
function showMessage(text, type) {
    messageText.textContent = text;
    statusMessage.className = 'mt-4 p-4 rounded-lg hidden';
    
    if (type === 'success') {
        statusMessage.classList.add('bg-green-100', 'text-green-700');
    } else if (type === 'error') {
        statusMessage.classList.add('bg-red-100', 'text-red-700');
    } else {
        statusMessage.classList.add('bg-blue-100', 'text-blue-700');
    }
    
    statusMessage.classList.remove('hidden');
    
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 5000);
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);