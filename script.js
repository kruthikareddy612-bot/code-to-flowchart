let currentCategory = 'all';
let visibleCount = 12; // Initial batched display count
let allTemplates = [];

// Initialize 1,000 templates with clean 1, 2, 3 sequential numbering
function initTemplates() {
    if (allTemplates.length > 0) return;
    
    const titles = {
        arithmetic: ["Basic Arithmetic Flow", "Variable Assignment Routine", "Simple Formula Calculation", "Mathematical Expression Evaluator", "Input-Output Processing Block"],
        conditional: ["If-Else Decision Branch", "Multi-Tier Evaluation Flow", "Relational Comparison Check", "Boolean Guard Condition", "Nested Branch Validator"],
        loop: ["Counter-Controlled Loop", "Accumulator Sequence", "Iterative Range Processing", "Conditional While-Loop Block", "Step-Wise Increment Routine"],
        array: ["Sequential Array Search", "Dataset Traversal Routine", "Array Item Lookup Filter", "Collection Mapping Process", "Indexed Element Selector"],
        advanced: ["Error Handling Routine", "Matrix Transformation Block", "Advanced Function Wrapper", "Exception Try-Catch Sequence", "Complex Pipeline Routine"]
    };

    for (let i = 1; i <= 1000; i++) {
        let category = 'arithmetic';
        if (i > 200 && i <= 400) category = 'conditional';
        else if (i > 400 && i <= 650) category = 'loop';
        else if (i > 650 && i <= 850) category = 'array';
        else if (i > 850) category = 'advanced';

        const categoryTitles = titles[category];
        const titleBase = categoryTitles[(i - 1) % categoryTitles.length];

        allTemplates.push({
            id: `t${i}`,
            title: `${i}. ${titleBase}`,
            desc: `Optimized structural variant for clean ${category} logic evaluation and flow mapping.`,
            category: category,
            code: `START\ninput x\nres = x * ${i % 10}\nprint res\nEND`
        });
    }
}

function switchPage(pageId, eventObj) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) targetPage.classList.add('active');
    
    if (eventObj && eventObj.target) {
        eventObj.target.classList.add('active');
    }
    
    if (pageId === 'templates') {
        initTemplates();
        renderTemplateGrid();
    }
}

function setCategory(category, eventObj) {
    currentCategory = category;
    visibleCount = 12; // Reset batch count on category switch
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (eventObj && eventObj.target) {
        eventObj.target.classList.add('active');
    }
    renderTemplateGrid();
}

function filterTemplates() {
    visibleCount = 12; // Reset batch count on search
    renderTemplateGrid();
}

function loadMoreTemplates() {
    visibleCount += 12;
    renderTemplateGrid();
}

// Render grid with Search, Category Filter, and Pagination applied
function renderTemplateGrid() {
    const grid = document.getElementById('dynamic-template-grid');
    const searchInput = document.getElementById('template-search');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!grid) return;

    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = allTemplates.filter(t => {
        const matchesCategory = currentCategory === 'all' || t.category === currentCategory;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery) || t.desc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    const paginated = filtered.slice(0, visibleCount);
    
    let html = '';
    paginated.forEach(t => {
        html += `<div class="template-card" onclick="loadTemplate('${t.id}')">
            <h4>${t.title}</h4>
            <p>${t.desc}</p>
        </div>`;
    });
    
    grid.innerHTML = html;

    if (loadMoreBtn) {
        if (visibleCount >= filtered.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

function loadTemplate(id) {
    const template = allTemplates.find(t => t.id === id);
    if (!template) return;
    
    const pseudocodeInput = document.getElementById('pseudocode-input');
    if (pseudocodeInput) {
        pseudocodeInput.value = template.code;
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const generatorPage = document.getElementById('generator-page');
    if (generatorPage) generatorPage.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const firstNavBtn = document.querySelector('nav button:first-child');
    if (firstNavBtn) firstNavBtn.classList.add('active');
}

function generateFlowchart() {
    const code = document.getElementById('pseudocode-input').value.trim();
    const outputDiv = document.getElementById('flowchart-output');
    
    if (!code) {
        outputDiv.innerHTML = '<p style="color: #f85149;">Please enter some pseudocode first.</p>';
        return;
    }

    let lines = code.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let mermaidCode = 'graph TD;\n';
    
    mermaidCode += 'classDef startEnd fill:#13231c,stroke:#2ea043,stroke-width:2px,color:#d1ffd6,font-weight:bold;\n';
    mermaidCode += 'classDef process fill:#162235,stroke:#388bfd,stroke-width:2px,color:#c6e2ff;\n';
    
    let lastNodeId = 'StartNode';
    mermaidCode += `StartNode((START)):::startEnd;\n`;

    lines.forEach((line, index) => {
        if (line.toUpperCase() === 'START') return;
        const nodeId = `Node${index}`;
        mermaidCode += `${nodeId}["${line}"]:::process;\n`;
        mermaidCode += `${lastNodeId} --> ${nodeId};\n`;
        lastNodeId = nodeId;
    });

    outputDiv.removeAttribute('data-processed');
    outputDiv.textContent = mermaidCode;
    setTimeout(() => { mermaid.contentLoaded(); }, 100);
}

// Export Flowchart as PNG or SVG
function exportFlowchart(format) {
    const outputDiv = document.getElementById('flowchart-output');
    const svgElement = outputDiv.querySelector('svg');
    
    if (!svgElement) {
        alert('Please generate a flowchart first before exporting.');
        return;
    }

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    
    if (format === 'svg') {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flowchart.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else if (format === 'png') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const svgBox = svgElement.getBoundingClientRect();
        
        canvas.width = svgBox.width * 2; // High resolution scale
        canvas.height = svgBox.height * 2;
        
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = function() {
            context.fillStyle = '#0d1117';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = 'flowchart.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
}