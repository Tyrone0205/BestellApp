// Erstellt das HTML-Template für eine Gerichtskarte.
function getMealTemplate(meal, mealIndex) {
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
                    <button type="button" onclick="addToBasket(${mealIndex})">Add to basket</button>
                </div>
            </article>`;
}