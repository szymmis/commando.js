let canvas;
let ctx;

const DEBUG = false;
let GODMODE = false;

const WIDTH = 800;
const HEIGHT = 420;
const GUI_HEIGHT = 60;

let pushed_keys = [];

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT + GUI_HEIGHT;
    ctx = canvas.getContext('2d');

    createWorld();

    update();
}

function update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#675406";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawWorld();
    ctx.fillStyle = "black";
    ctx.fillRect(0, HEIGHT, WIDTH, HEIGHT + GUI_HEIGHT);
    drawGUI();

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {

    if (e.which == 32) {
        if (GAME_STATE == 0) {
            GAME_STATE = 1;
            
            if (!!localStorage.getItem('topscore')) {
                TOPSCORE = localStorage.getItem('topscore');
                console.log(TOPSCORE)
            }
        }
        else if (GAME_STATE == 2 || GAME_STATE == 3) {
            GAME_STATE = 0;

            createWorld();
        }
    }

    // console.log(e.which)
    if (!pushed_keys.includes(e.which))
        pushed_keys.push(e.which);
})

document.addEventListener('keyup', (e) => {
    _temp = [];
    for (let i = 0; i < pushed_keys.length; i++) {
        if (pushed_keys[i] != e.which)
            _temp.push(pushed_keys[i]);
    }
    pushed_keys = _temp;
})