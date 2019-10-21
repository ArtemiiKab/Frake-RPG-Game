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
                var frameWidth = self.img.width/6; 
              

                ctx.drawImage(self.img, 0, 0, frameWidth, frameWidth, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
        ctx.restore();
        }
    

    self.update = function(){

        if(self.isOpened){
            if(currentMap.isEntrance({x:player.x, y:(player.y+(player.height/2)), width:player.width, height:1})){
                currentMap = mapList["dungeon2"];
                player.x= (TILE_SIZE*2 - TILE_SIZE/2)
                 player.y = (TILE_SIZE*3 - TILE_SIZE/2)
                 timeWhenGameStarted = Date.now();
                 frameCount = 0;
                 score = 0;
                 enemyList = {};
                 upgradeList = {};
                 bulletList = {}; 
                 corpseList = {};
                 trapList = {};
                 coffinList = {};
                 doorList = {};
                 torchList = {};
                 npcList = {};
                 effectList = {};
                 currentMap.generateTraps();
                 currentMap.generateCoffins(); 
                 currentMap.generateTorches();
                 currentMap.generateDoors();
            }
        }

        if(self.doorframeCount < 126 && self.isTriggered){
            self.doorframeCount+=4;
            }  else if(self.doorframeCount >= 126){
                    self.isOpened = true;
                   
            }
            
        if(self.testCollision({x:player.x, y:(player.y+(player.height/2)), width:player.width, height:1})){
            self.isTriggered = true;
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        var frameWidth = self.img.width/6; 
                        var walk = Math.floor(self.doorframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
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