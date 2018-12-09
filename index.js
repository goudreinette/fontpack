const fs = require('fs');
const homedir = require('os').homedir();
const path = require('path');
const ttf2woff = require("ttf2woff")
const Datauri = require('datauri');
const datauri = new Datauri();
const fontManager = require('font-manager')
const libui = require('libui-node')


function makeCss(family, weight, italic, data) {
	return `@font-face {
		font-family: '${family}';
		src: url('${data}');
		font-weight: ${weight};
		font-style: ${italic ? 'italic' : 'normal'};
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
	let nonItalic = fontManager.findFontsSync({family: familyName, italic: false})
	let italic = fontManager.findFontsSync({family: familyName, italic: true})
	let fonts = [...nonItalic, ...italic]
	console.log(fonts)
	let output = ""
	for (let variant of fonts) {
		let fileContent = fs.readFileSync(variant.path)
		let ext = path.extname(variant.path)
		let fontData = datauri.format(ext, fileContent).content
		output += makeCss(variant.family, variant.weight, variant.italic, fontData)
	}
	return output
}


function writeCssFileFor(family) {
	fs.writeFileSync(`${homedir}/Desktop/${family}.css`, familyToCss(family));
}




// IDEA: web UI instead?
function main() {	
	// container -------
	var win = new libui.UiWindow("Font Packager", 320, 80, false);
	var form = new libui.UiForm();
	form.padded = true
	win.setChild(form);

	// font chooser
	var fontbutton = new libui.UiFontButton(); //
	form.append("", fontbutton, false);
	fontbutton.onChanged(() => {
		var family = fontbutton.font.getFamily()
		console.log(`Selected: ${family}`);
	});

	// button -----
	var button = new libui.UiButton();
	button.text = "Generate CSS file"
	form.append("", button, false);
	button.onClicked(() => {
		let family = fontbutton.font.getFamily()
		writeCssFileFor(family)
	})

	// loop ----
	win.onClosing(() => {
		win.close();
		libui.stopLoop();
	});
	libui.startLoop();
	win.show();
}

main()