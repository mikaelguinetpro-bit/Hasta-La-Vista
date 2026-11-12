"""Construit les vitrinas à partir de leurs sources (ce dossier, maqueta/src/).

Depuis la racine du dépôt :  python3 maqueta/src/build.py maqueta ../hasta-la-vista/fuentes/

Repo layout:   maqueta/vitrina-*.html + maqueta/vitrina.css  (fonts from ../hasta-la-vista/fuentes/)
Flat layout:   <dir>/vitrina-*.html + <dir>/vitrina.css     (fonts from fuentes/)
"""
import re, sys, os, shutil
SRC = {'src-vitrina.html': 'vitrina-estrellas', 'src-stars-en.html': 'vitrina-stars', 'src-fr.html': 'vitrina-etoiles',
       'src-pt.html': 'vitrina-estrelas', 'src-ru.html': 'vitrina-zvezdy', 'src-ar.html': 'vitrina-nujum',
       'src-hi.html': 'vitrina-tare', 'src-bn.html': 'vitrina-tara', 'src-zh.html': 'vitrina-xingxing'}
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = [('Playfair Display', 'playfair-display', w, st) for w in (600, 700) for st in ('normal', 'italic')] + \
        [('DM Sans', 'dm-sans', w, 'normal') for w in (400, 500, 600, 700)] + [('DM Mono', 'dm-mono', w, 'normal') for w in (400, 500)]

def css_of(path):
    return re.search(r'<style>\n(.*?)</style>', open(path).read(), re.S).group(1)

def shared_css(font_dir):
    base = css_of(os.path.join(HERE, 'src-vitrina.html')).replace('/*FONTS*/\n', '')
    extra = []
    for f in ('src-ar.html', 'src-hi.html', 'src-bn.html', 'src-zh.html'):
        for line in css_of(os.path.join(HERE, f)).split('\n'):
            if line.strip().startswith(':lang(') and line not in base and line not in extra:
                extra.append(line)
    faces = ''.join(f"@font-face{{font-family:'{fam}';font-style:{st};font-weight:{w};font-display:swap;src:url('{font_dir}{f}-latin-{w}-{st}.woff2') format('woff2')}}\n" for fam, f, w, st in FONTS)
    head = '/* Hasta La Vista — estilos comunes de la vitrina (9 idiomas). Generado por build.py */\n'
    return head + faces + base + '\n'.join(extra) + '\n'

def build(out_dir, font_dir, link_map=None):
    os.makedirs(out_dir, exist_ok=True)
    open(os.path.join(out_dir, 'vitrina.css'), 'w').write(shared_css(font_dir))
    for src, name in SRC.items():
        s = open(os.path.join(HERE, src)).read()
        s = re.sub(r'<style>\n.*?</style>', '<link rel="stylesheet" href="vitrina.css">', s, count=1, flags=re.S)
        for a, b in (link_map or {}).items():
            s = s.replace(f'href="{a}"', f'href="{b}"')
        open(os.path.join(out_dir, name + '.html'), 'w').write(s)

if __name__ == '__main__':
    out, font_dir = sys.argv[1], sys.argv[2]
    build(out, font_dir)
    print('built', out)
