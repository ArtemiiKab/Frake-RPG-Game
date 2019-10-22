var quest1 = { 
    name:"Greetings in the Dungeon!",
    isStarted:false,
    isEnemyWave1Released :false,
    isFinished : false,
    
    event1 : {
        isFinished:false,
        text:["Hi traveller, welcome to my totally safe and not vampire invaded mansion!", "You can use w, a, s, d, to move", "I really glad you came. Our dinner starts really soon!",""],
    },
    event2 : {
        isFinished:false,
        text:["Oh no, i's Goblins! They are totaly attacking me and not you!",""],
    },

    event3 : {
        isFinished:false,
        text:["Damn you are good! It makes me angry!"," Okay, lets go forward then, open that door please", "I could open it myself, ofcourse, cause I'm not a vampire", "See you on the other side, bye!",""],
    },

    isEvent1Finished (){
        if(quest1.event1.text.length === pageNumber+1 && !quest1.event1.isFinished && player.currentEvent === quest1.event1 ){
            quest1.event1.isFinished = true;
            pageNumber = 0;
            return true;
        }
    },


    update(){
        if(quest1.isEvent1Finished() && player.currentEvent === quest1.event1){
            randomlyGenerateEnemy();
            randomlyGenerateEnemy();
            randomlyGenerateEnemy();
            randomlyGenerateEnemy();
            randomlyGenerateEnemy();
            //targetGenerateEnemy(player.x - TILE_SIZE*3, player.y);
            //targetGenerateEnemy(player.x + TILE_SIZE*3, player.y);
            
            player.currentEvent = quest1.event2;
            quest1.event1.isFinished = false;
            
        }

        if(player.killCount === 5 && player.currentEvent === quest1.event2){
            
            pageNumber = 0;
            player.currentEvent = quest1.event3;
        }

        if(player.currentEvent === quest1.event3 && pageNumber+1 === quest1.event3.text.length){
            
            npcList = {}; 
            quest1.isFinished = true;
        }else {
            quest1.isFinished = false;
        }

       
    
    }
 
} 




/*

eventList = {};

Event = function(id, number, type, enemiesNumb, text){
    var self = {
        id : id,
        number : number,
        type : type,
        enemiesNumb : enemiesNumb,
        text : text,
    }

    self.isStarted = false;
    self.isFinished = false;

    if (self.type === "killAll"){
        player.killCount = 0; 
        var enemieCount = self.enemiesNumb;
        if(self.isStarted){
            for (i = 0; i < enemieCount; i++){
                randomlyGenerateEnemy();
            }
        } 

        self.update = function (){
            if(self.number === player.currentEvent){
                self.isStarted = true;
            }
            if(self.isStarted && player.killCount === self.enemiesNumb){
                self.isFinished = true;
            }
            if(self.isFinished){
                player.currentEvent = self.number + 1;
                delete self;
            }
        }
    } 

    if (self.type === "text"){
        pageNumber = 0;
        self.update = function(){
            if(self.number === player.currentEvent){
                self.isStarted = true;
            }; 

            if(self.isStarted && pageNumber === self.text.length){
                self.isFinished = true;
            }

            if(self.isFinished){
                player.currentEvent = self.number + 1;
                delete self;
            }

        }
    }
    

    eventList[id] = self;
}

generateEvent = function(id, number, type, enemiesNumb, text){
    Event(id, number, type, enemiesNumb, text)
}
*/










questList = {}; 

Quest = function(id, quest, numbEvents){ 
    var self = quest;
    self.id = id;
    self.numbEvents = numbEvents;
    var superUpdate = self.update;
    self.update = function(){ 
        superUpdate();
       
      
        if(self.isFinished){
            delete questList[self.id];
            delete self;
        }
    } 

    questList[id] = self;

} 

generateQuest = function(quest, numbEvents){
    var id = Math.random();
    Quest(id, quest, numbEvents);
}







