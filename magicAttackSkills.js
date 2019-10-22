MagicAttackSkill = function(id){
    var self = {
        id:id,
    }
    self.event = function(){
        player.bulletType2 = self.id;  
    }
    MagicAttackSkill.list[self.id] = self;
    return self;
}

MagicAttackSkill.list = {};

MagicAttackSkill ("frostball");
MagicAttackSkill ("fireball"); 



PhysicalAttackSkill = function(id){
    var self = {
        id:id,
    }
    self.event = function(){
        player.bulletType = self.id;
    }
    PhysicalAttackSkill.list[self.id] = self;
    return self;
}

PhysicalAttackSkill.list = {};
PhysicalAttackSkill("arrow");
PhysicalAttackSkill("frostball");
PhysicalAttackSkill("fireball");