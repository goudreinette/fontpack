import matplotlib.font_manager


def list_fonts():
	fonts = matplotlib.font_manager.fontManager.ttflist
	for f in fonts: print(f)
	print(len(fonts))
	return fonts
	

def make_woff():
	pass
	
	
def	generate_css(family, woff_data, weight='normal', style='italic'):	
	return '@fontface { ' + f'''
			font-family: {family}
			src: url(data:application/x-font-woff;charset=utf-8;base64,);
			font-weight: {weight};
			font-style: {style};
	''' + '}'
	
	
def to_css_file(fontfamily):
	css = ""
	css + generate_css(fontfamily)
	
	

print(list_fonts()[0])
print(generate_css("DIN Medium", "hello"))