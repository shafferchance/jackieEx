import Menu from './components/menu.component.js';

// No point in utilize Event object that will be passed to callback funtion hence zero parameters
window.addEventListener('load', () => {
    let workerRes = new Worker("./lib/pubsub.js");
    const main = new Menu(workerRes);
    document.getElementById("app").append(main);
}); 