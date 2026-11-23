// Speichert sämtliche Gerichte und den Warenkorb im LocalStorage.
function saveDataToLocalStorage() {
    const data = {
        meals: meals,
        basket: basket
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Prüft, ob ein gespeichertes Gericht gültige Eigenschaften besitzt.
function isValidMeal(meal) {
    if (meal === null || typeof meal !== 'object') return false;

    return typeof meal.name === 'string'
        && typeof meal.description === 'string'
        && typeof meal.type === 'string'
        && typeof meal.picture === 'string'
        && typeof meal.price === 'number'
        && ['burger', 'pizza', 'salad'].includes(meal.type);
}

// Stellt die gespeicherten Gerichte aus dem LocalStorage wieder her.
function loadStoredMeals(storedMeals) {
    if (!Array.isArray(storedMeals) || storedMeals.length === 0) return;

    for (let meal of storedMeals) {
        if (!isValidMeal(meal)) return;
    }

    meals.length = 0;

    for (let meal of storedMeals) {
        meals.push(meal);
    }
}

// Prüft, ob ein gespeicherter Warenkorbeintrag gültig ist.
function isValidBasketItem(item) {
    if (item === null || typeof item !== 'object') return false;

    return Number.isInteger(item.mealIndex)
        && item.mealIndex >= 0
        && item.mealIndex < meals.length
        && Number.isInteger(item.quantity)
        && item.quantity > 0;
}

// Stellt den gespeicherten Warenkorb wieder her.
function loadStoredBasket(storedBasket) {
    if (!Array.isArray(storedBasket)) return;

    basket = storedBasket.filter(isValidBasketItem);
}

// Lädt Gerichte und Warenkorb aus dem LocalStorage.
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return;

    try {
        const data = JSON.parse(storedData);
        if (data === null || typeof data !== 'object') return;

        loadStoredMeals(data.meals);
        loadStoredBasket(data.basket);
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
    }
}
