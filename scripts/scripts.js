let indice = 1;
let intervaloCarrusel;

muestraCarrusel(indice);
iniciarCarrusel();

function iniciarCarrusel() {
    intervaloCarrusel = setInterval(function tiempo() {
        muestraCarrusel(indice += 1);
    }, 3000);
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


//importar informacion desde aceitesyserums.json
let aceitesyserums = null
fetch('/datos/aceitesyserums.json')
    .then(response => response.json())
    .then(data => {
        aceitesyserums = data;
        console.log(aceitesyserums);
        addDataToHTML();
    })

//agregar datos de productos en HTML
let ListaAyS = document.querySelector('.ListaAyS');
function addDataToHTML() {
    aceitesyserums.forEach(aceitesyserums => {
        //crear item de nuevo producto
        let nuevoProducto = document.createElement('a');
        nuevoProducto.href = '/templates/aceitesyserums/detalles_ays.html?id=' + aceitesyserums.id;
        nuevoProducto.classList.add('item_ays');
        nuevoProducto.innerHTML = `<img class="img_ays" src="${aceitesyserums.image}">
        <h2 class="name_ays">${aceitesyserums.name}</h2>
        <div class="price_ays">${aceitesyserums.price}</div>`;


        //agregar este elemento en la clase lista_jyd
        ListaAyS.appendChild(nuevoProducto);

    })
}

