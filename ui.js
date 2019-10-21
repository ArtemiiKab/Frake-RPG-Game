openMenu = function(){ 
    document.getElementById('menu').style.display ="block"; 

} 

closeMenu = function(){
    document.getElementById('menu').style.display ="none"; 
} 

showPotions = function(){
    document.getElementById('potions').style.display = "block";
    document.getElementById('playerInfo').style.display = "none";
    document.getElementById('skillsRightMenu').style.display = "none";
    document.getElementById('quests').style.display = "none";
} 

showHero = function(){
    document.getElementById('potions').style.display = "none";
    document.getElementById('playerInfo').style.display = "block";
    document.getElementById('skillsRightMenu').style.display = "none";
    document.getElementById('quests').style.display = "none";
} 

showSkills = function(){
    document.getElementById('potions').style.display = "none";
    document.getElementById('playerInfo').style.display = "none";
    document.getElementById('skillsRightMenu').style.display = "block";
    document.getElementById('quests').style.display = "none";
}

addConstitution = function(){
    player.constitution += 1; 
    player.skillPoints -=1; 
    
}

addStrength = function(){
    player.strength +=1;
    player.skillPoints -=1;
}

addDexterity = function(){
    player.dexterity +=1;
    player.skillPoints -=1;
}

addIntellect = function(){
    player.intellect +=1;
    player.skillPoints -=1;
} 

addWisdom = function(){
    player.wisdom +=1;
    player.skillPoints -=1;
}  

showQuests = function(){
    document.getElementById('potions').style.display = "none";
    document.getElementById('playerInfo').style.display = "none";
    document.getElementById('skillsRightMenu').style.display = "none";
    document.getElementById('quests').style.display = "block";
}

updateShowQuests = function(){
    document.getElementById('quests').innerHTML = "";
    for(var key in questList){
        document.getElementById('quests').innerHTML += questList[key].name;
    }
}

updateSkillBoxes = function(){
    document.getElementById('firstSkill').style.backgroundImage = "url('img/"+ player.bulletType +"up.png')"; 
    document.getElementById('firstSkill').style.backgroundSize = "cover";
    document.getElementById('firstSkill').style.backgroundRepeat = "no-repeat";
    document.getElementById('secondSkill').style.backgroundImage = "url('img/"+ player.bulletType2 +"up.png')"; 
    document.getElementById('secondSkill').style.backgroundSize = "cover";
    document.getElementById('secondSkill').style.backgroundRepeat = "no-repeat"; 
    document.getElementById('fourthSkill').style.backgroundImage = "url('img/potion.png')"; 
    document.getElementById('fourthSkill').style.backgroundSize = "cover";
    document.getElementById('fourthSkill').style.backgroundRepeat = "no-repeat"; 
  
    var healPotion = playerInventory.items.filter(it => it.id === "potion");
    document.getElementById('fourthSkill').innerHTML = "X : "+ healPotion.map(it => it.amount).join()+"";
    if(healPotion.length === 0){
        document.getElementById('fourthSkill').innerHTML = "X : 0"
    }
}

$(document).on('click','.skill-column2', function(){$(this).addClass("borderChoosen").siblings().removeClass("borderChoosen")});

let textMenu = document.getElementById('UpCenterTextMenu');
var pageNumber = 0
updateTextMenu = function(){
    if (player.currentQuest.isStarted){
        textMenu.innerHTML = player.currentEvent.text[pageNumber];
    
         if (pageNumber < player.currentEvent.text.length-1){
        document.getElementById('btn-flip-page').style.display = "block";
        } else {
        document.getElementById('btn-flip-page').style.display = "none";
        }
    } else {
        document.getElementById('btn-flip-page').style.display = "none";
        }   
} 
flipPage = function(){
    if(pageNumber < player.currentEvent.text.length-1){
        pageNumber++;
    }
}