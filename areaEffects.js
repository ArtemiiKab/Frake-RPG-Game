var effectList = {};

Effect = function (name, id, x, y, width, height, img) {
	var self = Entity(name, id, x, y, width, height, img);
	self.effectframeCount = 0;

	self.draw = function () {
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;

		x += WIDTH / 2;
		y += HEIGHT / 2;
		var frameWidth = self.img.width / 12;
		var walk = Math.floor(self.effectframeCount / 25)

		ctx.drawImage(self.img, walk * frameWidth, 0, frameWidth, frameWidth, x - (TILE_SIZE * 1.25), y - (TILE_SIZE * 1.4) + 2, self.width * 2.8, self.height * 1.8)
		ctx.restore();
	}
	self.update = function () {
		if (self.effectframeCount < 300) {
			self.effectframeCount += 10;
		} else {
			delete effectList[self.id];
			delete self;
		}
		if (self.testCollision(player) && self.effectframeCount > 150) {
			player.hp -= Math.ceil((10 - player.magicDamageResist));
			player.isDamaged = true;
			if (player.hp <= 0) {
				player.deathCause = "You got killed by magic. Try using counterspell, you are a wizzard, damn!"
			}
		}
		for (var key in enemyList) {
			if (self.testCollision(enemyList[key]) && self.effectframeCount > 150) {
				enemyList[key].hp -= (10 - enemyList[key].magicDamageResist)
				enemyList[key].isDamaged = true;
			}
		}
		self.draw();
	}
	effectList[id] = self;

}

generateEffect = function (name, colX, rowY) {
	var x = colX//*TILE_SIZE+TILE_SIZE/2
	var y = rowY//*TILE_SIZE+TILE_SIZE/2
	var height = TILE_SIZE - 2;
	var width = TILE_SIZE - 2;
	var id = Math.random()
	Img.effect = new Image();
	Img.effect.src = "./img/" + name + ".png";
	img = Img.effect;
	Effect(name, id, x, y, width, height, img)
}