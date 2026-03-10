import os
import re
import glob

# The desktop replacement block (used for both root and en/ folders)
# We use a lambda or formatting to handle the relative path prefix
def get_desktop_replacement(prefix):
    return f"""<li class="dropdown">
                            <a href="{prefix}index.html#servicios">SERVICIOS <i class="fas fa-chevron-down" style="font-size:0.65rem;margin-left:3px;"></i></a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-submenu">
                                    <a href="{prefix}construccion.html">Construcción <i class="fas fa-chevron-down" style="font-size:0.6rem;margin-left:6px;"></i></a>
                                    <ul class="submenu">
                                        <li><a href="{prefix}promocionesdeviviendas.html">Promociones de viviendas</a></li>
                                        <li><a href="{prefix}viviendasindividuales.html">Villas con piscina</a></li>
                                    </ul>
                                </li>
                                <li><a href="{prefix}reformasintegrales.html">Reformas Integrales</a></li>
                                <li><a href="{prefix}disenodeinteriores.html">Diseño de Interiores</a></li>
                            </ul>
                        </li>"""

def get_mobile_replacement(prefix, filename):
    # This replaces everything inside the mobile-menu <ul> EXCEPT the language selector
    # Since we're parsing it, it's easier to just replace the whole <nav class="mobile-menu" ...> ... </nav>
    # We will pass the specific language links
    
    # If in root, spanish link is `filename`, english is `en/filename`
    # If in en/, spanish is `../filename`, english is `filename`
    if prefix == "":
        es_link = filename
        en_link = "en/" + filename
        lang_text = "Idioma"
        es_text = "Español"
        en_text = "English"
    else:
        es_link = "../" + filename
        en_link = filename
        lang_text = "Language"
        es_text = "Español"
        en_text = "English"

    return f"""    <!-- Menú Mobile - Estilo TriInfinity -->
    <nav class="mobile-menu" id="mobileMenu">
        <ul>
            <li><a href="{prefix}index.html#inicio">
                    <i class="fas fa-home"></i> Inicio</a></li>
            <li class="mobile-dropdown">
                <a href="#" class="dropdown-toggle">
                    <i class="fas fa-concierge-bell"></i> Servicios
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul class="dropdown-menu">
                    <li class="mobile-dropdown">
                        <a href="#" class="dropdown-toggle">
                            <i class="fas fa-hammer"></i> Construcción
                            <i class="fas fa-chevron-down dropdown-icon"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="{prefix}construccion.html">
                                    <i class="fas fa-building"></i> Construcción General</a></li>
                            <li><a href="{prefix}promocionesdeviviendas.html">
                                    <i class="fas fa-city"></i> Promociones de viviendas</a></li>
                            <li><a href="{prefix}viviendasindividuales.html">
                                    <i class="fas fa-swimming-pool"></i> Villas con piscina</a></li>
                        </ul>
                    </li>
                    <li><a href="{prefix}reformasintegrales.html">
                            <i class="fas fa-pencil-ruler"></i> Reformas Integrales</a></li>
                    <li><a href="{prefix}disenodeinteriores.html">
                            <i class="fas fa-couch"></i> Diseño de Interiores</a></li>
                </ul>
            </li>
            <li><a href="{prefix}index.html#proyectos">
                    <i class="fas fa-tags"></i> Venta</a></li>
            <li><a href="{prefix}alquiler.html">
                    <i class="fas fa-key"></i> Alquiler</a></li>
            <li><a href="{prefix}trasteros-mostoles.html">
                    <i class="fas fa-warehouse"></i> Trasteros</a></li>
            <li><a href="{prefix}index.html#contacto">
                    <i class="fas fa-envelope"></i> Contacto</a></li>
            <li class="mobile-dropdown">
                <a href="#" class="dropdown-toggle">
                    <i class="fas fa-globe"></i> {lang_text}
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="{es_link}">
                            <i class="fas fa-flag"></i> {es_text}</a></li>
                    <li><a href="{en_link}">
                            <i class="fas fa-flag"></i> {en_text}</a></li>
                </ul>
            </li>
        </ul>
    </nav>"""

# Regex patterns
# Desktop: match from <li><a href="...#servicios"> to <li><a href="...disenodeinteriores.html">DISEÑO</a></li>
desktop_pattern = re.compile(
    r'<li>\s*<a[^>]*?#servicios[^>]*>SERVICIOS</a>\s*</li>.*?<li>\s*<a[^>]*?disenodeinteriores\.html[^>]*>DISEÑ?[O|o]</a>\s*</li>',
    re.DOTALL | re.IGNORECASE
)

# Mobile: match the entire nav
mobile_pattern = re.compile(
    r'<!-- Menú Mobile -->\s*<nav class="mobile-menu" id="mobileMenu">.*?</nav>',
    re.DOTALL
)

mobile_pattern_alt = re.compile(
    r'<nav class="mobile-menu" id="mobileMenu">.*?</nav>',
    re.DOTALL
)

def process_file(filepath):
    # skip index.html in root since it's already done
    if os.path.basename(filepath) == 'index.html' and os.path.dirname(filepath).endswith('unero'):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content
    filename = os.path.basename(filepath)
    is_en = 'unero\\en' in filepath or 'unero/en' in filepath
    prefix = '../' if is_en else ''

    # Desktop replacement
    content = desktop_pattern.sub(get_desktop_replacement(prefix), content)

    # Mobile replacement
    mobile_repl = get_mobile_replacement(prefix, filename)
    if '<!-- Menú Mobile -->' in content:
        content = mobile_pattern.sub(mobile_repl, content)
    else:
        # Some might not have the comment
        content = mobile_pattern_alt.sub(mobile_repl, content)

    if orig_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes made to {filepath} - perhaps format differs")

# Find all HTML files
base_dir = r"c:\Users\twitc\Desktop\unero"
html_files = glob.glob(os.path.join(base_dir, "*.html"))
en_html_files = glob.glob(os.path.join(base_dir, "en", "*.html"))

for f in html_files + en_html_files:
    process_file(f)

print("Done")
