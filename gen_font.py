import fontforge,os,glob

font = fontforge.font()

for file in glob.glob("out/*.svg"):
	glyph = font.createChar(int(file.replace("out/", "").replace(".svg", "")))
	glyph.importOutlines(file)
	
font.save('out.sfd')
