var fs = require("fs");
var vm = require('vm');
var jsdom = require('jsdom');
var cheerio = require("cheerio");
var child_process = require("child_process");

var doc = jsdom.jsdom("<html><body></body></html>");
doc.defaultView.Raphael = {};
doc.implementation._addFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
var filename = require.resolve('raphael/raphael');
vm.createScript("(function () {" + fs.readFileSync(filename).toString('utf-8').replace("})(this);", "})(this);eve = window.eve;") + "}).call(window)", filename).runInNewContext({
	window:    doc.defaultView,
	document:  doc,
	navigator: doc.defaultView.navigator,
	console:   console,
	setTimeout: setTimeout,
	setInterval: setInterval,
});

var Raphael = doc.defaultView.Raphael;

var CHARS = process.argv[3] || 'ABCÇDEFGHIİJKLMNOÖPQRSŞTUÜVWXYZ ÀÈÌÒÙ ÁĆÉÍĹŃÓŔŚÚÝŹ ÂĈÊĜĤÎĴÔŜÛŴŶ ǍČĎĚŇŘŠŤŽ ÃÑÕŨ ÅŮ ÄËÏŸ ĄĘĮŲ ÆŒ Ţ ĢĶĻŅȘȚ ĐŁØ ŐŰ ĂĞ ĀĒĪŪ ĖŻ ÞĽ @°-¿?*±+-~()&"\'¡!/:,. 0123456789'.replace(/\s/g, "");

var $ = cheerio.load(fs.readFileSync(process.argv[2]), {xmlMode: true});
var svg = cheerio.load($.html());
svg("svg").empty();

var paths = [ ];
$("path").each(function() {
	var t = $(this);
	paths.push({
		bbox: Raphael.pathBBox(t.attr("d")),
		el: t
	});
});

paths.sort(function(a, b) {
	return a.bbox.x - b.bbox.x;
});

paths.forEach(function(it, i) {
	if(i >= CHARS.length)
		return;
	
	var t = cheerio.load(svg.html());
	t("svg").append($('<g transform="translate(' + (-it.bbox.x) + ',0)"/>').append(it.el))
		.attr("width", it.bbox.width);
		
	var char = CHARS.charAt(i);
	var files = [ char == "/" ? "%2f" : char ];
	
	// There U+00D0 and U+0110 look the same
	if(char == "Đ") files.push("Ð");
	else if(char == "Ð") files.push("Đ");

	// Make lowercase copy
	files.forEach(function(it) {
		if(it.toLowerCase() != it && it.toLowerCase().length == 1)
			files.push(it.toLowerCase());
	});
	
	var str = t.html();
	files.forEach(function(it) {
		fs.writeFileSync("out/"+it+".svg", str);
	});
});
