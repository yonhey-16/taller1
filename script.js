// Firebase configuración (reemplaza con tu propia configuración de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAzn1VrP1bY6h-kDbPD_6hbR1SmjNUWzKA",
    authDomain: "taller1-e4a59.firebaseapp.com",
    projectId: "taller1-e4a59",
    storageBucket: "taller1-e4a59.firebasestorage.app",
    messagingSenderId: "989644443398",
    appId: "1:989644443398:web:d91e2e513a481533cb1887"
};
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado");

    // Variables globales
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const mainMenu = document.getElementById("mainMenu");
    const menu = document.getElementById("menu");
    const controls = document.querySelector(".controls");
    const playButton = document.getElementById("playButton");
    const customizeButton = document.getElementById("customizeButton");
    const startGameButton = document.getElementById("startGameButton");
    const snakeColorInput = document.getElementById("snakeColor");
    const bgColorInput = document.getElementById("bgColor");

    // Verificar que los botones existen
    console.log(playButton, customizeButton, startGameButton);

    // Función para iniciar el juego
    function startGame() {
        console.log("Iniciando juego...");
        canvas.style.display = "block"; 
        controls.style.display = "flex"; 
        mainMenu.style.display = "none"; 
        menu.style.display = "none"; 
    }

    // Botón "Jugar"
    playButton.addEventListener("click", function () {
        console.log("Botón Jugar presionado");
        mainMenu.style.display = "none";
        startGame();
    });

    // Botón "Personalizar"
    customizeButton.addEventListener("click", function () {
        console.log("Botón Personalizar presionado");
        mainMenu.style.display = "none";
        menu.style.display = "block";
    });

    // Botón "Jugar" en el menú de personalización
    startGameButton.addEventListener("click", function () {
        console.log("Botón Jugar en Personalizar presionado");
        snakeColor = snakeColorInput.value;
        bgColor = bgColorInput.value;
        menu.style.display = "none";
        startGame();
    });
});
