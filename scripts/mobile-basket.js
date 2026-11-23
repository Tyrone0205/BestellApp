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
