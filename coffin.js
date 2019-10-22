Coffin = function(type, id, x, y, width, height, img){
    var self = Entity(type, id, x, y, width, height, img); 
    self.coffinframeCount = 0;
    self.isAwaken = false;
    
    self.draw = function(){
        ctx.save();
        var  x = self.x - player.x; 
        var  y = self.y - player.y; 

        x += WIDTH/2;
        y += HEIGHT/2; 
        var frameWidth = self.img.width/6; 
              
        ctx.drawImage(self.img, 0, 0, frameWidth, frameWidth, x - (TILE_SIZE), y - (TILE_SIZE) + 2, self.width + 2, self.height + 2)
        ctx.restore();
        }
    

    self.update = function(){

        if(self.coffinframeCount < 126 && self.isTriggered){
            self.coffinframeCount += 4;
        } else if(self.coffinframeCount >= 126){
            self.coffinframeCount = 125
            if(!self.isAwaken){
                targetGenerateEnemy(self.x+TILE_SIZE/2, self.y-TILE_SIZE/2);
                self.isAwaken = true;
            }
        }
            
        if(self.testCollision({x:player.x, y:(player.y + (player.height/2)), width:player.width, height:1}) && !self.isTriggered){
            self.isTriggered = true;
            self.draw = function(){
                ctx.save(); 
                var  x = self.x - player.x; 
                var  y = self.y - player.y; 
        
                x += WIDTH/2;
                y += HEIGHT/2; 
                var frameWidth = self.img.width/6; 
                var walk = Math.floor(self.coffinframeCount/25)
        
                ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x - (TILE_SIZE), y - (TILE_SIZE) + 2, self.width + 2, self.height + 2)
                ctx.restore();
            }
        }
        self.draw();
    }
        coffinList[id] = self;    
}

generateCoffin = function(colX, rowY){
    var x = colX*TILE_SIZE + TILE_SIZE
    var y = rowY*TILE_SIZE + TILE_SIZE
    var height = ((TILE_SIZE*2) - 2);
    var width = ((TILE_SIZE*2) - 2); 
    var id = Math.random()
    Img.coffin = new Image();
    Img.coffin.src = "./img/Vampire-Coffin.png" 
    img = Img.coffin;
   Coffin("coffin", id, x, y, width, height, img)
}