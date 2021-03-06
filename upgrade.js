Upgrade = function (id, x, y, width, height, category, img) {
	var self = Entity('upgrade', id, x, y, width, height, img);
	self.category = category;
	self.lootframeCount = Math.floor(Math.random() * 75);

	self.draw = function () {
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;

		x += WIDTH / 2;
		y += HEIGHT / 2;
		var frameWidth = self.img.width / 5;
		var walk = Math.floor(self.lootframeCount / 25)
		if (self.category === "RubyDiadem" || self.category === "Skull") {
			ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height, x, y, self.width, self.height)

		} else {
			ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, 65, x - (TILE_SIZE / 4), y - (TILE_SIZE / 3), self.width + 2, self.height)
		}
		ctx.restore();
	}



	var super_update = self.update;
	self.update = function () {
		super_update();
		self.lootframeCount += 5;
		if (self.lootframeCount >= 70) {
			self.lootframeCount = 0;
		}

		var isColliding = player.testCollision(self);
		if (isColliding) {
			if (self.category === 'heal')
				playerInventory.addItem("potion", "potions", 1)
			if (self.category === 'manaRestore')
				player.mana = player.manaMax;
			if (self.category === 'coin')
				player.gold += self.id;
			if (self.category === "RubyDiadem" || self.category === "Skull")
				playerInventory.addItem(self.category, "helmets", 1)

			delete upgradeList[self.id];
		}
	}
	if (currentMap.isPositionWall(self) || currentMap.isTorch(self)) {
		randomlyGenerateUpgrade()
	} else {
		upgradeList[id] = self;
	}
}

randomlyGenerateUpgrade = function () {
	//Math.random() returns a number between 0 and 1
	var x = Math.random() * currentMap.width;
	var y = Math.random() * currentMap.height;
	var height = 50;
	var width = 32;
	var id = Math.random();


	if (Math.random() < 0.5) {
		var category = 'heal';
		Img.potion = new Image();
		Img.potion.src = "./img/healingPotion.png"
		var img = Img.potion;
	} else {
		var category = 'manaRestore';
		Img.potionMana = new Image();
		Img.potionMana.src = "./img/manaPotion.png"
		var img = Img.potionMana;
	}

	Upgrade(id, x, y, width, height, category, img);
}

generateCoin = function (x, y, amount) {
	var height = 50;
	var width = 32;
	var category = "coin";
	Img.coin = new Image();
	Img.coin.src = "img/coin.png"
	var img = Img.coin;
	Upgrade(amount, x, y, width, height, category, img);
}

generateHelmet = function (x, y, amount) {
	var height = 50;
	var width = 32;
	var category = "none";
	var id = Math.random();
	var generateLoot = Math.floor(Math.random() * 2);
	if (generateLoot < 1) {
		var chooseItem = Math.floor(Math.random() * 2)
		if (chooseItem === 0) {
			category = "RubyDiadem"

		} else if (chooseItem === 1) {
			category = "Skull"
		}
		var item = new Image();
		item.src = "img/" + category + ".png";
		var img = item
		Upgrade(id, x + Math.floor(Math.random() * 200) - Math.floor(Math.random() * 200), y + Math.floor(Math.random() * 200) - Math.floor(Math.random() * 200), width, height, category, img)
	} 
}