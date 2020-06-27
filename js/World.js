NUM_OF_DECALS = 120;

let MAX_HEIGHT = 4550;
let GAME_STATE = 0;

function createWorld() {

    GameObjects = [];
    SCORE = 0;

    LIVES = 5;
    GRENADES = 5;
    Decals = [];
    OFFSET = 0;
    if (!!localStorage.getItem('maxscore'))
        TOPSCORE = localStorage.getItem('maxscore');
    else
        TOPSCORE = 0;

    for (let i = 0; i < NUM_OF_DECALS; i++) {
        // new GroundDecal(Math.floor(Math.random() * (WIDTH-150)) + 50, 3500/NUM_OF_DECALS*i + 100);
        new GroundDecal(Math.floor(Math.random() * (WIDTH - 150)) + 50, Math.floor(Math.random() * 4500));
    }

    new Enemy(180, 220, 0);
    new Enemy(120, 460);
    new Enemy(120, 920);
    new Enemy(WIDTH - 200, 1130, 2);

    new Tree(50, 60);
    new Tree(WIDTH - 80, 60);
    new Hill(WIDTH - 100, 220, 0)
    new Tree(WIDTH / 2 - 50, 340);
    new Tree(WIDTH - 200, 440);
    new Tree(WIDTH - 240, 420);
    new Tree(WIDTH - 160, 420);
    new Tree(WIDTH / 2 - 50, 540);
    new Hill(WIDTH - 160, 680, 1)
    new Enemy(WIDTH, 740, 3);
    new Enemy(WIDTH + 100, 740, 3);
    new Enemy(WIDTH + 200, 740, 3);
    new Tree(50, 770)
    new Tree(80, 790)
    new Tree(110, 770)
    new Tree(WIDTH - 200, 890)
    new Wall(WIDTH - 260, 1100, 0)
    new Tree(WIDTH - 280, 1160)
    new Hill(-50, 1200, 1)
    new Enemy(-70, 1260, 4);
    new Enemy(-170, 1260, 4);
    new Enemy(-270, 1260, 4);
    new Hill(300, 1380, 1)
    new Rock(560, 1450, 3)
    new Tree(540, 1580)
    new Tree(80, 1580)
    new Tree(WIDTH / 2 - 50, 1680)
    new Wall(WIDTH - 160, 1800, 0)
    new Enemy(WIDTH - 110, 1850, 2)
    new Tree(50, 1860)
    new Bridge(0, 2000);

    new Rock(WIDTH / 2, 2250, 2);
    new Enemy(WIDTH / 2 + 16, 2300, 2);

    new Rock(100, 2400, 2);
    new Enemy(110, 2450, 2)

    new Rock(WIDTH / 2 - 125, 2500, 2);
    new Enemy(WIDTH / 2 - 110, 2550, 2);

    new Rock(WIDTH / 2 + 45, 2550, 2);
    new Enemy(WIDTH / 2 + 60, 2600, 2);

    new Rock(100, 2850, 2);
    new Enemy(115, 2900, 2);

    new Rock(WIDTH / 2 - 50, 2850, 2);
    new Enemy(WIDTH / 2 - 35, 2900, 2);

    new Rock(WIDTH - 200, 2850, 2);
    new Enemy(WIDTH - 185, 2900, 2);

    new Wall(10, 3140, 0);
    new Enemy(80, 3190, 2);

    new Wall(WIDTH - 200, 3290, 0)
    new Wall(WIDTH - 270, 3290, 0)
    new Enemy(WIDTH - 230, 3340, 2);
    new Enemy(WIDTH - 160, 3340, 2);

    new Wall(10, 3640, 0)
    new Enemy(40, 3690, 2);

    new Wall(WIDTH / 2 - 60, 3780, 0)
    new Wall(WIDTH - 180, 3780, 0)
    new Enemy(WIDTH / 2 - 30, 3830, 2);

    new Wall(WIDTH - 250, 3920, 0)
    new Enemy(WIDTH - 180, 3970, 2)

    new Wall(10, 4250, 0)
    new Wall(80, 4250, 0)
    new Enemy(50, 4300, 2)
    new Enemy(130, 4300, 2)

    new Gate(0, MAX_HEIGHT - 50);

    new Ammo(100, 100);
    new Ammo(WIDTH - 100, 3400);

    PLAYER = new Player();
}
let didSpawn = false;
function spawn() {
    if (!didSpawn) {
        console.log('spawn')
        for (let i = 0; i < 20; i++) {
            setTimeout(function () {
                enemy = new Enemy(WIDTH / 2 - Math.floor(Math.random() * 20) - 10, 4540, 5);
                enemy.immunity = 60;
            }, i * 1500);
        }
        didSpawn = true;
    }
}

function countEnemys() {
    let counter = 0;
    for (let i = 0; i < GameObjects.length; i++) {
        if (GameObjects[i] instanceof Enemy)
            counter++;
    }
    return counter;
}

function drawWorld() {

    if (GAME_STATE == 1) {

        if (PLAYER.y >= 4500 - 300) {
            spawn();

            if (PLAYER.y >= 4550) {
                if (countEnemys() <= 0) {
                    SCORE += LIVES * 500;
                    GAME_STATE = 3;
                    console.log(localStorage.getItem('topscore'));
                    if (localStorage.getItem('topscore') == null || localStorage.getItem('topscore') < SCORE)
                        localStorage.setItem('topscore', SCORE);
                }
            }

        }

        for (let i = 0; i < GameObjects.length; i++) {
            let o = GameObjects[i];
            o.update();
        }

        for (let i = 0; i < Decals.length; i++) {
            Decals[i].draw();
        }


        let _temp = [];
        for (let i = 0; i < GameObjects.length; i++) {
            o = GameObjects[i];
            if (!(o instanceof Player))
                o.draw();

            if (o instanceof Moveable) {
                for (let j = 0; j < GameObjects.length; j++) {
                    if (GameObjects[j] != o) {
                        collision(o, GameObjects[j]);
                    }
                }
            }

            if (!o.destroyed)
                _temp.push(o);
        }
        GameObjects = _temp;

        PLAYER.draw();

        for (let i = 0; i < GameObjects.length; i++) {
            GameObjects[i].drawUpper();
        }
    }
    else if (GAME_STATE == 0) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT + 100);
        ctx.drawImage(TITLE, WIDTH / 2 - TITLE.width / 2, 30);
        ctx.fillStyle = 'white';
        ctx.font = "18px myFont";
        let arrows = 'arrows - movement';
        ctx.fillText(arrows, WIDTH / 2 - ctx.measureText(arrows).width / 2, 200);
        let shoot = 'a - shoot';
        ctx.fillText(shoot, WIDTH / 2 - ctx.measureText(shoot).width / 2, 240);
        let grenade = 's - grenade';
        ctx.fillText(grenade, WIDTH / 2 - ctx.measureText(grenade).width / 2, 280);

        let space = 'press space to start!'
        timer++;
        if (timer <= 50)
            ctx.fillText(space, WIDTH / 2 - ctx.measureText(space).width / 2, 380);
        else if (timer >= 80)
            timer = 0;
    }
    else if (GAME_STATE == 2 || GAME_STATE == 3) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT + 100);
        ctx.fillStyle = 'white';
        ctx.font = "18px myFont";
        let died = 'not this time, try again!';
        if (GAME_STATE == 3)
            died = 'congratulations, you have made it!'
        ctx.fillText(died, WIDTH / 2 - ctx.measureText(died).width / 2, 100);
        let score = 'score: ' + (SCORE + '').padStart(8, '0');
        ctx.fillText(score, WIDTH / 2 - ctx.measureText(score).width / 2, 140);
        let newrecord = 'new record!!!!'
        if (!!!localStorage.getItem('topscore') || SCORE > localStorage.getItem('topscore'))
            ctx.fillText(newrecord, WIDTH / 2 - ctx.measureText(newrecord).width / 2, 180);

        let space = 'press space to continue!'
        timer++;
        if (timer <= 50)
            ctx.fillText(space, WIDTH / 2 - ctx.measureText(space).width / 2, 380);
        else if (timer >= 80)
            timer = 0;
    }
}
let timer = 0;

function drawGUI() {
    if (GAME_STATE == 1) {
        ctx.font = "18px myFont";
        ctx.fillStyle = "white";
        let score = 'SCORE ' + (SCORE + '').padStart(8, '0');
        let grenades = 'G=' + (GRENADES + '').padStart(2, '0');
        let lives = 'MEN ' + (LIVES + '').padStart(2, '0');
        let highscore = 'HI ' + (TOPSCORE + '').padStart(8, '0');
        ctx.fillText(score, 20, HEIGHT + GUI_HEIGHT - 20);
        ctx.fillText(grenades, 62 + ctx.measureText(score).width, HEIGHT + GUI_HEIGHT - 20);
        ctx.fillText(lives, 100 + ctx.measureText(score + grenades).width, HEIGHT + GUI_HEIGHT - 20);
        ctx.fillText(highscore, 146 + ctx.measureText(score + grenades + lives).width, HEIGHT + GUI_HEIGHT - 20);
    }
}