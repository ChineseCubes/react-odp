all ::
	-rm ../LRRH-Demo.epub
	zip -rX ../LRRH-Demo.epub mimetype *.xhtml package.opf META-INF LRRH css fonts js images

SCRIPT = ./ls/build/gen.ls
gen ::
	$(SCRIPT) ./LRRH/ 1 > page1.xhtml
	$(SCRIPT) ./LRRH/ 2 > page2.xhtml
	$(SCRIPT) ./LRRH/ 3 > page3.xhtml
	$(SCRIPT) ./LRRH/ 4 > page4.xhtml
	$(SCRIPT) ./LRRH/ 5 > page5.xhtml
	$(SCRIPT) ./LRRH/ 6 > page6.xhtml
	$(SCRIPT) ./LRRH/ 7 > page7.xhtml
	$(SCRIPT) ./LRRH/ 8 > page8.xhtml
	$(SCRIPT) ./LRRH/ 9 > page9.xhtml
	$(SCRIPT) ./LRRH/ 10 > page10.xhtml
	$(SCRIPT) ./LRRH/ 11 > page11.xhtml
	$(SCRIPT) ./LRRH/ 12 > page12.xhtml
	$(SCRIPT) ./LRRH/ 13 > page13.xhtml

ttf ::
	@perl -Mutf8 -CSD -nE 's/[\x00-\xff]//g; $$_{$$_}++ for split //; END { say for qw[Open("SourceHanSansTW-Regular.ttf") Select(0u3000)]; printf qq[SelectMore(0u%04x) #%s\n], $$_, chr $$_ for grep { $$_ > 10000 } map ord, sort keys %_; say for qw[SelectInvert() Clear() Generate("fonts/Noto-subset.ttf")]} ' */dict.json *xhtml | fontforge -script
