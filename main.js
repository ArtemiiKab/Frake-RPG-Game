var isGameStarted = false;
var choosenClass = "";
var ctx = document.getElementById("ctx").getContext("2d");
var canvas = document.getElementById("ctx");
var healthBar = document.getElementById("playerHp").getContext("2d")

var heightRatio = 0.05;
healthBar.height = healthBar.width * heightRatio;
var mapList = {};
var HEIGHT = 768;
var WIDTH = 1705;
var CANVAS_WIDTH = 1705;
var CANVAS_HEIGHT = 768;
var TILE_SIZE = 96;

var playerLook = document.getElementById("playerLook").getContext("2d")




var timeWhenGameStarted = Date.now();   //return time in ms
var frameCount = 0;
var paused = false;
var score = 0;

let resizeCanvas = function () {
	CANVAS_WIDTH = window.innerWidth - 4;
	CANVAS_HEIGHT = window.innerHeight - 4;
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
window.addEventListener('resize', function () {
	resizeCanvas();
});







document.onclick = function () {
	if (isGameStarted && !isNotAttack) {
		player.performAttack();
		/*  var x =  player.x + player.targetX
			var y =  player.y + player.targetY
			 generateEffect("lightningblue", x, y) */
	}
}

document.oncontextmenu = function (mouse) {
	player.performSpecialAttack();
	mouse.preventDefault();
}

document.onmousemove = function (mouse) {
	if (isGameStarted) {
		var mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
		var mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;

		mouseX -= CANVAS_WIDTH / 2;
		mouseY -= CANVAS_HEIGHT / 2;

		player.targetX = mouseX
		player.targetY = mouseY
		player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;

	}
}


document.onkeydown = function (event) {
	if (event.keyCode === 68)        //d
		player.pressingRight = true;
	else if (event.keyCode === 83)   //s
		player.pressingDown = true;
	else if (event.keyCode === 65) //a
		player.pressingLeft = true;
	else if (event.keyCode === 87) // w
		player.pressingUp = true;
	else if (event.keyCode === 81 && playerInventory.hasItem("potion", "potions", 1))//q
		Item.list["potion"].event();
	else if (event.keyCode === 84) {// t 
		player.isTalking = true;
	}
	else if (event.keyCode === 49) {//1

		if (player.PhysicalAttackList.indexOf(player.bulletType) + 1 < player.PhysicalAttackList.length) {
			player.bulletType = player.PhysicalAttackList[player.PhysicalAttackList.indexOf(player.bulletType) + 1]
		} else {
			player.bulletType = player.PhysicalAttackList[0]
		}
	}
	else if (event.keyCode === 50) {//2
		player.armor = "Clothing"
		var magicSkillsList = player.magicAttackList.map(it => it.parent)
		if (magicSkillsList.indexOf(player.bulletType2) + 1 < magicSkillsList.length) {
			player.bulletType2 = magicSkillsList[magicSkillsList.indexOf(player.bulletType2) + 1]
		} else {
			player.bulletType2 = magicSkillsList[0]
		}
	}
}

document.onkeyup = function (event) {
	if (event.keyCode === 68) {      //d
		player.pressingRight = false;
	}
	else if (event.keyCode === 83) { //s
		player.pressingDown = false;
	}
	else if (event.keyCode === 65) //a
		player.pressingLeft = false;
	else if (event.keyCode === 87) // w
		player.pressingUp = false;
	else if (event.keyCode === 80) //p ;
		paused = !paused;

}

update = function () {
	if (paused) {
		ctx.fillText("Paused", WIDTH / 2, HEIGHT / 2)
		return;
	}
	if (player.dead) {
		ctx.fillText("", WIDTH / 2, HEIGHT / 2)
		return;
	}
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	healthBar.clearRect(0, 0, WIDTH, HEIGHT)
	playerLook.clearRect(0, 0, WIDTH, HEIGHT);
	currentMap.draw();
	frameCount++;
	score++;

	for (var key in corpseList) {
		corpseList[key].update();
		if (corpseList[key].isExpired) {
			delete corpseList[key]
		}
	}
	for (var key in trapList) {
		trapList[key].update();
	}
	for (var key in coffinList) {
		coffinList[key].update();
	}
	for (var key in doorList) {
		doorList[key].update();
	}
	for (var key in upgradeList) {
		upgradeList[key].update();
	}

	for (var key in questList) {
		questList[key].update();
	}
	for (var key in torchList) {
		torchList[key].update();
	}

	for (var key in merchantList) {
		merchantList[key].update();
	}

	for (var key in triggerList) {
		triggerList[key].update();
	}

	for (var key in ritualStoneList) {
		ritualStoneList[key].update();
	}
	for (var key in npcList) {
		npcList[key].update();
		if (npcList[key].hp <= 0) {
			generateCorpse(npcList[key])
			delete npcList[key]
		}
	}
	for (var key in enemyList) {
		enemyList[key].update();
		if (enemyList[key].hp <= 0) {
			generateCorpse(enemyList[key])
			player.xp += enemyList[key].exp;
			generateCoin(enemyList[key].x, enemyList[key].y, Math.floor(Math.random() * 10));
			generateHelmet(enemyList[key].x, enemyList[key].y, 1)

			delete enemyList[key];
			player.killCount++;
		}
	}
	if (quest1.isFinished || currentMap.id === "dungeon2") {
		if (frameCount % 100 === 0)      //every 4 sec
			randomlyGenerateEnemy();
		if (frameCount % 75 === 0)       //every 3 sec
			randomlyGenerateUpgrade();
	}
	player.update();

	updateUI();//only after player update!

	for (var key in bulletList) {
		bulletList[key].update();
	}

	for (var key in effectList) {
		effectList[key].update();
	}

}

Maps = function (id, imgSrc, grid) {
	var self = {
		id: id,
		image: new Image(),
		width: grid[0].length * TILE_SIZE,
		height: grid.length * TILE_SIZE,
		grid: grid,
	}
	self.image.src = imgSrc;
	self.isPositionWall = function (pt) {
		var gridX = Math.floor(pt.x / TILE_SIZE);
		var gridY = Math.floor(pt.y / TILE_SIZE);
		if (gridX < 0 || gridX >= self.grid[0].length) {
			return true;
		}
		if (gridY < 0 || gridY >= self.grid.length) {
			return true;
		}
		if (self.grid[gridY][gridX] === 1 || self.grid[gridY][gridX] === 6 || self.grid[gridY][gridX] === 51 || self.grid[gridY][gridX] === 53) {
			return true;
		} else if (self.grid[gridY][gridX] === 0) {
			return false;
		} else {
			return false
		}
	}

	self.draw = function () {
		var x = WIDTH / 2 - player.x;
		var y = HEIGHT / 2 - player.y;
		ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, x, y, self.image.width * 2, self.image.height * 2)
	}

	self.generateTraps = function () {
		for (var i = 0; i < self.grid.length; i++) {
			for (var i2 = 0; i2 < self.grid[0].length; i2++) {
				if (self.grid[i][i2] === 2) {
					generateTrap(i2, i)
				}
			}
		}
	}

	self.generateCoffins = function () {
		for (var i = 0; i < self.grid.length; i++) {
			for (var i2 = 0; i2 < self.grid[0].length; i2++) {
				if (self.grid[i][i2] === 4) {
					generateCoffin(i2, i)
				}
			}
		}
	}



	self.generateDoors = function () {
		for (var i = 0; i < self.grid.length; i++) {
			for (var i2 = 0; i2 < self.grid[0].length; i2++) {
				if (self.grid[i][i2] === 5) {
					generateDoor(i2, i)
				} else if (self.grid[i][i2] === 51) {
					generateTrigger(i2, i)
				} else if (self.grid[i][i2] === 52) {
					generateSecretDoor(i2, i)
				} else if (self.grid[i][i2] === 53) {
					generateRitualStone(i2, i)
				}
			}
		}
	}

	self.generateTorches = function () {
		for (var i = 0; i < self.grid.length; i++) {
			for (var i2 = 0; i2 < self.grid[0].length; i2++) {
				if (self.grid[i][i2] === 6) {
					generateTorch(i2, i)
				}
			}
		}
	}

	self.generateMerchants = function () {
		for (var i = 0; i < self.grid.length; i++) {
			for (var i2 = 0; i2 < self.grid[0].length; i2++) {
				if (self.grid[i][i2] === 8) {
					generatePotionMerchant(i2, i)
				}
				if (self.grid[i][i2] === 9) {
					generateBlacksmithMerchant(i2, i)
				}
			}
		}
	}

	self.isStairs = function (pt) {
		var gridX = Math.floor(pt.x / TILE_SIZE);
		var gridY = Math.floor(pt.y / TILE_SIZE);
		if (self.grid[gridY][gridX] === 3)
			return true
	}

	self.isTorch = function (pt) {
		var gridX = Math.floor(pt.x / TILE_SIZE);
		var gridY = Math.floor(pt.y / TILE_SIZE);
		if (self.grid[gridY][gridX] === 6 || self.grid[gridY][gridX] === 8)
			return true
	}

	self.isEntrance = function (pt) {
		var gridX = Math.floor(pt.x / TILE_SIZE);
		var gridY = Math.floor(pt.y / TILE_SIZE);
		if (self.grid[gridY][gridX] === 5)
			return true
	}
	mapList[id] = self;
	return self;
}

currentMap = Maps("dungeon1", "img/dungeon1.png",
	[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 5, 6, 1],
	[1, 0, 0, 0, 0, 0, 0, 8, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 2, 0, 0, 2, 0, 1],
	[1, 1, 0, 1, 1, 1, 0, 0, 0, 6, 1, 1, 6, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 4, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 6, 1, 0, 0, 0, 1, 1, 1, 1, 0, 2, 0, 0, 2, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	]);

Maps("dungeon2", "img/map4.png",
	[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 6, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 1, 0, 1, 0, 6, 1, 1, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
	[1, 1, 1, 0, 1, 1, 0, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
	[1, 1, 6, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	]);

Maps("mainCamp", "img/newMap.png",
	[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 8, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 9, 1, 6, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	]);

Maps("location1", "img/map1.png",
	[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 6, 52, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 53, 0, 0, 0, 53, 0, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 0, 0, 51, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 53, 0, 0, 0, 53, 0, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	])


chooseBarbarian = function () {
	document.getElementById('chooseWizard').style.display = "none";
	document.getElementById('chooseHero').style.display = "none";
	document.getElementById('btn-choose-barbarian').style.display = "none";
	document.getElementById('barbarianInfoMenu').style.display = "block";
	document.getElementById('startGame').style.display = "block";
	document.getElementById('backToChooseHero').style.display = "block";
	choosenClass = "barbarian";
}

chooseWizard = function () {
	document.getElementById('chooseBarbarian').style.display = "none";
	document.getElementById('chooseHero').style.display = "none";
	document.getElementById('btn-choose-wizard').style.display = "none";
	document.getElementById('wizardInfoMenu').style.display = "block";
	document.getElementById('startGame').style.display = "block";
	document.getElementById('backToChooseHero').style.display = "block";
	choosenClass = "wizard";
}

backToChooseHero = function () {
	document.getElementById('chooseBarbarian').style.display = "block";
	document.getElementById('chooseWizard').style.display = "block";
	document.getElementById('btn-choose-barbarian').style.display = "none";
	document.getElementById('btn-choose-wizard').style.display = "block";
	document.getElementById('chooseHero').style.display = "block";

	document.getElementById('wizardInfoMenu').style.display = "none";
	document.getElementById('startGame').style.display = "none";
	document.getElementById('backToChooseHero').style.display = "none";
	document.getElementById('barbarianInfoMenu').style.display = "none";
}

startGame = function () {
	document.getElementById('startMenu').style.display = "none";
	document.getElementById('welcomeMessage').style.display = "none";
	document.getElementById('ui').style.display = "block";

	if (choosenClass === "barbarian") {
		player = Player("player", "barbarian", (TILE_SIZE * 2 - TILE_SIZE / 2), (TILE_SIZE * 3 - TILE_SIZE / 2), 90, 90, Img.barbarian, 1000, 50, 10, 10, 10, 8, 3, 2, "SwordStrike")
	} else if (choosenClass === "wizard") {
		player = Player("player", "wizard", (TILE_SIZE * 2 - TILE_SIZE / 2), (TILE_SIZE * 3 - TILE_SIZE / 2), 80, 90, Img.wizard, 600, 300, 6, 6, 6, 8, 8, 7, "fireball")
	}
	playerInventory = Inventory();
	isGameStarted = true;
	startNewGame();
	setInterval(update, 40);
}


startNewGame = function () {
	hideDeathMenu();
	currentMap = mapList["location1"];
	player.dead = false;
	player.deathCause = "Wow, you're still alive, that's impressive... Are you sure you want to leave?"
	player.hp = player.hpMax;
	player.mana = player.manaMax;
	player.x = (TILE_SIZE * 8 - TILE_SIZE / 2)
	player.y = (TILE_SIZE * 17 - TILE_SIZE / 2)
	//player.x= (TILE_SIZE*2 - TILE_SIZE/2)
	// player.y = (TILE_SIZE*3 - TILE_SIZE/2)
	player.currentQuest = "none";
	player.currentEvent = "none";
	player.killCount = 0;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	enemyList = {};
	upgradeList = {};
	merchantList = {};
	bulletList = {};
	corpseList = {};
	trapList = {};
	coffinList = {};
	doorList = {};
	questList = {};
	torchList = {};
	triggerList = {};
	ritualStoneList = [];
	npcList = {};
	effectList = {};
	playerInventory.addItem("potion", "potions", 3);
	playerInventory.addItem("potionSpeed", "potions", 3);
	// playerInventory.addItem("Skull","helmets", 1);
	playerInventory.addItem("FrostHood", "helmets", 1);
	playerInventory.addItem("HatOfGreatWizardry", "helmets", 1);
	//  playerInventory.addItem("RubyDiadem","helmets", 1);
	generateNpc(TILE_SIZE * 8 - TILE_SIZE / 2, TILE_SIZE * 3 - TILE_SIZE / 2, "npc1", quest1, "questGiver");

	currentMap.generateTraps();
	currentMap.generateCoffins();
	currentMap.generateDoors();
	currentMap.generateTorches();
	currentMap.generateMerchants();
	for (var key in merchantList) {
		merchantList[key].inventory.refreshRender();
	}

	textMenu.innerHTML = '';
	pageNumber = 0;
	quest1.isStarted = false;
	//targetGenerateEnemy(300, 300);
}

