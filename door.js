Door = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.doorframeCount = 0;
    self.isOpened = false;
    
        self.draw = function(){
            ctx.save();
              var  x = self.x - player.x; 
              var  y = self.y - player.y; 

                x += WIDTH/2;
                y += HEIGHT/2; 
                if(self.type === "secretDoor") {
                    x += TILE_SIZE/2
                    y += TILE_SIZE/2 + TILE_SIZE*0.2
                }
                var frameWidth = self.img.width/6;  
                var frameHeight = self.img.height
              

                ctx.drawImage(self.img, 0, 0, frameWidth, frameHeight, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
        ctx.restore();
        }
    
    self.update = function(){

        if(self.isOpened && self.type !== "secretDoor"){
            if(currentMap.isEntrance({x:player.x, y:(player.y+(player.height/2)), width:player.width, height:1})){
                if(currentMap.id = "dungeon1"){
                    currentMap = mapList["mainCamp"]
                } else {
                currentMap = mapList["dungeon2"];
                }
                player.x= (TILE_SIZE*2 - TILE_SIZE/2)
                 player.y = (TILE_SIZE*3 - TILE_SIZE/2)
                 timeWhenGameStarted = Date.now();
                 frameCount = 0;
                 score = 0;
                 enemyList = {};
                 upgradeList = {};
                 merchantList = {};
                 bulletList = {}; 
                 corpseList = {};
                 trapList = {};
                 coffinList = {};
                 doorList = {};
                 triggerList = {};
                 torchList = {};
                 npcList = {};
                 effectList = {};
                 currentMap.generateTraps();
                 currentMap.generateCoffins(); 
                 currentMap.generateTorches();
                 currentMap.generateDoors();
                 currentMap.generateMerchants();
                
                 if( currentMap === mapList["mainCamp"]){
                    generateNpc(TILE_SIZE*12 - TILE_SIZE/2, TILE_SIZE*7 - TILE_SIZE/2, "banditRogue", "", "walker");
                    generateNpc(TILE_SIZE*11 - TILE_SIZE/2, TILE_SIZE*7 - TILE_SIZE/2, "banditRogue", "", "walker");
                    generateNpc(TILE_SIZE*10 - TILE_SIZE/2, TILE_SIZE*7 - TILE_SIZE/2, "skeletonRogue", "", "walker");
                    generateNpc(TILE_SIZE*13 - TILE_SIZE/2, TILE_SIZE*7 - TILE_SIZE/2, "skeletonNecromancer", "", "walker");
                 }
            }
        }

        if(self.doorframeCount < 126 && self.isTriggered){
            self.doorframeCount+=4;
            }  else if(self.doorframeCount >= 126){
                    self.isOpened = true;
                   
            }
        
        if(self.type === "secretDoor"){

            if(!self.isOpened){
                for(var key in bulletList){
                    if(self.testCollision(bulletList[key])){
                        bulletList[key].toRemove = true;
                    }
                }
               
            }
            for (var trigger in triggerList){
                if(self.testCollision({x:triggerList[trigger].x, y:(triggerList[trigger].y - TILE_SIZE*4), width:triggerList[trigger].width , height:triggerList[trigger].height + TILE_SIZE*4})){
                    if(triggerList[trigger].isTriggered && ritualStoneList[1].position === "sea" && ritualStoneList[3].position === "sea" && ritualStoneList[5].position === "sea"&& ritualStoneList[7].position === "sea"){
                        self.isTriggered = true;
                        triggerList[trigger].isTriggered = false;  
                    }else if(triggerList[trigger].isTriggered){         
                        for(var key2 in ritualStoneList){     
                            var angle = 0;
                            while (angle < 360){
                                generateBullet(ritualStoneList[key2], angle, "arrow");
                                angle +=40;  
                            }
                        }   
                        triggerList[trigger].isTriggered = false;        
                    }
                    
                }
            }
        } else if(self.testCollision({x:player.x, y:(player.y+(player.height/2)), width:player.width, height:1})){
            self.isTriggered = true;
        }

        if(self.isTriggered){
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        if(self.type === "secretDoor") {
                            x += TILE_SIZE/2
                            y += TILE_SIZE/2 + TILE_SIZE*0.2
                        }
                        var frameWidth = self.img.width/6; 
                        var frameHeight = self.img.height
                        var walk = Math.floor(self.doorframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameHeight, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
                ctx.restore();
            }
            
        }
        self.draw();
    }
        doorList[id] = self; 
        
}



generateDoor = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE
    var y = rowY*TILE_SIZE+TILE_SIZE
    var height = TILE_SIZE -2;
    var width = TILE_SIZE -2; 
    var id = Math.random()
    Img.door = new Image();
    Img.door.src = "./img/door.png" 
    img = Img.door;
   Door("door",id,x,y, width, height, img)
} 

generateSecretDoor = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE/2
    var y = rowY*TILE_SIZE
    var height = TILE_SIZE *1.3
    var width = TILE_SIZE -2; 
    var id = Math.random()
    Img.door = new Image();
    Img.door.src = "./img/secretDoor.png" 
    img = Img.door;
   Door("secretDoor",id,x,y, width, height, img)
} 







Trigger = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.triggerframeCount = 0;
    self.isPushed = false;
    self.isTriggered = false;
    
    self.draw = function(){
        ctx.save();
        var  x = self.x - player.x; 
        var  y = self.y - player.y; 

        x += WIDTH/2;
        y += HEIGHT/2; 
        var frameWidth = self.img.width/3; 
              

        ctx.drawImage(self.img, 0, 0, frameWidth, frameWidth, x-(TILE_SIZE*0.7), y-(TILE_SIZE*1.2)+2, self.width*1.5, self.height*1.5)
        ctx.restore();
    }
    
    self.update = function(){

        if(self.isPushed){
            if(self.triggerframeCount < 74){
                self.triggerframeCount+=1;
            } else {
                self.isTriggered = true; 
                self.isPushed = false; 
                self.triggerframeCount = 0;
            }

        }
            
        if(self.testCollision({x:player.x, y:(player.y+(player.height)), width:player.width, height:1}) ||self.testCollision({x:player.x, y:(player.y+player.height/4), width:player.width, height:1})){
            self.isPushed = true;
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        var frameWidth = self.img.width/3; 
                        var walk = Math.floor(self.triggerframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth,  x-(TILE_SIZE*0.7), y-(TILE_SIZE*1.2)+2, self.width*1.5, self.height*1.5)
                ctx.restore();
            }
            
        }
        self.draw();
    }
        triggerList[id] = self; 
        
}



generateTrigger = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE/2
    var y = rowY*TILE_SIZE+TILE_SIZE
    var height = TILE_SIZE //*1.5
    var width = TILE_SIZE //*1.5 
    var id = Math.random()
    Img.trigger = new Image();
    Img.trigger.src = "./img/trigger.png" 
    img = Img.trigger;
   Trigger("trigger",id,x,y, width, height, img)
} 






RitualStone = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.position = ""; 
    self.magicDamage = 0;
    self.dexterity = 10; 
    self.strength = 20;


    self.updateAim = function(){
        var diffX = player.x - self.x; 
        var diffY = player.y - self.y; 
        self.aimAngle = Math.atan2(diffY, diffX)/ Math.PI *180;
        
    }


        self.number = Math.floor(Math.random()*3)
  
        if(self.number === 0){
            self.triggerframeCount = 0 
            self.position = "tentical"
        } else if(self.number === 1){
            self.triggerframeCount = 75 
            self.position = "eye"
        } else if (self.number === 2){
            self.triggerframeCount = 150
            self.position = "sea"
        }
    
    self.isPushed = false;
    self.isTurned = false;
    
    self.draw = function(){
        ctx.save();
        var  x = self.x - player.x; 
        var  y = self.y - player.y; 

        x += WIDTH/2;
        y += HEIGHT/2; 
        var frameWidth = self.img.width/9; 
        var walk = Math.floor(self.triggerframeCount/25)

        ctx.drawImage(self.img, walk*frameWidth, 0, frameWidth, frameWidth, x - TILE_SIZE/2, y - TILE_SIZE/1.8, self.width+2, self.height+2)
        ctx.restore();
    }
    
    self.update = function(){
        self.updateAim();
        if(self.isPushed){
            if(self.triggerframeCount <= 74){
                self.triggerframeCount+=2.5;
                self.position = "tentical"
                if(self.triggerframeCount === 75){
                    self.isPushed = false; 
                    self.position = "eye";
                   
                }
            } else if (self.triggerframeCount > 74 && self.triggerframeCount <= 149 ){
                self.triggerframeCount+=2.5 
                self.position = "eye"
                if(self.triggerframeCount === 150){
                    self.isPushed = false;  
                    self.position = "sea" ;
                }
            } else if (self.triggerframeCount > 149 && self.triggerframeCount <= 224){
                self.triggerframeCount+=2.5; 
                self.position = "sea"
                if(self.triggerframeCount === 225){
                    self.isPushed = false;  
                    self.position = "tentical"
                    self.triggerframeCount = 0;  
                } 
            }

        }
            
        if(self.testCollision({x:player.x, y:(player.y - player.height/3), width:player.width, height:1})|| self.testCollision({x:player.x, y:(player.y + player.height/3), width:player.width, height:1}) ){
            self.isPushed = true;
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        var frameWidth = self.img.width/9; 
                        var walk = Math.floor(self.triggerframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth,  x - TILE_SIZE/2, y - TILE_SIZE/1.8, self.width+2, self.height+2)
                ctx.restore();
            }

            if(self.isTurned){
                self.draw = function(){
                    ctx.save();
                    var  x = self.x - player.x; 
                    var  y = self.y - player.y; 
            
                    x += WIDTH/2;
                    y += HEIGHT/2; 
                    var frameWidth = self.img.width/9; 
                          
            
                    ctx.drawImage(self.img, 0, 0, frameWidth, frameWidth, x - TILE_SIZE/2, y - TILE_SIZE/1.8, self.width+2, self.height+2)
                    ctx.restore();
                }
            }
            
        }
        self.draw();
    }
        ritualStoneList[id] = self; 
        
}



generateRitualStone = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE/2
    var y = rowY*TILE_SIZE+TILE_SIZE/2
    var height = TILE_SIZE 
    var width = TILE_SIZE 
    var id = ritualStoneList.length + 1;
    Img.trigger = new Image();
    Img.trigger.src = "./img/ritualStone.png" 
    img = Img.trigger;
   RitualStone("ritualStone",id,x,y, width, height, img)
} 