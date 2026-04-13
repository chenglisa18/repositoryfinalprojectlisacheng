var mode = 0;

let splash;
let osc;

function setup() {
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();
  
  // simple sound setup
  osc = new p5.Oscillator("sine");
  osc.start();
  osc.amp(0);
}

function draw() {
  if (mouseIsPressed && splash.update()) {
    mode = 1;
  }

  if (mode == 0) {
    splash.display();
  }

  if (mode == 1) {
    background(30, 30, 80);
    
    // simple interaction
    fill(255);
    ellipse(mouseX, mouseY, 25, 25);
    
    // simple falling object
    for (let i = 0; i < 5; i++) {
      let x = (i * 120) + 100;
      let y = (frameCount * 2 + i * 80) % height;
      
      fill(255, 200, 100);
      ellipse(x, y, 20, 20);
      
      // play sound when mouse is close
      let d = dist(mouseX, mouseY, x, y);
      if (d < 30) {
        osc.freq(300 + i * 100);
        osc.amp(0.3);
      }
    }
    
    // fade sound when not touching
    if (!mouseIsPressed) {
      osc.amp(0, 0.1);
    }
  }
}

// simple splash class
class Splash {
  constructor() {
    this.ready = false;
  }
  
  update() {
    this.ready = true;
    return this.ready;
  }
  
  display() {
    background(10, 10, 40);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Sound Catcher", width / 2, height / 2 - 40);
    
    textSize(20);
    text("Click to Start", width / 2, height / 2 + 20);
  }
}
