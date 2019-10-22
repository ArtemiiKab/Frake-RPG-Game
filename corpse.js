Corpse = function(type, id,x,y,width,height,img){
 var self = Entity(type,id,x,y,width,height,img); 
 corpseList[id] = self;
}

generateCorpse = function(dead){
    var x = dead.x;
    var y = dead.y; 

    var height = dead.height;
    var width = dead.width; 
    var id = Math.random(); 
    var img = Img.body; 
    Corpse("corpse",id,x,y, width, height, img)
}