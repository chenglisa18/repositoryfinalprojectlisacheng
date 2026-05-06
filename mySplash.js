class Splash {

 constructor() {
  this.splashBorder = 100;
  this.hidden = false;

  this.title = createDiv("Musical Sound Catcher");
  this.title.style('color:deeppink');
  this.title.style('font-family: Arial, Helvetica, sans-serif');
  this.title.position(this.splashBorder+20, this.splashBorder+20);
  
  this.name = createDiv("Lisa Cheng");
  this.name.position(this.splashBorder+20, this.splashBorder+60);
  
  this.info = createDiv("My project is an interactive sound game built in p5.js. I used classes to organize the different game objects, like the paddle, falling notes, particles, stars, and splash screen. I used for loops to create and update multiple objects efficiently. I also added sound with an oscillator and envelope, so the player gets audio feedback for success and failure. Overall, the goal was to combine gameplay, visual design, and sound into one simple but engaging project.  <a href=https://github.com/chenglisa18/repositoryfinalprojectlisacheng>view code</a>");
  
  this.info.position(this.splashBorder+20, this.splashBorder+100);
  this.info.size(windowWidth-this.splashBorder*2-50, windowHeight-this.splashBorder*2-50)
}

  display(){
    background(20, 25, 45);

    fill(255);
    stroke(255, 0, 0);
    strokeWeight(3);
    rect(this.splashBorder, this.splashBorder, windowWidth-this.splashBorder*2, windowHeight-this.splashBorder*2);

    fill(0, 0, 222);
    line(windowWidth-this.splashBorder-40, this.splashBorder+20,windowWidth-this.splashBorder-20, this.splashBorder+40);
    line(windowWidth-this.splashBorder-20, this.splashBorder+20,windowWidth-this.splashBorder-40, this.splashBorder+40);
  }
  
  update(){
       if(mouseX > windowWidth-this.splashBorder-40 && 
          mouseX < windowWidth-this.splashBorder-20 
          && mouseY < this.splashBorder+40 
          && mouseY > this.splashBorder+20
     ){
     return true
   }
  }
 
  hide(){
    if (!this.hidden) {
      this.title.remove()
      this.name.remove()
      this.info.remove()
      volumeSlider.show()
      this.hidden = true;
    }
  }
}
