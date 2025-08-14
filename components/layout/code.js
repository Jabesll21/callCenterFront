import { getActives, getAnswered } from "./services.js";

export function init() {
    console.log('Initializing layout...');

    getData()

    const intervalId = setInterval(getData, 1000);
}

function getData(){
    console.log('Getting Data...')
    //Fetch active agents to draw his icon/image (right)
    getActives()
        .then( (response) => {
            console.log('Actives')
            var indexes = []
            response.sessions.forEach(element => {
                drawAgentIcon(element.station.id, element.agent.photo, element.idCurrentCall)
                indexes.push(element.station.id)
            });
            cleanAgentIcons(indexes)
        })
    //Fetch answered calls to print its time (left)
    getAnswered()
        .then( (response) => {
            console.log('Answered')
            var indexes = []
            response.sessions.forEach(element => {
                drawCallIcon(element.station.id, element.timeInCall.substring(3), element.status)
                indexes.push(element.station.id)
            });
            cleanCallIcons(indexes)
        })
}

function drawAgentIcon(aId, aPhoto, aStatus) {
    //Si ya estaba este elemento en el HTML, borrar para no imprimirlo de nuevo
    if (document.getElementById('ws-' + aId + '-agent-icon')) {
        document.getElementById('ws-' + aId + '-agent-icon').remove()
        document.getElementById('ws-' + aId + '-photo').remove()
        document.getElementById('circle-clip-' + aId)?.remove()
    }
    
    //position
    var cx = 0;
    var cy = 0;
    cx = document.getElementById('ws-'+aId+'-desk').x.animVal.value + 100
    cy = document.getElementById('ws-'+aId+'-desk').y.animVal.value + 25

    // Add clipPath for circular image
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.id = 'circle-clip-' + aId;
    
    var clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCircle.setAttribute('cx', cx);
    clipCircle.setAttribute('cy', cy);
    clipCircle.setAttribute('r', 18);
    
    clipPath.appendChild(clipCircle);
    defs.appendChild(clipPath);
    document.getElementById('svg-callcenter').appendChild(defs);

    //circle background
    var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.id = 'ws-' + aId + '-agent-icon'; 
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 18);
    if (aStatus != 0)
        aStatus = "good"
    circle.setAttribute('class', 'call-icon ' + aStatus);
    document.getElementById('svg-callcenter').appendChild(circle);

    //image
    var image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    image.id = 'ws-' + aId + '-photo'
    image.setAttribute('x', cx - 18);
    image.setAttribute('y', cy - 18);
    image.setAttribute('href', '/TorresParcial2/TorresParcial2/callCenterFront/photos/' + aPhoto);
    image.setAttribute('width', 36);
    image.setAttribute('height', 36);
    image.setAttribute('clip-path', 'url(#circle-clip-' + aId + ')');
    image.onerror = function() {
        console.error('Error loading image:', aPhoto);
    };
    document.getElementById('svg-callcenter').appendChild(image);
}

function drawCallIcon(wsId, wsTime, wsStatus) {
    if (document.getElementById('ws-' + wsId + '-call-icon')) {
        document.getElementById('ws-' + wsId + '-call-icon').remove()
        document.getElementById('ws-' + wsId + '-time').remove()
    }
    //position
    var cx = 0;
    var cy = 0;
    cx = document.getElementById('ws-'+wsId+'-desk').x.animVal.value + 25
    cy = document.getElementById('ws-'+wsId+'-desk').y.animVal.value + 25
    //circle
    var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.id = 'ws-' + wsId + '-call-icon'; 
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 18);
    circle.setAttribute('class', 'call-icon ' + wsStatus);
    document.getElementById('svg-callcenter').appendChild(circle);
    //text
    var text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.id = 'ws-' + wsId + '-time';
    text.setAttribute('x', cx);
    text.setAttribute('y', (cy + 5));
    text.innerHTML = wsTime;
    text.setAttribute('class', 'call-icon-text');
    document.getElementById('svg-callcenter').appendChild(text);
}

//Si el id no esta en la lista de los obtenidos de la DB, pero sí está en el HTML, borrar
function cleanAgentIcons(indexes){
    for (let i = 1; i < 25; i++) {
        if (!indexes.includes(i)) {
            if (document.getElementById('ws-' + i + '-agent-icon')) {
                document.getElementById('ws-' + i + '-agent-icon').remove()
                document.getElementById('ws-' + i + '-photo').remove()
            }
        }
    }
}

function cleanCallIcons(indexes){
    for (let i = 1; i < 25; i++) {
        if (!indexes.includes(i)) {
            if (document.getElementById('ws-' + i + '-call-icon')) {
            document.getElementById('ws-' + i + '-call-icon').remove()
            document.getElementById('ws-' + i + '-time').remove()
            }
        }
    }
}
