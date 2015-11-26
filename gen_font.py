import fontforge,os,glob

font = fontforge.font()

for file in glob.glob("out/*.svg"):
	code = file.replace("out/", "").replace(".svg", "")
	glyph = font.createChar(ord(code if code != "%2f" else "/"))
	glyph.importOutlines(file)
	
font.save('out.sfd')
