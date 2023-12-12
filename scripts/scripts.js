let indice = 1;
let intervaloCarrusel;

muestraCarrusel(indice);
iniciarCarrusel();

function iniciarCarrusel() {
    intervaloCarrusel = setInterval(function tiempo() {
        muestraCarrusel(indice += 1);
    }, 3500);
}

function avanzaCarrusel(n) {
    muestraCarrusel(indice += n);
    reiniciarIntervalo();
}

function retrocedeCarrusel(n) {
    muestraCarrusel(indice -= n);
    reiniciarIntervalo();
}

function posicionCarrusel(n) {
    muestraCarrusel(indice = n);
    reiniciarIntervalo();
}

function muestraCarrusel(n) {
    let i;
    let carrusel = document.getElementsByClassName('miCarrusel');
    let barras = document.getElementsByClassName('barra');

    if (n > carrusel.length) {
        indice = 1;
    }
    if (n < 1) {
        indice = carrusel.length;
    }
    for (i = 0; i < carrusel.length; i++) {
        carrusel[i].style.display = 'none';
    }
    for (i = 0; i < barras.length; i++) {
        barras[i].className = barras[i].className.replace(" active", "");
    }

    carrusel[indice - 1].style.display = 'block';
    barras[indice - 1].className += ' active';
}

function detenerCarrusel() {
    clearInterval(intervaloCarrusel);
}

function reanudarCarrusel() {
    iniciarCarrusel();
}

function reiniciarIntervalo() {
    detenerCarrusel();
    reanudarCarrusel();
}

