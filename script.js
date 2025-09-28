class CurrencyCalculator {
    constructor() {
        this.apiKey = 'fca_live_5vVYlKj5sX5bXJ2X7kK3vV8dF9cG2hH3'; // API key de ejemplo (deberías reemplazarla)
        this.apiBaseUrl = 'https://api.exchangerate-api.com/v4/latest/';
        this.rates = {};
        this.lastUpdate = null;
        this.history = JSON.parse(localStorage.getItem('currencyHistory') || '[]');
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialRates();
        this.updateHistoryDisplay();
    }

    initializeElements() {
        this.fromAmount = document.getElementById('from-amount');
        this.fromCurrency = document.getElementById('from-currency');
        this.toCurrency = document.getElementById('to-currency');
        this.resultAmount = document.getElementById('result-amount');
        this.exchangeRate = document.getElementById('exchange-rate');
        this.convertBtn = document.getElementById('convert-btn');
        this.swapBtn = document.getElementById('swap-currencies');
        this.lastUpdateSpan = document.getElementById('last-update');
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.convertCurrency());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Convertir al presionar Enter
        this.fromAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertCurrency();
            }
        });

        // Auto-convertir al cambiar monedas
        this.fromCurrency.addEventListener('change', () => this.autoConvert());
        this.toCurrency.addEventListener('change', () => this.autoConvert());
        this.fromAmount.addEventListener('input', () => this.autoConvert());
    }

    async loadInitialRates() {
        try {
            await this.fetchRates('USD');
            this.updateLastUpdateTime();
            this.autoConvert();
        } catch (error) {
            console.error('Error cargando tasas iniciales:', error);
            this.showError('Error al cargar las tasas de cambio');
        }
    }

    async fetchRates(baseCurrency) {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBaseUrl}${baseCurrency}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.rates = data.rates;
            this.lastUpdate = new Date();
            this.updateLastUpdateTime();
            
            return this.rates;
        } catch (error) {
            console.error('Error obteniendo tasas:', error);
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async convertCurrency() {
        const amount = parseFloat(this.fromAmount.value);
        
        if (!amount || amount <= 0) {
            this.showError('Por favor ingrese una cantidad válida');
            return;
        }

        const fromCurrency = this.fromCurrency.value;
        const toCurrency = this.toCurrency.value;

        try {
            this.showLoading(true);
            
            // Si no tenemos tasas para la moneda base, obtenerlas
            if (!this.rates[fromCurrency]) {
                await this.fetchRates(fromCurrency);
            }

            const rate = this.rates[toCurrency];
            const result = amount * rate;
            
            this.resultAmount.textContent = this.formatNumber(result);
            this.exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            
            // Guardar en historial
            this.addToHistory(amount, fromCurrency, result, toCurrency, rate);
            
        } catch (error) {
            console.error('Error en conversión:', error);
            this.showError('Error al realizar la conversión');
        } finally {
            this.showLoading(false);
        }
    }

    async autoConvert() {
        const amount = parseFloat(this.fromAmount.value);
        
        if (!amount || amount <= 0) {
            this.resultAmount.textContent = '0.00';
            this.exchangeRate.textContent = '1 USD = 0.85 EUR';
            return;
        }

        const fromCurrency = this.fromCurrency.value;
        const toCurrency = this.toCurrency.value;

        try {
            // Si no tenemos tasas para la moneda base, obtenerlas
            if (!this.rates[fromCurrency]) {
                await this.fetchRates(fromCurrency);
            }

            const rate = this.rates[toCurrency];
            const result = amount * rate;
            
            this.resultAmount.textContent = this.formatNumber(result);
            this.exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            
        } catch (error) {
            console.error('Error en auto-conversión:', error);
            // No mostrar error en auto-conversión para no molestar al usuario
        }
    }

    swapCurrencies() {
        const fromValue = this.fromCurrency.value;
        const toValue = this.toCurrency.value;
        
        this.fromCurrency.value = toValue;
        this.toCurrency.value = fromValue;
        
        // Auto-convertir después de intercambiar
        this.autoConvert();
    }

    addToHistory(amount, fromCurrency, result, toCurrency, rate) {
        const historyItem = {
            id: Date.now(),
            amount: amount,
            fromCurrency: fromCurrency,
            result: result,
            toCurrency: toCurrency,
            rate: rate,
            timestamp: new Date()
        };

        this.history.unshift(historyItem);
        
        // Mantener solo las últimas 20 conversiones
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }

        localStorage.setItem('currencyHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">No hay conversiones recientes</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-amount">
                    ${this.formatNumber(item.amount)} ${item.fromCurrency} → ${this.formatNumber(item.result)} ${item.toCurrency}
                </div>
                <div class="history-time">
                    ${this.formatTime(item.timestamp)}
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('¿Estás seguro de que quieres limpiar el historial de conversiones?')) {
            this.history = [];
            localStorage.removeItem('currencyHistory');
            this.updateHistoryDisplay();
        }
    }

    updateLastUpdateTime() {
        if (this.lastUpdate) {
            this.lastUpdateSpan.textContent = this.formatTime(this.lastUpdate);
        } else {
            this.lastUpdateSpan.textContent = 'No disponible';
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} d`;
        
        return date.toLocaleDateString('es-ES');
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('active');
        } else {
            this.loadingOverlay.classList.remove('active');
        }
    }

    showError(message) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #fff;
            z-index: 1001;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Añadir animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar la calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyCalculator();
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Manejar errores de red no capturados
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
});