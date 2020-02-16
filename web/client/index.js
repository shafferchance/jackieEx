import Menu from './components/menu.component.js';

// No point in utilize Event object that will be passed to callback funtion hence zero parameters
window.addEventListener('load', () => {
    const main = new Menu();
    document.getElementById("app").append(main);
}); 