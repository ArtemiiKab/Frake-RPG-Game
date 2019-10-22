Trap = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.trapframeCount = 0;
    
        self.draw = function(){
            ctx.save();
              var  x = self.x - player.x; 
              var  y = self.y - player.y; 

                x += WIDTH/2;
                y += HEIGHT/2; 
                var frameWidth = self.img.width/6; 
              

                ctx.drawImage(self.img, 0, 0, frameWidth, frameWidth, x-(TILE_SIZE/2), y-(TILE_SIZE/2)+2, self.width+2, self.height+2)
        ctx.restore();
        }
    
    self.update = function(){

        if(self.trapframeCount < 126 && self.isTriggered){
            self.trapframeCount+=4;
            }  else if(self.trapframeCount >= 126){
                self.trapframeCount = 125
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
                        var walk = Math.floor(self.trapframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-(TILE_SIZE/2), y-(TILE_SIZE/2)+2, self.width+2, self.height+2)
                ctx.restore();
            }
        }

        for(var key in enemyList){
            if(self.testCollision({x:enemyList[key].x, y:(enemyList[key].y+(enemyList[key].height/2)), width:enemyList[key].width, height:1})){
                self.isTriggered = true;
                self.draw = function(){
                    ctx.save();
                     
                           var x = self.x - player.x; 
                           var y = self.y - player.y; 
            
                            x += WIDTH/2;
                            y += HEIGHT/2; 
                            var frameWidth = self.img.width/6; 
                            var walk = Math.floor(self.trapframeCount/25)
            
                            ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-(TILE_SIZE/2), y-(TILE_SIZE/2)+2, self.width+2, self.height+2)
                    ctx.restore();
                }
            }
        }
        
        
        self.draw();
    }
        trapList[id] = self; 
        console.log(trapList.length)
}
   
   generateTrap = function(colX, rowY){
        var x = colX*TILE_SIZE+TILE_SIZE/2
        var y = rowY*TILE_SIZE+TILE_SIZE/2
        var height = TILE_SIZE -2;
        var width = TILE_SIZE -2; 
        var id = Math.random()
        Img.trap = new Image();
        Img.trap.src = "./img/trap.png" 
        img = Img.trap;
       Trap("trap",id,x,y, width, height, img)
   }