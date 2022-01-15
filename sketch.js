var frank, frankRunning, frankRunningReverse, frankCollided;
var spikesImg
var widthW, heightW;
var Play = 1,End = 2, Win = 3;
var gameState = Play;
var canPress = false, pressCount = 30;
var bgImg
var finishLine = 300
var movement = 0
var obstacleImg, obstacleGroup, obstacleX;
var itemVal = 0
var itemArray = []
var overPlatGroup
var onePlatSpinnerGroup, twoPlatSpinnerGroup, spikeGroup, fireballGroup, heartGroup,pointGroup;
var score = 0
var resetButton,resetButtonImg;
var heartImg,heart1,heart2,heart3,heart4,heart5,heart6,health = 3
var fireballAnim
var jumpSound, gamePlaySound, deathSound, pointSound,hitSound,celebrateSound;

function preload(){
  frankRunning = loadAnimation(
  "/assets/frank1.jpg", 
  "/assets/frank2.jpg"
  ,"/assets/frank3.jpg", 
  "/assets/frank4.jpg", 
  "/assets/frank5.jpg", 
  "/assets/frank6.jpg", 
  "/assets/frank7.jpg")

frankRunningReverse = loadAnimation(
  "/assets/frank1r.jpg", 
  "/assets/frank2r.jpg"
  ,"/assets/frank3r.jpg", 
  "/assets/frank4r.jpg", 
  "/assets/frank5r.jpg", 
  "/assets/frank6r.jpg", 
  "/assets/frank7r.jpg")

  frankCollided = loadAnimation("/assets/frankCollided.png")

  obstacleImg = loadImage("/assets/JumpingPlatform.jpg")
  spikesImg = loadImage("/assets/spikes.png")
  resetButtonImg = loadImage("/assets/resetButton.png")
  heartImg = loadImage("/assets/heart.png")

 fireballAnim = loadAnimation(
    "/assets/fireball1.jpg",
    "/assets/fireball2.jpg",
    "/assets/fireball3.jpg",
    "/assets/fireball4.jpg",
    "/assets/fireball5.jpg",
    "/assets/fireball6.jpg")

    jumpSound = loadSound("/assets/Jump.wav")
    gamePlaySound = loadSound("/assets/gamePlay.wav")
    deathSound = loadSound("/assets/death.wav")
    hitSound = loadSound("/assets/hit.wav")
    celebrateSound = loadSound("/assets/victory.wav")
}

function setup() {
widthW = windowWidth
heightW = windowHeight

    createCanvas(widthW, heightW);

    frank = createSprite(5,heightW / 2 + 100, 50,50)
    frank.addAnimation("runningForward", frankRunning)
    frank.addAnimation("runningBack", frankRunningReverse)
    frank.addAnimation("collided", frankCollided)
    frank.scale = 0.35
    frank.debug = true

    platfrom = createSprite(widthW/2, heightW - 25,widthW * 100,75)
    platfrom.visible = false

    platfromUp = createSprite(widthW/2, 10,widthW * 100, 30)
    platfromUp.visible = false

    startPlat = createSprite(frank.x, heightW / 2 + 250,300,heightW / 2 - 50)

    contactPlat = createSprite(widthW / 2, heightW - 30, widthW * 100,75)
    contactPlat.shapeColor = "Red"
    contactPlat.visible = false

    resetButton = createSprite(camera.position.x, heightW / 2,50,50)
    resetButton.addImage("reset", resetButtonImg)
    resetButton.scale = 0.25
    resetButton.visible = false

    fireBallSpawn = createSprite(widthW, height / 2,10,10)

    heart1 = createSprite(5,50,50,50)
    heart1.addImage("heart", heartImg)
    heart1.scale = 0.1

    heart2 = createSprite(5,50,50,50)
    heart2.addImage("heart", heartImg)
    heart2.scale = 0.1

    heart3 = createSprite(5,50,50,50)
    heart3.addImage("heart", heartImg)
    heart3.scale = 0.1

    heart4 = createSprite(5,100,50,50)
    heart4.addImage("heart", heartImg)
    heart4.scale = 0.1

    heart5 = createSprite(5,100,50,50)
    heart5.addImage("heart", heartImg)
    heart5.scale = 0.1

    heart6 = createSprite(5,100,50,50)
    heart6.addImage("heart", heartImg)
    heart6.scale = 0.1

    obstacleGroup = new Group()
    overPlatGroup = new Group()
    xMoverGroup = new Group()
    yMoverGroup = new Group()
    onePlatSpinnerGroup = new Group()
    twoPlatSpinnerGroup = new Group()
    spikeGroup = new Group()
    fireballGroup = new Group()
    heartGroup = new Group()
    pointGroup = new Group()

    heightArray = [heightW / 2 - 100,heightW / 2, heightW / 2 + 100]
}
  function draw() {
    background(0,0,0)
if(gameState == Play){
  // height and width aray setup
      camera.position.x = frank.x
      frank.velocityX = 0
      fireBallSpawn.x = camera.position.x + 775
      heart1.x = camera.position.x + 430
      heart2.x = camera.position.x + 480
      heart3.x = camera.position.x + 530
      heart4.x = camera.position.x + 430
      heart5.x = camera.position.x + 480
      heart6.x = camera.position.x + 530

      heart1.visible = true
      heart2.visible = true
      heart3.visible = true

      spawnObstacles(itemArray.length)

      if(frameCount % 80 === 0){
        spawnFireballs(fireBallSpawn.x, frank.y - Math.round(random(50,85)))
     }
   // Checks if he can't press the space bar then it will decrease the time until he can press it   
  if(!canPress){
    pressCount = pressCount - 1
  }
  
  // Movements
      frank.velocityY += 1
  
    // Collisions
      frank.collide(platfrom)
      frank.collide(obstacleGroup)
      frank.collide(overPlatGroup)
      frank.collide(startPlat)
      frank.collide(onePlatSpinnerGroup)
      frank.collide(twoPlatSpinnerGroup)
  
  if(frank.isTouching(platfromUp)){
    frank.velocityY += 3
  }
  if(frank.isTouching(contactPlat)){
    gameState = End
    deathSound.play()
  }
  if(frank.isTouching(overPlatGroup)){
    gameState = Win
    celebrateSound.play()
  }
  if(frank.isTouching(spikeGroup)){
    gameState = End
    deathSound.play()
  }
  if(frank.isTouching(fireballGroup)){
   for(i=0;i<fireballGroup.length;i++){
      if(frank.isTouching(fireballGroup[i])){
          fireballGroup[i].destroy(frank)
          health -= 1
          hitSound.play()
       }
   }
  }

  if(frank.isTouching(heartGroup)){
    for(i=0;i<heartGroup.length;i++){
      if(frank.isTouching(heartGroup[i])){
        heartGroup[i].destroy(frank)
          health += 1
      }
    }
  }

  if(frank.isTouching(pointGroup)){
    for(i=0;i<pointGroup.length;i++){
if(frank.isTouching(pointGroup[i])){
  pointGroup[i].destroy(frank)
  score += 12
}
    }
  }

  if(health < 7){
    heart6.visible = true
    heart5.visible = true
    heart4.visible = true
    heart3.visible = true
    heart2.visible = true
    heart1.visible = true
  }
  if(health < 6){
    heart6.visible = false
    heart5.visible = true
    heart4.visible = true
    heart3.visible = true
    heart2.visible = true
    heart1.visible = true
  }
  if(health < 5){
    heart6.visible = false
    heart5.visible = false
    heart4.visible = true
    heart3.visible = true
    heart2.visible = true
    heart1.visible = true
  }
  if(health < 4){
    heart6.visible = false
    heart5.visible = false
    heart4.visible = false
    heart3.visible = true
    heart2.visible = true
    heart1.visible = true
  }
  if(health < 3){
    heart6.visible = false
    heart5.visible = false
    heart4.visible = false
    heart3.visible = false
    heart2.visible = true
    heart1.visible = true
  }
  if(health < 2){
    heart6.visible = false
    heart5.visible = false
    heart4.visible = false
    heart3.visible = false
    heart2.visible = false
    heart1.visible = true
  }
  if(health < 1){
    heart6.visible = false
    heart5.visible = false
    heart4.visible = false
    heart3.visible = false
    heart2.visible = false
    heart1.visible = false
    gameState = End
  }

  // keys for movement
  if(keyDown("right") || keyDown("d")){
    frank.changeAnimation("runningForward", frankRunning)
    frank.x += 5
    // camera.position.x += 5
  }
  
  if(keyDown("left") || keyDown("a")){
    frank.changeAnimation("runningBack", frankRunningReverse)
    frank.x -= 5
  //  camera.position.x -= 5
  }
  
  if(keyDown("space") && pressCount <= 0){
    frank.velocityY = -18
    canPress = false
    pressCount = 30
    jumpSound.play()
  }
}
else if(gameState == End){
  frank.changeAnimation("collided",frankCollided)
   obstacleGroup.destroyEach()
   onePlatSpinnerGroup.destroyEach()
   twoPlatSpinnerGroup.destroyEach()
   spikeGroup.destroyEach()
   fireballGroup.destroyEach()
   heartGroup.destroyEach()
   pointGroup.destroyEach()
   overPlatGroup.destroyEach()
   //contactPlat.destroy(frank)
   itemArray.length = 0

   heart1.visible = false
   heart2.visible = false
   heart3.visible = false
   heart4.visible = false
   heart5.visible = false
   heart6.visible = false

   if(mousePressedOver(resetButton)){
     reset()
  }
}

else if(gameState == Win){
  //frank.changeAnimation("collided",frankCollided)
  obstacleGroup.destroyEach()
  onePlatSpinnerGroup.destroyEach()
  twoPlatSpinnerGroup.destroyEach()
  spikeGroup.destroyEach()
  fireballGroup.destroyEach()
  heartGroup.destroyEach()
  pointGroup.destroyEach()
  overPlatGroup.destroyEach()
  //contactPlat.destroy(frank)
  itemArray.length = 0

  heart1.visible = false
  heart2.visible = false
  heart3.visible = false
  heart4.visible = false
  heart5.visible = false
  heart6.visible = false

  if(mousePressedOver(resetButton)){
    reset()
 }
}
drawSprites();
if(gameState == Play){
  textSize(30)
  stroke(2)
  fill("White")
  text("Score: "+ score, camera.position.x - 300, 50)

  textSize(30)
  stroke(2)
  fill("Red")
  text("Health: ", camera.position.x + 300, 60)
}
else if(gameState == End){
   textSize(100)
   stroke(2)
   fill("Red")
   text("You died!", camera.position.x, 200)

   textSize(100)
   stroke(2)
   fill("White")
   text("Your Score: "+ score, camera.position.x - 150,350)

   resetButton.visible = true
   resetButton.x = camera.position.x
   resetButton.y = 500
}
else if(gameState == Win){
  textSize(80)
  stroke(2)
  fill("Yellow")
  text("Congratulations You Win!", camera.position.x - 300, 200)

  resetButton.visible = true
  resetButton.x = camera.position.x
  resetButton.y = 500
}
}

function spawnObstacles(itemNum){
  obstaclePick = Math.round(random(1,4))
  if(itemNum < Math.round(finishLine / 20)){
    if(itemNum == 0){
      spawnSimplePlat(finishLine - 20/20, 0)
    }
    if(obstaclePick == 1||obstaclePick == 2){
      spawnSimplePlat(finishLine - 20/20, itemArray.length)
    }
     else if(obstaclePick == 3){
      spawnOnePlatSpinner(finishLine - 20/20, itemArray.length)
     }
    else if(obstaclePick == 4){
      spawnTwoPlatSpinner(finishLine - 20/20, itemArray.length)
    }
  }

  else if(itemNum > Math.round(finishLine / 30)) {
  var lastItem = itemArray[itemNum - 1]
overGamePlat = createSprite(lastItem.x + 500, heightW / 2 + heightW / 4, 500,heightW / 2)
//overGamePlat.addImage("JumpingPlatform", obstacleImg)
overPlatGroup.add(overGamePlat)
    }
}

function spawnSimplePlat(itemPosX,itemNum){
  var randY = Math.round(random(0,2))
  // This function spwans simple platforms which the player will use to move across the map
  var obstacle = createSprite(itemPosX + 250 * itemNum,heightArray[randY],5,5)
      obstacle.addImage("JumpingPlatform", obstacleImg)
      obstacle.scale = 0.25
      obstacle.debug = true
      itemArray.push(obstacle)
      obstacleGroup.add(obstacle)

      var point = createSprite(obstacle.x,obstacle.y,110,60)
      point.shapeColor = "Yellow"
      point.visible = false
      pointGroup.add(point)


      // This function will spawn random spikes on platforms
      if(Math.round(random(1,3)) == 1){
        var spike = createSprite(obstacle.x, heightArray[randY] - 20,50,50)
        spike.addImage("spike", spikesImg)
        spike.scale = 0.12
        spikeGroup.add(spike)
      }

      if(Math.round(random(1,6)) == 1){
        spawnHeart(obstacle.x, randY)
      }
}
function spawnOnePlatSpinner(itemPosX, itemNum){
  randY = Math.round(random(1,2))
  // This function spawns one rect shaped block which spins by changing it's rotation by 5
  var spinner = createSprite(itemPosX + 250 * itemNum, heightArray[randY],110,5)
  spinner.rotationSpeed = -3
  itemArray.push(spinner)
  onePlatSpinnerGroup.add(spinner)

  var point = createSprite(spinner.x,spinner.y,110,90)
      point.shapeColor = "Yellow"
      point.visible = false
      pointGroup.add(point)

  if(Math.round(random(1,6)) == 1){
    spawnHeart(spinner.x, randY)
  }

}

function spawnTwoPlatSpinner(itemPosX, itemNum){
  randY = Math.round(random(1,2))
  // This function spawns two rect shaped blocks which has different initial rotation values. The two blocks spin by changing it's rotation by 5
  var spinner1 = createSprite(itemPosX + 275 * itemNum, heightArray[randY],110,5)
  spinner1.shapeColor = "Red"
  spinner1.rotation = 0
  spinner1.rotationSpeed = -3

  var spinner2 = createSprite(itemPosX + 275 * itemNum, heightArray[randY],110,5)
  spinner2.shapeColor = "Red"
  spinner2.rotation = 90
  spinner2.rotationSpeed = -3

  itemArray.push(spinner1,spinner2)
  twoPlatSpinnerGroup.add(spinner1)
  twoPlatSpinnerGroup.add(spinner2)

  var point = createSprite(spinner1.x,spinner1.y,110,90)
      point.shapeColor = "Yellow"
      point.visible = false
      pointGroup.add(point)

  if(Math.round(random(1,6)) == 1){
    spawnHeart(spinner1.x, randY)
  }
}

function spawnFireballs(x,y){
  // This function will spawn fireballs
  var fireball = createSprite(x,y,50,50)
  fireball.addAnimation("fireBallAnim",fireballAnim)
  fireball.scale = 0.45
  fireball.velocityX = -5
  fireball.rotation = 180
  fireballGroup.setColliderEach("rectangle",0 , 0,150,150);
  fireballGroup.add(fireball)
}

function spawnHeart(x,y){
   var heart = createSprite(x,heightArray[y] - 75,50,50)
   heart.addImage("heart",heartImg)
   heart.scale = 0.1
   heartGroup.add(heart)
}

function reset(){
  gameState = Play

  frank.x = 5
    frank.y = heightW / 2 + 100
    frank.changeAnimation("runningForward", frankRunning)
    spawnObstacles()

    resetButton.visible = false
    score = 0
    health = 3

    heart1.visible = true
    heart2.visible = true
    heart3.visible = true
    heart4.visible = true
    heart5.visible = true
    heart6.visible = true

    deathSound.stop()
  celebrateSound.stop()
}