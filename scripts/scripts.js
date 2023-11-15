// Incluimos el código JavaScript aquí para inicializar el carrusel
document.addEventListener('DOMContentLoaded', function () {
    // Inicializamos el carrusel con opciones de autoplay
    var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleAutoplaying'), {
        interval: 2500,  // Cambia la imagen cada 3 segundos (ajústalo según tus necesidades)
        pause: 'hover', // Pausa el carrusel cuando el mouse está sobre él
        wrap: true       // Vuelve al principio después de la última imagen
    });
});
