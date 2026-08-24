import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronLeft, ChevronRight, MapPin, Phone, Clock,
  Instagram, MessageCircle, Star, ArrowRight, Navigation, UtensilsCrossed,
} from "lucide-react";

/* =============================================================================
   SAVORÉ — Landing page de restaurante (demo / rascunho)
   -----------------------------------------------------------------------------
   ONDE SUBSTITUIR O CONTEÚDO REAL (tudo centralizado, nada espalhado no JSX):
     - Nome, slogan, endereço, telefone, WhatsApp, Instagram, horários -> objeto `restaurant`
     - Caminhos de imagem                                              -> objeto `images`
     - Itens do cardápio completo                                      -> array `menuData`
     - Pratos em destaque                                              -> array `featuredDishes`
     - Depoimentos                                                     -> array `testimonials`
     - Fotos da galeria                                                -> array `galleryImages`
     - Logo: troque o texto "SAVORÉ" no <Header> e no <Footer> por um <img>

   Em um projeto Next.js real, cada bloco comentado abaixo (components/, constants/)
   viraria um arquivo próprio dentro de components/restaurant/ e constants/.
   As imagens usam os caminhos exatos que devem existir em public/images/restaurant/
   quando as fotos reais chegarem. Até lá, o componente <Photo> exibe um placeholder
   elegante automaticamente (veja a seção "Photo" mais abaixo).
============================================================================= */

/* ---------------------------- design tokens -------------------------------- */
const buttonPrimary =
  "inline-flex items-center gap-2 bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors px-7 py-3.5 text-sm tracking-wide uppercase font-medium rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200";

const buttonOutline =
  "inline-flex items-center gap-2 border border-stone-400 text-stone-100 hover:border-amber-400 hover:text-amber-400 transition-colors px-7 py-3.5 text-sm tracking-wide uppercase font-medium rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

const buttonGhostLight =
  "inline-flex items-center gap-2 text-stone-900 hover:text-amber-600 text-sm tracking-wide uppercase border-b border-stone-900 hover:border-amber-600 pb-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";

const displayFont = { fontFamily: "'Fraunces', serif" };
const bodyFont = { fontFamily: "'Work Sans', sans-serif" };

/* ------------------------- constants/restaurant.js -------------------------- */
const restaurant = {
  name: "SAVORÉ",
  slogan: "Sabores que transformam momentos.",
  since: "2018",
  address: "Rua das Oliveiras, 245 — Jardins, São Paulo - SP",
  phone: "(11) 4002-8922",
  phoneRaw: "+551140028922",
  whatsapp: "5511999999999",
  instagram: "@savore.restaurante",
  hours: [
    { days: "Terça a Sexta", time: "18h às 23h30" },
    { days: "Sábado", time: "12h às 00h" },
    { days: "Domingo", time: "12h às 17h" },
    { days: "Segunda", time: "Fechado" },
  ],
};

function whatsappLink(message) {
  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* --------------------------- constants/images.js ----------------------------
   PRODUÇÃO: substitua os arquivos dentro de public/images/restaurant/
   mantendo exatamente estes nomes — nenhuma outra alteração será necessária.
--------------------------------------------------------------------------- */
const images = {
  hero: "/images/restaurant/hero.jpg",
  story: "/images/restaurant/story.jpg",
  reservation: "/images/restaurant/reserva-bg.jpg",
  finalCta: "/images/restaurant/cta-final.jpg",
  dishes: {
    dish01: "/images/restaurant/dish-01.jpg",
    dish02: "/images/restaurant/dish-02.jpg",
    dish03: "/images/restaurant/dish-03.jpg",
    dish04: "/images/restaurant/dish-04.jpg",
  },
  experience: {
    salao: "/images/restaurant/ambiente-salao.jpg",
    detalhe: "/images/restaurant/ambiente-detalhe.jpg",
    jantar: "/images/restaurant/ambiente-pessoas.jpg",
    prato: "/images/restaurant/ambiente-prato.jpg",
  },
  gallery: {
    g1: "/images/restaurant/galeria-01.jpg",
    g2: "/images/restaurant/galeria-02.jpg",
    g3: "/images/restaurant/galeria-03.jpg",
    g4: "/images/restaurant/galeria-04.jpg",
    g5: "/images/restaurant/galeria-05.jpg",
    g6: "/images/restaurant/galeria-06.jpg",
    g7: "/images/restaurant/galeria-07.jpg",
    g8: "/images/restaurant/galeria-08.jpg",
  },
};

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

/* ----------------------------- constants/menu.js ----------------------------- */
const menuData = [
  {
    id: "entradas", roman: "I", label: "Entradas",
    items: [
      { name: "Carpaccio de filé com alcaparras", description: "Fatias finas de filé mignon, azeite trufado, lascas de parmesão e rúcula selvagem.", price: "R$ 42" },
      { name: "Tartare de salmão defumado", description: "Salmão curado na casa, avocado, gergelim tostado e toast de brioche.", price: "R$ 48" },
      { name: "Burrata com tomates confit", description: "Burrata cremosa, tomates assados lentamente, manjericão e pesto.", price: "R$ 39" },
    ],
  },
  {
    id: "principais", roman: "II", label: "Principais",
    items: [
      { name: "Filé ao molho de vinho do Porto", description: "Filé mignon grelhado, redução de vinho do Porto, purê de mandioquinha.", price: "R$ 98" },
      { name: "Peixe branco em crosta de ervas", description: "Peixe do dia, crosta de ervas finas, legumes salteados e beurre blanc.", price: "R$ 89" },
      { name: "Risoto de cogumelos selvagens", description: "Arbóreo cremoso, mix de cogumelos, trufa negra e parmesão 24 meses.", price: "R$ 76" },
    ],
  },
  {
    id: "massas", roman: "III", label: "Massas",
    items: [
      { name: "Tagliatelle ao ragù de 12 horas", description: "Massa fresca da casa, ragù de carnes lentamente cozido, parmesão.", price: "R$ 68" },
      { name: "Ravioli de queijo e nozes", description: "Recheio artesanal, manteiga de sálvia e nozes tostadas.", price: "R$ 72" },
      { name: "Linguine aos frutos do mar", description: "Camarões, lula e mexilhões, molho leve de tomate e ervas frescas.", price: "R$ 84" },
    ],
  },
  {
    id: "carnes", roman: "IV", label: "Carnes",
    items: [
      { name: "Costela braseada 18 horas", description: "Costela bovina, redução própria, purê trufado.", price: "R$ 94" },
      { name: "Cordeiro ao alecrim", description: "Carré de cordeiro, crosta de ervas, molho de alecrim.", price: "R$ 108" },
      { name: "Picanha na brasa", description: "Corte nobre grelhado no ponto, farofa artesanal e vinagrete.", price: "R$ 89" },
    ],
  },
  {
    id: "sobremesas", roman: "V", label: "Sobremesas",
    items: [
      { name: "Fondant de chocolate 70%", description: "Centro cremoso, sorvete de baunilha bourbon.", price: "R$ 34" },
      { name: "Crème brûlée de baunilha", description: "Clássico francês, baunilha de Madagascar.", price: "R$ 32" },
      { name: "Tarte tatin de maçã", description: "Massa amanteigada, caramelo e chantilly.", price: "R$ 36" },
    ],
  },
  {
    id: "bebidas", roman: "VI", label: "Bebidas",
    items: [
      { name: "Seleção de vinhos", description: "Carta com rótulos nacionais e importados.", price: "Consulte" },
      { name: "Coquetéis autorais", description: "Criações exclusivas da casa.", price: "R$ 38" },
      { name: "Águas e refrigerantes", description: "Com e sem gás, opções artesanais.", price: "R$ 12" },
    ],
  },
];

/* -------------------------- constants/dishes.js (destaque) ------------------- */
const featuredDishes = [
  { id: "d1", name: "Filé ao molho de vinho do Porto", description: "Filé mignon grelhado, redução de vinho do Porto e purê de mandioquinha.", price: "R$ 98", category: "Principal", image: images.dishes.dish01, label: "dish-01.jpg" },
  { id: "d2", name: "Risoto de cogumelos selvagens", description: "Arbóreo cremoso, mix de cogumelos, trufa negra e parmesão 24 meses.", price: "R$ 76", category: "Assinatura", image: images.dishes.dish02, label: "dish-02.jpg" },
  { id: "d3", name: "Tagliatelle ao ragù de 12 horas", description: "Massa fresca da casa com ragù de carnes lentamente cozido.", price: "R$ 68", category: "Massa", image: images.dishes.dish03, label: "dish-03.jpg" },
  { id: "d4", name: "Fondant de chocolate 70%", description: "Centro cremoso e sorvete de baunilha bourbon.", price: "R$ 34", category: "Sobremesa", image: images.dishes.dish04, label: "dish-04.jpg" },
];

/* ----------------------------- constants/testimonials.js --------------------- */
const testimonials = [
  { id: "t1", name: "Marina Costa", rating: 5, comment: "Uma experiência completa, do atendimento à última colher da sobremesa. Já virou parada obrigatória." },
  { id: "t2", name: "Rafael Nunes", rating: 5, comment: "O risoto de cogumelos é de outro nível. Ambiente lindo, luz baixa, clima perfeito para uma noite especial." },
  { id: "t3", name: "Juliana Prado", rating: 4, comment: "Comida impecável e equipe muito atenciosa. Voltarei para experimentar o restante do cardápio." },
  { id: "t4", name: "Eduardo Lima", rating: 5, comment: "Reservei para comemorar um aniversário e superou todas as expectativas. Recomendo demais." },
];

/* ------------------------------ constants/gallery.js -------------------------- */
const galleryImages = [
  { id: "g1", src: images.gallery.g1, alt: "Salão do restaurante ao entardecer", label: "galeria-01.jpg", tall: true },
  { id: "g2", src: images.gallery.g2, alt: "Prato de massa fresca finalizado", label: "galeria-02.jpg" },
  { id: "g3", src: images.gallery.g3, alt: "Detalhe de talheres e guardanapo de linho", label: "galeria-03.jpg" },
  { id: "g4", src: images.gallery.g4, alt: "Chef finalizando prato na cozinha", label: "galeria-04.jpg", wide: true },
  { id: "g5", src: images.gallery.g5, alt: "Taça de vinho sobre mesa posta", label: "galeria-05.jpg" },
  { id: "g6", src: images.gallery.g6, alt: "Pessoas brindando à mesa", label: "galeria-06.jpg", tall: true },
  { id: "g7", src: images.gallery.g7, alt: "Sobremesa emplatada com detalhes finos", label: "galeria-07.jpg" },
  { id: "g8", src: images.gallery.g8, alt: "Fachada e entrada do restaurante à noite", label: "galeria-08.jpg" },
];

/* --------------------------------- hooks ------------------------------------ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/* ------------------------------ small pieces --------------------------------- */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Work+Sans:wght@300;400;500;600&display=swap');

      html { scroll-behavior: auto; }
      @media (prefers-reduced-motion: no-preference) {
        html { scroll-behavior: smooth; }
      }

      @keyframes savoreFadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .savore-hero-item { opacity: 0; animation: savoreFadeUp 0.9s ease forwards; }

      .savore-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      .savore-reveal-visible { opacity: 1; transform: translateY(0); }

      @keyframes savoreScrollPulse {
        0%, 100% { transform: scaleY(1); opacity: 0.6; }
        50% { transform: scaleY(0.45); opacity: 1; }
      }
      .savore-scroll-indicator { animation: savoreScrollPulse 2s ease-in-out infinite; transform-origin: top; }

      @media (prefers-reduced-motion: reduce) {
        .savore-hero-item, .savore-reveal, .savore-scroll-indicator {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`savore-reveal ${inView ? "savore-reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* Photo: usa o caminho real de `images` quando existir; caso o arquivo ainda não
   exista (caso deste rascunho), cai automaticamente num placeholder elegante —
   assim a página fica pronta para apresentação mesmo antes das fotos reais. */
function Photo({ src, alt, label, className = "", style }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = failed || !src;
  return (
    <div className={`relative overflow-hidden bg-stone-900 ${className}`} style={style}>
      {showPlaceholder ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950"
          role="img"
          aria-label={alt}
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <UtensilsCrossed className="w-7 h-7 text-amber-400" style={{ opacity: 0.7 }} strokeWidth={1.25} aria-hidden="true" />
            <span className="uppercase text-stone-400" style={{ ...bodyFont, fontSize: "11px", letterSpacing: "0.15em" }}>
              {label}
            </span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{ color: i < rating ? "#fbbf24" : "#44403c" }}
          fill={i < rating ? "#fbbf24" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* --------------------------------- Header ------------------------------------ */
function MobileDrawer({ open, onClose, firstLinkRef }) {
  return (
    <div
      id="mobile-drawer"
      className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Menu de navegação"
    >
      <div className="absolute inset-0 bg-stone-950" style={{ opacity: open ? 0.7 : 0 }} onClick={onClose} />
      <div
        className={`absolute top-0 right-0 h-full w-5/6 max-w-sm bg-stone-950 border-l border-stone-800 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-stone-800">
          <span className="text-lg tracking-widest uppercase text-stone-50" style={displayFont}>{restaurant.name}</span>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 inline-flex items-center justify-center text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col justify-center gap-2 px-8" aria-label="Navegação móvel">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              ref={i === 0 ? firstLinkRef : null}
              tabIndex={open ? 0 : -1}
              onClick={onClose}
              className="py-3 text-2xl text-stone-100 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 transition-colors"
              style={displayFont}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="p-8 border-t border-stone-800">
          <a href="#reserva" tabIndex={open ? 0 : -1} onClick={onClose} className={`${buttonPrimary} w-full justify-center`}>
            Reservar mesa
          </a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      firstLinkRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${scrolled ? "backdrop-blur-md" : ""}`}
      style={{ backgroundColor: scrolled ? "rgba(12,10,9,0.88)" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* SUBSTITUIR: trocar o texto abaixo por <img src={...} alt="Logo SAVORÉ" /> quando houver identidade visual */}
          <a
            href="#inicio"
            className="text-2xl tracking-widest uppercase text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-4"
            style={displayFont}
          >
            {restaurant.name}
          </a>

          <nav className="hidden lg:flex items-center gap-10" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide uppercase text-stone-200 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-4 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a href="#reserva" className={buttonPrimary}>Reservar mesa</a>
          </div>

          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => { setOpen(false); menuBtnRef.current?.focus(); }}
        firstLinkRef={firstLinkRef}
      />
    </header>
  );
}

/* ---------------------------------- Hero -------------------------------------- */
function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-end scroll-mt-24 overflow-hidden bg-stone-950">
      <Photo
        src={images.hero}
        alt="Prato principal do SAVORÉ em composição elegante, servido em ambiente de luz baixa"
        label="hero.jpg — 1600×1000"
        className="absolute inset-0 w-full h-full"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(12,10,9,0.55) 0%, rgba(12,10,9,0.35) 35%, rgba(12,10,9,0.92) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 sm:pb-24 w-full">
        <div className="max-w-2xl">
          <p className="savore-hero-item text-amber-400 text-xs sm:text-sm tracking-widest uppercase mb-5" style={{ ...bodyFont, animationDelay: "0.1s" }}>
            Uma experiência à mesa
          </p>
          <h1 className="savore-hero-item text-stone-50 text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6" style={{ ...displayFont, fontWeight: 500, animationDelay: "0.25s" }}>
            Sabores que transformam momentos.
          </h1>
          <p className="savore-hero-item text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10" style={{ animationDelay: "0.4s" }}>
            Uma experiência gastronômica criada para quem aprecia ingredientes especiais, sabores marcantes e momentos inesquecíveis.
          </p>
          <div className="savore-hero-item flex flex-wrap gap-4" style={{ animationDelay: "0.55s" }}>
            <a href="#reserva" className={buttonPrimary}>Reservar uma mesa</a>
            <a href="#cardapio" className={buttonOutline}>Conhecer o cardápio</a>
          </div>
        </div>

        <div className="savore-hero-item mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-stone-300 text-sm" style={{ animationDelay: "0.7s" }}>
          <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />Ter–Dom, a partir das 12h</span>
          <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" aria-hidden="true" />Jardins, São Paulo</span>
        </div>
      </div>

      <a
        href="#sobre"
        className="hidden sm:flex absolute bottom-8 right-8 flex-col items-center gap-2 text-stone-300 text-xs tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        aria-label="Rolar para a próxima seção"
      >
        <span className="savore-scroll-indicator w-px h-12 bg-stone-400" aria-hidden="true" />
        Rolar
      </a>
    </section>
  );
}

/* ------------------------------- StorySection ---------------------------------- */
function StorySection() {
  return (
    <section id="sobre" className="scroll-mt-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <Reveal className="lg:col-span-7 lg:order-2">
            <Photo
              src={images.story}
              alt="Interior aconchegante do SAVORÉ, com mesas postas e iluminação baixa"
              label="story.jpg — 1200×1500"
              className="w-full rounded-sm shadow-2xl"
              style={{ aspectRatio: "4 / 5" }}
            />
          </Reveal>

          <Reveal className="lg:col-span-5 lg:order-1" delay={120}>
            <p className="text-amber-600 text-xs sm:text-sm tracking-widest uppercase mb-4">Nossa história</p>
            <h2 className="text-stone-900 text-4xl sm:text-5xl leading-tight mb-6" style={{ ...displayFont, fontWeight: 500 }}>
              Mais do que uma refeição. Uma experiência.
            </h2>
            {/* SUBSTITUIR: texto institucional real do restaurante */}
            <p className="text-stone-600 leading-relaxed mb-4">
              O {restaurant.name} nasceu do desejo de transformar cada visita em uma lembrança. Cada prato é pensado
              como parte de uma narrativa maior, onde técnica, ingredientes sazonais e hospitalidade se encontram à mesa.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Da cozinha à sala, cada detalhe é cuidado para que o tempo passe devagar — e o momento fique.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 mb-8 text-sm text-stone-500">
              <span>Desde {restaurant.since}</span>
              <span aria-hidden="true">•</span>
              <span>Ingredientes selecionados</span>
              <span aria-hidden="true">•</span>
              <span>Experiência gastronômica</span>
            </div>
            <a href="#experiencia" className={buttonGhostLight}>
              Conheça nossa história <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FeaturedDishes ---------------------------------- */
function FeaturedDishes() {
  return (
    <section className="bg-stone-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal className="max-w-xl mb-14">
          <p className="text-amber-400 text-xs sm:text-sm tracking-widest uppercase mb-4">Cardápio em destaque</p>
          <h2 className="text-stone-50 text-4xl sm:text-5xl leading-tight" style={{ ...displayFont, fontWeight: 500 }}>
            Uma seleção para despertar seus sentidos
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish, i) => (
            <Reveal key={dish.id} delay={i * 90}>
              <article className="group">
                <div className="relative overflow-hidden rounded-sm mb-4" style={{ aspectRatio: "3 / 4" }}>
                  <Photo
                    src={dish.image}
                    alt={dish.name}
                    label={dish.label}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute top-4 left-4 text-xs tracking-widest uppercase text-stone-100 px-3 py-1 rounded-sm"
                    style={{ backgroundColor: "rgba(12,10,9,0.6)", backdropFilter: "blur(4px)" }}
                  >
                    {dish.category}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-stone-50 text-lg" style={displayFont}>{dish.name}</h3>
                  <span className="text-amber-400 text-sm whitespace-nowrap pt-1">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm mt-2 leading-relaxed">{dish.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ExperienceSection --------------------------------- */
function ExperienceSection() {
  return (
    <section id="experiencia" className="scroll-mt-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal className="max-w-xl mb-14">
          <p className="text-amber-600 text-xs sm:text-sm tracking-widest uppercase mb-4">O ambiente</p>
          <h2 className="text-stone-900 text-4xl sm:text-5xl leading-tight" style={{ ...displayFont, fontWeight: 500 }}>
            O ambiente também faz parte da experiência.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          <Reveal className="col-span-2 lg:col-span-7">
            <Photo
              src={images.experience.salao}
              alt="Salão do restaurante com mesas postas e iluminação ambiente"
              label="ambiente-salao.jpg"
              className="w-full rounded-sm"
              style={{ aspectRatio: "16 / 10" }}
            />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={80}>
            <Photo
              src={images.experience.detalhe}
              alt="Detalhe da decoração da mesa"
              label="ambiente-detalhe.jpg"
              className="w-full h-full rounded-sm"
              style={{ aspectRatio: "4 / 5" }}
            />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={140}>
            <Photo
              src={images.experience.jantar}
              alt="Pessoas jantando em clima intimista"
              label="ambiente-pessoas.jpg"
              className="w-full rounded-sm"
              style={{ aspectRatio: "4 / 3" }}
            />
          </Reveal>
          <Reveal className="col-span-2 lg:col-span-7" delay={200}>
            <Photo
              src={images.experience.prato}
              alt="Prato sendo finalizado pelo chef"
              label="ambiente-prato.jpg"
              className="w-full rounded-sm"
              style={{ aspectRatio: "16 / 9" }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- MenuSection ------------------------------------ */
function MenuSection() {
  const [active, setActive] = useState(menuData[0].id);
  const activeCategory = menuData.find((c) => c.id === active);

  return (
    <section id="cardapio" className="scroll-mt-24 bg-stone-950">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal className="text-center max-w-xl mx-auto mb-12">
          <p className="text-amber-400 text-xs sm:text-sm tracking-widest uppercase mb-4">Cardápio</p>
          <h2 className="text-stone-50 text-4xl sm:text-5xl leading-tight" style={{ ...displayFont, fontWeight: 500 }}>
            Uma jornada por categorias
          </h2>
        </Reveal>

        <div role="tablist" aria-label="Categorias do cardápio" className="flex flex-wrap justify-center gap-2 mb-12">
          {menuData.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                onClick={() => setActive(cat.id)}
                className={`px-5 py-2.5 text-sm tracking-wide uppercase transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  isActive ? "bg-amber-400 text-stone-950" : "text-stone-300 hover:text-amber-400 border border-stone-800"
                }`}
              >
                <span aria-hidden="true" className="mr-2">{cat.roman}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${activeCategory.id}`}
          aria-labelledby={`tab-${activeCategory.id}`}
          className="grid sm:grid-cols-2 gap-x-10 gap-y-8"
        >
          {activeCategory.items.map((item) => (
            <div key={item.name} className="flex items-start justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <h3 className="text-stone-50 text-lg mb-1" style={displayFont}>{item.name}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
              </div>
              <span className="text-amber-400 whitespace-nowrap pt-1">{item.price}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href={whatsappLink(`Olá! Gostaria de receber o cardápio completo do ${restaurant.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonOutline}
          >
            Ver cardápio completo
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Gallery -------------------------------------- */
function Lightbox({ images: imgs, index, onClose, onNavigate }) {
  const closeBtnRef = useRef(null);
  const current = imgs[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % imgs.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + imgs.length) % imgs.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, imgs.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Imagem ${index + 1} de ${imgs.length}: ${current.alt}`}
    >
      <div className="absolute inset-0 bg-stone-950" style={{ opacity: 0.95 }} onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 w-11 h-11 inline-flex items-center justify-center text-stone-200 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          aria-label="Fechar galeria"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        <Photo src={current.src} alt={current.alt} label={current.label} className="w-full rounded-sm" style={{ aspectRatio: "16 / 10" }} />

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => onNavigate((index - 1 + imgs.length) % imgs.length)}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" /> Anterior
          </button>
          <span className="text-stone-500 text-sm">{index + 1} / {imgs.length}</span>
          <button
            type="button"
            onClick={() => onNavigate((index + 1) % imgs.length)}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Próxima imagem"
          >
            Próxima <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section id="galeria" className="scroll-mt-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal className="max-w-xl mb-14">
          <p className="text-amber-600 text-xs sm:text-sm tracking-widest uppercase mb-4">Galeria</p>
          <h2 className="text-stone-900 text-4xl sm:text-5xl leading-tight" style={{ ...displayFont, fontWeight: 500 }}>
            Um convite visual à experiência {restaurant.name}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" style={{ gridAutoRows: "160px" }}>
          {galleryImages.map((img, i) => (
            <Reveal
              key={img.id}
              delay={(i % 4) * 70}
              className={`${img.tall ? "row-span-2" : "row-span-1"} ${img.wide ? "col-span-2" : "col-span-1"}`}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="relative w-full h-full overflow-hidden rounded-sm group focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
                aria-label={`Ampliar imagem: ${img.alt}`}
              >
                <Photo src={img.src} alt={img.alt} label={img.label} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={galleryImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </section>
  );
}

/* --------------------------------- Testimonials ------------------------------------ */
function Testimonials() {
  return (
    <section className="bg-stone-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal className="max-w-xl mb-14">
          <p className="text-amber-400 text-xs sm:text-sm tracking-widest uppercase mb-4">Depoimentos</p>
          <h2 className="text-stone-50 text-4xl sm:text-5xl leading-tight" style={{ ...displayFont, fontWeight: 500 }}>
            Experiências que ficam na memória
          </h2>
        </Reveal>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory sm:overflow-visible pb-4 sm:pb-0">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 90} className="shrink-0 w-5/6 sm:w-auto">
              <div className="snap-center h-full bg-stone-950 border border-stone-800 rounded-sm p-7">
                <StarRow rating={t.rating} />
                <p className="text-stone-300 leading-relaxed mt-4 mb-6">&ldquo;{t.comment}&rdquo;</p>
                <p className="text-stone-100 text-sm tracking-wide" style={displayFont}>{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- ReservationCTA ------------------------------------ */
function ReservationCTA() {
  return (
    <section id="reserva" className="relative scroll-mt-24 bg-stone-950">
      <Photo
        src={images.reservation}
        alt="Mesa reservada com talheres dispostos, pronta para receber convidados"
        label="reserva-bg.jpg"
        className="absolute inset-0 w-full h-full"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(12,10,9,0.85) 0%, rgba(12,10,9,0.92) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-28 sm:py-36 text-center">
        <Reveal>
          <p className="text-amber-400 text-xs sm:text-sm tracking-widest uppercase mb-5">Reservas</p>
          <h2 className="text-stone-50 text-4xl sm:text-5xl leading-tight mb-6" style={{ ...displayFont, fontWeight: 500 }}>
            Sua mesa está esperando por você.
          </h2>
          <p className="text-stone-300 leading-relaxed mb-10 max-w-xl mx-auto">
            Reserve seu momento e venha viver uma experiência gastronômica especial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={whatsappLink(`Olá! Gostaria de reservar uma mesa no ${restaurant.name}.`)} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> Reservar pelo WhatsApp
            </a>
            {/* SUBSTITUIR: conectar a um sistema real de reservas (ex.: OpenTable, Sympla, API própria) */}
            <a href="#contato" className={buttonOutline}>Fazer reserva</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- LocationSection ------------------------------------ */
function LocationSection() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;
  return (
    <section id="contato" className="scroll-mt-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-amber-600 text-xs sm:text-sm tracking-widest uppercase mb-4">Localização</p>
            <h2 className="text-stone-900 text-4xl sm:text-5xl leading-tight mb-8" style={{ ...displayFont, fontWeight: 500 }}>
              Venha nos visitar
            </h2>

            <dl className="space-y-5 text-stone-700 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div><dt className="sr-only">Endereço</dt><dd>{restaurant.address}</dd></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Horário de funcionamento</dt>
                  <dd>
                    <ul>
                      {restaurant.hours.map((h) => (<li key={h.days}>{h.days}: {h.time}</li>))}
                    </ul>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Telefone</dt>
                  <dd>
                    <a href={`tel:${restaurant.phoneRaw}`} className="hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600">
                      {restaurant.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Instagram</dt>
                  <dd>
                    <a
                      href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
                    >
                      {restaurant.instagram}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={buttonGhostLight}>
              Como chegar <Navigation className="w-4 h-4" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={120}>
            {/* SUBSTITUIR: incorporar aqui um Google Maps embed real (iframe) apontando para o endereço final */}
            <div
              className="w-full rounded-sm border border-stone-200 flex items-center justify-center bg-stone-100"
              style={{ aspectRatio: "4 / 3" }}
            >
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <MapPin className="w-7 h-7 text-amber-600" strokeWidth={1.25} aria-hidden="true" />
                <span className="text-stone-500 text-sm uppercase tracking-widest">Mapa — a ser incorporado</span>
                <span className="text-stone-400 text-xs">(ex.: Google Maps embed)</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- FinalCTA -------------------------------------- */
function FinalCTA() {
  return (
    <section className="relative bg-stone-950">
      <Photo
        src={images.finalCta}
        alt="Composição de pratos e taças em mesa elegante"
        label="cta-final.jpg"
        className="absolute inset-0 w-full h-full"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(12,10,9,0.75) 0%, rgba(12,10,9,0.9) 100%)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-28 sm:py-32 text-center">
        <Reveal>
          <h2 className="text-stone-50 text-4xl sm:text-5xl leading-tight mb-8" style={{ ...displayFont, fontWeight: 500 }}>
            Seu próximo momento especial começa aqui.
          </h2>
          <a href="#reserva" className={buttonPrimary}>Reservar uma mesa</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------- Footer --------------------------------------- */
function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            {/* SUBSTITUIR: trocar por <img> do logo real quando disponível */}
            <p className="text-2xl tracking-widest uppercase text-stone-50 mb-4" style={displayFont}>{restaurant.name}</p>
            <p className="text-stone-400 text-sm leading-relaxed">{restaurant.slogan}</p>
          </div>
          <div>
            <p className="text-stone-200 text-sm uppercase tracking-widest mb-4">Navegação</p>
            <ul className="space-y-2 text-stone-400 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-stone-200 text-sm uppercase tracking-widest mb-4">Contato</p>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li>{restaurant.address}</li>
              <li>
                <a href={`tel:${restaurant.phoneRaw}`} className="hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
                  {restaurant.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                >
                  {restaurant.instagram}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-stone-200 text-sm uppercase tracking-widest mb-4">Horário</p>
            <ul className="space-y-2 text-stone-400 text-sm">
              {restaurant.hours.map((h) => (<li key={h.days}>{h.days}: {h.time}</li>))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <span>© {new Date().getFullYear()} {restaurant.name}. Todos os direitos reservados.</span>
          <span>Landing page demo — conteúdo e imagens provisórios</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------- App ---------------------------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-stone-950" style={bodyFont}>
      <GlobalStyles />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-amber-400 focus:text-stone-950 focus:px-4 focus:py-2 focus:rounded-sm"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="main-content">
        <Hero />
        <StorySection />
        <FeaturedDishes />
        <ExperienceSection />
        <MenuSection />
        <Gallery />
        <Testimonials />
        <ReservationCTA />
        <LocationSection />
      </main>

      <FinalCTA />
      <Footer />
    </div>
  );
}
