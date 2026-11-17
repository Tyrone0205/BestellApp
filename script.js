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

// Rendert die Gerichte, sobald das HTML-Dokument vollständig aufgebaut ist.
document.addEventListener('DOMContentLoaded', renderMeals);
