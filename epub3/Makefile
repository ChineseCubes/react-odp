all ::
	-rm ../LRRH-Demo.epub
	zip -rX ../LRRH-Demo.epub mimetype *.xhtml package.opf META-INF LRRH css fonts js images


gen ::
	i=1 ; while [[ $$i -le 13 ]] ; do \
		./ls/build/gen.ls ./LRRH/ $$i > page$${i}.xhtml ; \
		echo page$${i}.xhtml ; \
		((i = i + 1)) ; \
	done

ttf ::
	@perl -Mutf8 -CSD -nE 's/[\x00-\xff]//g; $$_{$$_}++ for split //; END { say for qw[Open("SourceHanSansTW-Regular.ttf") Select(0u3000)]; printf qq[SelectMore(0u%04x) #%s\n], $$_, chr $$_ for grep { $$_ > 10000 } map ord, sort keys %_; say for qw[SelectInvert() Clear() Generate("fonts/Noto-subset.ttf")]} ' */dict.json *xhtml | fontforge -script
