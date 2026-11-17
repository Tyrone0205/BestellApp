// Rendert sämtliche Gerichte anhand ihres Typs in den passenden HTML-Container.
function renderMeals() {
    const mealTypes = ['burger', 'pizza', 'salad'];

    for (let type of mealTypes) {
        document.getElementById(`${type}-list`).innerHTML = '';
    }

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
        const meal = meals[mealIndex];

        const mealContainerRef = document.getElementById(`${meal.type}-list`);

        mealContainerRef.insertAdjacentHTML('beforeend', getMealTemplate(meal));
    }
}

// Erstellt das HTML-Template für eine Gerichtskarte.
function getMealTemplate(meal) {
    return `<article class="meal-card">
                <img class="meal-card-image"
                    src="${meal.picture}"
                    alt="${meal.name}">

                <div class="meal-card-info">
                    <h3>${meal.name}</h3>
                    <p>${meal.description}</p>
                </div>

                <div class="meal-card-order">
                    <span class="meal-price">${meal.price.toFixed(2).replace('.', ',')}€</span>
                    <button type="button">Add to basket</button>
                </div>
            </article>`;
}
