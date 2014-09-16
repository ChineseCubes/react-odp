all ::
	-rm ../LRRH-Demo.epub
	zip -rX ../LRRH-Demo.epub mimetype *.xhtml package.opf META-INF LRRH css fonts js images


gen ::
	lsc -bpc gen.ls > gen.js
	chmod a+x gen.js
	slimerjs gen.js 1
	slimerjs gen.js 2
	slimerjs gen.js 3
	slimerjs gen.js 4
	slimerjs gen.js 5
	slimerjs gen.js 6
	slimerjs gen.js 7
	slimerjs gen.js 8
	slimerjs gen.js 9
	slimerjs gen.js 10
	slimerjs gen.js 11
	slimerjs gen.js 12
	slimerjs gen.js 13

