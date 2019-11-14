MagicAttackSkill = function(id, describtion){
    var self = {
        id:id,
        describtion:describtion
    }
    self.event = function(){
        player.bulletType2 = self.id; 
        document.getElementById('skillsDescribtion').innerHTML = self.describtion;
    }
    MagicAttackSkill.list[self.id] = self;
    return self;
}

MagicAttackSkill.list = {};
MagicAttackSkill ("frostball","Throws 3 frostball missiles into the enemy, doing magical damage when they hit.");
MagicAttackSkill ("fireball","Creates a ring of fire missiles around player doing magic damage when they hit. Ps: they always do." ); 
MagicAttackSkill ("Rage", "You shout and yell as loud and angry as you can. All enemies in 6-7 tiles from you stop attacking you and run away for 1.2 sec" ); 
MagicAttackSkill ("Giant Sword","You throw a giant sword at a straight line wich pierces and carries every enemy it goes through"); 




PhysicalAttackSkill = function(id, describtion){
    var self = {
        id:id,
        describtion:describtion
    }
    self.event = function(){
        player.bulletType = self.id;
        document.getElementById('skillsDescribtion').innerHTML = self.describtion;
    }
    PhysicalAttackSkill.list[self.id] = self;
    return self;
}

PhysicalAttackSkill.list = {};
PhysicalAttackSkill("arrow", "Regular steel arrows, doing piercing damage depends on your dexterity more then strength.");
PhysicalAttackSkill("frostball", "Throws a single frost missile towards the enemy doing magical damage. Depends on your intellect and wisdom.");
PhysicalAttackSkill("fireball", "Throws a single fire missile towards the enemy doing magical damage. Depends on your intellect and wisdom.");
PhysicalAttackSkill("SwordStrike", "Releases a swipe blow of energy, the impact highly depends on your strength");
PhysicalAttackSkill("bloodball","Throws a single missile of blood energy doing magical damage. On hit, you restore 10% hp of dealt damage.");
PhysicalAttackSkill("polymorf","Turns enemy into chiken if you land a click within 4 tiles from you. Costs 100 mana to cast.");





PassiveSkill = function(id){
    var self = {
        id:id,
    }
    self.event = function(){
        player.passiveSkill = self.id;  

    }
    passiveSkill.list[self.id] = self;
    return self;
}

PassiveSkill.list = {};
