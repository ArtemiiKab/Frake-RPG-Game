
Torch = function(type, id,x,y,width,height,img){
    var self = Entity(type,id,x,y,width,height,img); 
    self.torchframeCount = Math.floor(Math.random()*75);

    self.draw = function(){
        ctx.save(); 
            var  x = self.x - player.x; 
            var  y = self.y - player.y; 
    
            x += WIDTH/2;
            y += HEIGHT/2; 
            var frameWidth = self.img.width/6; 
            var walk = Math.floor(self.torchframeCount/25)
    
            ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
            ctx.restore();
    }
        
    self.update = function(){
        self.torchframeCount += 5;
        if(self.torchframeCount >= 75){
            self.torchframeCount = 0;
        }
        self.draw();
    }
    torchList[id] = self;       
}



generateTorch = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE
    var y = rowY*TILE_SIZE+TILE_SIZE
    var height = TILE_SIZE -2;
    var width = TILE_SIZE -2; 
    var id = Math.random()
    Img.torch = new Image();
    Img.torch.src = "./img/torch2.png" 
    img = Img.torch;
   Torch("torch",id,x,y, width, height, img)
}