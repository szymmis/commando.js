let LIVES = 5;
let GRENADES = 5;
let SCORE = 0;
let TOPSCORE;

let PLAYER;
let OFFSET = 3800;

class Player extends Moveable {
    constructor() {
        super(WIDTH / 2 - 12, 10, 24, 30);
        this.speed = 2.5;
        this.canMove = { l: true, r: true, u: true, d: true };
        this.recovery = 0;
        this.recoveryGrenade = 0;
        this.direction = 0;
        this.dead = false;

        this.standAnim = new Array(8);
        for (let i = 0; i < this.standAnim.length; i++) {
            this.standAnim[i] = new Animation(this);
        }
        loadDirections('player/walk/', 1, this.standAnim)
        this.runAnim = new Array(8);
        for (let i = 0; i < this.runAnim.length; i++) {
            this.runAnim[i] = new Animation(this, [], 8);
        }
        loadDirections('player/walk/', 3, this.runAnim)

        this.dieAnim = new Animation(this, loadImages(['die0.png', 'die1.png'], 'player/die/'), 30)

        this.state = 0;

    }

    die() {
        if (!GODMODE && !this.dead) {
            this.state = 3;
            console.log('died')
            LIVES--;
            this.dead = true;

            setTimeout(() => {
                if (LIVES <= 0)
                    GAME_STATE = 2;
                else {

                    for (let i = 0; i < GameObjects.length; i++) {
                        let o = GameObjects[i];
                        if (o != this) {
                            if (o instanceof Bullet || o instanceof Grenade || o instanceof Explosion) {
                                o.destroy();
                            }
                            else if (o instanceof Enemy) {
                                o.x = o.startPos.x;
                                o.y = o.startPos.y;
                                o.AIstate = o.startAIstate;
                                o.direction = 4;
                                o.state = 0;
                                o.recovery = 50;
                                o.recoveryGrenade = Math.floor(Math.random() * 200) + 50;
                                o.canShoot = true;
                            }
                        }
                    }
                }

                this.dead = false;
                this.direction = 0;
                this.moveBack();
            }, 1000)
        }
    }


    moveBack() {
        this.y -= 300;
        this.x = WIDTH / 2 - this.width / 2;
        OFFSET -= 300;

        if (this.y <= 100) {
            this.y = 10;
            OFFSET = 0;
            return;
        }

        for (let i = 0; i < 20; i++) {
            if (this.y <= 100) {
                this.y = 10;
                OFFSET = 0;
                return;
            }
            else {
                let dontCollide = true;
                for (let i = 0; i < GameObjects.length; i++) {
                    if (GameObjects[i] != this) {
                        if (GameObjects[i] instanceof Obstacle) {
                            if (multipleIntersection(this.getCollider()[0], GameObjects[i].getCollider())) {
                                dontCollide = false;
                                console.log('lol5!!!');
                            }
                        }
                    }
                }
                if (dontCollide)
                    return;
            }

            if(i == 4){
                this.y = 10;
                OFFSET = 0;
                return;
            }
        }

        this.y -= 100;
        this.x = WIDTH / 2;
        OFFSET -= 100;
    }

    update() {
        if (!this.dead) {
            this.canMove = { l: true, r: true, u: true, d: true };
            for (let i = 0; i < GameObjects.length; i++) {
                if (GameObjects[i] != this) {
                    let col = GameObjects[i].getCollider();
                    intersection(this.getCollider(), col);
                    if (GameObjects[i] instanceof Obstacle) {
                        if (this.canMove.l)
                            this.canMove.l = !multipleIntersection(this.getMvmColl().l, col);
                        if (this.canMove.r)
                            this.canMove.r = !multipleIntersection(this.getMvmColl().r, col);
                        if (this.canMove.u)
                            this.canMove.u = !multipleIntersection(this.getMvmColl().u, col);
                        if (this.canMove.d)
                            this.canMove.d = !multipleIntersection(this.getMvmColl().d, col);
                    }
                }
            }

            if (!this.dead)
                this.state = 0;

            if (pushed_keys.includes(38) && this.canMove.u) {
                if (this.y < 4550)
                    this.y += this.speed;
                else
                    this.y = 4550;
                this.state = 1;
                if (this.y >= OFFSET + 100) {
                    if (OFFSET < 4180)
                        OFFSET += this.speed;
                    else
                        OFFSET = 4180;
                }
            }
            else if (pushed_keys.includes(40) && this.canMove.d) {
                this.state = 1;
                if (this.y > 0) {
                    if (this.y > OFFSET) {
                        this.y -= this.speed;
                    }
                    else
                        this.y = OFFSET;
                }
                else
                    this.y = 0;
            }

            if (pushed_keys.includes(37) && this.canMove.l) {
                this.state = 1;
                if (this.x > 0)
                    this.x -= this.speed;
                else
                    this.x = 0;
            }
            else if (pushed_keys.includes(39) && this.canMove.r) {
                this.state = 1;
                if (this.x < WIDTH - this.width)
                    this.x += this.speed;
                else
                    this.x = WIDTH - this.width;
            }

            this.setDirection();

            if (this.recovery <= 0) {
                if (pushed_keys.includes(65)) {
                    let b = new Bullet(this.x + this.width / 2 - 5, this.y + this.height / 2);
                    b.direction = this.direction;
                    this.recovery = 10;
                }
            }
            else {
                this.recovery -= 1;
            }

            if (this.recoveryGrenade <= 0) {
                if (pushed_keys.includes(83) && GRENADES > 0) {
                    console.log('lol')
                    let g = new Grenade(this.x + this.width / 2 - 5, this.y + this.height / 2);
                    g.direction = this.direction;
                    g.speed = 5;
                    this.recoveryGrenade = 200;


                    GRENADES--;
                }
            }
            else {
                this.recoveryGrenade -= 1;
            }
        }
    }

    draw() {
        switch (this.state) {
            case 0:
                this.standAnim[this.direction].play();
                break;
            case 1:
                this.runAnim[this.direction].play();
                break;
            case 3:
                this.dieAnim.play();
                break;
        }

        if (DEBUG) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(this.x, this.getScreenCoords().y + this.img.height - this.height, this.width, this.height);
            ctx.stroke();
            ctx.closePath();
        }
    }

    setDirection() {
        if (pushed_keys.includes(38)) {
            this.direction = 0;
            if (pushed_keys.includes(37))
                this.direction = 7;
            else if (pushed_keys.includes(39))
                this.direction = 1;
        }
        else if (pushed_keys.includes(40)) {
            this.direction = 4;
            if (pushed_keys.includes(37))
                this.direction = 5;
            else if (pushed_keys.includes(39))
                this.direction = 3;
        }
        else if (pushed_keys.includes(37))
            this.direction = 6;
        else if (pushed_keys.includes(39))
            this.direction = 2;
    }

    getMvmColl() {
        return {
            l: { x1: this.x - 5, x2: this.x, y1: this.y, y2: this.y + this.height },
            r: { x1: this.x + this.width, x2: this.x + this.width + 5, y1: this.y, y2: this.y + this.height },
            u: { x1: this.x, x2: this.x + this.width, y1: this.y + this.height, y2: this.y + this.height + 5 },
            d: { x1: this.x, x2: this.x + this.width, y1: this.y - 5, y2: this.y + this.height }
        }
    }
}