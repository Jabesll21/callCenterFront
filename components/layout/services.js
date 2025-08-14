import { config } from '../../js/config.js';

// Get Active Sessions
export async function getActives() {
    const url = config.api.url + "Session/Active";
    console.log('Fetching actives from:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Actives response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching actives:', error);
        throw error;
    }
}

// Get Active Calls with Time - NUEVO ENDPOINT
export async function getActiveCallsWithTime() {
    const url = config.api.url + "Call/ActiveCallsWithTime";
    console.log('Fetching active calls with time from:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Active calls with time response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching active calls with time:', error);
        throw error;
    }
}

// Get Answered Sessions (calls in progress) - MANTENER PARA COMPATIBILIDAD
export async function getAnswered() {
    const url = config.api.url + "Session/Answered";
    console.log('Fetching answered from:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Answered response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching answered:', error);
        throw error;
    }
}

// Get calls from database directly
export async function getCallsFromDatabase() {
    const url = config.api.url + "Call";
    console.log('Fetching calls from database:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Calls from database:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching calls from database:', error);
        throw error;
    }
}

// Get Totals (que SÍ funciona)
export async function getTotals(date) {
    const url = config.api.url + "call/totals/" + date;
    console.log('Fetching totals from:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Totals response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching totals:', error);
        throw error;
    }
}

// Función para testear la conectividad con el API
export async function testApiConnection() {
    try {
        const response = await fetch(config.api.url + 'Session/Active');
        if (response.ok) {
            console.log('✅ API connection successful');
            return true;
        } else {
            console.log('❌ API connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ API connection error:', error.message);
        return false;
    }
}