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
