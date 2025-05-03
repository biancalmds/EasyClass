const startButton = document.getElementById("start-button");

startButton.onmousemove = (event) => {
    const x = event.pageX - startButton.offsetLeft;
    const y = event.pageY - startButton.offsetTop;

    startButton.style.setProperty('--eixoX', x + 'px')
    startButton.style.setProperty('--eixoY', y + 'px')
};