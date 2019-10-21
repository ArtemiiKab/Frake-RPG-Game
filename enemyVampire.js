Vampire = function(name, attackClass, id,x,y,width,height, img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType){
    var self = Enemy(name,attackClass,id,x,y,width,height,img, hp, mana, AC, constitution, strength, dexterity, intellect, wisdom, bulletType);

   // self.width = 100;
   // self.height = 100;
    self.vampBlastCounter = 0;
    self.vampHealCounter = 0;
    self.bulletType2 = "bloodball";



    self.performSpecialAttack = function(){
        var angle = 0;
        while (angle < 360){
             generateBullet(self, angle, self.bulletType2);
             angle +=40;  
        }
    }

    var megaUpdate = self.update;
    self.update = function(){
        megaUpdate();
        self.vampBlastCounter ++;
        if(self.mana < self.manaMax){
            self.mana +=5;
        }
        if(self.vampBlastCounter >50 && self.mana >= 20){ 
            Img.attackImg = new Image();
            Img.attackImg.src = `./img/`+self.name+`Attack.png`      
            self.img = Img.attackImg;
            self.speed = 0;
                if(self.attackCounter > 25){
                    self.mana -= 100;
                    self.attackCounter = 0;
                    self.performSpecialAttack()         
                }
           
            if(self.vampBlastCounter >100){
                self.vampBlastCounter = 0;
                Img.walking = new Image();
                Img.walking.src = `./img/`+self.name+`.png`      
                self.img = Img.walking;
                self.speed = self.startSpeed;
            }
        }

        if(self.hp < self.hpMax){
            self.vampHealCounter ++
            if(self.vampHealCounter > 75){
                Img.attackImg = new Image();
                Img.attackImg.src = `./img/`+self.name+`Attack.png`      
                self.img = Img.attackImg;
                self.speed = 0;
                self.hp += 5;
            }
                if(self.vampHealCounter > 100){
                self.vampHealCounter = 0;
                Img.walking = new Image();
                Img.walking.src = `./img/`+self.name+`.png`      
                self.img = Img.walking;
                self.speed = self.startSpeed;

            }
        }
    }


    enemyList[id] = self;
}

