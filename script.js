let basket = [];
let orderDialogTimeout;

// Rendert sämtliche Gerichte anhand ihres Typs in den passenden HTML-Container.
function renderMeals() {
    const mealTypes = ['burger', 'pizza', 'salad'];

    for (let type of mealTypes) {
        document.getElementById(`${type}-list`).innerHTML = '';
    }

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
        const meal = meals[mealIndex];

        const mealContainerRef = document.getElementById(`${meal.type}-list`);

        mealContainerRef.insertAdjacentHTML('beforeend', getMealTemplate(meal, mealIndex));
    }
}

// Fügt ein Gericht zum Warenkorb hinzu oder erhöht dessen Anzahl.
function addToBasket(mealIndex) {
    const existingMeal = basket.find(item => item.mealIndex === mealIndex);

    if (existingMeal) {
        existingMeal.quantity++;
    } else {
        basket.push({
            mealIndex: mealIndex,
            quantity: 1
        });
    }

    renderBasket();
}

// Wechselt zwischen leerem und gefülltem Warenkorb.
function updateBasketView() {
    const basketEmptyRef = document.querySelector('.basket-empty');
    const basketContentRef = document.querySelector('.basket-content');

    if (basket.length === 0) {
        basketEmptyRef.classList.remove('d_none');
        basketContentRef.classList.add('d_none');
    } else {
        basketEmptyRef.classList.add('d_none');
        basketContentRef.classList.remove('d_none');
    }
}

/* Formatiert einen Preis in Euro. */
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + '€';
}

/* Rendert sämtliche Gerichte im Warenkorb. */
function renderBasket() {
    const basketItemsRef = document.querySelector('.basket-items');

    basketItemsRef.innerHTML = '';

    let subtotal = 0;

    for (let basketIndex = 0; basketIndex < basket.length; basketIndex++) {
        const basketItem = basket[basketIndex];
        const meal = meals[basketItem.mealIndex];

        basketItemsRef.innerHTML += getBasketItemTemplate(basketItem);

        subtotal += meal.price * basketItem.quantity;
    }

    const deliveryFee = 4.99;
    const total = subtotal + deliveryFee;

    document.getElementById('basket-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('basket-total').textContent = formatPrice(total);
    document.getElementById('basket-buy-btn').textContent = `Buy now (${formatPrice(total)})`;

    updateBasketView();
}

/* Erhöht oder verringert die Anzahl eines Gerichts. */
function changeBasketQuantity(mealIndex, change) {
    const basketItem = basket.find(item => item.mealIndex === mealIndex);

    if (!basketItem) {
        return;
    }

    basketItem.quantity += change;

    if (basketItem.quantity <= 0) {
        removeFromBasket(mealIndex);
        return;
    }

    renderBasket();
}

/* Entfernt ein Gericht vollständig aus dem Warenkorb. */
function removeFromBasket(mealIndex) {
    basket = basket.filter(item => item.mealIndex !== mealIndex);

    renderBasket();
}

/* Öffnet die Bestellbestätigung und leert den Warenkorb. */
function confirmOrder() {
    if (basket.length === 0) {
        return;
    }

    const orderDialogRef = document.getElementById('order-dialog');

    orderDialogRef.showModal();

    basket = [];
    renderBasket();

    orderDialogTimeout = setTimeout(closeOrderDialog, 10000);
}

/* Schließt die Bestellbestätigung mit einer kurzen Animation. */
function closeOrderDialog() {
    const orderDialogRef = document.getElementById('order-dialog');

    if (!orderDialogRef.open || orderDialogRef.classList.contains('is-closing')) {
        return;
    }

    clearTimeout(orderDialogTimeout);

    // Ausblendanimation starten.
    orderDialogRef.classList.add('is-closing');

    setTimeout(() => {
        orderDialogRef.close();
        orderDialogRef.classList.remove('is-closing');
    }, 250);
}

/* Initialisiert die Speisekarte, den Warenkorb und die Dialog-Events. */
document.addEventListener('DOMContentLoaded', () => {
    renderMeals();
    renderBasket();

    // Bestellung abschließen.
    document.getElementById('basket-buy-btn')
        .addEventListener('click', confirmOrder);

    // Bestätigungsdialog manuell schließen.
    document.getElementById('order-dialog-close-id')
        .addEventListener('click', closeOrderDialog);

    // Auch beim Schließen mit Escape den Timer aufräumen.
    document.getElementById('order-dialog')
        .addEventListener('close', () => {
            clearTimeout(orderDialogTimeout);
        });
});

