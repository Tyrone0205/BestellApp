
let basket = [];
let orderDialogTimeout;
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

// Fügt ein Gericht hinzu oder erhöht die vorhandene Anzahl.
function addToBasket(mealIndex) {
    const existingMeal = basket.find(item => item.mealIndex === mealIndex);

    if (existingMeal) {
        existingMeal.quantity++;
    } else {
        basket.push({ mealIndex: mealIndex, quantity: 1 });
    }

    renderBasket();
}

// Wechselt zwischen leerem und gefülltem Warenkorb.
function updateBasketView() {
    const isEmpty = basket.length === 0;

    document.querySelector('.basket-empty').classList.toggle('d_none', !isEmpty);
    document.querySelector('.basket-content').classList.toggle('d_none', isEmpty);
}

// Formatiert einen Preis in Euro.
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + '€';
}

// Rendert die HTML-Karten der Gerichte im Warenkorb.
function renderBasketItems() {
    const basketItemsRef = document.querySelector('.basket-items');
    basketItemsRef.innerHTML = '';

    for (let basketItem of basket) {
        basketItemsRef.innerHTML += getBasketItemTemplate(basketItem);
    }
}

// Berechnet die Zwischensumme aller Gerichte.
function calculateSubtotal() {
    let subtotal = 0;

    for (let basketItem of basket) {
        subtotal += meals[basketItem.mealIndex].price * basketItem.quantity;
    }

    return subtotal;
}

// Aktualisiert die Preisübersicht und den Bestellbutton.
function updateBasketPrices() {
    const subtotal = calculateSubtotal();
    const total = subtotal + 4.99;

    document.getElementById('basket-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('basket-total').textContent = formatPrice(total);
    document.getElementById('basket-buy-btn').textContent = `Buy now (${formatPrice(total)})`;
}

// Aktualisiert den gesamten Warenkorb.
function renderBasket() {
    renderBasketItems();
    updateBasketPrices();
    updateBasketView();
    updateBasketItemsHeight();
    updateMobileBasketCount();
}

// Erhöht oder verringert die Anzahl eines Gerichts.
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

// Entfernt ein Gericht vollständig aus dem Warenkorb.
function removeFromBasket(mealIndex) {
    basket = basket.filter(item => item.mealIndex !== mealIndex);
    renderBasket();
}

// Öffnet die Bestellbestätigung und leert den Warenkorb.
function confirmOrder() {
    if (basket.length === 0) {
        return;
    }

    closeMobileBasket();
    orderDialogRef.showModal();

    basket = [];
    renderBasket();

    orderDialogTimeout = setTimeout(closeOrderDialog, 10000);
}

// Startet die Schließanimation des Bestätigungsdialogs.
function closeOrderDialog() {
    if (!orderDialogRef.open || orderDialogRef.classList.contains('is-closing')) {
        return;
    }

    clearTimeout(orderDialogTimeout);
    orderDialogRef.classList.add('is-closing');
    setTimeout(finishCloseOrderDialog, 250);
}

// Schließt den Dialog nach der Animation vollständig.
function finishCloseOrderDialog() {
    orderDialogRef.close();
    orderDialogRef.classList.remove('is-closing');
}

// Prüft, ob außerhalb des Bestätigungsdialogs geklickt wurde.
function handleOrderDialogClick(event) {
    const rect = orderDialogRef.getBoundingClientRect();
    const outsideX = event.clientX < rect.left || event.clientX > rect.right;
    const outsideY = event.clientY < rect.top || event.clientY > rect.bottom;

    if (outsideX || outsideY) {
        closeOrderDialog();
    }
}

// Öffnet den mobilen Warenkorb als Dialog.
function openMobileBasket() {
    const dialogRef = document.getElementById('mobile-basket-dialog');
    const basketRef = document.querySelector('.basket');

    dialogRef.appendChild(basketRef);
    dialogRef.showModal();
}

// Schließt den mobilen Warenkorb.
function closeMobileBasket() {
    const dialogRef = document.getElementById('mobile-basket-dialog');

    if (dialogRef.open) {
        dialogRef.close();
    }
}

// Verschiebt den Warenkorb zurück in seine Desktop-Spalte.
function restoreBasket() {
    const basketRef = document.querySelector('.basket');
    document.querySelector('.basket-wrapper').appendChild(basketRef);
    scheduleBasketHeightUpdate();
}

// Schließt den Dialog beim Klicken außerhalb.
function handleMobileBasketClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const outsideX = event.clientX < rect.left || event.clientX > rect.right;
    const outsideY = event.clientY < rect.top || event.clientY > rect.bottom;

    if (outsideX || outsideY) {
        closeMobileBasket();
    }
}

// Registriert die Events des mobilen Warenkorbs.
function initializeMobileBasket() {
    const dialogRef = document.getElementById('mobile-basket-dialog');

    document.getElementById('mobile-basket-button').addEventListener('click', openMobileBasket);
    document.getElementById('mobile-basket-close').addEventListener('click', closeMobileBasket);

    dialogRef.addEventListener('close', restoreBasket);
    dialogRef.addEventListener('click', handleMobileBasketClick);
}

// Aktualisiert die Anzahl im mobilen Warenkorb-Icon.
function updateMobileBasketCount() {
    const count = basket.reduce((total, item) => total + item.quantity, 0);
    const countRef = document.getElementById('mobile-basket-count');

    countRef.textContent = count;
    countRef.classList.toggle('d_none', count === 0);
}

// Berechnet die Gesamthöhe der ersten drei Warenkorb-Karten.
function calculateBasketItemsHeight(items, gap) {
    let height = 0;

    for (const item of items) {
        height += item.offsetHeight;
    }

    return height + Math.max(items.length - 1, 0) * gap;
}

// Passt den Scrollbereich an maximal drei vollständige Gerichte an.
function updateBasketItemsHeight() {
    const basketItemsRef = document.querySelector('.basket-items');

    if (basketItemsRef.offsetWidth === 0) return;

    const items = Array.from(basketItemsRef.children).slice(0, 3);
    const gap = parseFloat(getComputedStyle(basketItemsRef).rowGap) || 0;
    const height = calculateBasketItemsHeight(items, gap);

    basketItemsRef.style.maxHeight = `${height}px`;
}

// Aktualisiert die Warenkorb-Scrollhöhe im nächsten Animationsframe.
function scheduleBasketHeightUpdate() {
    requestAnimationFrame(updateBasketItemsHeight);
}

// Schließt den mobilen Warenkorb beim Wechsel zum Desktop.
function handleDesktopBreakpointChange(event) {
    if (event.matches) {
        closeMobileBasket();
    }
}

// Registriert die Events für das responsive Warenkorb-Layout.
function initializeResponsiveBasketEvents() {
    const desktopBreakpoint = window.matchMedia('(min-width: 901px)');

    desktopBreakpoint.addEventListener('change', handleDesktopBreakpointChange);
    window.addEventListener('resize', scheduleBasketHeightUpdate);

    document.getElementById('mobile-basket-dialog')
        .addEventListener('toggle', scheduleBasketHeightUpdate);
}

// Initialisiert die Website und registriert die Event-Listener.
function initializeApp() {
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
