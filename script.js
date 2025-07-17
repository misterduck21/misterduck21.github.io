// System Information Display
document.getElementById('browser-info').textContent += navigator.userAgent;
document.getElementById('os-info').textContent += navigator.platform;
document.getElementById('cores-info').textContent += navigator.hardwareConcurrency || 'Unknown';

if (window.performance && performance.memory) {
    const totalMB = Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024));
    document.getElementById('memory-info').textContent += `Total heap size: ${totalMB} MB`;
} else {
    document.getElementById('memory-info').textContent += 'Memory information not available';
}

// Test Variables
let cpuScore = 0;
let gpuScore = 0;
let memoryScore = 0;
let storageScore = 0;

// DOM Elements
const elements = {
    cpu: {
        btn: document.getElementById('cpu-test-btn'),
        result: document.getElementById('cpu-result'),
        progress: document.getElementById('cpu-progress')
    },
    gpu: {
        btn: document.getElementById('gpu-test-btn'),
        result: document.getElementById('gpu-result'),
        progress: document.getElementById('gpu-progress'),
        canvas: document.getElementById('gpu-canvas')
    },
    memory: {
        btn: document.getElementById('memory-test-btn'),
        result: document.getElementById('memory-result'),
        progress: document.getElementById('memory-progress')
    },
    storage: {
        btn: document.getElementById('storage-test-btn'),
        result: document.getElementById('storage-result'),
        progress: document.getElementById('storage-progress')
    },
    runAll: document.getElementById('run-all-btn'),
    finalScore: document.getElementById('final-score')
};

// Event Listeners
elements.cpu.btn.addEventListener('click', runCpuTest);
elements.gpu.btn.addEventListener('click', runGpuTest);
elements.memory.btn.addEventListener('click', runMemoryTest);
elements.storage.btn.addEventListener('click', runStorageTest);
elements.runAll.addEventListener('click', runAllTests);

// CPU Test
function runCpuTest() {
    const startTime = performance.now();
    resetTestUI('cpu');
    
    let progress = 0;
    let calculations = 0;
    const totalCalculations = 10000000;
    const chunkSize = 100000;
    
    function calculateChunk() {
        for (let i = 0; i < chunkSize; i++) {
            calculations += Math.sqrt(Math.random()) * Math.tan(Math.random());
        }
        
        progress += chunkSize;
        updateProgress('cpu', progress, totalCalculations);
        
        if (progress < totalCalculations) {
            setTimeout(calculateChunk, 0);
        } else {
            finishTest('cpu', startTime, calculations);
        }
    }
    
    calculateChunk();
}

// GPU Test
function runGpuTest() {
    const startTime = performance.now();
    resetTestUI('gpu');
    elements.gpu.canvas.style.display = 'block';
    
    const ctx = elements.gpu.canvas.getContext('2d');
    ctx.clearRect(0, 0, elements.gpu.canvas.width, elements.gpu.canvas.height);
    
    const totalFrames = 100;
    let framesCompleted = 0;
    
    function drawFrame() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, elements.gpu.canvas.width, elements.gpu.canvas.height);
        
        // Draw complex shapes
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * elements.gpu.canvas.width;
            const y = Math.random() * elements.gpu.canvas.height;
            const radius = Math.random() * 30 + 10;
            const hue = Math.random() * 360;
            
            // Draw circle with gradient
            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `hsl(${hue}, 100%, 80%)`);
            grad.addColorStop(1, `hsl(${hue}, 100%, 30%)`);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        framesCompleted++;
        updateProgress('gpu', framesCompleted, totalFrames);
        
        if (framesCompleted < totalFrames) {
            requestAnimationFrame(drawFrame);
        } else {
            elements.gpu.canvas.style.display = 'none';
            finishTest('gpu', startTime, totalFrames * 100);
        }
    }
    
    drawFrame();
}

// Memory Test
function runMemoryTest() {
    const startTime = performance.now();
    resetTestUI('memory');
    
    const size = 1000000; // 1 million elements
    let progress = 0;
    const chunks = 100;
    const chunkSize = size / chunks;
    
    let data = new Array(size);
    
    function processChunk() {
        const startIdx = progress * chunkSize;
        const endIdx = startIdx + chunkSize;
        
        for (let i = startIdx; i < endIdx; i++) {
            data[i] = Math.random();
            data[i] = Math.sin(data[i]) * Math.cos(data[i]);
        }
        
        progress++;
        updateProgress('memory', progress, chunks);
        
        if (progress < chunks) {
            setTimeout(processChunk, 0);
        } else {
            data = null;
            finishTest('memory', startTime, size / 1000);
        }
    }
    
    processChunk();
}

// Storage Test
function runStorageTest() {
    const startTime = performance.now();
    resetTestUI('storage');
    
    const testSize = 10000;
    let progress = 0;
    const testKey = 'webmark_test_key';
    const chunkSize = 100;
    
    function performStorageOperation() {
        const endProgress = Math.min(testSize, progress + chunkSize);
        
        for (let i = progress; i < endProgress; i++) {
            localStorage.setItem(testKey, Math.random().toString());
            const data = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
        }
        
        progress = endProgress;
        updateProgress('storage', progress, testSize);
        
        if (progress < testSize) {
            setTimeout(performStorageOperation, 0);
        } else {
            finishTest('storage', startTime, testSize);
        }
    }
    
    performStorageOperation();
}

// Helper Functions
function resetTestUI(test) {
    elements[test].progress.style.width = '0%';
    elements[test].result.style.display = 'none';
    elements[test].result.innerHTML = '';
}

function updateProgress(test, current, total) {
    const percent = Math.min(100, (current / total) * 100);
    elements[test].progress.style.width = percent + '%';
}

function finishTest(test, startTime, operations) {
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    
    // Calculate scores differently for each test
    let score;
    switch(test) {
        case 'cpu':
            score = Math.round(100000 / duration);
            break;
        case 'gpu':
            score = Math.round((operations * 10) / duration);
            break;
        case 'memory':
            score = Math.round(operations / duration);
            break;
        case 'storage':
            score = Math.round((operations * 5) / duration);
            break;
    }
    
    // Store score
    window[`${test}Score`] = score;
    
    // Display results
    elements[test].result.innerHTML = `
        ${test.toUpperCase()} Test completed in <strong>${duration.toFixed(2)}s</strong>.<br>
        Score: <strong>${score}</strong>
    `;
    elements[test].result.style.display = 'block';
    
    updateFinalScore();
}

function runAllTests() {
    // Reset all
    cpuScore = gpuScore = memoryScore = storageScore = 0;
    elements.finalScore.textContent = '';
    
    // Run tests with delays
    runCpuTest();
    setTimeout(runGpuTest, 3000);
    setTimeout(runMemoryTest, 6000);
    setTimeout(runStorageTest, 9000);
}

function updateFinalScore() {
    if (cpuScore > 0 && gpuScore > 0 && memoryScore > 0 && storageScore > 0) {
        const totalScore = cpuScore + gpuScore + memoryScore + storageScore;
        elements.finalScore.innerHTML = `
            <h2>Final WebMark Score</h2>
            <div style="font-size: 48px; margin: 10px 0;">${totalScore}</div>
            <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                <div>CPU: ${cpuScore}</div>
                <div>GPU: ${gpuScore}</div>
                <div>RAM: ${memoryScore}</div>
                <div>Storage: ${storageScore}</div>
            </div>
        `;
    }
}