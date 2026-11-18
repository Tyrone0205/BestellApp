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


/* Erstellt das HTML-Template für ein Gericht im Warenkorb. */
function getBasketItemTemplate(basketItem) {
    const meal = meals[basketItem.mealIndex];

    const deleteButton = `
        <button class="basket-delete-btn"
                type="button"
                onclick="removeFromBasket(${basketItem.mealIndex})"
                aria-label="Remove ${meal.name}">
            <img src="./assets/icons/delete.svg" alt="">
        </button>
    `;

    return `
        <article class="basket-item">

            <div class="basket-item-top">
                <h3>${basketItem.quantity} x ${meal.name}</h3>

                ${basketItem.quantity > 1 ? deleteButton : ''}
            </div>

            <div class="basket-item-bottom">

                <div class="basket-quantity">

                    ${basketItem.quantity === 1
                        ? deleteButton
                        : `<button type="button"
                                   onclick="changeBasketQuantity(${basketItem.mealIndex}, -1)"
                                   aria-label="Decrease quantity">−</button>`}

                    <span>${basketItem.quantity}</span>

                    <button type="button"
                            onclick="changeBasketQuantity(${basketItem.mealIndex}, 1)"
                            aria-label="Increase quantity">+</button>
                </div>

                <span class="basket-item-price">
                    ${formatPrice(meal.price * basketItem.quantity)}
                </span>

            </div>

        </article>
    `;
}
