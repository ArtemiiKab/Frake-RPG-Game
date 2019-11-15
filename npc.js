Npc = function(name, quest, type, id, x,y,width,height, img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType){
    var self = Actor('npc', id,x,y,width,height,img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType);
    self.toRemove = false; 
    self.name = name; 
    self.quest = quest; 
    self.type = type
    self.directionCounter = 0;

    self.chooseDirection = function(){
        if(self.directionCounter >= 50){
            self.directionCounter = 0 
        }
        if(self.directionCounter === 0){
            self.aimAngle = Math.floor(Math.random()*360)
        }
    }

    self.updateAim = function(){
        var diffX = player.x - self.x; 
        var diffY = player.y - self.y; 
        if(self.type !=="walker"){
            self.aimAngle = Math.atan2(diffY, diffX)/ Math.PI *180;
        }else {
            self.chooseDirection()
        }   
    }

    
    
    var super_draw = self.draw; 
    self.draw = function(){
            super_draw(); 
            var x = self.x - player.x + WIDTH/2;
            var y = self.y - player.y + HEIGHT/2 - self.height/2 - 20;
        ctx.save();
        ctx.fillStyle = "blue"
        var width = 100*self.hp/self.hpMax;
        
        if(width < 0){
                width = 0;
        } 
        ctx.fillRect(x-50, y, width, 10);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x-50, y, 100, 10)
        ctx.restore();
    }
    self.updatePosition = function(){
       // if(self.mission === "questGiver"){
        self.bumperRight = {x:self.x + self.width/2, y:self.y};
        self.bumperLeft = {x:self.x - self.width/2, y:self.y};
        self.bumperUp = {x:self.x, y:self.y - self.height/2};
        self.bumperDown = {x:self.x, y:self.y + self.height/2};

            var diffX = player.x - self.x; 
            var diffY = player.y - self.y; 

            if(self.testCollision({x:player.x, y:player.y, width:player.width*2, height:player.height*2})){
                self.speed = 0; 
                
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
                    ctx.drawImage(self.img, 1 * frameWidth, self.directionMod * self.frameHeight, frameWidth, self.frameHeight, x, y, self.width, self.height)
                    ctx.restore();
               
                }
            }else{
                self.draw = super_draw;
                self.speed = self.speedStart;
                
            }
           
            if(self.type !== "walker"){
                if(diffX > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperRight)){
                    self.x += self.speed;
                }else if(diffX < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperLeft)){
                    self.x -= self.speed;
                }
                if(diffY > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperDown)){
                    self.y += self.speed;
                }else if(diffY < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperUp)){
                    self.y -= self.speed;
                }  
            } else {
                
               /* if(currentMap.isPositionWall(self.bumperUp)||currentMap.isPositionWall(self.bumperLeft)||currentMap.isPositionWall(self.bumperDown)||currentMap.isPositionWall(self.bumperRight)){
                    self.directionCounter = 0; 
                    self.chooseDirection();
                } */
                if(self.directionMod === 0 && !currentMap.isPositionWall(self.bumperUp) ){
                    self.y -= self.speed;
                } else if (self.directionMod === 1 &&  !currentMap.isPositionWall(self.bumperLeft)){
                    self.x -= self.speed;
                } else if (self.directionMod === 2 && !currentMap.isPositionWall(self.bumperDown)){
                    self.y += self.speed
                } else if (self.directionMod === 3 && !currentMap.isPositionWall(self.bumperRight)){
                    self.x += self.speed
                }
            } 


    } 

   

    self.giveQuest = function(){ 
        if(self.testCollision({x:player.x, y:player.y, width:player.width*2, height:player.height*2})&& !self.quest.isStarted){
            generateQuest(quest1, 3);
            self.quest.isStarted = true; 
            player.currentQuest = self.quest; 
            player.currentEvent = self.quest.event1;
            player.currentQuest.isStarted = true;
        }
    } 

    self.addToCounter = function(){
        self.directionCounter +=  Math.ceil(Math.random()*2) //to stop them turning in the same time
    }
    var super_update = self.update;
    self.update = function(){
        super_update();
        self.spriteAnimCounter += 0.2;
        self.addToCounter();
        self.updateAim();
        if(self.type === "questGiver" && !self.quest.isStarted ){
            self.giveQuest();
        }
        
    }

    npcList[id] = self;
} 


generateNpc = function(x, y, name, quest, type){
    var height = 100     //between 10 and 40
    var width = 100
    var id = Math.random();
    var img = new Image();
    img.src = "./img/"+name+".png";
    Npc(name, quest, type, id, x, y, width, height, img, 200, 200, 10, 3, 3, 5, 7, 2, "fireball" )

}