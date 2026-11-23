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

// Aktualisiert den gesamten Warenkorb und speichert die Daten.
function renderBasket() {
    renderBasketItems();
    updateBasketPrices();
    updateBasketView();
    updateBasketItemsHeight();
    updateMobileBasketCount();
    updateMealButtons();
    saveDataToLocalStorage();
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

    const styles = getComputedStyle(basketItemsRef);
    const items = Array.from(basketItemsRef.children).slice(0, 3);
    const gap = parseFloat(styles.rowGap) || 0;
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;

    const height = calculateBasketItemsHeight(items, gap);
    basketItemsRef.style.maxHeight = `${height + paddingTop + paddingBottom + 2}px`;
}


// Aktualisiert die Warenkorb-Scrollhöhe im nächsten Animationsframe.
function scheduleBasketHeightUpdate() {
    requestAnimationFrame(updateBasketItemsHeight);
}

// Aktualisiert den Buttontext und Zustand der Gerichte.
function updateMealButtons() {
    const buttons = document.querySelectorAll('.meal-add-button');

    for (const button of buttons) {
        const mealIndex = Number(button.dataset.mealIndex);
        const basketItem = basket.find(item => item.mealIndex === mealIndex);

        button.textContent = basketItem ? `Added ${basketItem.quantity}` : 'Add to basket';
        button.classList.toggle('is-added', Boolean(basketItem));
    }
}
