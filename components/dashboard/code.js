import { getTotals } from "./services.js"

var intervalData

export function init(){
    console.log('Initializing dashboard...')
    getData()
}

function getData() {
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    getTotals(date).then( (response) => {
        console.log(response)
        //Change values
        document.getElementById('label-active-sessions').textContent = response.activeSessions
        document.getElementById('label-active-calls').textContent = response.activeCalls
        document.getElementById('label-total-calls').textContent = response.totalCalls
        document.getElementById('label-avg-handle-time').textContent = response.averageHandleTime.value
        document.getElementById('label-wait-time').textContent = response.waitTime.value
        document.getElementById('label-calls-in-queue').textContent = response.callsInQueue.value
        //Set colors
        //Calls in Queue
        document.getElementById('div-avg-handle').style.background = 'var(--' + response.averageHandleTime.status + ')'
        document.getElementById('icon-avg-handle').style.background = 'var(--' + response.averageHandleTime.status + ')'
        document.getElementById('value-avg-handle').style.background = 'var(--' + response.averageHandleTime.status + ')'
        document.getElementById('div-avg-handle-bottom').style.background = 'var(--' + response.averageHandleTime.status + 'Dark)'
        //Calls in Queue
        document.getElementById('div-wait-time').style.background = 'var(--' + response.waitTime.status + ')'
        document.getElementById('icon-wait-time').style.background = 'var(--' + response.waitTime.status + ')'
        document.getElementById('value-wait-time').style.background = 'var(--' + response.waitTime.status + ')'
        document.getElementById('div-wait-time-bottom').style.background = 'var(--' + response.waitTime.status + 'Dark)'
        //Calls in Queue
        document.getElementById('div-calls-in-queue').style.background = 'var(--' + response.callsInQueue.status + ')'
        document.getElementById('icon-calls-in-call').style.background = 'var(--' + response.callsInQueue.status + ')'
        document.getElementById('value-calls-in-call').style.background = 'var(--' + response.callsInQueue.status + ')'
        document.getElementById('div-calls-in-queue-bottom').style.background = 'var(--' + response.callsInQueue.status + 'Dark)'

        //Draw chart
        drawChart(response)
    })
    
    clearInterval(intervalData)
    intervalData = setInterval(getData, 10000)
}


function drawChart(data) {
    console.log('Drawing charts...');
    Highcharts.chart('chart-duration', Highcharts.merge(padresDarkTheme, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Call Duration'
        },
        subtitle: {
            text: data.date,
            text: ' minutes'
        },
        xAxis: {
            categories: data.duration.minutes
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total calls'
            }
        },
        series: [
            {
                name: 'Calls',
                data: data.duration.totals,
                color: '#4A3B30'
            }
        ]
    }));
    Highcharts.chart('chart-hour', Highcharts.merge(padresDarkTheme, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Call Volume'
        },
        subtitle: {
            text: data.date,
            text: ' per hour'
        },
        xAxis: {
            categories: data.totals.hour
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total calls'
            }
        },
        series: [
            {
                name: 'Calls',
                data: data.totals.totals,
                color: '#4A3B30'
            }
        ]
    })); 
}

const padresDarkTheme = {
    chart: {
        backgroundColor: '#2D241C',  // Fondo marrón oscuro
        style: {
            fontFamily: '"Open Sans", sans-serif'
        }
    },
    colors: [
        '#FFD700', // Oro
        '#5F4B32', // Marrón oscuro
        '#A67C52', // Marrón claro
        '#2D241C', // Marrón muy oscuro
        '#C0A480', // Beige
        '#3A2E1F'  // Marrón medio
    ],
    title: {
        style: { 
            color: '#FFD700', // Oro
            fontWeight: 'bold',
            fontSize: '20px'
        }
    },
    subtitle: {
        style: { 
            color: '#C0A480', // Beige dorado
            fontSize: '14px'
        }
    },
    xAxis: {
        labels: { 
            style: { 
                color: '#FFD700', // Oro
                fontSize: '12px'
            } 
        },
        title: {
            style: {
                color: '#FFD700' // Oro
            }
        },
        lineColor: '#5F4B32', // Marrón oscuro para la línea del eje
        tickColor: '#A67C52'   // Marrón claro para las marcas
    },
    yAxis: {
        title: { 
            style: { 
                color: '#FFD700', // Oro
                fontWeight: 'bold'
            } 
        },
        labels: { 
            style: { 
                color: '#FFD700', // Oro
                fontSize: '12px'
            } 
        },
        gridLineColor: '#5F4B32', // Marrón oscuro para las líneas de la grilla
        minorGridLineColor: '#3A2E1F' // Marrón más oscuro para líneas secundarias
    },
    legend: {
        itemStyle: { 
            color: '#FFD700' // Oro para los ítems de leyenda
        },
        itemHoverStyle: {
            color: '#C0A480' // Beige dorado al pasar el mouse
        }
    },
    tooltip: {
        backgroundColor: '#2D241C', // Fondo marrón muy oscuro
        borderColor: '#FFD700',    // Borde dorado
        style: {
            color: '#FFD700'       
        }
    },
    plotOptions: {
        series: {
            borderColor: '#2D241C',
            dataLabels: {
                color: '#FFD700'   
            }
        }
    }
};