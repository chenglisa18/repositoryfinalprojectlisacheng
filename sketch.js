var mode = 0;

let splash;
let catcher;
let notes = [];
let particles = [];
let stars = [];

let score = 0;
let lives = 5;
let gameOver = false;
let paused = false;

let spawnRate = 45;
let frameCounter = 0;

let osc;
let env;
let volumeSlider;
let soundStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  splash = new Splash();
  catcher = new Catcher();
  
  osc = new p5.Oscillator("sine");
  env = new p5.Envelope();
  env.setADSR(0.01, 0.1, 0.2, 0.2);
  env.setRange(0.4, 0);
  osc.amp(0);
  
  volumeSlider = createSlider(0, 100, 40);
  volumeSlider.position(20, 20);
  volumeSlider.style("width", "120px");
  volumeSlider.hide();
  
  for (let i = 0; i < 60; i++) {
    stars.push(new Star());
  }
}

function draw() {
  if (mode == 0) {
    splash.display();
  }
  
  if (mode == 1) {
    splash.hide();
    runGame();
  }
}

function mousePressed() {
  if (mode == 0 && splash.update() == true) {
    startSound();
    mode = 1;
  }
}

function startSound() {
  if (!soundStarted) {
    userStartAudio();
    osc.start();
    osc.amp(0);
    soundStarted = true;
  }
}

function runGame() {
  background(20, 25, 45);
  
  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].display();
  }
  
  drawUI();
  
  if (gameOver) {
    displayGameOver();
    return;
  }
  
  if (paused) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Paused", width / 2, height / 2);
    return;
  }
  
  catcher.update();
  catcher.display();
  
  frameCounter++;
  if (frameCounter >= spawnRate) {
    notes.push(new FallingNote());
    frameCounter = 0;
  }
  
  for (let i = notes.length - 1; i >= 0; i--) {
    notes[i].update();
    notes[i].display();
    
    if (catcher.hits(notes[i])) {
      score++;
      playCatchSound();
      
      for (let j = 0; j < 8; j++) {
        particles.push(new Particle(notes[i].x, notes[i].y));
      }
      
      notes.splice(i, 1);
    } else if (notes[i].offscreen()) {
      lives--;
      playMissSound();
      notes.splice(i, 1);
      
      if (lives <= 0) {
        gameOver = true;
      }
    }
  }
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    if (particles[i].done()) {
      particles.splice(i, 1);
    }
  }
}

function drawUI() {
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  text("Volume", 20, 50);
  text("Score: " + score, 20, 80);
  text("Lives: " + lives, 20, 110);
  text("1 = Easy   2 = Medium   3 = Hard   P = Pause   R = Restart", 20, 140);
}

function displayGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Game Over", width / 2, height / 2 - 40);
  
  textSize(28);
  text("Final Score: " + score, width / 2, height / 2 + 10);
  
  textSize(22);
  text("Press R to restart", width / 2, height / 2 + 55);
}

function playCatchSound() {
  let vol = volumeSlider.value() / 100;
  osc.amp(vol);
  env.setRange(vol, 0);
  
  let notePitch = map(score % 8, 0, 7, 220, 660);
  osc.freq(notePitch);
  env.play(osc);
}

function playMissSound() {
  let vol = volumeSlider.value() / 100;
  osc.amp(vol);
  env.setRange(vol, 0);
  osc.freq(120);
  env.play(osc);
}

function keyPressed() {
  if (key === '1') {
    spawnRate = 60;
  }
  if (key === '2') {
    spawnRate = 45;
  }
  if (key === '3') {
    spawnRate = 30;
  }
  if (key === 'p' || key === 'P') {
    paused = !paused;
  }
  if (key === 'r' || key === 'R') {
    restartGame();
  }
}

function restartGame() {
  score = 0;
  lives = 5;
  notes = [];
  particles = [];
  gameOver = false;
  paused = false;
  spawnRate = 45;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Catcher {
  constructor() {
    this.w = 120;
    this.h = 20;
    this.y = height - 80;
    this.x = width / 2;
  }
  
  update() {
    this.x = mouseX;
    this.x = constrain(this.x, this.w / 2, width - this.w / 2);
    this.y = height - 80;
  }
  
  display() {
    fill(100, 220, 255);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 10);
    
    fill(180, 240, 255);
    ellipse(this.x, this.y - 10, 30, 30);
  }
  
  hits(note) {
    return (
      note.x > this.x - this.w / 2 &&
      note.x < this.x + this.w / 2 &&
      note.y + note.size / 2 > this.y - this.h / 2 &&
      note.y - note.size / 2 < this.y + this.h / 2
    );
  }
}

class FallingNote {
  constructor() {
    this.x = random(40, width - 40);
    this.y = -20;
    this.speed = random(3, 6);
    this.size = random(20, 35);
  }
  
  update() {
    this.y += this.speed;
  }
  
  display() {
    fill(255, 220, 100);
    noStroke();
    
    ellipse(this.x, this.y, this.size, this.size);
    rect(this.x + this.size / 3, this.y - this.size, 6, this.size);
    ellipse(this.x + this.size / 3 + 8, this.y - this.size + 5, 18, 12);
  }
  
  offscreen() {
    return this.y > height + 30;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-3, 3);
    this.dy = random(-3, 3);
    this.alpha = 255;
    this.size = random(4, 10);
  }
  
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 6;
  }
  
  display() {
    fill(255, 255, 255, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  done() {
    return this.alpha <= 0;
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.5, 2);
    this.size = random(2, 5);
  }
  
  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }
  
  display() {
    fill(255, 255, 255, 180);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}
