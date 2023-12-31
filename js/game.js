import { loadImage,detectCollision } from './utils.js'
import { Canvas } from './canvas.js'
import { Clouds } from './clouds.js'
import { Track } from './track.js'
import { Dino } from './vamp.js'
import { Obstacles } from './obstacle.js'
import { Audio } from './audio.js'
import { assetData } from './assetData.js'

class Game extends Canvas {

    constructor() {
        super()
        this.debug = 0
        this.loadGame()
    }

    async loadGame() {
        this.audio = new Audio();
        this.state = 'init';

        // Use the imported assetData directly
        await this.loadAssets(assetData);

        this.initAssets();
        this.addEvents();
    }

    initAssets() {

        this.gameBeginTime = performance.now();
        this.speed = 3;
        this.maxSpeed = 5
        this.frameCounter = 0
        this.fps = 30
        this.score = 0

        this.clouds = new Clouds(this.assets.Cloud)
        this.clouds.init()

        this.track = new Track(this.assets.Track)
        this.track.init()

        this.dino = new Dino(this.assets);
        this.dino.init()

        this.obstacles = new Obstacles(this.assets)
        this.obstacles.init()
    }

    keydownEvent = (event) => {

        if (event.code == 'Space') {

            if (this.state == 'playing' && this.dino.state !== 'jump') {
                this.dino.jump()
                this.audio.beep()
            }

            if (this.state == 'init') {
                this.initAssets();
                this.loop();
                this.state = 'playing'
                this.dino.jump()
                this.audio.beep()
            }
        }
    }

    keyupEvent = (event) => {

        if (event.code == 'Space') {

            if (this.state == 'dead') {

                this.initAssets();
                this.loop()
                this.state = 'playing'
                this.dino.jump()
                this.audio.beep()

            }
        }
    }

    clickEvent = (event) => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
    }

    async addEvents(wait) {
        if (wait) {
            await new Promise(resolve => setTimeout(resolve, wait));
        }

        document.addEventListener('keydown', this.keydownEvent)
        document.addEventListener('keyup', this.keyupEvent)
        document.addEventListener('touchstart', this.clickEvent)
    }

    removeEvents() {
        document.removeEventListener('keydown', this.keydownEvent)
        document.removeEventListener('keyup', this.keyupEvent)
        document.addEventListener('touchstart', this.clickEvent)

    }

    updateSpeed() {

        if (this.frameCounter % 60) {
            if (this.speed < this.maxSpeed) {
                this.speed += 0.001
            }
        }       
    }

    getSpeed() {
        let speed = this.speed * (60 / this.fps)
        if (this.debug) document.getElementById('speed').innerHTML = "Speed: " + speed
        return speed
    }

    calculateScore(speed, frameCounter) {
        this.score += 1
        return this.score
    }
    
    updateFps(){

        if (this.frameCounter % 60) { 
            let timeElapsed = performance.now() - this.gameBeginTime;
            this.fps = 1000 * this.frameCounter / timeElapsed;
        }

        if (this.debug) document.getElementById('fps').innerHTML = 'FPS: ' + this.fps
    }

    drawScore(speed, frameCounter) {
        if (frameCounter % 5 === 0) {
            let score = this.calculateScore(speed, frameCounter);
            this.score = score;
    
            // Save the updated score to local storage within the user object
            this.saveScore();
        }
    
        this.ctx.fillStyle = 'white'; // Set text color to white
        this.ctx.font = '32px serif';
    
        let scoreTxt = String(this.score).padStart(5, '0');
        this.ctx.fillText(scoreTxt, 1100, 50); // Use fillText instead of strokeText
    
        // Get the logged-in username
        const loggedInUsername = getLoggedInUsername();
    
        // Retrieve the user object from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = users.find(u => u.username === loggedInUsername);
    
        // Display the high score directly from the user object
        if (loggedInUser && loggedInUser.highScore !== undefined) {
            let hiScore = String(loggedInUser.highScore).padStart(5, '0');
            this.ctx.fillText(`HI ${hiScore}`, 950, 50); // Use fillText instead of strokeText
        }
    }
    
    saveScore() {
        // Get the logged-in username
        const loggedInUsername = getLoggedInUsername();
    
        // Retrieve the user object from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = users.find(u => u.username === loggedInUsername);
    
        // Update the user object with the new score
        if (loggedInUser) {
            loggedInUser.highScore = Math.max(loggedInUser.highScore || 0, this.score);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    

    loop() {
        
        let running = true;
        this.frame = window.requestAnimationFrame(async () => {

            this.updateFps()
            if (this.state == 'playing') {

                this.updateSpeed();
                let speed = this.getSpeed()

                this.ctx.clearRect(0, 0, this.width, this.height);

                let obstacle = this.obstacles.obstacles[0]
                let dino = this.dino;

                if (detectCollision(dino, obstacle)) {
                    running = false
                    this.gameOver()
                }

                this.drawScore(speed, this.frameCounter)

                this.clouds.update(speed, this.frameCounter)
                this.track.update(speed * 4, this.frameCounter)
                this.dino.update(speed, this.frameCounter)
                this.obstacles.update(speed * 4, this.frameCounter)

                if (this.score > 100) {
                    this.obstacles.useBirds = true
                }
            }

            if (running) {
                this.frameCounter += 1
                this.loop()
            }
        });
    }

    gameOver() {

        this.stop()
        this.audio.endBeep()
        this.state = 'dead'
        this.dino.state = 'dead'
        this.saveScore()
        this.removeEvents()
        
        this.ctx.drawImage(this.assets.GameOver, 400, 50);
        this.ctx.drawImage(this.assets.Reset, 555, 100);

        this.addEvents(2000)        

    }

    stop() {
        window.cancelAnimationFrame(this.frame)
    }

    async loadAssets(json) {

        this.assets = {}
        let promises = []
            for (const elem of json) {
                promises.push(loadImage(elem.path))
            }
        
        await Promise.all(promises).then( images => {
            let i = 0;
            for (const elem of json) {
                this.assets[elem.shortName] = images[i]; // loadImage(elem.path)
                i += 1
            }
        })
    }
}

export { Game };
