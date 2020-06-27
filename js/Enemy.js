class Enemy extends Moveable {
    constructor(x, y, AIstate) {
        super(x, y, 24, 36);
        this.speed = 3;
        this.canMove = { l: true, r: true, u: true, d: true };
        if (!!AIstate)
            this.AIstate = AIstate;
        else
            this.AIstate = 1;
        this.startAIstate = this.AIstate;

        this.standAnim = new Array(8);
        for (let i = 0; i < this.standAnim.length; i++) {
            this.standAnim[i] = new Animation(this);
        }
        loadDirections('enemy/walk/', 1, this.standAnim)
        this.runAnim = new Array(8);
        for (let i = 0; i < this.runAnim.length; i++) {
            this.runAnim[i] = new Animation(this, [], 8);
        }
        loadDirections('enemy/walk/', 3, this.runAnim)

        this.dieAnim = new Animation(this, loadImages(['deadL.png', 'deadR.png'], 'enemy/dead/'), 12);

        this.throwL = new Image();
        this.throwL.src = 'assets/enemy/throw/throwL.png';
        // this.throwL = loadImages(['throwL.png'], 'enemy/throw/');
        // this.throwR = loadImages(['throwR.png'], 'enemy/throw/');
        this.throwR = new Image();
        this.throwR.src = 'assets/enemy/throw/throwR.png';

        this.direction = 4;
        this.state = 0;

        this.immunity = 0;

        this.recovery = 50;
        this.recoveryGrenade = Math.floor(Math.random() * 200) + 50;

        this.centerPos = { x: this.x, y: this.y };
        this.startPos = this.centerPos;

        if (AIstate == 3) {
            this.centerPos = { x: this.x - 300, y: this.y };
            this.startPos = { x: this.x, y: this.y };
        }
        else if (AIstate == 4) {
            this.centerPos = { x: this.x + 300, y: this.y };
            this.startPos = { x: this.x, y: this.y };
        }



        this.minDistance = 100;
        this.maxDistance = 300;
        this.radius = 250;

        this.canShoot = true;
    }

    update() {
        if (!!!this.dead) {

            if(this.immunity > 0)
                this.immunity--;

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

            this.recovery--;


            switch (this.AIstate) {
                case 1:
                    if (this.canShoot && !!this.moveDirection && this.moveDistance > 0) {
                        this.state = 1;
                        switch (this.moveDirection) {
                            case 1:
                                if (this.x <= this.width || this.x <= this.centerPos.x - this.radius || !this.canMove.l) {
                                    if (this.last != 3)
                                        this.setDirection(3);
                                    else
                                        this.setDirection(this.getPossibleDirection());
                                    this.moveDistance = this.minDistance;
                                }
                                this.x -= this.speed;
                                this.moveDistance -= this.speed;
                                break;
                            case 2:
                                if (this.y >= MAX_HEIGHT || this.y >= this.centerPos.y + this.radius || !this.canMove.u) {
                                    if (this.last != 4)
                                        this.setDirection(4);
                                    else
                                        this.getPossibleDirection();
                                    this.moveDistance = this.minDistance;
                                }
                                this.y += this.speed;
                                this.moveDistance -= this.speed;
                                break;
                            case 3:
                                if (this.x >= WIDTH - this.width || this.x >= this.centerPos.x + this.radius || !this.canMove.r) {
                                    if (this.last != 1)
                                        this.setDirection(1);
                                    else
                                        this.getPossibleDirection();
                                    this.moveDistance = this.minDistance;
                                }
                                this.x += this.speed;
                                this.moveDistance -= this.speed;
                                break;
                            case 4:
                                if (this.y <= this.centerPos.y - this.radius || !this.canMove.d) {
                                    if (this.last != 2)
                                        this.setDirection(2);
                                    else
                                        this.getPossibleDirection();
                                    this.moveDistance = this.minDistance;
                                }
                                this.y -= this.speed;
                                this.moveDistance -= this.speed;
                                break;
                        }
                    }
                    else {
                        this.moveDirection = this.getPossibleDirection();
                        this.moveDistance = Math.floor(Math.random() * (this.maxDistance - this.minDistance)) + this.minDistance;
                    }

                    break;
                case 2:
                    this.direction = 4;
                    this.state = 0;
                    if (PLAYER.y + 120 >= this.y) {
                        this.AIstate = 1;
                        this.moveDirection = 2;
                        this.moveDistance = this.minDistance / 2;
                    }
                    break;
                case 3:
                    this.canShoot = false;
                    this.immunity = 100;
                    if (PLAYER.y + 200 >= this.y) {
                        this.jump = true;
                    }
                    if (this.jump) {

                        this.direction = 6;
                        this.canShoot = false;
                        if (this.x > WIDTH - 160) {
                            this.x -= this.speed;
                            this.state = 1;
                        }
                        else if (this.x > WIDTH - 180) {
                            this.x -= this.speed;
                            this.y += this.speed * 1.5;
                            this.state = 2;
                        }
                        else if (this.x > WIDTH - 240) {
                            this.x -= this.speed;
                            this.y -= this.speed * 1.35;
                            this.state = 2;
                        }
                        else {

                            this.AIstate = 1;
                            this.state = 1;
                            this.recoveryGrenade = 300;
                            this.recovery = 100;
                            this.canShoot = true;
                            this.jump = false;
                            this.immunity = 4;
                        }
                    }

                    break;
                case 4:
                    this.canShoot = false;
                    this.immunity = 100;
                    if (PLAYER.y + 200 >= this.y) {
                        this.jump = true;
                    }
                    if (this.jump) {

                        this.direction = 2;
                        this.canShoot = false;
                        if (this.x < 120) {
                            this.x += this.speed;
                            this.state = 1;
                        }
                        else if (this.x < 140) {
                            this.x += this.speed;
                            this.y += this.speed * 1.5;
                            this.state = 2;
                        }
                        else if (this.x < 200) {
                            this.x += this.speed;
                            this.y -= this.speed * 1.35;
                            this.state = 2;
                        }
                        else {
                            this.AIstate = 1;
                            this.state = 1;
                            this.recoveryGrenade = 300;
                            this.recovery = 100;
                            this.canShoot = true;
                            this.jump = false;
                            this.immunity = 4;
                        }
                    }
                    break;
                case 5:
                    this.moveDirection = 4;
                    this.moveDistance = 200;
                    this.AIstate = 1;
                    break;
            }

            if (this.canShoot) {
                if (this.getDistanceTo(PLAYER) <= 350) {
                    this.recoveryGrenade--;
                    this.grenade();
                    this.shoot();
                }
            }

            if (this.y + this.height < OFFSET)
                this.destroy();

            if (this.canShoot)
                this.direction = Math.round(this.getCorrectDirection((Math.floor(-Math.atan2(this.y - PLAYER.y, this.x - PLAYER.x) * 180 / Math.PI) + 180) / 45 + 2));
        }
    }

    setDirection(dir) {
        if (!!this.moveDirection)
            this.last = this.moveDirection;
        this.moveDirection = dir;
    }

    onCollision(o) {
        if (o instanceof Player) {
            if (!!this.dead)
                o.die();
        }
    }

    draw() {
        if (!!this.dead) {
            if (!!this.dieAnim)
                this.dieAnim.play();
            return;
        }

        switch (this.state) {
            case 0:
                if (!!this.standAnim[this.direction])
                    this.standAnim[this.direction].play();
                break;
            case 1:
                if (!!this.runAnim[this.direction])
                    this.runAnim[this.direction].play();
                break;
            case 2:
                if (!!this.throwL && [0, 5, 6, 7].includes(this.direction))
                    ctx.drawImage(this.throwL, this.x + this.width / 2 - this.throwL.width / 2, this.getScreenCoords().y - this.throwL.height);
                else if (!!this.throwR)
                    ctx.drawImage(this.throwR, this.x + this.width / 2 - this.throwR.width / 2, this.getScreenCoords().y - this.throwR.height);

                break;
            case 3:
                if (!!this.dieAnim)
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

    shoot() {
        if (this.recovery <= 0) {
            let b = new Bullet(this.x + this.width / 2 - 5, this.y + this.height / 2);
            b.direction = this.getCorrectDirection((Math.floor(-Math.atan2(this.y - PLAYER.y, this.x - PLAYER.x) * 180 / Math.PI) + 180) / 45 + 2);
            b.enemys = this;
            b.speed = 3.5;
            this.recovery = 180;
        }
    }

    grenade() {
        if (this.recoveryGrenade <= 0) {
            this.direction = Math.round(this.getCorrectDirection((Math.floor(-Math.atan2(this.y - PLAYER.y, this.x - PLAYER.x) * 180 / Math.PI) + 180) / 45 + 2));
            this.state = 2;
            this.canShoot = false;
            this.recoveryGrenade = 500;
            let g = new Grenade(this.x + this.width / 2 - 5, this.y + this.height / 2, true);
            g.direction = this.getCorrectDirection((Math.floor(-Math.atan2(this.y - PLAYER.y, this.x - PLAYER.x) * 180 / Math.PI) + 180) / 45 + 2);
            this.recovery = 50;

            setTimeout(() => { this.state = 1; this.canShoot = true; }, 300)
        }
    }

    getCorrectDirection(dir) {
        if (dir >= 8)
            return Math.round(dir - 8);

        return Math.round(dir);
    }

    getMvmColl() {
        return {
            l: { x1: this.x - 10, x2: this.x, y1: this.y + 10, y2: this.y + this.height - 20 },
            r: { x1: this.x + this.width, x2: this.x + this.width + 10, y1: this.y - 10, y2: this.y + this.height - 20 },
            u: { x1: this.x + 5, x2: this.x + this.width - 10, y1: this.y + this.height, y2: this.y + this.height + 10 },
            d: { x1: this.x + 5, x2: this.x + this.width - 10, y1: this.y - 10, y2: this.y + this.height }
        }
    }

    getPossibleDirection() {
        let _r = [];
        if (this.canMove.l && this.last != 3)
            _r.push(1);
        if (this.canMove.u && this.last != 4)
            _r.push(2);
        if (this.canMove.r && this.last != 1)
            _r.push(3);
        if (this.canMove.d && this.last != 2)
            _r.push(4);

        return Math.floor(Math.random() * _r.length);
    }
}