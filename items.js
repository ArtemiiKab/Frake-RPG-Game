Inventory = function () {
	var self = {
		potions: [],
		helmets: []
	}

	self.addItem = function (id, type, amount) {
		if (type === "potions") {
			for (var i = 0; i < self.potions.length; i++) {
				if (self.potions[i].id === id) {
					self.potions[i].amount += amount;
					self.refreshRender();
					return;
				}
			}

			self.potions.push({ id: id, amount: amount });
		} else if (type === "helmets") {
			for (var i = 0; i < self.helmets.length; i++) {
				if (self.helmets[i].id === id) {
					self.helmets[i].amount += amount;
					self.refreshRender();
					return;
				}
			}
			self.helmets.push({ id: id, amount: amount });
		}
		self.refreshRender();
	}

	self.removeItem = function (id, type, amount) {
		if (type === "potions") {
			for (var i = 0; i < self.potions.length; i++) {
				if (self.potions[i].id === id) {
					self.potions[i].amount -= amount;
					if (self.potions[i].amount <= 0) {
						self.potions.splice(i, 1);
						self.refreshRender();
					}
					return;
				}
			}
		} else if (type === "helmets") {
			for (var i = 0; i < self.helmets.length; i++) {
				if (self.helmets[i].id === id) {
					self.helmets[i].amount -= amount;
					if (self.helmets[i].amount <= 0) {
						self.helmets.splice(i, 1);
						self.refreshRender();
					}
					return;
				}
			}
		}
	}

	self.hasItem = function (id, type, amount) {
		if (type === "potions") {
			for (var i = 0; i < self.potions.length; i++) {
				if (self.potions[i].id === id) {
					return self.potions[i].amount >= amount;
				}
			}
			return false;
		} else if (type === "helmets") {
			for (var i = 0; i < self.helmets.length; i++) {
				if (self.helmets[i].id === id) {
					return self.helmets[i].amount >= amount;
				}
			}
			return false;
		}
	}



	self.refreshRender = function () {


		var str = "";
		var str2 = "";
		var str3 = "";
		for (var i = 0; i < self.potions.length; i++) {
			let item = Item.list[self.potions[i].id];
			let use = "Item.list['" + item.id + "'].event()";
			let sell = "Item.list['" + item.id + "'].sell()";
			str += "<div class = 'potionList' id = '" + item.name + "'><div class = 'potion-info-block'><img src = './img/" + item.id + ".png' class = 'img-potions'><div class = 'info-potions'>Amount : " + self.potions[i].amount + "x <br> " + item.describtion + "</div><button class = 'btn-use-potion' onclick = \"" + use + "\" >Use</button></div></div>";
			str2 += "<div class = 'potionList' id = '" + item.name + "'><div class = 'potion-info-block'><img src = './img/" + item.id + ".png' class = 'img-potions'><div class = 'info-potions' style = 'color:azure;'>Amount : " + self.potions[i].amount + "x <br> " + item.describtion + "</div><button class = 'btn-sell-potion' onmousedown = \"" + sell + "\" >Sell</button></div></div>";
		}

		document.getElementById("potions").innerHTML = str;
		document.getElementById("playerPotions").innerHTML = str2;

		for (var i = 0; i < self.helmets.length; i++) {
			let item = Item.list[self.helmets[i].id];
			let use = "Item.list['" + item.id + "'].event()";
			let sell = "Item.list['" + item.id + "'].sell()";
			str3 += "<div class = 'potionList' id = '" + item.name + "1'><div class = 'potion-info-block'><button id ='btn" + item.id + "' class = 'btn-use-item' onclick = \"" + use + "\" >Use</button><div class = 'item-describtion' style = 'color:" + item.rarity + ";'>" + item.name + "<br><p style = 'color:azure'> " + item.describtion + "</p><br> </div><img src = './img/" + item.id + ".png' class = 'img-items' draggable ='true'></div></div>";
			str2 += "<div class = 'potionList' id = '" + item.name + "1'><div class = 'potion-info-block'><img src = './img/" + item.id + ".png' class = 'img-items'><div class = 'info-items' style = 'color:azure;'>Amount : " + self.helmets[i].amount + "x</div><button class = 'btn-sell-item' onmousedown = \"" + sell + "\" >Sell</button></div></div>";
		}

		document.getElementById('playerInventory').innerHTML = str3;
		updateInventoryItems()
	}

	return self;
}

Item = function (id, name, type, rarity, describtion, event, unUse, sell, buy) {
	var self = {
		id: id,
		name: name,
		type: type,
		rarity: rarity,
		describtion: describtion,
		event: event,
		sell: sell,
		buy: buy,
		unUse: unUse,
	}
	Item.list[self.id] = self;
	return self;
}

Item.list = {};

Item("potion", "Potion", "potions", "silver", "Heals to full", function () {

	player.hp = player.hpMax;
	playerInventory.removeItem("potion", "potions", 1)
	playerInventory.refreshRender();


}, function () { },

	function () {
		player.gold += 10;
		playerInventory.removeItem("potion", "potions", 1)
		merchantList["potionMerchant"].inventory.addItem("potion", "potions", 1)
		playerInventory.refreshRender();
		merchantList["potionMerchant"].inventory.refreshRender();

	},

	function () {
		if (player.gold >= 10) {
			player.gold -= 10;
			merchantList["potionMerchant"].inventory.removeItem("potion", "potions", 1)
			playerInventory.addItem("potion", "potions", 1)
			merchantList["potionMerchant"].inventory.refreshRender();
			playerInventory.refreshRender();

		}

	})

Item("potionSpeed", "PotionSpeed", "potions", "silver", "Sets speed to 12", function () {
	player.speed = 12;
	playerInventory.removeItem("potionSpeed", "potions", 1)
	playerInventory.refreshRender();
}, function () { },
	function () {
		playerInventory.removeItem("potionSpeed", "potions", 1)
		merchantList["potionMerchant"].inventory.addItem("potionSpeed", "potions", 1)
		playerInventory.refreshRender();
		merchantList["potionMerchant"].inventory.refreshRender();

		player.gold += 10;
	}, function () {
		if (player.gold >= 10) {
			merchantList["potionMerchant"].inventory.removeItem("potionSpeed", "potions", 1)
			playerInventory.addItem("potionSpeed", "potions", 1)
			merchantList["potionMerchant"].inventory.refreshRender();
			playerInventory.refreshRender();
			player.gold -= 10;
		}
	})

Item("Skull", "Skull", "helmets", "gold", "+1 to strength", function () {
	if (player.isHatOn) {
		Item.list[player.hat].unUse();
		document.getElementById('btn' + player.hat).disabled = false;
	}
	player.isHatOn = true;
	player.hat = "Skull";
	player.strength += 1
	document.getElementById('btn' + player.hat).disabled = true;
}, function () {
	player.strength -= 1
},
	function () {

	}, function () {

	})

Item("FrostHood", "FrostHood", "helmets", "blue", "+1 to dexterity", function () {
	if (player.isHatOn) {
		Item.list[player.hat].unUse()
		document.getElementById('btn' + player.hat).disabled = false;
	}
	player.isHatOn = true;
	player.hat = "FrostHood";
	player.dexterity += 1;
	document.getElementById('btn' + player.hat).disabled = true;
}, function () {
	player.dexterity -= 1
},

	function () {

	}, function () {

	})

Item("HatOfGreatWizardry", "HatOfGreatWizardry", "helmets", "gold", "+1 to wisdom", function () {
	if (player.isHatOn) {
		Item.list[player.hat].unUse()
		document.getElementById('btn' + player.hat).disabled = false;
	}
	player.isHatOn = true;
	player.hat = "HatOfGreatWizardry";
	player.wisdom += 1;
	document.getElementById('btn' + player.hat).disabled = true;
}, function () {
	player.wisdom -= 1;

}, function () {

}, function () {

})

Item("RubyDiadem", "RubyDiadem", "helmets", "red", "+1 to intellect", function () {
	if (player.isHatOn) {
		Item.list[player.hat].unUse()
		document.getElementById('btn' + player.hat).disabled = false;
	}
	player.isHatOn = true;
	player.hat = "RubyDiadem";
	player.intellect += 1;
	document.getElementById('btn' + player.hat).disabled = true;
}, function () {
	player.intellect -= 1
}, function () {

}, function () {

})

