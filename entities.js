var player; 
var enemyList = {};
var npcList = {};
var merchantList = {};
var upgradeList = {};
var bulvarList = {}; 
var corpseList = {}; 
var trapList = {};
var coffinList = {}; 
var doorList = {};
var triggerList = {};
var ritualStoneList = [];
var torchList = {};
var howManyHealPotions = 0;
 
 
Player = function(type, id, x, y, width, height, img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulvarType){
  var self = Actor(type, id, x, y, width, height, img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulvarType); 
  self.dead = false;
  self.isAttacking = false;
  self.isRaging = false; //for barbarian only
  self.isTalking = false
  self.targetX = 0;
  self.targetY = 0;
  self.currentQuest = "none";
  self.currentEvent = "none";
  self.killCount = 0;
  self.deathCause = "Wow, you're still alive, that's impressive... Are you sure you want to leave?"
  self.hpRegen = 2;
  self.manaRegen = 2;
	self.hp = self.constitution*100;
  self.skillPoints = 2; 
  self.manaMax = Math.floor((self.intellect*100)/3)
	self.mana = Math.floor((self.intellect*100)/3)
  self.atkSpd = 1.4 //Math.floor(self.dexterity/5);
  self.atkSpdMod = 0;
        
  self.lvl = 1;
  self.lvlUpCounter = 0;
  self.isLeveling = false;
  self.xp = 0; 
  self.xpMax = 1000;
  self.isSkillChanged = false;  

  self.gold = 100; 

  self.isHatOn = false;

  self.hat = "None"
  self.armor = "None"
  self.isClothingOn = false

        
  if(self.id === "wizard"){
    self.PhysicalAttackList = ["frostball","fireball", "polymorf"]
  } else if(self.id === "barbarian"){
    self.PhysicalAttackList = ["SwordStrike", "arrow"];
    self.bulvarType2 ="fireball";
  }
  self.showPhysicalAttacks = function(){
    document.getElementById('skillSlot1List').innerHTML = "";
    for(i = 0; i < self.PhysicalAttackList.length; i++){
      var skill = self.PhysicalAttackList[i];            
      var onclick = "PhysicalAttackSkill.list['" + skill + "'].event()";
      document.getElementById('skillSlot1List').innerHTML += "<div class='skill-column2' id ="+skill+" style = 'width:100%; height:10%; font-size:1vw' onclick = \"" + onclick + "\">"+skill+"</div>";
    }
  }
  self.showPhysicalAttacks()
    if(self.id === "wizard"){
      self.bulvarType2 ="frostball"
      self.magicAttackList = [{name:"Triple Freeze", parent:"frostball" },{name:"Ring of Fire", parent:"fireball"}];
    } else if(self.id === "barbarian"){
      self.bulvarType2 ="Rage"
      self.magicAttackList = [{name:"Scream", parent:"Rage"},{name:"Reckless Attack", parent:"Giant Sword"}];     
    }
  self.showMagicAttacks = function(){
    document.getElementById('skillSlot2List').innerHTML = "";
    for(i = 0; i < self.magicAttackList.length; i++){
      var skill = self.magicAttackList[i].parent; 
      var name = self.magicAttackList[i].name;
      var onclick = "MagicAttackSkill.list['" + skill + "'].event()";
      document.getElementById('skillSlot2List').innerHTML += "<div class='skill-column2' id ="+skill+" style = 'width:100%; height:10%; font-size:1vw' onclick = \"" + onclick + "\">"+name+"</div>";
    }
  }
        
  self.showMagicAttacks();

  self.updateSkillMenu = function(){
    if(self.isSkillChanged){
    	self.showPhysicalAttacks()  
      self.showMagicAttacks();
    	self.isSkillChanged = false;  
    }
  }
 

  self.updateLvl = function(){
    if(self.xp >= self.xpMax){
      self.xp = 0; 
      self.isLeveling = true;
    	self.xpMax = self.xpMax*4;
      self.lvl += 1 ;
      self.skillPoints += 2;
      if(self.lvl === 2  && self.id === "wizard"){
        self.isSkillChanged = true;
        self.PhysicalAttackList.push("bloodball")
      }
    }
  } 

  self.updateStats = function(){
    self.hpMax = self.constitution*100;
  	self.manaMax = Math.floor((self.intellect*100)/3)
    self.hpRegen = Math.ceil(self.constitution/5);
    self.manaRegen = Math.ceil(self.wisdom/5);
    self.atkSpd = 1.4 + self.atkSpdMod//Math.floor(self.dexterity/5) + self.atkSpdMod;
    self.speed = Math.floor(self.dexterity - Math.floor((self.constitution/10)))-1;

    if(frameCount % 25 === 0) { //every 1 sec
      if(player.hp < player.hpMax)
        player.hp += player.hpRegen;
      if(player.mana < player.manaMax)
        player.mana += player.manaRegen;
    }    
    if(self.hp > self.hpMax){
      self.hp = self.hpMax
    } else if (self.hp < 0){
      self.hp = 0
    }
    if(self.mana > self.manaMax){
      self.mana = self.manaMax
    }else if (self.mana < 0){
      self.mana = 0
    }
  }
 // var super_draw = self.draw; 
  self.draw = function(){
    //super_draw(); 
    if(!self.isAttacking){
   
    self.hatImg = Img[self.id+"Hat"+self.hat] 
    self.cloakImg = Img[self.id+self.armor]

    } else {
      self.hatImg = Img[self.id+"Hat"+self.hat +"Attack"]
      self.cloakImg = Img[self.id+self.armor +"Attack"]
    }
   
    ctx.save();  
    var x = self.x - player.x; 
    var y = self.y - player.y; 

    x += WIDTH/2;
    y += HEIGHT/2; 

    x -= self.width/2;
    y -= self.height/2;

    var frameWidth = self.img.width/3; 
    self.frameHeight = self.img.height/4;

    var aimAngle = self.aimAngle;
    if(aimAngle < 0){
      aimAngle = 360 + aimAngle;
    }

    self.directionMod = 3; //draw right
    if(aimAngle >= 45 && aimAngle < 135){// down
    	self.directionMod = 2;                   
    } else if (aimAngle >= 135 && aimAngle < 225){//left
      self.directionMod = 1;
    } else if (aimAngle >= 225 && aimAngle < 315){//up
      self.directionMod = 0;
    }
    if(!self.isAttacking){
    var walkingMod = Math.floor(self.spriteAnimCounter) % 3; 
    } else {
    var walkingMod = Math.floor(self.attackAnimeCounter/25) ; 
    }

    ctx.fillStyle ="#323c39" //"#363543"
    ctx.fillRect(WIDTH*30/100 , HEIGHT*82/100,TILE_SIZE + WIDTH*1/100, TILE_SIZE*1.2 + HEIGHT*1/100)
    ctx.strokeStyle = "azure";
    ctx.strokeRect(WIDTH*30/100 , HEIGHT*82/100,TILE_SIZE + WIDTH*1/100, TILE_SIZE*1.2 + HEIGHT*1/100)
    ctx.drawImage(self.hatImg, walkingMod * frameWidth, 2 * self.frameHeight, frameWidth, self.frameHeight/2, WIDTH*30.5/100 , HEIGHT*82/100, TILE_SIZE, TILE_SIZE*1.2)
    playerLook.drawImage(self.cloakImg, walkingMod * frameWidth, 2 * self.frameHeight, frameWidth, self.frameHeight, TILE_SIZE/1.1, TILE_SIZE/10 , player.img.width/0.9 , player.img.height/1.7)
    playerLook.drawImage(self.hatImg, walkingMod * frameWidth, 2 * self.frameHeight, frameWidth, self.frameHeight, TILE_SIZE/1.1, TILE_SIZE/10 , player.img.width/0.9 , player.img.height/1.7)

    ctx.drawImage(self.cloakImg, walkingMod * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height)
    ctx.drawImage(self.hatImg, walkingMod * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height)
        
   //drawing character UP there.......................................................................................................................................................................

    var x = self.x -  player.x + WIDTH/2;
    var y = self.y -  player.y + HEIGHT/2 - self.height/2 - 20;
    ctx.save();
    healthBar.save();
    ctx.fillStyle = "green"
    var width = 100*self.hp/self.hpMax;
    var manaWidth = 100* self.mana/self.manaMax;
    var xp = 100* self.xp/self.xpMax
    if(width < 0){
      width = 0;
    }
  	ctx.fillRect(x-50, y, width, 10);
  	ctx.strokeStyle = "black";
  	ctx.strokeRect(x-50, y, 100, 10)
    ctx.restore();
		healthBar.fillStyle ="red";
    healthBar.fillRect(0, 0, width, 20)
    healthBar.fillStyle = "blue";
    healthBar.fillRect(0, 20, manaWidth, 20)
    healthBar.strokeStyle = "black";
    healthBar.strokeRect(0,0,100,20);
    healthBar.strokeRect(0,20,100,20); 
    
    healthBar.restore();

    ctx.save()
    ctx.fillStyle = "#f6c2e6"//"#ffc96b";
    ctx.fillRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE ,  xp* 3, TILE_SIZE/4)
    ctx.strokeRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE, 100*3 , TILE_SIZE/4)
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE/2 - TILE_SIZE/4 , width * 3, TILE_SIZE/4)
    ctx.strokeRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE/2 - TILE_SIZE/4, 100*3 , TILE_SIZE/4)
    ctx.fillStyle = "#2640db"//"#3e63ed";
    ctx.fillRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE/2, manaWidth * 3, TILE_SIZE/4)
    ctx.strokeRect(TILE_SIZE * 2, HEIGHT-TILE_SIZE/2, 100*3, TILE_SIZE/4)
    ctx.fillStyle = "black";
    ctx.fillText(self.xp + " / " + self.xpMax, TILE_SIZE * 2 + TILE_SIZE*1.3, HEIGHT-TILE_SIZE + TILE_SIZE/5 )
    ctx.fillText(self.hp + " / " + self.hpMax, TILE_SIZE * 2 + TILE_SIZE*1.3, HEIGHT-TILE_SIZE/2 - TILE_SIZE/4 + TILE_SIZE/5 )
    ctx.fillText(self.mana + " / " + self.manaMax, TILE_SIZE * 2 + TILE_SIZE*1.3, HEIGHT-TILE_SIZE/2 + TILE_SIZE/5 )
           
    ctx.fillStyle ="azure";
    ctx.fillText("XP", TILE_SIZE * 1.4, HEIGHT-TILE_SIZE + TILE_SIZE/5 )
    ctx.fillText("HP", TILE_SIZE * 1.4, HEIGHT-TILE_SIZE/2 - TILE_SIZE/4 + TILE_SIZE/5 )
    ctx.fillText("MANA", TILE_SIZE * 1.4, HEIGHT-TILE_SIZE/2 + TILE_SIZE/5 )
    ctx.restore();


  }
  self.updatePosition = function(){ 
    var oldX = self.x;
    var oldY = self.y;   

    self.bumperRight = {x:self.x + self.width/2, y:self.y};
    self.bumperLeft = {x:self.x - self.width/2, y:self.y};
  	self.bumperUp = {x:self.x, y:self.y - self.height/2};
    self.bumperDown = {x:self.x, y:self.y + self.height/2};
                
    if(self.pressingRight )
      self.x += self.speed;                   
    if(self.pressingLeft)
      self.x -= self.speed;  
    if(self.pressingDown)
      self.y += self.speed;  
    if(self.pressingUp)
      self.y -= self.speed;    
    if(currentMap.isPositionWall(self)|| currentMap.isTorch(self)){
      self.x = oldX;
      self.y = oldY;
    }
    if(currentMap.isPositionWall(self.bumperRight)|| currentMap.isTorch(self))
      self.x  -= 4; 
    if(currentMap.isPositionWall(self.bumperLeft)|| currentMap.isTorch(self))
      self.x  += 4; 
    if(currentMap.isPositionWall(self.bumperDown)|| currentMap.isTorch(self))
    	self.y  -= 4; 
    if(currentMap.isPositionWall(self.bumperUp)|| currentMap.isTorch(self))
      self.y += 4; 

    for(var key in doorList){
      if(doorList[key].type === "secretDoor" && !doorList[key].isOpened){
        if(self.testCollision(doorList[key])){
          self.x = oldX;
          self.y = oldY;
        }
      }
    }
               
    //ispositionvalid
    if(self.x < self.width/2)
      self.x = self.width/2;
    if(self.x > currentMap.width-self.width/2)
      self.x = currentMap.width - self.width/2;
    if(self.y < self.height/2)
      self.y = self.height/2;
    if(self.y > currentMap.height - self.height/2)
      self.y = currentMap.height - self.height/2;     
	}
  var realUpdatePosition = self.updatePosition;
  var super_update = self.update;
  self.update = function(){

    if(self.isLeveling){
      self.lvlUpCounter ++;
      self.spriteAnimCounter +=0.2;
      var lvlImage = new Image();
      lvlImage.src = "img/" + self.id + "LvlUp.png";
      self.img = lvlImage;
      if(self.lvlUpCounter > 25){
        self.isLeveling = false;
        self.lvlUpCounter = 0;
        Img.walkImg = new Image();
        Img.walkImg.src = `./img/`+ self.id+`.png`;
        self.img = Img.walkImg;
      }
    }
    super_update(); 
    updateSkillBoxes();
    self.updateSkillMenu();
    self.updateLvl();  
    self.updateStats();   

   

    if(self.isAttacking ){
      self.attackAnimeCounter += 5; 
     // if(self.id === "wizard")
     // self.img = Img.wizardAttack;
      if(self.attackAnimeCounter > 74){ 
        self.attackAnimeCounter = 0;
        self.attackCounter = 0; 
        self.isAttacking = false;
     //   Img.walk = new Image();
     //   Img.walk.src = `./img/`+ self.id+`.png`;
     //   self.img = Img.walk;
      }
    }
    if(self.isRaging){
      self.updatePosition = function(){}
      Img.attackImg = new Image();
      Img.attackImg.src = `./img/`+ self.id+`Scream.png`      
      self.img = Img.attackImg;
      self.rageAnimeCounter+=4;
      if(self.rageAnimeCounter > 74){
        for(var key in enemyList ){
          if(enemyList[key].testCollision({x:self.x, y:self.y, width:self.width*8, height:self.height*8}))
            enemyList[key].isScared = true;
        }
        self.updatePosition = realUpdatePosition;
        self.rageAnimeCounter = 0;
        self.attackCounter = 0;
    		self.isRaging = false;
        Img.attackImg = new Image();
        Img.attackImg.src = `./img/`+ self.id+`.png`;
        self.img = Img.attackImg;
      }
    }
        
    
        
    
        
    if(self.pressingDown||self.pressingLeft||self.pressingRight||self.pressingUp){
      self.spriteAnimCounter += 0.2;
    }
    if(self.hp <= 0){
      var timeSurvived = Date.now() - timeWhenGameStarted;           
      console.log("You lost! You survived for " + timeSurvived + " ms.");       
      showDeathMenu(); 
      generateCorpse(self);
      self.dead = true;
    } 
  }  
  self.pressingDown = false;
  self.pressingUp = false;
  self.pressingLeft = false;
  self.pressingRight = false;

  return self;      
}
 
Entity = function(type,id,x,y,width,height,img){
  var self = {
  	type:type,
  	id:id,
  	x:x,
  	y:y,             
  	width:width,
		height:height,
  	img:img,
  };
  self.update = function(){
    self.updatePosition();
    self.draw(); 
  }

  self.draw = function(){
    ctx.save();
    var x = self.x - player.x; 
    var y = self.y - player.y; 

    x += WIDTH/2;
    y += HEIGHT/2; 

    x -= self.width/2;
    y -= self.height/2;
                
    ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height, x, y, self.width, self.height)
    ctx.restore();
  }
        
  self.getDistance = function(entity2){   //return distance (number)
    var vx = self.x - entity2.x;
    var vy = self.y - entity2.y;
    return Math.sqrt(vx*vx+vy*vy);
  }
 
  self.testCollision = function(entity2){ //return if colliding (true/false)
    var rect1 = {
    	x:self.x-self.width/2,
  		y:self.y-self.height/2,
    	width:self.width,
    	height:self.height,
    }
    var rect2 = {
      x:entity2.x-entity2.width/2,
      y:entity2.y-entity2.height/2,
      width:entity2.width,
      height:entity2.height,
    }
    return testCollisionRectRect(rect1,rect2);          
  }
  self.updatePosition = function(){} 
	return self;
}
 
Actor = function(type,id,x,y,width,height,img,hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulvarType){
  var self = Entity(type,id,x,y,width,height,img);
        
  self.hp = hp;
  self.hpMax = hp; 
	self.mana = mana;
  self.manaMax = mana;
	self.constitution = constitution;
  self.strength = strength;
  self.dexterity = dexterity;
  self.intellect = intellect;
  self.wisdom = wisdom;
	self.AC = AC 
      
  self.physDamageResist = self.constitution + self.AC;
  self.magicDamageResist = Math.floor((self.AC + self.wisdom)/2);
  self.atkSpd = Math.ceil(self.dexterity/10);
  self.speed = (Math.floor(self.dexterity) - Math.floor((self.constitution/10)))-1;
  self.startSpeed = self.speed;
  self.attackCounter = 0;
  self.aimAngle = 0; 
  self.bulvarType = bulvarType;
  self.speedStart = self.speed;
  self.spriteAnimCounter = 0;
  self.bulvarSize = 50;
  self.attackAnimeCounter = 0;
  self.rageAnimeCounter = 0;
  self.isDamaged = false;
  self.damageAnimeCounter = 50;  
  self.isCasting = false;

  self.isPolymorfed = false;
   
  var super_update = self.update;
  self.update = function(){
    super_update();
    if(self.hp > self.hpMax){
      self.hp = self.hpMax
    }
    self.attackCounter += self.atkSpd;  
    self.magicDamage = self.intellect*10;
    for(var key in trapList){
      if(trapList[key].trapframeCount >100 && trapList[key].testCollision({x:self.x, y:(self.y+(self.height/2)), width:self.width, height:1})){
        self.hp -=(10 - Math.floor(self.physDamageResist/10));
        self.isDamaged = true;
        if(player.hp <= 0){
          player.deathCause = "You died stupid and totally not a heroic death in the middle of the dungeon. Be careful with traps next time"
        }
			}       
		}

  	if(currentMap.isStairs(self)){
      self.speed = Math.floor(self.speedStart/1.3);
    } else {
      self.speed = self.speedStart
    }

    if(self.isDamaged ){
      if(self.type === "player"){
      	self.isPolymorfed = false;
      	self.width = 90;
      	self.height = 90
    		Img.damageImg = new Image();
      	Img.damageImg.src = `./img/`+ self.id+`Damaged.png`  
      	self.img = Img.damageImg;                  
      } else if(self.name !=="npc") {
      	self.isPolymorfed = false;
      	self.width = 90;
        self.height = 90
        Img.damageImg = new Image()
        Img.damageImg.src = `./img/`+ self.name +`Damaged.png`  
        self.img = Img.damageImg; 
        self.attackCounter = 0;
      }    
                        
      self.damageAnimeCounter+=5;
      if(self.damageAnimeCounter > 74){
        self.damageAnimeCounter = 50;
        self.isDamaged = false;
                                
        if(self.type === "player"){
          Img.walkImg = new Image();
          Img.walkImg.src = `./img/`+ self.id+`.png`;
          self.img = Img.walkImg;
        } else {
          Img.walkImg = new Image();
          Img.walkImg.src = `./img/`+ self.name +`.png` 
          self.img = Img.walkImg;      
        }           
      }
    } 
  } 
  self.draw = function(){
    ctx.save();  
    var x = self.x - player.x; 
    var y = self.y - player.y; 

    x += WIDTH/2;
    y += HEIGHT/2; 

    x -= self.width/2;
    y -= self.height/2;

    var frameWidth = self.img.width/3; 
    self.frameHeight = self.img.height/4;

    var aimAngle = self.aimAngle;
    if(aimAngle < 0){
      aimAngle = 360 + aimAngle;
    }

    self.directionMod = 3; //draw right
    if(aimAngle >= 45 && aimAngle < 135){// down
    	self.directionMod = 2;                   
    } else if (aimAngle >= 135 && aimAngle < 225){//left
      self.directionMod = 1;
    } else if (aimAngle >= 225 && aimAngle < 315){//up
      self.directionMod = 0;
    }
    var walkingMod = Math.floor(self.spriteAnimCounter) % 3; 

/*
    
    } else if (self === player && player.isRaging){
      var walk = Math.floor(self.rageAnimeCounter/25)
      ctx.drawImage(self.img, walk * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height) 
    } else if(self === player && !player.isDamaged){
      ctx.drawImage(self.img, walkingMod * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height)
        

*/  if(self.isDamaged && self !== player){
    	var walk = Math.floor(self.damageAnimeCounter/25)
      ctx.drawImage(self.img, walk * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height) 
    } else if (self !== player) {                     
      ctx.drawImage(self.img, walkingMod * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height)
        
    }

    ctx.restore();
  }

  self.onDeath = function(){};
       
	self.performAttack = function(){
    if(self.type === "player" && player.attackCounter > 25){
      player.isAttacking = true;
      if(player.bulvarType === "Rage"){
        for(var key in enemyList ){
          if(enemyList[key].testCollision({x:player.x, y:player.y, width:player.width*8, height:player.height*8}))
            enemyList[key].isScared = true;
        } 
      } else if (player.bulvarType === "polymorf"){
        if( player.mana >= 100){
          player.mana -= 100;
          var x =  player.x + player.targetX;
          var y =  player.y + player.targetY;
          for(var key in enemyList){
            if(enemyList[key].testCollision({x:x, y:y, width:TILE_SIZE*4, height:TILE_SIZE*4})){
            	enemyList[key].isPolymorfed = true;
              break
            }
          }
        }
      } else {                 
        generateBullet(self, self.aimAngle, self.bulvarType);
      }
      self.attackCounter = 0; 
    } else {
      if(self.attackClass === "spell"){
        if(self.attackCounter > 25){    //every 1 sec
          Img.attackImg = new Image();
          Img.attackImg.src = `./img/`+self.name+`Attack.png`      
        	self.img = Img.attackImg;
          self.speed = 0;
          if(self.attackCounter === 28)
            generateBullet(self, self.aimAngle, self.bulvarType);
          if(self.attackCounter === 44)
            generateBullet(self, self.aimAngle, self.bulvarType);
        } 

        if (self.attackCounter > 50){
          self.attackCounter = 0; 
          Img.walking = new Image();
        	Img.walking.src = `./img/`+self.name+`.png`      
          self.img = Img.walking;
        	self.speed = self.startSpeed;
        } 
      } else if (self.attackClass === "melee" && self.attacking === true && !self.isPolymorfed && !self.isScared){
        self.attackCounter ++;
        Img.attackImg = new Image();
      	Img.attackImg.src = `./img/`+self.name+`Attack.png`      
        self.img = Img.attackImg;
        self.speed = 0;  
      	if(self.testCollision(player)){
      		player.isDamaged = true;
        	player.hp -= Math.ceil(self.strength- Math.floor(player.physDamageResist/self.strength))
        	if(player.hp <= 0){
      			if(self.name === "Goblin_Vampire"){
          		player.deathCause = "You died by trying to hug a Vampire. They are sexy, but try running from them next time!"
          	} else {
            	player.deathCause = "You died by being stabbed in the ass. That's a shitty death damn!"
          	}
		    	} 
        	if(self.name === "Goblin_Vampire" && self.hp < self.hpMax){
          	self.hp += ((self.strength-Math.floor(player.physDamageResist/self.strength))/**2*/)
        	}
      	}	
      	if(self.attackCounter>25){
        	self.attacking = false;
        	Img.walking = new Image();
        	Img.walking.src = `./img/`+self.name+`.png`      
        	self.img = Img.walking;
        	self.speed = self.startSpeed;
      	}
    	} else if (self.attackClass === "areaEffect"){
    		var distanceX = self.x-player.x;
      	var distanceY = self.y - player.y;
      	if(self.attackCounter > 25 && distanceX < TILE_SIZE*6 && distanceX > -(TILE_SIZE*6)&& distanceY < TILE_SIZE*6 && distanceY > -(TILE_SIZE*6)){    //every 1 sec
        	Img.attackImg = new Image();
        	Img.attackImg.src = `./img/`+self.name+`Attack.png`      
        	self.img = Img.attackImg;
        	self.speed = 0;
        	if(self.attackCounter === 44)
          	generateEffect(self.bulvarType, player.x, player.y);                       
        	if(self.attackCounter === 46)
        		generateEffect(self.bulvarType, player.x+6, player.y-6);
        	if(self.attackCounter === 48)
          	generateEffect(self.bulvarType, player.x-4, player.y-6);
      	} 

      	if (self.attackCounter > 49){
    			self.attackCounter = 0; 
        	Img.walking = new Image();
        	Img.walking.src = `./img/`+self.name+`.png`      
        	self.img = Img.walking;
        	self.speed = self.startSpeed;
      	} 
    	} else if (self.attackClass === "targetSpell") {
          if(self.bulvarType === "raiseDead" && self.attackCounter > 50 && !self.isCasting ){
            
            for(var key in corpseList){
              if(corpseList[key].testCollision({x:self.x - TILE_SIZE*2, y:self.y - TILE_SIZE*2, width:TILE_SIZE*4, height:TILE_SIZE*4})){
                corpseList[key].isRessurecting = true;
                break
              }
                self.isCasting = true; 
            }  
          }

          if(self.isCasting){
            Img.attackImg = new Image();
            Img.attackImg.src = `./img/`+self.name+`Attack.png`      
            self.img = Img.attackImg;
            self.speed = 0; 
          }
          if(self.attackCounter > 75){
            self.attackCounter = 0; 
            self.isCasting = false;
            Img.walking = new Image();
            Img.walking.src = `./img/`+self.name+`.png`      
            self.img = Img.walking;
            self.speed = self.startSpeed;
          }
      }        
  	}
  }
       
  self.performSpecialAttack = function(){
    if(player.bulvarType2 === "frostball"){
      if(self.attackCounter > 50 && self.mana >= 20){    //every 1 sec
        self.attackCounter = 0;
        player.isAttacking = true;
        self.mana -= 20;
        generateBullet(self,self.aimAngle - 5, self.bulvarType2);
        generateBullet(self,self.aimAngle, self.bulvarType2);
        generateBullet(self,self.aimAngle + 5, self.bulvarType2);
      }
    } else if (player.bulvarType2 ==="fireball"){
      if(self.attackCounter > 50 && self.mana >= 180){    //every 1 sec
      	self.attackCounter = 0;
      	player.isAttacking = true;
        self.mana -= 180;
        var angle = 0;
        while (angle < 360){
          generateBullet(self, angle, self.bulvarType2);
          angle +=10;  
      	}
      }       
    } else if(player.bulvarType2 === "Rage"){
      player.isRaging = true;     
    } else if(player.bulvarType2 === "Giant Sword"){
      if(self.attackCounter > 50 && self.mana >= 20){
        self.mana -= 20;
        player.isAttacking = true;
        generateBullet(self,self.aimAngle, self.bulvarType2);
      }
    }
  }       
  return self;
}
 
testCollisionRectRect = function(rect1,rect2){
  return rect1.x <= rect2.x+rect2.width
  && rect2.x <= rect1.x+rect1.width
  && rect1.y <= rect2.y + rect2.height
  && rect2.y <= rect1.y + rect1.height;
}
