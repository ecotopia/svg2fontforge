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

var CHARS = 'ABCÇDEFGHIİJKLMNOÖPQRSŞTUÜVWXYZ ÀÈÌÒÙ ÁĆÉÍĹŃÓŔŚÚÝŹ ÂĈÊĜĤÎĴÔŜÛŴŶ ǍČĎĚŇŘŠŤŽ ÃÑÕŨ ÅŮ ÄËÏŸ ĄĘŲ ÆŒ Ţ ĢĶĻȘȚ ĐŁØ ŐŰ ĂĞ ŻÞĽ @°-¿?*±+-()&"\'¡!/:,. 0123456789';

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
	var t = cheerio.load(svg.html());
	t("svg").append($('<g transform="translate(' + (-it.bbox.x) + ',0)"/>').append(it.el))
		.attr("width", it.bbox.width);

	fs.writeFileSync("out/"+CHARS.charAt(i)+".svg", t.html());
});