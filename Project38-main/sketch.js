var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("Images/trex1.png","Images/trex3.png","Images/trex4.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  
  groundImage = loadImage("Images/ground2.png");
  
  cloudImage = loadImage("Images/cloud.png");
  
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  obstacle5 = loadImage("Images/obstacle5.png");
  obstacle6 = loadImage("Images/obstacle6.png");
  
  restartImg = loadImage("Images/restart.png")
  gameOverImg = loadImage("Images/gameOver.png")
  
  jumpSound = loadSound("Sounds/jump.mp3")
  dieSound = loadSound("Sounds/die.mp3")
  checkPointSound = loadSound("Sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight - 80);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,displayHeight - 120,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/15,displayHeight - 120,displayWidth*2,40);
  ground.addImage("ground",groundImage);
  
  
  gameOver = createSprite(displayWidth/2,displayHeight/2 - 20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2 + 10,displayHeight/2 + 20);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-90,displayWidth,10);
  invisibleGround.visible = false;
   
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
}

function draw() {
  
  background(180);
  
  text("Score: "+ score, displayWidth/1.05,displayHeight/15);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    

    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    trex.velocityX = (6 + score/100);
  
      ground.velocityX = (6 + score/100);
      invisibleGround.velocityX = (6 + score/100);

  
    
    if(keyDown("space")&& trex.y >= displayHeight - 120) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.7
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        trex.velocityX = 0;
        trex.velocityY = 0;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      trex.changeAnimation("collided", trex_collided);
    
      ground.velocityX = 0;
      trex.velocityY = 0;
     
      if(mousePressedOver(restart)) {
      reset();
      }
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(trex.x + 600,displayHeight - 120,10,40);


         camera.position.x = trex.x;
          camera.position.y = displayHeight/2;
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.7
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.8
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.6
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.3;
              break;
      default: break;
    }
             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
 
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,-displayHeight + 30,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 400;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

