var menu = document.getElementById('menu').innerHTML;
var isOnMenu = document.getElementById('menu');
var isOnDialog = document.getElementById('btn-flip-page');
var isNotAttack = false;
isOnMenu.addEventListener("mouseover", function(){
    isNotAttack = true;
}) 
isOnMenu.addEventListener("mouseleave", function(){
    isNotAttack = false;  
})

isOnDialog.addEventListener("mouseover", function(){
    isNotAttack = true;
}) 
isOnDialog.addEventListener("mouseleave", function(){
    isNotAttack = false;  
})





updateUI = function(){
    updateTextMenu();
    updateShowQuests();
    updateHeroStatBoxes();
    document.querySelector(".playerGold").innerHTML = "Your Gold: " + player.gold;

    if(player.health <= 0){
        showDeathMenu();
    }
}



openMenu = function(){ 
   
    document.getElementById('menu').style.display = "block"; 
} 

closeMenu = function(){
   
    document.getElementById('menu').style.display = "none"; 
}  

closeShop = function(){
    document.getElementById("shopPotions").style.display = "none";
    player.isTalking = false
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
    player.skillPoints -= 1;  
}

addStrength = function(){
    player.strength += 1;
    player.skillPoints -= 1;
}

addDexterity = function(){
    player.dexterity += 1;
    player.skillPoints -= 1;
}

addIntellect = function(){
    player.intellect += 1;
    player.skillPoints -= 1;
} 

addWisdom = function(){
    player.wisdom += 1;
    player.skillPoints -= 1;
}  

showQuests = function(){
    document.getElementById('potions').style.display = "none";
    document.getElementById('playerInfo').style.display = "none";
    document.getElementById('skillsRightMenu').style.display = "none";
    document.getElementById('quests').style.display = "block";
}

updateShowQuests = function(){
    document.getElementById('questList').innerHTML = "";
    for(var key in questList){
        document.getElementById('questList').innerHTML += "<div style = 'width: 100%; height:15%; border:2px solid; border-color:azure; color:white;'>" + questList[key].name + "</div>";
    }
}

updateSkillBoxes = function(){
    document.getElementById('firstSkill').style.backgroundImage = "url('img/"+ player.bulletType + "Up.png')"; 
    document.getElementById('firstSkill').style.backgroundSize = "cover";
    document.getElementById('firstSkill').style.backgroundRepeat = "no-repeat";
    document.getElementById('secondSkill').style.backgroundImage = "url('img/"+ player.bulletType2 + "Up.png')"; 
    document.getElementById('secondSkill').style.backgroundSize = "cover";
    document.getElementById('secondSkill').style.backgroundRepeat = "no-repeat"; 
    document.getElementById('fourthSkill').style.backgroundImage = "url('img/potion.png')"; 
    document.getElementById('fourthSkill').style.backgroundSize = "cover";
    document.getElementById('fourthSkill').style.backgroundRepeat = "no-repeat"; 
  
    var healPotion = playerInventory.items.filter(it => it.id === "potion");
    document.getElementById('fourthSkill').innerHTML = "X : "+ healPotion.map(it => it.amount).join()+ "";
    if(healPotion.length === 0){
        document.getElementById('fourthSkill').innerHTML = "X : 0"
    }
} 

updateHeroStatBoxes = function(){
    healthBar.fillText(player.hp +'/'+ player.hpMax, 26, 17);
    healthBar.fillText(player.mana +'/'+ player.manaMax, 30, 37);
    document.getElementById("constitutionDiv").innerHTML = player.constitution;
    document.getElementById("strengthDiv").innerHTML =  player.strength;
    document.getElementById("dexterityDiv").innerHTML =  player.dexterity;
    document.getElementById("intellectDiv").innerHTML =  player.intellect;
    document.getElementById("wisdomDiv").innerHTML =  player.wisdom;
    document.getElementById("skillPoints").innerHTML = "SKILL POINTS: " + player.skillPoints;
    document.getElementById("playerLvl").innerHTML = "LVL " + player.lvl; 
  

   
    ctx.fillText(player.hp + " Hp",0,30);
    ctx.fillText('Score: ' + score,200,30);

}

$(document).on('click','.skill-column2', function(){$(this).addClass("borderChoosen").siblings().removeClass("borderChoosen")});
$(document).on('click','.invLeft', function(){$(this).addClass("inv-left-choosen").siblings().removeClass("inv-left-choosen")});
let textMenu = document.getElementById('UpCenterTextMenu');
var pageNumber = 0
updateTextMenu = function(){
    if (player.currentQuest.isStarted){
        textMenu.innerHTML = player.currentEvent.text[pageNumber];
        if (pageNumber < player.currentEvent.text.length - 1){
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
showDeathMenu = function(){
    document.getElementById('onDeathMenu').innerHTML = '<button id = "btn-start-game" style = "position: absolute; left:40%; top:80%; width:15%; height:10%; z-index:100;" onclick = "startNewGame()">New Game</button><div id = "deathMenu" style = "position:absolute; width:100%;height:100%; background-color:#323c39; border:2px solid; border-color:azure; text-align:center;">'+ player.deathCause + '</div>'
    document.getElementById('menu').style.display = "none";
    document.getElementById('btn-open-menu').style.display = "none";
    document.getElementById('onDeathMenu').style.display = "block";
} 
hideDeathMenu = function(){
    document.getElementById('onDeathMenu').innerHTML = "";
    document.getElementById('onDeathMenu').style.display = "none;"
    document.getElementById('btn-open-menu').style.display = "block";
}
