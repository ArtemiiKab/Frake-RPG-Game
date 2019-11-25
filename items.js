Inventory = function (){
    var self = {
        items : [],
    }

    self.addItem = function(id, amount){
        for(var i = 0; i < self.items.length; i++){
            if(self.items[i].id === id){
                self.items[i].amount += amount;
                self.refreshRender();
                return;
            }
        }
        self.items.push({id:id, amount:amount});
        self.refreshRender();
    }

    self.removeItem = function(id, amount){
        for(var i = 0; i < self.items.length; i++){
            if(self.items[i].id === id){
                self.items[i].amount -= amount;
                if(self.items[i].amount <= 0){
                    self.items.splice(i, 1);
                    self.refreshRender();
                }
                return;
            }
        }
    }
    
    self.hasItem = function(id, amount){
        for(var i = 0; i < self.items.length; i++){
            if(self.items[i].id === id){
                return self.items[i].amount >= amount;
            }
        }
        return false;
    }

   
    
    self.refreshRender = function(){
       
        var str = "";
        var str2 = "";
      
        for(var i = 0; i < self.items.length; i++){
            let item = Item.list[self.items[i].id];
            let use = "Item.list['" + item.id + "'].event()";
            let sell = "Item.list['" + item.id + "'].sell()";
            str += "<div class = 'potionList' id = '"+item.name+"'><div class = 'potion-info-block'><img src = './img/"+item.id+".png' class = 'img-potions'><div class = 'info-potions'>Amount : "+ self.items[i].amount +"x</div><button class = 'btn-use-potion' onclick = \"" + use + "\" >Use</button></div></div>";
            str2 += "<div class = 'potionList' id = '"+item.name+"'><div class = 'potion-info-block'><img src = './img/"+item.id+".png' class = 'img-potions'><div class = 'info-potions' style = 'color:azure;'>Amount : "+ self.items[i].amount +"x</div><button class = 'btn-sell-potion' onmousedown = \"" + sell + "\" >Sell</button></div></div>";
        }
        
        document.getElementById("potions").innerHTML = str;
        document.getElementById("playerPotions").innerHTML = str2;
        
       
        
    }

    return self;
}

Item = function(id, name, event, sell, buy){
    var self = {
        id:id,
        name:name,
        event:event,
        sell:sell,
        buy:buy,
    }
    Item.list[self.id] = self;
    return self;
}

Item.list = {};

Item ("potion", "Potion", function(){
    
    player.hp = player.hpMax;
    playerInventory.removeItem("potion", 1)
    playerInventory.refreshRender();
    
    
}, function(){
    player.gold += 10;
    playerInventory.removeItem("potion", 1)
    merchantList["potionMerchant"].inventory.addItem("potion", 1)
    playerInventory.refreshRender();
    merchantList["potionMerchant"].inventory.refreshRender();
   
},  

    function(){
    if(player.gold >= 10){
        player.gold -= 10;
        merchantList["potionMerchant"].inventory.removeItem("potion",1)
        playerInventory.addItem("potion", 1)
        merchantList["potionMerchant"].inventory.refreshRender();
        playerInventory.refreshRender();
        
    }
    
})

Item ("potionSpeed", "PotionSpeed", function(){
    player.speed = 12;
    playerInventory.removeItem("potionSpeed", 1)
    playerInventory.refreshRender();
}, function(){
    playerInventory.removeItem("potionSpeed", 1)
    merchantList["potionMerchant"].inventory.addItem("potionSpeed", 1)
    playerInventory.refreshRender();
    merchantList["potionMerchant"].inventory.refreshRender();

    player.gold += 10;
}, function(){
    if(player.gold >= 10){
        merchantList["potionMerchant"].inventory.removeItem("potionSpeed",1)
        playerInventory.addItem("potionSpeed", 1)
        merchantList["potionMerchant"].inventory.refreshRender();
        playerInventory.refreshRender();
        player.gold -= 10;
    }
})