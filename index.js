const fs = require('fs');
const homedir = require('os').homedir();
const {exec} = require('child_process')
const path = require('path');
const Datauri = require('datauri');
const datauri = new Datauri();
const fontManager = require('font-manager')
const libui = require('libui-node')


function makeCss({family, weight, italic}, data) {
	return `
	
@font-face {
	font-family: '${family}';
	src: url('${data}');
	font-weight: ${weight};
	font-style: ${italic ? 'italic' : 'normal'};
}`
}



function familyToCss(familyName = 'Helvetica') {
	let nonItalic = fontManager.findFontsSync({family: familyName, italic: false})
	let italic = fontManager.findFontsSync({family: familyName, italic: true})
	let fonts = [...nonItalic, ...italic]
	
	let fontfaceRules = fonts.map(variant => {
		let fileContent = fs.readFileSync(variant.path)
		let ext = path.extname(variant.path)
		let fontData = datauri.format(ext, fileContent).content
		return makeCss(variant, fontData)
	})
	
	return fontfaceRules.join()
}


function writeCssFileFor(family) {
	let path = `${homedir}/Desktop/${family}.css`
	fs.writeFileSync(path, familyToCss(family))
	return path
}





function main() {	
	// font chooser
	var fontbutton = new libui.UiFontButton()
	fontbutton.onChanged(() => {
		var family = fontbutton.font.getFamily()
		console.log(`Selected: ${family}`);
	});
	
		
	// label
	var label = new libui.UiLabel()


	// button -----
	var button = new libui.UiButton();
	button.text = "Generate CSS file"
	button.onClicked(() => {
		let family = fontbutton.font.getFamily()
		let path = writeCssFileFor(family)
		label.text = `Generated ${path}`
		//exec(`open ${path}`)
	})
	
	
	// add children to window  ----
	var win = new libui.UiWindow("Font Packager", 320, 80, false);
	win.margined = true;
	var box = new libui.UiVerticalBox()
	win.setChild(box)
	box.append(fontbutton, false)
	box.append(button, false)
	box.append(label, false)
	
	
	// loop ----
	win.onClosing(() => {
		win.close();
		libui.stopLoop();
	});
	libui.startLoop();
	win.show();
}

main()