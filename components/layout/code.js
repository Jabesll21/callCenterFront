import { getActives, getActiveCallsWithTime } from "./services.js";

export function init() {
    console.log('Initializing layout...');
    console.log('🔗 Using 100% REAL data from database...');
    
    getData();
    // Actualizar cada segundo para tiempos reales
    const intervalId = setInterval(getData, 1000);
}

function getData() {
    console.log('Getting 100% real-time data...');
    
    // Obtener agentes activos (quién está logueado)
    getActives()
        .then((response) => {
            console.log('✅ Active agents loaded:', response);
            processAgentData(response);
        })
        .catch(error => {
            console.error('❌ Error fetching active agents:', error);
            showEmptyStations();
        });
    
    // Obtener llamadas con tiempos REALES
    getActiveCallsWithTime()
        .then((response) => {
            console.log('✅ Real call times loaded:', response);
            processRealCallData(response);
        })
        .catch(error => {
            console.error('❌ Error fetching real call times:', error);
            showBasicCounters();
        });
}

function processAgentData(response) {
    console.log('Processing agent data...');
    var activeStationIds = [];
    
    if (response && response.sessions) {
        response.sessions.forEach(element => {
            if (element.station && element.station.id <= 24) {
                // Determinar si el agente está en llamada basándose en idCurrentCall
                const isInCall = element.idCurrentCall && element.idCurrentCall !== 0;
                drawAgentIcon(element.station.id, element.agent.photo, element.idCurrentCall, true);
                activeStationIds.push(element.station.id);
                
                console.log(`📍 Station ${element.station.id}: ${element.agent.name} - ${isInCall ? '📞 IN CALL' : '✅ AVAILABLE'}`);
            }
        });
    }
    
    // Mostrar estaciones vacías (sin agentes) en gris
    for (let stationId = 1; stationId <= 24; stationId++) {
        if (!activeStationIds.includes(stationId)) {
            drawEmptyStation(stationId);
        }
    }
}

function processRealCallData(response) {
    console.log('Processing REAL call data from database...');
    
    // Crear un mapa para las llamadas activas REALES
    const activeCallStations = new Map();
    
    if (response && response.sessions) {
        response.sessions.forEach(element => {
            if (element.station && element.station.id <= 24) {
                console.log(`⏱️ Station ${element.station.id}: ${element.timeInCall} (${element.status}) - REAL TIME`);
                activeCallStations.set(element.station.id, {
                    timeInCall: element.timeInCall,
                    status: element.status
                });
            }
        });
    }
    
    // Mostrar contadores para todas las estaciones (1-24)
    for (let stationId = 1; stationId <= 24; stationId++) {
        const callData = activeCallStations.get(stationId);
        
        if (callData && callData.timeInCall) {
            // Estación con llamada activa REAL - tiempo 100% real de la base de datos
            drawCallIcon(stationId, callData.timeInCall, callData.status);
        } else {
            // Estación sin llamada - mostrar 00:00
            drawCallIcon(stationId, "00:00", "good");
        }
    }
}

function showBasicCounters() {
    // Mostrar 00:00 en todos los contadores si no hay datos de llamadas
    for (let stationId = 1; stationId <= 24; stationId++) {
        drawCallIcon(stationId, "00:00", "good");
    }
}

function showEmptyStations() {
    // Mostrar todas las estaciones como vacías si no hay datos de agentes
    for (let stationId = 1; stationId <= 24; stationId++) {
        drawEmptyStation(stationId);
    }
}

function drawEmptyStation(stationId) {
    // Limpiar elementos existentes
    removeExistingAgentElements(stationId);
    
    // Verificar que existe el elemento de la estación
    const deskElement = document.getElementById('ws-' + stationId + '-desk');
    if (!deskElement) {
        return;
    }
    
    // Calcular posición (lado derecho del escritorio)
    var cx = deskElement.x.animVal.value + 100;
    var cy = deskElement.y.animVal.value + 25;

    // Crear círculo gris para estación vacía
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.id = 'ws-' + stationId + '-agent-icon';
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 18);
    circle.setAttribute('class', 'agent-icon empty-station');
    document.getElementById('svg-callcenter').appendChild(circle);

    // Mostrar texto "OFF" para indicar que está vacía
    var emptyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emptyText.id = 'ws-' + stationId + '-empty-text';
    emptyText.setAttribute('x', cx);
    emptyText.setAttribute('y', cy + 4);
    emptyText.setAttribute('text-anchor', 'middle');
    emptyText.setAttribute('class', 'empty-station-text');
    emptyText.textContent = 'OFF';
    document.getElementById('svg-callcenter').appendChild(emptyText);
}

function drawAgentIcon(stationId, agentPhoto, currentCallId, isActiveAgent = false) {
    // Limpiar elementos existentes
    removeExistingAgentElements(stationId);
    
    // Verificar que existe el elemento de la estación
    const deskElement = document.getElementById('ws-' + stationId + '-desk');
    if (!deskElement) {
        console.warn(`Desk element ws-${stationId}-desk not found`);
        return;
    }
    
    // Calcular posición (lado derecho del escritorio)
    var cx = deskElement.x.animVal.value + 100;
    var cy = deskElement.y.animVal.value + 25;

    // Determinar el estado del círculo basado en la situación real
    let circleStatus;
    if (!isActiveAgent) {
        circleStatus = "empty-station"; // Estación sin agente
    } else if (currentCallId && currentCallId !== 0) {
        circleStatus = "active-call"; // Agente en llamada
    } else {
        circleStatus = "available"; // Agente disponible
    }

    // Crear clipPath para imagen circular (solo si hay agente)
    if (isActiveAgent) {
        createClipPath(stationId, cx, cy);
    }

    // Crear círculo de fondo para el agente
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.id = 'ws-' + stationId + '-agent-icon';
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 18);
    circle.setAttribute('class', 'agent-icon ' + circleStatus);
    document.getElementById('svg-callcenter').appendChild(circle);

    if (isActiveAgent) {
        // Construir ruta de imagen
        let imagePath = agentPhoto;
        
        // Si viene del backend con URL completa, extraer solo el nombre del archivo
        if (agentPhoto && (agentPhoto.includes('http') || agentPhoto.includes('/'))) {
            const parts = agentPhoto.split('/');
            imagePath = parts[parts.length - 1];
        }
        
        // Crear imagen del agente si existe la foto
        if (agentPhoto && imagePath) {
            const finalImagePath = `photos/agents/${imagePath}`;
            
            var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.id = 'ws-' + stationId + '-photo';
            image.setAttribute('x', cx - 18);
            image.setAttribute('y', cy - 18);
            image.setAttribute('href', finalImagePath);
            image.setAttribute('width', 36);
            image.setAttribute('height', 36);
            image.setAttribute('clip-path', 'url(#circle-clip-' + stationId + ')');
            
            image.onload = function() {
                console.log(`✅ Agent photo loaded for station ${stationId}`);
            };
            
            image.onerror = function() {
                console.log(`❌ Photo not found for station ${stationId}: ${finalImagePath}`);
                showDefaultAgentIcon(stationId, cx, cy, circleStatus);
            };
            
            document.getElementById('svg-callcenter').appendChild(image);
        } else {
            // Si no hay foto definida, mostrar icono por defecto
            showDefaultAgentIcon(stationId, cx, cy, circleStatus);
        }
    } else {
        // Para estaciones vacías, mostrar texto "OFF"
        var emptyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        emptyText.id = 'ws-' + stationId + '-empty-text';
        emptyText.setAttribute('x', cx);
        emptyText.setAttribute('y', cy + 4);
        emptyText.setAttribute('text-anchor', 'middle');
        emptyText.setAttribute('class', 'empty-station-text');
        emptyText.textContent = 'OFF';
        document.getElementById('svg-callcenter').appendChild(emptyText);
    }
}

function drawCallIcon(stationId, timeDisplay, status) {
    // Remover elementos existentes del contador
    removeExistingCallElements(stationId);
    
    // Verificar que existe el elemento de la estación
    const deskElement = document.getElementById('ws-' + stationId + '-desk');
    if (!deskElement) {
        console.warn(`Desk element ws-${stationId}-desk not found`);
        return;
    }
    
    // Calcular posición (lado izquierdo del escritorio para el contador)
    var cx = deskElement.x.animVal.value + 25;
    var cy = deskElement.y.animVal.value + 25;
    
    // Crear círculo de tiempo
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.id = 'ws-' + stationId + '-call-icon';
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 18);
    circle.setAttribute('class', 'call-icon ' + status);
    document.getElementById('svg-callcenter').appendChild(circle);
    
    // Crear texto del tiempo
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.id = 'ws-' + stationId + '-time';
    text.setAttribute('x', cx);
    text.setAttribute('y', cy + 5);
    text.textContent = timeDisplay;
    text.setAttribute('class', 'call-icon-text');
    document.getElementById('svg-callcenter').appendChild(text);
}

function createClipPath(stationId, cx, cy) {
    // Verificar si ya existe el clipPath
    let existingClip = document.getElementById('circle-clip-' + stationId);
    if (existingClip) {
        existingClip.remove();
    }
    
    // Buscar o crear el elemento defs
    let defs = document.querySelector('#svg-callcenter defs');
    if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        document.getElementById('svg-callcenter').appendChild(defs);
    }
    
    var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.id = 'circle-clip-' + stationId;
    
    var clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCircle.setAttribute('cx', cx);
    clipCircle.setAttribute('cy', cy);
    clipCircle.setAttribute('r', 18);
    
    clipPath.appendChild(clipCircle);
    defs.appendChild(clipPath);
}

function showDefaultAgentIcon(stationId, cx, cy, status) {
    // Remover imagen existente si hay
    let existingImage = document.getElementById('ws-' + stationId + '-photo');
    if (existingImage) {
        existingImage.remove();
    }
    
    // Crear un icono por defecto usando el número de la estación
    var defaultIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    defaultIcon.id = 'ws-' + stationId + '-default-icon';
    defaultIcon.setAttribute('x', cx);
    defaultIcon.setAttribute('y', cy + 5);
    defaultIcon.setAttribute('text-anchor', 'middle');
    defaultIcon.setAttribute('class', 'agent-default-icon');
    defaultIcon.textContent = stationId;
    document.getElementById('svg-callcenter').appendChild(defaultIcon);
}

function removeExistingAgentElements(stationId) {
    const elementsToRemove = [
        'ws-' + stationId + '-agent-icon',
        'ws-' + stationId + '-photo',
        'ws-' + stationId + '-default-icon',
        'ws-' + stationId + '-empty-text',
        'circle-clip-' + stationId
    ];
    
    elementsToRemove.forEach(elementId => {
        let element = document.getElementById(elementId);
        if (element) {
            element.remove();
        }
    });
}

function removeExistingCallElements(stationId) {
    const elementsToRemove = [
        'ws-' + stationId + '-call-icon',
        'ws-' + stationId + '-time'
    ];
    
    elementsToRemove.forEach(elementId => {
        let element = document.getElementById(elementId);
        if (element) {
            element.remove();
        }
    });
}

// Función para debug - mostrar información del estado actual
export function getSystemStatus() {
    console.log('=== CALL CENTER LAYOUT STATUS ===');
    console.log('📊 Monitoring all 24 stations');
    console.log('🔄 Updating every 1 second with 100% REAL data');
    console.log('📡 Connected to:', 'http://localhost:5062/api/');
    console.log('🎯 Data source: ActiveCallsWithTime endpoint (100% real)');
    console.log('📋 Color coding:');
    console.log('  🟢 Green (good): 0-1 minutes');
    console.log('  🟡 Yellow (low): 1-3 minutes');
    console.log('  🟠 Orange (mid): 3-5 minutes');
    console.log('  🔴 Red (high): 5-10 minutes');
    console.log('  ⚫ Dark Red (extreme): +10 minutes');
}

// Hacer disponible para debug en consola
window.layoutStatus = getSystemStatus;