Bullet = function (id, bulletType, x, y, spdX, spdY, width, height, combatType, img, damage){
    var self = Entity('bullet', id, x, y, width, height, img);
    
    self.timer = 0;
    var super_update = self.update;
    self.combatType = combatType;
    self.spdX = spdX; 
    self.spdY = spdY;  
    self.bulletType = bulletType;
    self.damage = damage;

    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
                           
        if(self.x < 0 || self.x > currentMap.width){
            self.spdX = -self.spdX;
        }
        if(self.y < 0 || self.y > currentMap.height){
            self.spdY = -self.spdY;
        }
    } 
    self.update = function(){
        super_update();
        
        var toRemove = false;
        self.timer++;
        if(self.timer > 75){
            toRemove = true;
        }
        if(self.combatType === "player"){
            for(var key2 in enemyList){      
                var isColliding = self.testCollision(enemyList[key2]);
                if(isColliding){
                    toRemove = true; 
                    if(self.bulletType === "arrow"){
                        enemyList[key2].hp -= (self.damage - enemyList[key2].physDamageResist)
                    } else if (self.bulletType === "frostball"||self.bulletType === "fireball"){
                        enemyList[key2].hp -=(self.damage - enemyList[key2].magicDamageResist)           
                    }    
                }      
            }
        }else if (self.bulletType === "frostball"||self.bulletType === "fireball"||self.bulletType === "bloodball" ) {
            var isColliding = self.testCollision(player);
            if(isColliding){
                player.hp -= (self.damage - player.magicDamageResist);
                toRemove = true;     
            }  
        }
        if(currentMap.isPositionWall(self)||currentMap.isTorch(self)){
            toRemove = true;
        }
        if(toRemove){
            delete bulletList[self.id];   
        }
    }
    bulletList[id] = self;
}

generateBullet = function(actor, aimOverwrite, bulletType){
    
    var x = actor.x;
    var y = actor.y;
    var height = actor.bulletSize;
    var width = actor.bulletSize; 
    var bulletType = bulletType;
    var damage = actor.magicDamage + Math.floor(Math.random()*10);
    if(bulletType === "arrow"){
        damage = actor.dexterity*5 + actor.strength + Math.floor(Math.random()*10)
    }
    var id = Math.random();
   
    var angle;
    if(aimOverwrite !== undefined){
        angle = aimOverwrite;
    } else {
        angle = actor.aimAngle;
    }
   
    var spdX = Math.cos(angle/180*Math.PI)*12;
    var spdY = Math.sin(angle/180*Math.PI)*12;  

    
    if(actor.aimAngle < 0){
        actor.aimAngle = 360 + actor.aimAngle;
    } 
 
    if ( actor.aimAngle >= 45 && actor.aimAngle < 135){
        width = 14;
        Img.a1 = new Image();
        Img.a1.src = `img/`+ bulletType +`Down.png`;
        img = Img.a1;
    } else if (actor.aimAngle >= 135 && actor.aimAngle < 225){
        height = 14;
        Img.a2 = new Image();
        Img.a2.src = `img/`+ bulletType +`Left.png`;
        img = Img.a2;
    } else if (actor.aimAngle >= 225 && actor.aimAngle < 315){
        width = 14;
        Img.a3 = new Image();
        Img.a3.src = `img/`+ bulletType +`Up.png`;
        img = Img.a3;
    } else {
        height = 14;
        Img.a4 = new Image();
        Img.a4.src = `img/`+ bulletType +`Right.png`;
        img = Img.a4
    } 
    

    if(bulletType === "bloodball"){
    width = 40;
    height = 40;
    //spdX = Math.cos(angle/180*Math.PI)*15;
    //spdY = Math.sin(angle/180*Math.PI)*15; 
    //damage = 10;
    }

    Bullet(id, bulletType, x, y, spdX, spdY, width, height, actor.type, img, damage)
} 

