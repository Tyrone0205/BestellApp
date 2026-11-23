let basket = [];
let orderDialogTimeout;

const STORAGE_KEY = 'bestellAppData';
const orderDialogRef = document.getElementById('order-dialog');

// Rendert sämtliche Gerichte in den passenden HTML-Container.
function renderMeals() {
    const mealTypes = ['burger', 'pizza', 'salad'];

    for (let type of mealTypes) {
        document.getElementById(`${type}-list`).innerHTML = '';
    }

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
        const meal = meals[mealIndex];
        const containerRef = document.getElementById(`${meal.type}-list`);
        containerRef.insertAdjacentHTML('beforeend', getMealTemplate(meal, mealIndex));
    }
}

// Initialisiert die Website und registriert die Event-Listener.
function initializeApp() {
    loadDataFromLocalStorage();
    renderMeals();
    renderBasket();
    initializeMobileBasket();
    initializeResponsiveBasketEvents();

    document.getElementById('basket-buy-btn').addEventListener('click', confirmOrder);
    document.getElementById('order-dialog-close-id').addEventListener('click', closeOrderDialog);

    orderDialogRef.addEventListener('click', handleOrderDialogClick);
    orderDialogRef.addEventListener('close', () => clearTimeout(orderDialogTimeout));
}

// Startet die Initialisierung, sobald der DOM geladen wurde.
document.addEventListener('DOMContentLoaded', initializeApp);
