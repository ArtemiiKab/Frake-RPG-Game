var ctx = document.getElementById("ctx").getContext("2d");
var canvas = document.getElementById("ctx");
var healthBar = document.getElementById("playerHp").getContext("2d")
var heightRatio = 0.05;
healthBar.height = healthBar.width * heightRatio;
var mapList = {};
var HEIGHT = 768 //530;
var WIDTH = 1705//960;
var CANVAS_WIDTH = 1705;
var CANVAS_HEIGHT = 768
var TILE_SIZE = 96;
var timeWhenGameStarted = Date.now();   //return time in ms
var frameCount = 0;
var paused = false;
var score = 0;

let resizeCanvas = function(){
        CANVAS_WIDTH = window.innerWidth -4;
        CANVAS_HEIGHT = window.innerHeight -4 ;
       /* let ratio = 1705/768
        if(CANVAS_HEIGHT < CANVAS_WIDTH / ratio){
                CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
        } else {
                CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
        } */
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        ctx.font = '2vw MiniSet2';
        canvas.style.width = "" + CANVAS_WIDTH + "px";
        canvas.style.height = "" + CANVAS_HEIGHT + "px";
}
resizeCanvas();
window.addEventListener('resize', function(){
        resizeCanvas();
});
 


var Img = {};
Img.player = new Image();
Img.player.src = "img/hero.png";
Img.goblin = new Image();
Img.goblin.src = "img/Goblin_Wizard.png";
Img.goblinLightningWizard = new Image();
Img.goblinLightningWizard.src = "img/Goblin_LightningWizard.png";
Img.goblin_warrior = new Image();
Img.goblin_warrior.src = "img/Goblin_Warrior.png";
Img.goblin_vampire = new Image();
Img.goblin_vampire.src = "img/Goblin_Vampire.png";
Img.upgrade = new Image();
Img.upgrade.src = "img/mushroom.png";
Img.map = new Image(); 
Img.map.src = "img/dungeon1.png";
Img.body = new Image(); 
Img.body.src = "img/body.png";

ctx.drawImage(Img.player, 50, 50)
 
document.onclick = function(){
      player.performAttack();       
 }

document.oncontextmenu = function(mouse){
        player.performSpecialAttack();
        mouse.preventDefault();
}
 
document.onmousemove = function(mouse){
        var mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
        var mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
        mouseX -= CANVAS_WIDTH/2;
        mouseY -= CANVAS_HEIGHT/2; 
        player.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}


document.onkeydown = function(event){
        if(event.keyCode === 68)        //d
                player.pressingRight = true;
        else if(event.keyCode === 83)   //s
                player.pressingDown = true;
        else if(event.keyCode === 65) //a
                player.pressingLeft = true;
        else if(event.keyCode === 87) // w
                player.pressingUp = true;
        else if(event.keyCode === 81 && playerInventory.hasItem("potion",1) )//q
                Item.list["potion"].event();
}
 
document.onkeyup = function(event){
        if(event.keyCode === 68){      //d
                player.pressingRight = false;
        }
        else if(event.keyCode === 83) { //s
                player.pressingDown = false;    
        }
        else if(event.keyCode === 65) //a
                player.pressingLeft = false;
        else if(event.keyCode === 87) // w
                player.pressingUp = false; 
        else if(event.keyCode === 80) //p ;
                paused = !paused;  
}
 
update = function(){ 
        if(paused){
                ctx.fillText("Paused", WIDTH/2, HEIGHT/2)
                return;
        }

        
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        healthBar.clearRect(0,0,WIDTH,HEIGHT)
        currentMap.draw();
        frameCount++;
        score++; 
        updateTextMenu();
        updateShowQuests();
        quest1.update();
       
        if(frameCount % 25 === 0) { //every 1 sec
                if(player.hp < player.hpMax)
                player.hp += player.hpRegen;
                if(player.mana < player.manaMax)
                player.mana += player.manaRegen;
        }    
                 
        
        for(var key in corpseList){
                corpseList[key].update(); 
        }

       
        for (var key in trapList){
                trapList[key].update();
                    
        }

        for (var key in coffinList){
                coffinList[key].update();
                    
        }

        for (var key in doorList){
                doorList[key].update();
                    
        }

        for(var key in upgradeList){
                upgradeList[key].update(); 
        }
        for(var key in bulletList){
                bulletList[key].update();   
        }

       
        
        for(var key in questList){
                questList[key].update();     
        }

        for(var key in torchList){
                torchList[key].update();     
        }
        
        for(var key in npcList){
                npcList[key].update();
                if(npcList[key].hp <= 0){
                generateCorpse(npcList[key])
                     delete npcList[key]
                }
        }
       
        for(var key in enemyList){
                enemyList[key].update();
                if(enemyList[key].hp <= 0){
                generateCorpse(enemyList[key])
                     delete enemyList[key];
                     player.killCount ++;
                }
        }
        if(quest1.isFinished || currentMap.id === "dungeon2"){
        if(frameCount % 100 === 0)      //every 4 sec
        randomlyGenerateEnemy();
        if(frameCount % 75 === 0)       //every 3 sec
        randomlyGenerateUpgrade(); 
        }

        player.update(); 

        for(var key in effectList){
                effectList[key].update();     
        }  

        healthBar.fillText(player.hp +'/'+ player.hpMax, 26, 17);
        healthBar.fillText(player.mana +'/'+ player.manaMax, 30, 37);
        document.getElementById("constitutionDiv").innerHTML = player.constitution;
        document.getElementById("strengthDiv").innerHTML =  player.strength;
        document.getElementById("dexterityDiv").innerHTML =  player.dexterity;
        document.getElementById("intellectDiv").innerHTML =  player.intellect;
        document.getElementById("wisdomDiv").innerHTML =  player.wisdom;
        document.getElementById("skillPoints").innerHTML = "SKILL POINTS: " + player.skillPoints;
       
        ctx.fillText(player.hp + " Hp",0,30);
        ctx.fillText('Score: ' + score,200,30);
}
 

Maps = function(id, imgSrc, grid){
        var self = {
                id:id,
                image:new Image(),
                width:grid[0].length * TILE_SIZE,
                height:grid.length * TILE_SIZE,
                grid:grid,
        }
        self.image.src = imgSrc;
        self.isPositionWall = function(pt){
                var gridX = Math.floor(pt.x/ TILE_SIZE);
                var gridY = Math.floor(pt.y/ TILE_SIZE);
                if (gridX <0 || gridX >= self.grid[0].length){
                        return true;
                } 
                if (gridY <0 || gridY >= self.grid.length){
                        return true;
                }
                if (self.grid[gridY][gridX] === 1 || self.grid[gridY][gridX] === 6){
                        return true;
                }else if (self.grid[gridY][gridX] === 0){
                        return false;
                }else {
                        return false
                }
        }

       self.draw = function(){
                var x = WIDTH/2 - player.x;
                var y = HEIGHT/2 - player.y;
                ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height,x,y,self.image.width*2,self.image.height*2)
        }  

        self.generateTraps = function(){
                for(var i = 0; i < self.grid.length; i++){
                        for(var i2 = 0; i2 < self.grid[0].length; i2++){
                                if(self.grid[i][i2]=== 2){
                                        generateTrap(i2,i)
                                }
                        }
                }
       } 

       self.generateCoffins = function(){
        for(var i = 0; i < self.grid.length; i++){
                for(var i2 = 0; i2 < self.grid[0].length; i2++){
                        if(self.grid[i][i2]=== 4){
                                generateCoffin(i2,i)
                        }
                }
        }
} 

        self.generateDoors = function(){
        for(var i = 0; i < self.grid.length; i++){
                for(var i2 = 0; i2 < self.grid[0].length; i2++){
                        if(self.grid[i][i2]=== 5){
                                generateDoor(i2,i)
                        }
                }
        }
} 

        self.generateTorches = function(){
        for(var i = 0; i < self.grid.length; i++){
                for(var i2 = 0; i2 < self.grid[0].length; i2++){
                        if(self.grid[i][i2]=== 6){
                                generateTorch(i2,i)
                        }
                }
        }
} 

       self.isStairs = function(pt){
        var gridX = Math.floor(pt.x/ TILE_SIZE);
        var gridY = Math.floor(pt.y/ TILE_SIZE);
                if(self.grid[gridY][gridX] === 3)
                return true
       }

       self.isTorch = function(pt){
        var gridX = Math.floor(pt.x/ TILE_SIZE);
        var gridY = Math.floor(pt.y/ TILE_SIZE);
                if(self.grid[gridY][gridX] === 6)
                return true
       }

       self.isEntrance = function(pt){
        var gridX = Math.floor(pt.x/ TILE_SIZE);
        var gridY = Math.floor(pt.y/ TILE_SIZE);
                if(self.grid[gridY][gridX] === 5)
                return true
       }
        
        mapList[id] = self;
        return self;
}

currentMap = Maps("dungeon1", "img/dungeon1.png",
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,6,5,6,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,0,2,0,0,2,0,1],
[1,1,0,1,1,1,0,0,0,6,1,1,6,0,0,0,0,0,0,1],
[1,1,0,1,1,1,0,0,0,0,3,3,0,0,0,0,4,0,0,1],
[1,1,0,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1],
[1,1,0,1,6,1,0,0,0,1,1,1,1,0,2,0,0,2,0,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]);

Maps("dungeon2", "img/map4.png",
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,6,1,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,1,1,0,1,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,1,1,0,1,0,6,1,1,6,0,0,1,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,6,0,0,0,0,0,1,1,0,0,1],
[1,1,1,0,1,1,0,6,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
[1,1,6,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]);


 
player = Player(); 
playerInventory = Inventory();
startNewGame = function(){
      
        currentMap = mapList["dungeon1"];
        player.hp = player.hpMax;
        player.mana = player.manaMax;
        player.x= (TILE_SIZE*2 - TILE_SIZE/2)
        player.y = (TILE_SIZE*3 - TILE_SIZE/2)
        player.atkSpd = 1;
        player.currentQuest = "none";
        player.currentEvent = "none";
        player.killCount = 0;
        timeWhenGameStarted = Date.now();
        frameCount = 0;
        score = 0;
        enemyList = {};
        npcList = {};
        upgradeList = {};
        bulletList = {}; 
        corpseList = {};
        trapList = {};
        coffinList = {}; 
        doorList = {}; 
        questList = {};
        torchList = {};
        effectList = {};
        generateNpc(TILE_SIZE*8 - TILE_SIZE/2, TILE_SIZE*3 - TILE_SIZE/2, "npc1", quest1);
        currentMap.generateTraps();
        currentMap.generateCoffins();
        currentMap.generateDoors();
        currentMap.generateTorches();
        playerInventory.addItem("potion",1);
        playerInventory.addItem("potionSpeed",1);
        textMenu.innerHTML = '';
        pageNumber = 0;
        quest1.isStarted = false;
       // randomlyGenerateEnemy();
       // randomlyGenerateEnemy();
       // randomlyGenerateEnemy();
}
startNewGame();

setInterval(update,40); 

