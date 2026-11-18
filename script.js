let basket = [];

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

    updateBasketView();
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

// Rendert die Gerichte, sobald das HTML-Dokument vollständig aufgebaut ist.
document.addEventListener('DOMContentLoaded', renderMeals);
