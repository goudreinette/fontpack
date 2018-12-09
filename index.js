const fs = require('fs');
const ttf2woff = require("ttf2woff")
const Datauri = require('datauri');
const datauri = new Datauri();
const fontManager = require('font-manager');


function makeCss(family, weight, style, woffData) {
	return `@font-face {
		font-family: '${family}';
		src: url('${datauri.format('.woff', woffData).content}');
		font-weight: ${weight};
		font-style: ${style};
	}
	
	`
}


function toWoff (fontPath) {
	//"/Users/rein/Library/Fonts/Anonymous Pro.ttf"
	var input = fs.readFileSync(fontPath)
	var ttf = new Uint8Array(input)
	var woff = new Buffer(ttf2woff(ttf, {}).buffer)
	return woff;
}


function familyToCss(familyName = 'Helvetica') {
	let fonts = fontManager.findFontsSync({family: familyName})
	console.log(fonts)
	let output = ""
	for (let variant of fonts) {
		let woff = toWoff(variant.path)
		output += makeCss(variant.family, variant.weight, variant.style, woff)
	}
	return output
}


fs.writeFileSync("./anonymous.css", familyToCss('Anonymous Pro'));