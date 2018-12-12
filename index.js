import React, { Component } from 'react'; // import from react
import {render, Window, App, FontButton, Box, Button, Text} from 'proton-native'
const fs = require('fs');
const homedir = require('os').homedir();
const path = require('path');
const Datauri = require('datauri');
const datauri = new Datauri();
const fontManager = require('font-manager')


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




class Example extends Component {
    state = {
        font: {fontFamily: 'Helvetica'},
        statusMsg: ''
    }


    generate() {
        console.log(this.state.font)
        let family = this.state.font.fontFamily
        let path = writeCssFileFor(family)
        this.setState({statusMsg: `Generated ${path}`})
    }

    render() { // all Components must have a render method
    return (
      <App> // you must always include App around everything
        <Window title="FontPack" size={{w: 300, h: 50}} menuBar={false}>
            <Box padded={false}>
                <FontButton
                    stretchy={false}
                    onChange={v => this.setState({ font: v })}
                />
                <Button
                    onClick={_ => this.generate()}
                    style={{ height: '100px' }}
                >
                    Generate CSS file
                </Button>
                <Text >{this.state.statusMsg}</Text>
            </Box>
        </Window>
      </App>
    );
  }
}

render(<Example />); // and finally render your main component
