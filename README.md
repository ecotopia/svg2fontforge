Takes an SVG file that contains letter/symbols in a row (each one represented by one path object) and converts them into a fontforge file.

Usage
=====

0. Make sure you have node, python and fontforge installed
1. Run `npm install`
2. Create an SVG file 1000px high and arbitrarily wide. At 200px there is your baseline. Put in your letters (each one as one path object).
3. Run `node split_chars.js svgfile.svg ABCDEF`, where `svgfile.svg` is the file with your letters and `ABCDEF` is the letters how they appear in the document from left to right. The characters will be split up and put into `out/<charCode>.svg`.
4. Run `python gen_font.svg`. Your font will be saved as `out.sfd`.
