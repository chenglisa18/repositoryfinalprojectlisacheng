var mode = 0;
let osc;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  osc = new p5.Oscillator("sine");
  osc.start();
  osc.amp(0);
}

function draw() {
  if (mouseIsPressed) mode = 1;

  if (mode == 0) {
    background(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Click to Start", width/2, height/2);
  }

  if (mode == 1) {
    background(50, 50, 120);

    // player
    ellipse(mouseX, mouseY, 20, 20);

    // simple falling objects
    for (let i = 0; i < 3; i++) {
      let x = 150 * (i + 1);
      let y = (frameCount * 2 + i * 80) % height;
      
      ellipse(x, y, 20, 20);

      // sound when close
      if (dist(mouseX, mouseY, x, y) < 25) {
        osc.freq(300 + i * 100);
        osc.amp(0.3);
      }
    }
  }
}
