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
                    if(self.bulletType !== "Giant Sword"){
                    toRemove = true; 
                    }
                    if(self.bulletType === "arrow" || self.bulletType === "SwordStrike"|| self.bulletType === "Giant Sword"){
                        enemyList[key2].hp -= (self.damage - enemyList[key2].physDamageResist)
                        enemyList[key2].isDamaged = true;
                        if(self.bulletType === "Giant Sword"){
                            enemyList[key2].x = self.x - self.width/4;
                            enemyList[key2].y = self.y - self.height/4; 
                        }
                    } else if (self.bulletType === "frostball"||self.bulletType === "fireball"|| self.bulletType === "bloodball"){
                        var damage =(self.damage - enemyList[key2].magicDamageResist);
                        enemyList[key2].hp -= damage;
                        enemyList[key2].isDamaged = true;      
                        if(self.bulletType === "bloodball") {
                            player.hp += damage/10
                        }  
                    }   
                }      
            }
        }else if (self.bulletType === "frostball"||self.bulletType === "fireball"||self.bulletType === "bloodball" ) {
            var isColliding = self.testCollision(player);
            if(isColliding){
                player.hp -= (self.damage - player.magicDamageResist);
                player.isDamaged = true;
                toRemove = true; 
                if(player.hp <= 0){
                    player.deathCause = "You died by running directly into a " + self.bulletType + ". Try opening your eyes while playing."
                } 
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
    var bulletThickness = 14
    var damage = actor.magicDamage + Math.floor(Math.random()*10);
    if(bulletType === "arrow"){
        damage = actor.dexterity*5 + actor.strength + Math.floor(Math.random()*10)
    }else if(bulletType === "SwordStrike"){
        damage = actor.strength*10 + actor.dexterity + Math.floor(Math.random()*10)
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

    
    if(bulletType === "Giant Sword"){
        width = 80;
        height = 80;
        bulletThickness = 30
    }
 
    if ( actor.aimAngle >= 45 && actor.aimAngle < 135){
        width = bulletThickness;
        Img.a1 = new Image();
        Img.a1.src = `img/`+ bulletType +`Down.png`;
        img = Img.a1;
    } else if (actor.aimAngle >= 135 && actor.aimAngle < 225){
        height = bulletThickness;
        Img.a2 = new Image();
        Img.a2.src = `img/`+ bulletType +`Left.png`;
        img = Img.a2;
    } else if (actor.aimAngle >= 225 && actor.aimAngle < 315){
        width = bulletThickness;
        Img.a3 = new Image();
        Img.a3.src = `img/`+ bulletType +`Up.png`;
        img = Img.a3;
    } else {
        height = bulletThickness;
        Img.a4 = new Image();
        Img.a4.src = `img/`+ bulletType +`Right.png`;
        img = Img.a4
    } 
    

    if(bulletType === "bloodball"){
    width = 40;
    height = 40;
    }

    if(bulletType === "SwordStrike"){
    width = 40;
    height = 40;
    }


    Bullet(id, bulletType, x, y, spdX, spdY, width, height, actor.type, img, damage)
} 

