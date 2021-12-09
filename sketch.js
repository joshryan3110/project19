var trex,trexRun,trexCrouch,trexHit,smolTrex,smolTrexImg,smolTrexGroup
var cactus1,cactus2,cactus3,cactus4,cactus5,cactus6,cactusgroup
var project,projectImg,projectGroup
var ground,groundImage,notGround
var cloud,cloudI,cloudGroup
var over,overImage,restart,restartImage;
var cpSound,jumpSound,oof
var score=0;
var gamestate="start"

function preload(){
    trexRun=loadAnimation("trex3.png","trex4.png");
    trexCrouch=loadAnimation("trexduck.png","trexduck2")
    trexBump=loadImage("trex_collided.png");

    cactus1=loadImage("obstacle1.png");
    cactus2=loadImage("obstacle2.png");
    cactus3=loadImage("obstacle3.png");
    cactus4=loadImage("obstacle4.png");
    cactus5=loadImage("obstacle5.png");
    cactus6=loadImage("obstacle6.png");

    projectImg=loadImage("arrow0.png")
  
  
    groundImage=loadImage("ground2.png");
  
    cloudI=loadImage("cloud.png");

    obst1=loadImage("obstacle1.png");
    obst2=loadImage("obstacle2.png");

    overImage=loadImage("gameOver.png");
    restartImage=loadImage("restart.png");

    jumpSound=loadSound("jump.mp3");
    oof=loadSound("die.mp3");
    cpSound=loadSound("checkpoint.mp3");
}

function setup() {
    createCanvas(1350,610)

    trex=createSprite(200,350)
    trex.addAnimation("run",trexRun);
    trex.addAnimation("duck",trexCrouch);
    trex.addImage("ded",trexBump);
    trex.scale=0.7
    trex.debug=false
    trex.setCollider("circle",0,0,42);

    ground=createSprite(675,410)
    ground.addImage("image",groundImage)
  
    notGround=createSprite(675,430,1350,10)
    notGround.visible=false
  
    over=createSprite(675,250);
    over.addImage(overImage);
    over.scale=1
    over.visible=false;
    
    restart=createSprite(675,300);
    restart.addImage(restartImage);
    restart.scale=0.5
    restart.visible=false;
  
    cactusgroup=new Group();
    projectGroup=new Group();
    cloudgroup=new Group();
    smolTrexGroup=new Group();
}

function draw() {
    background("white")
    trex.collide(notGround)
    console.log(trex.y)
    textSize(30)
    text("Score: "+score,1120,100)
    
    if(gamestate==="start"){
        ground.velocityX=0
        if(keyDown("space")){
            gamestate="play"
        }
        textSize(50)
        text("Press Spacebar To Start",400,200)
    } 

    else if(gamestate==="play"){
        trex.velocityY+=0.5

        if(keyDown("space") && trex.y>394){
            trex.velocityY=-12.5
            jumpSound.play();
        }

        ground.velocityX=-(6+score/100);

        if(ground.x<0){
            ground.x=ground.width/2;
        }
        
        spawnCactus();

        spawnCloud();

        spawnProjectile();

        if(score%100===0 && score>0){
          cpSound.play();
        }
    
        if(frameCount%5===0){
          score=score+1;
        }

        // if(trex.isTouching(smolTrexGroup)){
        //   smolTrexGroup.destroyEach();
        //   score+1;
        // }

        if(trex.isTouching(cactusgroup)||trex.isTouching(projectGroup)){
            gamestate="end"
            oof.play();
        }

    }
    if(gamestate==="end"){
        trex.changeAnimation("ded",trexHit)
        trex.velocityY=0;

        ground.velocityX=0;

        cloudgroup.setVelocityXEach(0);
        cloudgroup.setLifetimeEach(-1)
    
        cactusgroup.setVelocityXEach(0);
        cactusgroup.setLifetimeEach(-1)

        over.visible=true;
        restart.visible=true;
    
        if(mousePressedOver(restart)){
          reset();

          projectGroup.setVelocityXEach(0)
        }
      }    
    drawSprites();
}

function spawnCloud(){
  //spawns cloud every 45 frames
  if(frameCount%45===0){

    //cloud spawns at different height
    cloud=createSprite(1360,random(100,300));

    cloudgroup.add(cloud)
    cloud.scale=random(0.4,0.8)
    cloud.addImage(cloudI);
    cloud.velocityX=-(5+score/100);

    //assign lifetime to the object
    cloud.lifetime=300;

    //the cloud does not pass through the t-rex
    trex.depth=cloud.depth+1;
  }
}

function spawnCactus(){
  //spawns cactus every 60 frames
  if(frameCount%70===0){
    var cactuss=createSprite(1360,390);
    cactusgroup.add(cactuss);
    cactuss.scale=0.7
    cactuss.velocityX=-(6+score/100);
    cactuss.lifetime=235
    
    var randomnumber=Math.round(random(1,6));
    //switch case so as to make the cactus random
    switch(randomnumber){
      case 1:cactuss.addImage(cactus1);
      break;
      case 2:cactuss.addImage(cactus2);
      break;
      case 3:cactuss.addImage(cactus3);
      break;
      case 4:cactuss.addImage(cactus4);
      break;
      case 5:cactuss.addImage(cactus5);
      break;
      case 6:cactuss.addImage(cactus6);
    }
  }
}  

function reset(){
  gamestate="play";
  cactusgroup.destroyEach();
  cloudgroup.destroyEach();
  score=1;
  restart.visible=false;
  over.visible=false;
  trex.changeAnimation("run",trexRun)
  trex.y=160;
}


function spawnProjectile(){
  if(frameCount%120===0){
    project=createSprite(1360,random(200,390))
    projectGroup.add(project)
    project.addImage(projectImg);
    project.scale=0.2
    project.velocityX=-30
    project.lifetime=300
    project.debug=false
    project.setCollider("rectangle",0,0,150,10)
  }
}

// function spawnDaBaby(){
//   if(frameCount%30===0){
//     smolTrex=createSprite(900,370)
//     smolTrexGroup.add(smolTrex);
//     smolTrex.addImage(smolTrexImg);
//     smolTrex.scale=0.5
//     smolTrex.velocityX=-6
//     smolTrex.lifetime=245;
//   }
// }
