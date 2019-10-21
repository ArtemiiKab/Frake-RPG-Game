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
        for(var i = 0; i < self.items.length; i++){
            let item = Item.list[self.items[i].id];
            let onclick = "Item.list['" + item.id + "'].event()";
            str += "<div class = 'potionList' id = '"+item.name+"'><div class = 'potion-info-block'><img src = './img/"+item.id+".png' class = 'img-potions'><div class = 'info-potions'>Amount : "+ self.items[i].amount +"x</div><button class = 'btn-use-potion' onclick = \"" + onclick + "\" >Use</button></div></div>";
        }
        
        document.getElementById("potions").innerHTML = str;
        
    }

    return self;
}


Item = function(id, name, event){
    var self = {
        id:id,
        name:name,
        event:event,
    }
    Item.list[self.id] = self;
    return self;
}

Item.list = {};

Item ("potion", "Potion", function(){
    
    player.hp = player.hpMax;
    playerInventory.removeItem("potion", 1)
    playerInventory.refreshRender();
    
    
})

Item ("potionSpeed", "PotionSpeed", function(){
    player.speed = 12;
    playerInventory.removeItem("potionSpeed", 1)
    playerInventory.refreshRender();
})