# 🌍 Calculadora de Divisas - maykolg

¡Bienvenido a la Calculadora de Divisas profesional! Esta es una aplicación web completa para convertir entre diferentes monedas utilizando tasas de cambio en tiempo real. 🚀

## 📋 Descripción del Proyecto

Esta calculadora de divisas es una aplicación web moderna y responsiva que permite a los usuarios convertir cantidades entre diferentes monedas utilizando tasas de cambio actualizadas. La aplicación features un diseño elegante en blanco y negro, con una interfaz intuitiva y profesional.

### ✨ Características Principales

- 🔄 **Conversión en tiempo real**: Utiliza API de tasas de cambio actualizadas
- 💱 **Múltiples monedas**: Soporta 15 monedas principales incluyendo USD, EUR, GBP, JPY, y monedas latinoamericanas
- 📱 **Diseño responsivo**: Funciona perfectamente en desktop, tablet y móvil
- 🎨 **Tema blanco y negro**: Diseño minimalista y profesional
- 📊 **Historial de conversiones**: Guarda las últimas 20 conversiones realizadas
- 🔄 **Intercambio rápido**: Botón para intercambiar monedas con un solo clic
- 💾 **Almacenamiento local**: El historial se guarda en el navegador del usuario
- ⚡ **Auto-conversión**: Convierte automáticamente al escribir o cambiar monedas
- 🎯 **Interfaz intuitiva**: Fácil de usar para todos los usuarios

## 🏗️ Estructura del Proyecto

El proyecto está organizado en una sola carpeta con los siguientes archivos:

```
github-pages-currency-calculator/
├── index.html          # 📄 Estructura HTML principal
├── style.css           # 🎨 Estilos CSS para el diseño
├── script.js           # ⚡ Lógica JavaScript de la aplicación
└── README.md           # 📖 Documentación del proyecto
```

## 📄 Archivos y su Funcionalidad

### 🏠 `index.html`
Este archivo contiene la estructura HTML completa de la aplicación:

- **Header**: Título principal y subtítulo descriptivo
- **Main Content**: 
  - Tarjeta de calculadora con campos de entrada y selección de monedas
  - Botón de intercambio de monedas con animación
  - Sección de resultados con el monto convertido y tasa de cambio
  - Botón de conversión principal
- **Info Card**: Muestra información sobre las tasas y última actualización
- **History Section**: Historial de conversiones recientes
- **Footer**: Información de créditos
- **Loading Overlay**: Indicador de carga durante las conversiones

### 🎨 `style.css`
Archivo de estilos CSS que define el aspecto visual de la aplicación:

- **Diseño en blanco y negro**: Únicamente utiliza estos dos colores para un look minimalista
- **Tipografía Inter**: Fuente moderna y legible
- **Diseño responsivo**: Media queries para diferentes tamaños de pantalla
- **Animaciones sutiles**: Transiciones suaves y efectos hover
- **Tarjetas con sombras**: Efecto de profundidad con bordes negros
- **Botones interactivos**: Estados hover y active bien definidos
- **Scrollbar personalizado**: Estilo coherente con el diseño general

### ⚡ `script.js`
Contiene toda la lógica de la aplicación JavaScript:

- **Clase CurrencyCalculator**: Clase principal que maneja toda la funcionalidad
- **Integración con API**: Utiliza ExchangeRate-API para obtener tasas en tiempo real
- **Gestión de errores**: Manejo robusto de errores y mensajes para el usuario
- **Historial local**: Almacenamiento en localStorage del historial de conversiones
- **Auto-conversión**: Convierte automáticamente al cambiar valores
- **Event listeners**: Manejo de eventos de usuario como clics y entrada de teclado
- **Formateo de números**: Formato localizado para cantidades monetarias
- **Gestión de tiempo**: Formateo relativo de timestamps

## 🔧 Cómo Funciona el Código

### 1. Inicialización 🚀
```javascript
class CurrencyCalculator {
    constructor() {
        this.apiKey = 'fca_live_...'; // API key para tasas de cambio
        this.apiBaseUrl = 'https://api.exchangerate-api.com/v4/latest/';
        this.rates = {}; // Objeto para almacenar tasas
        this.history = JSON.parse(localStorage.getItem('currencyHistory') || '[]');
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialRates();
        this.updateHistoryDisplay();
    }
}
```

### 2. Obtención de Tasas 📊
```javascript
async fetchRates(baseCurrency) {
    try {
        this.showLoading(true);
        const response = await fetch(`${this.apiBaseUrl}${baseCurrency}`);
        const data = await response.json();
        this.rates = data.rates;
        this.lastUpdate = new Date();
        return this.rates;
    } catch (error) {
        console.error('Error obteniendo tasas:', error);
        throw error;
    } finally {
        this.showLoading(false);
    }
}
```

### 3. Conversión de Moneda 💱
```javascript
async convertCurrency() {
    const amount = parseFloat(this.fromAmount.value);
    const fromCurrency = this.fromCurrency.value;
    const toCurrency = this.toCurrency.value;

    const rate = this.rates[toCurrency];
    const result = amount * rate;
    
    this.resultAmount.textContent = this.formatNumber(result);
    this.exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    this.addToHistory(amount, fromCurrency, result, toCurrency, rate);
}
```

### 4. Gestión de Historial 📝
```javascript
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
    if (this.history.length > 20) {
        this.history = this.history.slice(0, 20);
    }

    localStorage.setItem('currencyHistory', JSON.stringify(this.history));
    this.updateHistoryDisplay();
}
```

## 🌐 Monedas Soportadas

La calculadora soporta las siguientes monedas:

- **USD** - Dólar Estadounidense 🇺🇸
- **EUR** - Euro 🇪🇺
- **GBP** - Libra Esterlina 🇬🇧
- **JPY** - Yen Japonés 🇯🇵
- **CHF** - Franco Suizo 🇨🇭
- **CAD** - Dólar Canadiense 🇨🇦
- **AUD** - Dólar Australiano 🇦🇺
- **CNY** - Yuan Chino 🇨🇳
- **MXN** - Peso Mexicano 🇲🇽
- **ARS** - Peso Argentino 🇦🇷
- **BRL** - Real Brasileño 🇧🇷
- **CLP** - Peso Chileno 🇨🇱
- **COP** - Peso Colombiano 🇨🇴
- **PEN** - Sol Peruano 🇵🇪
- **UYU** - Peso Uruguayo 🇺🇾

## 🚀 Cómo Usar

1. **Ingresar cantidad**: Escribe el monto que deseas convertir en el campo principal
2. **Seleccionar monedas**: Elige la moneda de origen y destino usando los menús desplegables
3. **Convertir**: Haz clic en el botón "Convertir" o presiona Enter
4. **Ver resultados**: El monto convertido aparece inmediatamente con la tasa de cambio
5. **Intercambiar**: Usa el botón de flechas para intercambiar monedas rápidamente
6. **Historial**: Revisa tus conversiones anteriores en la sección de historial

## 🔧 Configuración para GitHub Pages

Para desplegar esta aplicación en GitHub Pages:

1. **Crear repositorio**: Crea un nuevo repositorio en GitHub
2. **Subir archivos**: Sube todos los archivos (`index.html`, `style.css`, `script.js`, `README.md`)
3. **Configurar Pages**: 
   - Ve a Settings > Pages
   - Selecciona la rama main
   - Selecciona la carpeta raíz (/)
   - Haz clic en Save
4. **Acceder**: Tu sitio estará disponible en `https://[tu-usuario].github.io/[nombre-repositorio]`

## 🛠️ Tecnologías Utilizadas

- **HTML5** 📄 - Estructura semántica de la aplicación
- **CSS3** 🎨 - Estilos y diseño responsivo
- **JavaScript ES6+** ⚡ - Lógica de la aplicación
- **ExchangeRate-API** 🌐 - Servicio de tasas de cambio
- **LocalStorage** 💾 - Almacenamiento en el navegador
- **GitHub Pages** 🌍 - Hosting gratuito

## 🎯 Mejoras Futuras

- [ ] Gráficos históricos de tasas de cambio
- [ ] Modo offline con tasas caché
- [ ] Soporte para más monedas
- [ ] Calculadora de conversión múltiple
- [ ] Notificaciones de cambios significativos en tasas
- [ ] Exportación de historial a CSV/Excel

## 📝 Notas Importantes

⚠️ **API Key**: La aplicación incluye una API key de ejemplo. Para uso en producción, debes obtener tu propia API key gratuita en [ExchangeRate-API](https://www.exchangerate-api.com).

⚠️ **Limitaciones**: La API gratuita tiene límites de uso. Para alto tráfico, considera actualizar a un plan pago.

⚠️ **Precisión**: Las tasas de cambio son proporcionadas por terceros y pueden tener pequeñas variaciones.

## 👨‍💻 Créditos

Este proyecto fue desarrollado por **maykolg** en 2025. Todos los derechos reservados.

- **Desarrollo**: maykolg
- **Diseño**: maykolg
- **Licencia**: Todos los derechos reservados

---

🌟 ¡Gracias por usar la Calculadora de Divisas de maykolg! Si encuentras algún problema o tienes sugerencias, no dudes en contactar.