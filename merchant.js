merchantInventory = function(){
    var self = Inventory();
    self.refreshRender = function(){
        var str = "";
        for(var i = 0; i < self.items.length; i++){
            var item = Item.list[self.items[i].id];
            var buy = "Item.list['" + item.id + "'].buy()";
            str += "<div class = 'potionListMerchant' id = '"+item.name+"'><div class = 'potion-merchant-info-block'><img src = './img/"+item.id+".png' class = 'img-merchant-potions'><div class = 'info-merchant-potions' style = 'color:azure;'>Amount : "+ self.items[i].amount +"x</div><button class = 'btn-buy-potion' onclick = \""+buy+"\" >Buy</button></div></div>";
        }
        document.getElementById("merchantPotions").innerHTML = str;
    }

    return self;
}


Merchant = function(type, id, x, y, width, height, img){
    var self = Entity(type, id, x, y, width, height, img);
    self.frameCount = 0; 
    self.startImg = self.img;
    self.inventory = merchantInventory();
    self.fillStore = function(){
        self.inventory.addItem("potion", Math.ceil(Math.random()*10))
        self.inventory.addItem("potionSpeed", Math.ceil(Math.random()*5))  
    }
    self.draw = function(){
        ctx.save(); 
            var  x = self.x - player.x; 
            var  y = self.y - player.y; 
    
            x += WIDTH/2;
            y += HEIGHT/2; 
            var frameWidth = self.img.width/6; 
            var walk = Math.floor(self.frameCount/25)
    
            ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x-(TILE_SIZE), y-(TILE_SIZE)+2, self.width+2, self.height+2)
            ctx.restore(); 
                   
    } 
    self.fillStore();
  
    
    self.update = function(){
        
        self.frameCount += 5;
        if(self.frameCount >= 150){
            self.frameCount = 0;
        } 
       
        if(self.testCollision(player)){
          
          //  self.img = imgPotionMerchantTalk
            if(player.isTalking){
                document.getElementById("shopPotions").style.display = "block";  
            }
        } else {
            document.getElementById("shopPotions").style.display = "none";
            player.isTalking = false
            self.img = self.startImg;
        }
        self.draw();

      
    }

    merchantList[id] = self;
} 


generatePotionMerchant = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE
    var y = rowY*TILE_SIZE+TILE_SIZE
    var height = TILE_SIZE*1.8    //between 10 and 40
    var width = TILE_SIZE*1.8
    var id = "potionMerchant"
    var img = new Image();
    var name = "PotionMerchant"
    img.src = "./img/"+name+".png";
    Merchant(name, id, x, y, width, height, img)

} 

generateBlacksmithMerchant = function(colX, rowY){
    var x = colX*TILE_SIZE+TILE_SIZE
    var y = rowY*TILE_SIZE+TILE_SIZE
    var height = TILE_SIZE*1.6    //between 10 and 40
    var width = TILE_SIZE*1.6
    var id = "blacksmithMerchant"
    var img = new Image();
    var name = "BlacksmithMerchant"
    img.src = "./img/"+name+".png";
    Merchant(name, id, x, y, width, height, img)

} 

