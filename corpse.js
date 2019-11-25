Corpse = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.isRessurecting = false; 
    self.isExpired = false;
    self.corpseFrameCount = 0;
    var superUpdate = self.update;
    self.update = function(){
        superUpdate();
       
        if(self.isRessurecting && !self.isExpired){ 
            self.corpseFrameCount += 4; 
            Img.rise = new Image();
            Img.rise.src = "./img/riseDead.png" 
            self.img = Img.rise;
           
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        var frameWidth = self.img.width/6; 
                        var walk = Math.floor(self.corpseFrameCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-TILE_SIZE/2, y - TILE_SIZE/2, self.width+2, self.height+2)
                ctx.restore();
            }
            self.draw()
            if(self.corpseFrameCount >= 126){
                self.isRessurecting = false;
                self.isExpired = true;
                targetGenerateEnemy(self.x, self.y)
               
            }
        }
    }



 corpseList[id] = self;
}

generateCorpse = function(dead){
    var x = dead.x;
    var y = dead.y; 

    var height = dead.height;
    var width = dead.width; 
    var id = Math.random(); 
    var img = Img.body; 
    Corpse("corpse",id,x,y, width, height, img)
}