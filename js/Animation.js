let TITLE = new Image();
TITLE.src = 'assets/title.png';

class Animation {
    constructor(o, frames, interval) {
        this.parent = o;
        this.frames = frames;
        this.interval = interval;
        if (!!!this.interval)
            this.interval = 1;

        this.index = 0;
        this.timer = 0;
    }

    play() {
        if (!!this.frames) {
            if (!!this.centered)
                ctx.drawImage(this.frames[this.index], this.parent.x + this.parent.width / 2 - this.frames[this.index].width / 2, this.parent.getScreenCoords().y - this.parent.height/2 - this.frames[this.index].height/2);
            else
                ctx.drawImage(this.frames[this.index], this.parent.x + this.parent.width / 2 - this.frames[this.index].width / 2, this.parent.getScreenCoords().y - this.frames[this.index].height);
            this.timer++;
            if (this.timer >= this.interval) {
                this.timer = 0;
                this.index++;

                if (this.index >= this.frames.length)
                    this.index = 0;
            }
        }
    }
}

function loadImages(sources, prefix) {
    let images = [];
    for (let i = 0; i < sources.length; i++) {
        img = new Image();
        if (!!prefix)
            img.src = 'assets/' + prefix + sources[i];
        else
            img.src = +'assets/ ' + sources[i];
        images.push(img);
    }
    return images;
}

function loadDirections(src, length, array) {
    for (let i = 0; i < array.length; i++) {
        images = [];
        for (let j = 1; j <= length; j++) {
            img = new Image();
            img.src = 'assets/' + src + i + '.' + j + '.png'
            images.push(img);
        }
        array[i].frames = images;
    }
}