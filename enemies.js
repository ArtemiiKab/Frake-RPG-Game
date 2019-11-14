Enemy = function(name, attackClass, id,x,y,width,height, img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType){
    var self = Actor('enemy',id,x,y,width,height,img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType);
        
    self.toRemove = false;
    self.isScared = false;
    self.exp = self.hp + self.AC + self.constitution + self.strength + self.dexterity + self.intellect + self.wisdom
    self.scaredCounter = 0;
    self.name = name; 
    self.attackClass = attackClass;
    self.updateAim = function(){
        var diffX = player.x - self.x; 
        var diffY = player.y - self.y; 
        self.aimAngle = Math.atan2(diffY, diffX)/ Math.PI *180;
        if(self.isScared){
                self.aimAngle = - Math.atan2(diffX, diffY)/ Math.PI *180;  
                self.attackCounter = 0; 
              
        }
    }

    var super_draw = self.draw; 
    self.draw = function(){
            super_draw(); 
            var x = self.x - player.x + WIDTH/2;
            var y = self.y - player.y + HEIGHT/2 - self.height/2 - 20;
        ctx.save();
        ctx.fillStyle = "red"
        var width = 100*self.hp/self.hpMax;
        
        if(width < 0){
                width = 0;
        } 
        
        ctx.fillRect(x-50, y, width, 10);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x-50, y, 100, 10)
       
        ctx.restore();
    }

    self.updatePosition = function(){
       
        self.bumperRight = {x:self.x + self.width/2, y:self.y};
        self.bumperLeft = {x:self.x - self.width/2, y:self.y };
        self.bumperUp = {x:self.x, y:self.y - self.height/2};
        self.bumperDown = {x:self.x, y:self.y + self.height/2 };

            var diffX = player.x - self.x; 
            var diffY = player.y - self.y; 

            if(diffX > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperRight)){
                    self.x += self.speed;
            }else if(diffX < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperLeft)){
                    self.x -= self.speed;
            }
            if(diffY > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperDown)){
                self.y += self.speed;
            }else if(diffY < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperUp)){
                self.y -= self.speed;
            }   
            
            if(self.isScared){
                if(diffX > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperLeft)){
                        self.x -= self.speed*2;
                }else if(diffX < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperRight)){
                        self.x += self.speed*2;
                }
                if(diffY > self.speed/2+0.1 && !currentMap.isPositionWall(self.bumperUp)){
                    self.y -= self.speed*2;
                }else if(diffY < -(self.speed/2+0.1) && !currentMap.isPositionWall(self.bumperDown)){
                    self.y += self.speed*2;
                }        
            }
            
            
            var isColliding = self.testCollision(player);
                if(isColliding && self.attackClass === "melee"){ 
                        self.attackCounter = 0;
                        self.attacking = true;
                };  
        }
    self.onDeath = function(){
            self.toRemove = true;
    }
    var super_update = self.update;
    self.update = function(){
        super_update();
        if(self.isScared){//barbarianRageSkill
                self.scaredCounter ++;
                if(self.scaredCounter >= 30){
                        self.isScared = false;
                        self.scaredCounter = 0;
                }
        }
        if(self.isPolymorfed){
                self.width = 40;
                self.height = 40
                Img.polymorfed = new Image();
                Img.polymorfed.src = `./img/chicken.png`      
                self.img = Img.polymorfed;
                self.speed = 0.5;
                self.attackCounter = 0;

        }
        self.spriteAnimCounter += 0.2;
        self.updateAim();
        self.performAttack(); 
        if(self.toRemove = true){ 
        }
    }
    if(currentMap.isPositionWall(self)|| currentMap.isTorch(self)){
            randomlyGenerateEnemy()
        }else{ 
        if(self.name !== "Goblin_Vampire"){
        enemyList[id] = self;
        }else{
        return self
        }
   }

}
 
randomlyGenerateEnemy = function(){
        //Math.random() returns a number between 0 and 1
        
        var x = Math.random()*currentMap.width;
        var y = Math.random()*currentMap.height;
        
        var height = 90     //between 10 and 40
        var width = 90
        var id = Math.random();
        
        if(Math.random()<= 0.3){
                Enemy("Goblin_Wizard","areaEffect",id,x,y,width,height, Img.goblin, 100, 100, 4, 1, 2, 5, 8, 2, "lightningblue");
        }else if(Math.random()> 0.3 && Math.random()< 0.6) {
                Enemy("Goblin_Warrior","melee", id,x,y,width,height, Img.goblin_warrior, 300, 0, 6, 3, 10, 8, 1, 0, "knife");
        } else {
                Enemy("Goblin_LightningWizard","spell",id,x,y,width,height, Img.goblinLightningWizard, 100, 100, 4, 1, 2, 5, 8, 2, "frostball");    
        } 
} 

targetGenerateEnemy = function(x, y){
        var height = 90     //between 10 and 40
        var width = 90
        var id = Math.random()*100;
        
        if(Math.random()< 0.5){
                Vampire("Goblin_Vampire","melee",id,x,y,width,height, Img.goblin_vampire, 1000, 200, 12, 10, 10, 14, 10, 5, "frostball");
        }else {
                Vampire("Goblin_Vampire","melee", id,x,y,width,height, Img.goblin_vampire, 1000, 200, 12, 10, 10, 14, 10, 5, "frostball");
        }  
}