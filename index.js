const readline = require('readline');
const Jimp = require('jimp');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let paletteName = 'palette';
rl.question('Palette filename (palette): ', input => {
	if (input) { paletteName = input; }
	rl.question('Paste sketch json-data: ', input => {

		var json = JSON.parse(input);

		createPng(json.colors);

		rl.close();
	});
});


function createPng(colors) {
	var image = new Jimp(256, 1, 0x4B4B4BFF, (err, image) => {
		setColors(colors, image);
		writeImage(image);
	});
}

function setColors(colors, image) {
	for (let i = 0; i < colors.length; i++) {
		const color = colors[i];
		const hex = Jimp.rgbaToInt(color.red * 255, color.green * 255, color.blue * 255, color.alpha * 255);
		image.setPixelColor(hex, 256 - i, 1);
	}

	for(let i = 0; i < 8; i++) {
		// 8 grey gradients
		let grad = i * (255 / 10);
		const hex = Jimp.rgbaToInt(grad, grad, grad, 255);
		image.setPixelColor(hex, 256 - (colors.length + i), 1);
	}
}

function writeImage(image) {
	image.write(`${paletteName}.png`, err => {
		if (err) throw err;
		console.log('');
		console.log(`Created new palette at ${__dirname}\\${paletteName}.png`);
	});
}