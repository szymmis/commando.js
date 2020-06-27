let GameObjects = [];
let Decals = [];

class Decal {
    constructor(x, y, imgSrc) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        if (!!imgSrc) {
            this.img.src = imgSrc;
            this.img.onload = () => {
                this.width = this.img.width;
                this.height = this.img.height;
            }
        }
        Decals.push(this);
    }

    draw() {
        if (!!this.img) {
            ctx.drawImage(this.img, this.x - this.width / 2, this.getScreenCoords().y + this.height / 2)
        }
    }

    getScreenCoords() {
        return { x: this.x, y: HEIGHT - this.img.height - this.y + OFFSET }
    }
}

class GroundDecal extends Decal {
    constructor(x, y) {
        super(x, y, `assets/decals/decal${Math.floor(Math.random() * 2)}.png`);
    }
}

class Object2D {
    constructor(x, y, width, height, imgSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.img = new Image();
        if (!!imgSrc) {
            this.img.src = 'assets/' + imgSrc;
        }

        GameObjects.push(this);
    }

    update() { }

    draw() {
        if (!!this.img) {
            ctx.drawImage(this.img, this.x + this.width / 2 - this.img.width / 2, this.getScreenCoords().y);
            if (DEBUG) {
                for (let i = 0; i < this.getCollider().length; i++) {
                    let col = this.getCollider()[i];
                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    // ctx.rect(this.x, this.getScreenCoords().y + this.img.height - this.height, this.width, this.height);
                    ctx.rect(col.x1, calcCoords(col.x1, col.y1).y, col.x2 - col.x1, calcCoords(col.x2, col.y2).y - calcCoords(col.x1, col.y1).y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    drawUpper() {
        if (!!this.upperImg) {
            ctx.drawImage(this.upperImg, this.x + this.width / 2 - this.img.width / 2, this.getScreenCoords().y)
        }
    }

    getScreenCoords() {
        return { x: this.x, y: HEIGHT - this.img.height - this.y + OFFSET }
    }

    getCollider() {
        return [{ x1: this.x, x2: this.x + this.width, y1: this.y, y2: this.y + this.height }]
    }

    onCollision(o) { }

    destroy() {
        this.destroyed = true;
        if (DEBUG)
            console.log(this, 'destroyed!')
    }

    getDistanceTo(o) {
        return getDistance({ x: this.x, y: this.y }, { x: o.x, y: o.y });
    }
}

class Obstacle extends Object2D {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
    }
}

class Tree extends Obstacle {
    constructor(x, y) {
        super(x, y, 20, 40);
        let rand = (Math.floor(Math.random() * 2) + 1);
        this.img.src = 'assets/obstacles/tree' + rand + '.png';
        this.upperImg = new Image();
        this.upperImg.src = 'assets/obstacles/treeU' + rand + '.png';
    }
}

class Rock extends Obstacle {
    constructor(x, y, type) {
        super(x, y);
        this.img.src = `assets/obstacles/hill${type}.png`;
        this.img.onload = () => {
            this.width = this.img.width * 0.8;
            this.height = this.img.height * 0.9;
        }
    }
}

class Hill extends Obstacle {
    constructor(x, y, type) {
        super(x, y);
        this.img.src = `assets/obstacles/hill${type}.png`;
        this.img.onload = () => {
            this.width = this.img.width * 0.8;
            this.height = this.img.height * 0.9;
        }
    }
}

class Wall extends Obstacle {
    constructor(x, y, type) {
        super(x, y);
        this.img.src = `assets/obstacles/wall${type}.png`;
        this.img.onload = () => {
            this.width = this.img.width * 0.8;
            this.height = this.img.height * 0.9;
        }
    }
}

class Bridge extends Obstacle {
    constructor(x, y) {
        super(x, y);

        this.img.src = 'assets/obstacles/bridge.png';
        this.img.onload = () => {
            this.width = this.img.width;
            this.height = this.img.height;
        }
        this.upperImg = new Image()
        this.upperImg.src = 'assets/obstacles/bridgeU.png';
    }

    getCollider() {
        return [{ x1: this.x, x2: this.x + this.width / 9 * 4, y1: this.y, y2: this.y + this.height },
        { x1: this.x + this.width / 9 * 5, x2: this.x + this.width, y1: this.y, y2: this.y + this.height }]
    }
}

gateOpen = new Image();
gateOpen.src = 'assets/obstacles/gateOpen.png';

class Gate extends Obstacle {
    constructor(x, y) {
        super(x, y, undefined, 50);

        this.img.src = 'assets/obstacles/gateOpen.png';
        this.img.onload = () => {
            this.width = this.img.width;
            this.height = this.img.height;
        }
    }

    getCollider() {
        return [{ x1: this.x, x2: this.x + this.width / 5 * 2, y1: this.y + 30, y2: this.y + 30 + this.height },
        { x1: this.x + this.width / 5 * 3, x2: this.x + this.width, y1: this.y + 30, y2: this.y + 30 + this.height }]
    }
}



class Moveable extends Object2D {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
    }
}

class Bullet extends Moveable {
    constructor(x, y) {
        super(x + 1.5, y - 1.5, 3, 3, '/bullet.png');
        this.speed = 10;
        this.direction = 8;
        this.startPos = { x: this.x, y: this.y };
    }

    onCollision(o) {
        if (o instanceof Enemy) {
            if (!!!this.enemys && o.state != 3 && o.immunity <= 0) {
                o.state = 3;
                setTimeout(function () { o.destroy(); }, 600)
                this.destroy();
                SCORE += 50;
                o.dead = true;
            }
        }
        else if (o instanceof Player) {
            if (!!this.enemys) {
                this.destroy();
                PLAYER.die();
            }
        }
        else if (o instanceof Obstacle) {
            if (!!!this.enemys) {
                this.destroy(true);
            }
            else {
                if (!(o instanceof Rock) && !(o instanceof Wall)) {
                    this.destroy(true);
                }
                else if ((o instanceof Rock) || (o instanceof Wall)) {
                    if (!!this.rock && this.rock != o) {
                        this.destroy(true);
                    }
                    else if(this.enemys.AIstate == 2){
                        this.rock = o;
                    }
                    else{
                        this.destroy(true);
                    }
                }
            }

        }
    }

    update() {
        this.move((this.direction) * 45 * Math.PI / 180);

        if (getDistance(this.startPos, { x: this.x, y: this.y }) >= 340)
            this.destroy(true);

        if (!!this.protection)
            this.protection -= 1;

    }

    destroy(explo) {
        this.destroyed = true;
        if (!!explo)
            new Explosion(this.x, this.y, 2);
    }

    move(angle) {
        this.x += this.speed * Math.sin(angle);
        this.y += this.speed * Math.cos(angle);
    }
}

class Grenade extends Moveable {
    constructor(x, y, enemys) {
        super(x + 1.5, y - 1.5, 6, 6, 'throwables/bomb1.png');
        this.speed = 4.5;
        this.maxLive = 40;
        this.liveTime = this.maxLive;
        this.enemys = enemys;

        this.anim = new Animation(this, loadImages(['bomb1.png', 'bomb2.png', 'bomb3.png', 'bomb2.png', 'bomb1.png'], 'throwables/'), 5);
    }

    update() {
        this.move((this.direction) * 45 * Math.PI / 180);
        this.anim.index = Math.floor(this.liveTime / this.maxLive * 9 / 2);

        // if (!!this.protection)
        // this.protection -= 1;

        this.liveTime--;

        if (this.liveTime <= 0) {
            if (!!this.enemys)
                new Explosion(this.x - 30, this.y - 30, 1, this.enemys);
            else
                new Explosion(this.x - 80, this.y - 80, 1);
            this.destroy();
        }
    }

    draw() {
        if (!!this.anim)
            this.anim.play();
    }

    move(angle) {
        this.x += this.speed * Math.sin(angle);
        this.y += this.speed * Math.cos(angle);
    }
}

class Explosion extends Object2D {
    constructor(x, y, type, enemys) {
        super(x, y, 0, 0);

        this.enemys = enemys;

        switch (type) {
            case 1:
                this.damage = 5;
                if (!!enemys) {
                    this.width = 60;
                    this.height = 60;
                }
                else {
                    this.width = 160;
                    this.height = 160;
                }
                this.animation = new Animation(this, loadImages(['1.0.png', '1.1.png', '1.2.png'], 'explosion/'), 5);
                this.animation.centered = true;
                break;
            case 2:
                this.animation = new Animation(this, loadImages(['2.0.png', '2.1.png', '2.2.png'], 'explosion/'), 5);
                this.animation.centered = true;
                break;
        }

        if (!!this.damage) {
            for (let j = 0; j < GameObjects.length; j++) {
                if (GameObjects[j] != this) {
                    collision(this, GameObjects[j]);
                }
            }

            this.active = false;
        }


        setTimeout(() => { this.destroy() }, 200);
    }

    onCollision(o) {
        if (o instanceof Enemy) {
            if (!!!this.enemys && o.state != 3) {
                setTimeout(function () { o.destroy(); }, 600)
                o.state = 3;
                SCORE += 50;
                o.dead = true;
            }
        }
        else if (o instanceof Player) {
            if (!!this.enemys) {
                PLAYER.die();
            }
        }
    }

    draw() {
        if (!!this.animation) {
            this.animation.play();
        }

        if (DEBUG) {
            for (let i = 0; i < this.getCollider().length; i++) {
                let col = this.getCollider()[i];
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.rect(col.x1, calcCoords(col.x1, col.y1).y, col.x2 - col.x1, calcCoords(col.x2, col.y2).y - calcCoords(col.x1, col.y1).y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

class Collectable extends Object2D {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
    }
}

class Ammo extends Collectable {
    constructor(x, y) {
        super(x, y, 48, 40);

        this.anim = new Animation(this, loadImages(['bricks1.png', 'bricks2.png'], 'collectables/'), 25);
    }

    draw() {
        this.anim.play();
    }

    onCollision(o) {
        if (o instanceof Player) {
            this.destroy();
            GRENADES += 3;
        }
    }
}

function intersection(r1, r2) {
    if (r1.x1 > r2.x2 || r2.x1 > r1.x2)
        return false;
    if (r1.y1 > r2.y2 || r2.y1 > r1.y2)
        return false;

    return true;
}

function multipleIntersection(r1, o2) {
    // console.log(o2)
    for (let i = 0; i < o2.length; i++) {
        if (intersection(r1, o2[i])) {
            return true;
        }
    }

    return false;
}

function collision(o1, o2) {
    // if (intersection(o1.getCollider(), o2.getCollider())) {
    //     if (!o1.destroyed)
    //         o1.onCollision(o2);
    //     if (!o2.destroyed)
    //         o2.onCollision(o1);
    // }

    for (let i = 0; i < o1.getCollider().length; i++) {
        for (let j = 0; j < o2.getCollider().length; j++) {
            if (intersection(o1.getCollider()[i], o2.getCollider()[j])) {
                if (!o1.destroyed && o1.active && !o2.destroyed && o2.active) {
                    o1.onCollision(o2);
                    o2.onCollision(o1);
                }
                return;
            }
        }
    }
}

function getDistance(pos1, pos2) {
    return Math.sqrt(Math.abs(pos2.x - pos1.x) ** 2 + Math.abs(pos2.y - pos1.y) ** 2)
}

function calcCoords(x, y) {
    return { x: this.x, y: HEIGHT - y + OFFSET }
}