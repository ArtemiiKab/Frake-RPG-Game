Bullet = function (id, bulletType, actor, x, y, spdX, spdY, width, height, combatType, img, damage, damageType){
    var self = Entity('bullet', id, x, y, width, height, img);
    self.actor = actor
    self.timer = 0;
    self.explosionframeCount = 0;
    var super_update = self.update;
    self.combatType = combatType;
    self.spdX = spdX; 
    self.spdY = spdY;  
    self.bulletType = bulletType;
    self.damage = damage; 
    self.damageType = damageType;
    self.toRemove = false;

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

        self.timer++;
        if(self.timer > 75){
            self.toRemove = true;
        }

        if(self.toRemove && self.damageType ==="magic"){
            self.explosionframeCount += 15
            var explosion = new Image();
            explosion.src = "./img/"+ self.bulletType + "Explosion.png";
            self.width = TILE_SIZE/2;
            self.height = TILE_SIZE/2
            self.img = explosion;
            self.spdX = 0;
            self.spdY = 0;
            self.draw = function(){
                ctx.save(); 
                      var  x = self.x - player.x; 
                      var  y = self.y - player.y; 
        
                        x += WIDTH/2;
                        y += HEIGHT/2; 
                        var frameWidth = self.img.width/6; 
                        var frameHeight = self.img.height
                        var walk = Math.floor(self.explosionframeCount/25)
        
                        ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameHeight, x - TILE_SIZE/4 , y - TILE_SIZE/5 , self.width+2, self.height+2)
                ctx.restore();
            }
        } else if (self.toRemove){
            delete bulletList[self.id];
        }
        if(self.combatType === "player" && !self.toRemove){
            for(var key2 in enemyList){      
                if(self.testCollision(enemyList[key2])){
                    if(self.bulletType !== "Giant Sword"){
                    self.toRemove = true; 
                    }
                    if(self.bulletType === "arrow" || self.bulletType === "SwordStrike"|| self.bulletType === "Giant Sword"){
                        enemyList[key2].hp -= (self.damage - enemyList[key2].physDamageResist)
                        enemyList[key2].isDamaged = true;
                        if(self.bulletType === "Giant Sword"){
                            enemyList[key2].x = self.x - self.width/4;
                            enemyList[key2].y = self.y - self.height/4; 
                        }
                    } else if (self.damageType === "magic"){
                        var damage =(self.damage - enemyList[key2].magicDamageResist);
                        enemyList[key2].hp -= damage;
                        enemyList[key2].isDamaged = true;      
                        if(self.bulletType === "bloodball") {
                            self.actor.hp += damage/10
                           
                        }  
                    }   
                }      
            }
        }else if(self.testCollision(player)  && !self.toRemove){
            if(self.damageType === "magic"){
                player.hp -= (self.damage - player.magicDamageResist);
            } else {
                player.hp -= (self.damage - player.physDamageResist)
            }
                player.isDamaged = true;
                self.toRemove = true; 
            if(player.hp <= 0){
                player.deathCause = "You died by running directly into a " + self.bulletType + ". Try opening your eyes while playing."
            } 
        }else if (self.actor.type === "ritualStone" && !self.toRemove){
           
            for (var key3 in enemyList){
                if(self.testCollision(enemyList[key3])){
                  
                    if(self.damageType === "magic"){
                        enemyList[key3].hp -= (self.damage - enemyList[key3].magicDamageResist);
                    } else {
                        enemyList[key3].hp -= (self.damage - enemyList[key3].physDamageResist)
                    }
                    enemyList[key3].isDamaged = true;
                    self.toRemove = true; 
                }
            }
               
        }
        
        if(!self.testCollision (self.actor)){
            if(currentMap.isPositionWall(self)||currentMap.isTorch(self)){
                self.toRemove = true;
            }
        }
        if(self.explosionframeCount > 125){
           
            delete bulletList[self.id];   
        }
    }
    bulletList[id] = self;
}

generateBullet = function(actor, aimOverwrite, bulletType){
    var damageType = "";
    var x = actor.x;
    var y = actor.y; 
   
    var height = actor.bulletSize;
    var width = actor.bulletSize; 
    if(height === undefined && width === undefined){
        height = 40; 
        width = 40;
    }
    var bulletType = bulletType;

    var bulletThickness = 14
    var damage = actor.magicDamage + Math.floor(Math.random()*10);
    if(bulletType === "arrow"){
        damage = actor.dexterity*5 + actor.strength + Math.floor(Math.random()*10)
        damageType = "piercing"
    }else if(bulletType === "SwordStrike"){
        damage = actor.strength*10 + actor.dexterity + Math.floor(Math.random()*10);
        damageType = "slashing"
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
    var chooseDirection = function(aim){
        if ( aim >= 45 &&  aim < 135){
            width = bulletThickness;
            Img.a1 = new Image();
            Img.a1.src = `img/`+ bulletType +`Down.png`;
            img = Img.a1;
        } else if ( aim >= 135 &&  aim < 225){
            height = bulletThickness;
            Img.a2 = new Image();
            Img.a2.src = `img/`+ bulletType +`Left.png`;
            img = Img.a2;
        } else if ( aim >= 225 &&  aim < 315){
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
    }
   
    if(actor.type !== "ritualStone"){
        chooseDirection(actor.aimAngle)
    } else {
        chooseDirection(aimOverwrite)
    }

    if(bulletType === "bloodball"){
    width = 40;
    height = 40;
    damageType = "magic"
    }

    if(bulletType === "SwordStrike"){
    width = 40;
    height = 40;

    }

    if(bulletType === "fireball" || bulletType === "frostball"|| bulletType === "bloodball" ){
        damageType = "magic"
    }


    Bullet(id, bulletType, actor, x, y, spdX, spdY, width, height, actor.type, img, damage, damageType)
} 

