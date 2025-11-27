import React, { useState, useEffect, useRef } from 'react';
import { MemoryRouter, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Info, Phone, Instagram, MapPin, X, Plus, Minus, ChevronRight, UtensilsCrossed, Wine, ChevronDown, ChevronUp, Quote, User, LayoutGrid, List, ArrowLeft, Check, Sparkles, Gift, Loader2, Wheat, Beef, Grape } from 'lucide-react';

/**
 * --- CONFIGURACIÓN GEMINI API ---
 * IMPORTANTE: Para que la IA funcione, debes colocar tu API Key aquí abajo.
 * Puedes obtener una gratis en: https://aistudio.google.com/app/apikey
 */
const apiKey = "AIzaSyB3X4wKWYT75ljiPDFNE2BleJQNI0N41UY"; 

const callGeminiAPI = async (prompt) => {
  // Validación de seguridad: Si no hay API Key, no intentamos la llamada
  if (!apiKey) {
    console.warn("Falta la API Key de Gemini.");
    return "⚠️ Para usar esta función, necesitas configurar tu API Key en el código (línea 10).";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la API');
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    return "Hubo un error de conexión con la IA. Intenta más tarde.";
  }
};

/**
 * --- DATOS DE LA APLICACIÓN ---
 */
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "The Classic Graze",
    description: "La combinación perfecta para cualquier reunión.",
    longDescription: "Nuestra tabla insignia es el equilibrio perfecto entre sabor y estética. Diseñada para complacer a todos los paladares, combina texturas cremosas, crujientes y sabores dulces y salados.",
    ingredients: ["Queso Brie Francés", "Gouda Ahumado", "Manchego Curado", "Jamón Serrano", "Salami Italiano", "Uvas y Fresas", "Nueces Caramelizadas", "Crackers Artesanales", "Miel de Abeja"],
    price: 850,
    serves: "4-6 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1621801306660-dbf07d643924?auto=format&fit=crop&q=80&w=800",
    popular: true
  },
  {
    id: 2,
    name: "Date Night Box",
    description: "Diseñada para compartir en pareja.",
    longDescription: "El plan romántico perfecto en una caja. Hemos seleccionado los sabores más sensuales y delicados para acompañar una noche de vino y buena compañía.",
    ingredients: ["Queso de Cabra con Ceniza", "Prosciutto Di Parma", "Fresas con Chocolate", "Higos Frescos", "Miel de Trufa", "Baguette Rústica", "Macarons"],
    price: 550,
    serves: "2 personas",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 3,
    name: "Royal Gathering",
    description: "Nuestra charola más abundante y lujosa.",
    longDescription: "Cuando quieres impresionar, esta es la elección. Una verdadera obra de arte comestible con nuestra selección más premium de importación.",
    ingredients: ["5 Variedades de Quesos Importados", "Lomo Embuchado", "Chorizo Pamplona", "Dips de Alcachofa", "Frutos Secos Premium", "Chocolate Amargo 70%", "Variedad de Panes de Masa Madre"],
    price: 1600,
    serves: "10-12 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9674c0e5?auto=format&fit=crop&q=80&w=800",
    popular: true
  },
  {
    id: 4,
    name: "Brunch Platter",
    description: "Ideal para la mañana.",
    longDescription: "Olvídate de cocinar el domingo por la mañana. Esta charola trae el mejor desayuno continental directamente a tu cama o mesa.",
    ingredients: ["Waffles Belgas", "Mini Croissants", "Queso Crema con Hierbas", "Jamón de Pavo", "Mermelada Casera de Frutos Rojos", "Fruta Fresca Picada", "Yogurt Griego"],
    price: 780,
    serves: "4-5 personas",
    category: "Brunch",
    image: "https://images.unsplash.com/photo-1605296830784-9cda631a7420?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 5,
    name: "Solo Graze Box",
    description: "El regalo corporativo perfecto o un capricho personal.",
    longDescription: "Pequeña pero poderosa. Esta cajita contiene toda la experiencia Quihuis en un formato individual. Ideal para regalos de empresa o lunch boxes de lujo.",
    ingredients: ["2 Tipos de Queso", "Salami", "Galletas Crackers", "Fruta de Temporada", "Frutos Secos", "Chocolate"],
    price: 250,
    serves: "1 persona",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1516709322056-b043db731055?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 6,
    name: "Veggie Delight",
    description: "Opción vegetariana con quesos premium.",
    longDescription: "Una explosión de colores y frescura. Eliminamos las carnes pero duplicamos el sabor con dips caseros y vegetales crujientes.",
    ingredients: ["Quesos Premium", "Hummus Casero de Betabel", "Crudités (Zanahoria, Pepino, Apio)", "Falafel", "Aceitunas Marinadas", "Frutas y Nueces"],
    price: 700,
    serves: "4-6 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1595507663246-88d4078864f1?auto=format&fit=crop&q=80&w=800",
    popular: false
  }
];

const TESTIMONIALS_DATA = [
  { id: 1, name: "Ana Sofía R.", text: "Pedí la Royal Gathering para el cumpleaños de mi esposo y fue un éxito total.", stars: 5 },
  { id: 2, name: "Carlos M.", text: "La mejor opción para regalos corporativos. Enviamos 20 Solo Graze Boxes.", stars: 5 },
  { id: 3, name: "Valeria G.", text: "Me encanta que tengan opciones vegetarianas tan completas.", stars: 4 },
];

const FAQ_DATA = [
  {
    question: "¿Con cuánto tiempo de anticipación debo hacer mi pedido?",
    answer: "Recomendamos hacer tu pedido con al menos 24 horas de anticipación para garantizar la disponibilidad de todos los productos frescos. Para eventos grandes, sugerimos 3-5 días."
  },
  {
    question: "¿Hacen entregas a domicilio?",
    answer: "¡Sí! Hacemos entregas en toda la ciudad. El costo de envío varía según la zona y se confirma al momento de finalizar tu pedido por WhatsApp."
  },
  {
    question: "¿Puedo personalizar mi tabla si tengo alergias?",
    answer: "Absolutamente. Al momento de hacer tu pedido, por favor indícanos cualquier alergia o restricción alimentaria. Podemos sustituir nueces, gluten o lácteos específicos."
  },
  {
    question: "¿Cómo vienen empacados los productos?",
    answer: "Nuestras 'Boxes' vienen en cajas de cartón kraft biodegradables con ventana. Las 'Boards' (Tablas) se montan sobre bases de madera desechables o puedes rentar una tabla de madera fina con un depósito extra."
  }
];

/**
 * --- COMPONENTES AUXILIARES ---
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContainer = document.getElementById('main-content');
    if (mainContainer) mainContainer.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setIsVisible(entry.isIntersecting)));
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);
  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button className="w-full py-6 flex justify-between items-center text-left focus:outline-none group" onClick={() => setIsOpen(!isOpen)}>
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-700' : 'text-stone-800 group-hover:text-amber-700'}`}>{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-amber-700" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

/**
 * --- COMPONENTES DE ESTRUCTURA ---
 */

const Navbar = ({ totalItems, setIsCartOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const navClass = !isHome || scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6';
  const textClass = !isHome || scrolled ? 'text-stone-900' : 'text-stone-900';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold font-serif">Q</div>
          <span className={`text-xl font-serif font-bold tracking-tight ${textClass}`}>
            Quihuis<span className="text-amber-700">Grazing</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/menu" className="hidden md:block text-sm font-medium hover:text-amber-700 transition-colors">Menú Completo</Link>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-stone-100 rounded-full transition-colors group">
            <ShoppingBag className="w-6 h-6 text-stone-700 group-hover:text-amber-700" />
            {totalItems > 0 && <span className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{totalItems}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-stone-950 text-stone-500 py-16 border-t border-stone-900">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h4 className="text-2xl font-serif font-bold text-white mb-4">Quihuis Grazing</h4>
          <p className="text-sm leading-relaxed mb-6">
            Transformamos ingredientes selectos en experiencias visuales y gastronómicas. Cada tabla cuenta una historia de sabor y dedicación.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-amber-700 transition-colors text-white"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-amber-700 transition-colors text-white"><Phone className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Enlaces Rápidos</h5>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
            <li><Link to="/menu" className="hover:text-amber-500 transition-colors">Menú Completo</Link></li>
            <li><a href="#faq" className="hover:text-amber-500 transition-colors">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contacto</h5>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-600" /> Ciudad de México, CDMX</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-600" /> +52 123 456 7890</li>
            <li className="flex items-center gap-3"><Info className="w-4 h-4 text-amber-600" /> hola@quihuisgrazing.com</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-stone-900 text-center text-xs text-stone-700 flex flex-col md:flex-row justify-between items-center">
        <p>© 2024 Quihuis Grazing. Todos los derechos reservados.</p>
        <p className="mt-2 md:mt-0">Diseñado con ♥ y mucho queso.</p>
      </div>
    </div>
  </footer>
);

const CartDrawer = ({ isOpen, setIsOpen, cart, addToCart, removeFromCart }) => {
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftOccasion, setGiftOccasion] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);

  const generateGiftMessage = async () => {
    if (!giftOccasion) return;
    setIsGenerating(true);
    const prompt = `Escribe un mensaje corto, cálido y elegante para una tarjeta de regalo de una tabla de quesos gourmet. Para: ${giftRecipient || "Alguien especial"}. Ocasión: ${giftOccasion}. Tono: Emotivo pero sofisticado. Máximo 25 palabras.`;
    const message = await callGeminiAPI(prompt);
    setGiftMessage(message);
    setIsGenerating(false);
  };

  const handleCheckout = () => {
    let message = "Hola Quihuis Grazing! Me gustaría hacer el siguiente pedido:\n\n";
    Object.values(cart).forEach(item => {
      message += `- ${item.qty}x ${item.name} ($${item.price * item.qty})\n`;
    });
    message += `\nTotal: $${totalPrice}`;
    if (isGift) {
      message += `\n\n🎁 ES PARA REGALO\nPara: ${giftRecipient}\nOcasión: ${giftOccasion}\nMensaje en tarjeta: "${giftMessage}"`;
    }
    message += "\n\n¿Tienen disponibilidad para envío?";
    window.open(`https://wa.me/521234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden pointer-events-none ${isOpen ? 'pointer-events-auto' : ''}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
      <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-serif font-bold text-stone-900">Tu Pedido</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><X className="w-5 h-5 text-stone-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(cart).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Tu lista está vacía.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-100" />
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900">{item.name}</h4>
                    <p className="text-amber-700 font-medium">${item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-stone-100"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-stone-100"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-stone-100 pt-6 mt-6">
                <button onClick={() => setIsGift(!isGift)} className="flex items-center gap-2 text-stone-900 font-bold mb-4 hover:text-amber-700 transition-colors">
                  <Gift className={`w-5 h-5 ${isGift ? 'text-amber-600' : 'text-stone-400'}`} /> ¿Es para regalo?
                </button>
                {isGift && (
                  <div className="bg-stone-50 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="¿Para quién es?" className="w-full p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-500 text-sm" value={giftRecipient} onChange={(e) => setGiftRecipient(e.target.value)} />
                    <input type="text" placeholder="Ocasión (ej. Aniversario, Cumpleaños)" className="w-full p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-500 text-sm" value={giftOccasion} onChange={(e) => setGiftOccasion(e.target.value)} />
                    <div className="relative">
                      <textarea placeholder="Escribe tu mensaje o genéralo con IA..." className="w-full p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-500 text-sm h-24 resize-none" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} />
                      <button onClick={generateGiftMessage} disabled={!giftOccasion || isGenerating} className="absolute bottom-2 right-2 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-amber-200 transition-colors disabled:opacity-50">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} {isGenerating ? "Creando..." : "Redactar con IA"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-stone-50 border-t border-stone-100">
          <div className="flex justify-between items-center mb-4"><span className="text-stone-500">Total Estimado</span><span className="text-2xl font-bold text-stone-900">${totalPrice}</span></div>
          <button onClick={handleCheckout} disabled={totalItems === 0} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${totalItems === 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'}`}><Phone className="w-5 h-5" /> Pedir por WhatsApp</button>
        </div>
      </div>
    </div>
  );
};

/**
 * --- PÁGINAS ---
 */

const HomePage = () => {
  const featuredProducts = PRODUCTS_DATA.filter(p => p.popular).slice(0, 3);

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <FadeIn className="flex-1 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-amber-800 uppercase bg-amber-100 rounded-full">Experiencias Gourmet</span>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-stone-900 leading-[1.1] mb-6">El arte de <br/><span className="text-amber-700 italic">compartir</span> momentos.</h1>
              <p className="text-lg text-stone-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">Charolas de quesos y carnes frías curadas artesanalmente.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/menu" className="px-8 py-4 bg-stone-900 text-white font-medium rounded-full hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">Ver Menú Completo <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </FadeIn>
            <FadeIn delay={200} className="flex-1 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <img src="https://images.unsplash.com/photo-1625938145744-e38051541e44?auto=format&fit=crop&q=80&w=800" alt="Grazing Board" className="w-full h-auto object-cover scale-105 hover:scale-100 transition-transform duration-700"/>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECCIÓN NUEVA: PRODUCTOS QUE USAMOS */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Nuestra Alacena Gourmet</h2>
            <p className="text-stone-400 max-w-2xl mx-auto">Creemos que el secreto de una gran tabla está en la calidad de cada ingrediente individual. Por eso seleccionamos solo lo mejor.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeIn delay={100} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 text-stone-900">
                <Wine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-amber-500">Quesos Importados</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Desde Brie francés cremoso hasta Manchego español curado por 12 meses. Trabajamos con proveedores que garantizan denominación de origen.
              </p>
            </FadeIn>

            <FadeIn delay={200} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 text-stone-900">
                <Beef className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-amber-500">Charcutería Fina</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Jamón serrano reserva, salami italiano con pimienta y prosciutto di Parma. Cortes finos que se deshacen en la boca.
              </p>
            </FadeIn>

            <FadeIn delay={300} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 text-stone-900">
                <Wheat className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-amber-500">Panadería Artesanal</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Acompañamos tus tablas con baguettes rústicas, crackers de romero y pan de masa madre horneado el mismo día.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Nuestros Favoritos</h2>
            <p className="text-stone-500">Una probadita de lo que más piden nuestros clientes.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 100}>
                <Link to={`/producto/${product.id}`} className="group block h-full">
                  <div className="bg-stone-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
                    <div className="relative overflow-hidden h-64">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{product.name}</h3>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="mt-auto flex items-center text-amber-700 font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">Ver Detalles <ChevronRight className="w-4 h-4" /></div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="inline-flex items-center gap-2 border-b-2 border-stone-900 pb-1 text-stone-900 font-bold hover:text-amber-700 hover:border-amber-700 transition-all">Explorar todo el menú</Link>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-amber-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Clientes Felices</h2>
          </FadeIn>
          <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {TESTIMONIALS_DATA.map((testimonial, idx) => (
              <div key={testimonial.id} className="snap-center shrink-0 w-[85vw] md:w-[400px]">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 h-full relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-100 fill-amber-100" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />)}
                  </div>
                  <p className="text-stone-700 italic mb-6">"{testimonial.text}"</p>
                  <span className="font-bold text-stone-900 text-sm">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN RESTAURADA: FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-stone-900">Preguntas Frecuentes</h2>
          </FadeIn>
          <div className="space-y-2">
            {FAQ_DATA.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 50}>
                <AccordionItem question={item.question} answer={item.answer} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const MenuPage = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [gridColumns, setGridColumns] = useState(2);
  
  const categories = ["Todos", ...new Set(PRODUCTS_DATA.map(p => p.category))];
  const filteredProducts = activeCategory === "Todos" 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === activeCategory);

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-stone-900 mb-6">Menú Completo</h1>
          <p className="text-stone-500 max-w-xl mx-auto">Explora nuestra colección de sabores curados.</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  {cat === 'Boards' ? 'Tablas' : cat === 'Boxes' ? 'Cajas' : cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
              <button onClick={() => setGridColumns(1)} className={`p-2 rounded-md transition-all ${gridColumns === 1 ? 'bg-white shadow text-amber-700' : 'text-stone-500 hover:text-stone-700'}`} title="Vista de Lista"><List className="w-5 h-5" /></button>
              <button onClick={() => setGridColumns(2)} className={`p-2 rounded-md transition-all ${gridColumns === 2 ? 'bg-white shadow text-amber-700' : 'text-stone-500 hover:text-stone-700'}`} title="Vista de Cuadrícula"><LayoutGrid className="w-5 h-5" /></button>
            </div>
          </div>
        </FadeIn>

        <div className={`grid gap-8 ${gridColumns === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {filteredProducts.map((product, index) => (
            <FadeIn key={product.id} delay={index * 50}>
              <div className={`group bg-stone-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-stone-100 flex h-full ${gridColumns === 1 ? 'flex-row' : 'flex-col'}`}>
                <Link to={`/producto/${product.id}`} className={`relative overflow-hidden block ${gridColumns === 1 ? 'w-48 h-full shrink-0' : 'h-64 w-full'}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </Link>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/producto/${product.id}`} className="hover:text-amber-700 transition-colors">
                      <h3 className="text-xl font-serif font-bold text-stone-900">{product.name}</h3>
                    </Link>
                    <span className="text-lg font-bold text-amber-700">${product.price}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">{product.serves}</p>
                  <p className={`text-stone-600 text-sm leading-relaxed mb-6 flex-1 ${gridColumns === 1 ? 'line-clamp-2' : ''}`}>{product.description}</p>
                  
                  <div className="flex gap-3 mt-auto">
                    <Link to={`/producto/${product.id}`} className="flex-1 py-3 bg-stone-100 text-stone-900 font-medium rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center text-sm">
                      Ver Detalles
                    </Link>
                    <button onClick={() => addToCart(product)} className="px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS_DATA.find(p => p.id === parseInt(id));
  const [pairingSuggestion, setPairingSuggestion] = useState(null);
  const [loadingPairing, setLoadingPairing] = useState(false);

  const handlePairing = async () => {
    setLoadingPairing(true);
    const prompt = `Actúa como un sommelier experto de clase mundial. Recomienda una bebida específica (tipo de vino, cerveza artesanal o cóctel) para maridar perfectamente con una tabla de quesos que contiene: ${product.ingredients.join(", ")}. Explica por qué brevemente en 2 frases elegantes. Respuesta en español.`;
    const result = await callGeminiAPI(prompt);
    setPairingSuggestion(result);
    setLoadingPairing(false);
  };

  if (!product) return <div className="pt-32 text-center">Producto no encontrado</div>;

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-xl h-[400px] lg:h-[600px] bg-stone-100 sticky top-32">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-fit">
              {product.category === 'Boards' ? 'Tabla Gourmet' : 'Box Experience'}
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-amber-700 mb-6">${product.price} <span className="text-sm text-stone-400 font-normal">/ MXN</span></p>
            
            <div className="border-t border-b border-stone-100 py-6 mb-6 space-y-4">
              <p className="text-stone-600 text-lg leading-relaxed">{product.longDescription}</p>
              <div className="flex items-center gap-2 text-stone-500 font-medium">
                <User className="w-5 h-5" /> Ideal para {product.serves}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-serif font-bold text-lg mb-4">¿Qué incluye?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {product.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-600 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {ing}
                  </li>
                ))}
              </ul>
              
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-stone-800 flex items-center gap-2"><Wine className="w-5 h-5 text-amber-700" /> Sommelier Virtual</h4>
                  {!pairingSuggestion && (
                    <button onClick={handlePairing} disabled={loadingPairing} className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-full hover:bg-stone-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                      {loadingPairing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />} Sugerir Maridaje con IA
                    </button>
                  )}
                </div>
                {loadingPairing && <p className="text-sm text-stone-500 italic animate-pulse">Analizando sabores...</p>}
                {pairingSuggestion && <div className="animate-in fade-in zoom-in-95 duration-500"><p className="text-stone-700 italic text-sm leading-relaxed border-l-2 border-amber-400 pl-3">"{pairingSuggestion}"</p></div>}
                {!pairingSuggestion && !loadingPairing && <p className="text-xs text-stone-400">Descubre la bebida perfecta para esta selección.</p>}
              </div>
            </div>

            <button onClick={() => addToCart(product)} className="w-full md:w-auto px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
              <Plus className="w-5 h-5" /> Agregar al Pedido
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: { ...product, qty: (prev[product.id]?.qty || 0) + 1 }
    }));
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId].qty > 1) newCart[productId].qty -= 1;
      else delete newCart[productId];
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);

  return (
    <MemoryRouter>
      <ScrollToTop />
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-sans { font-family: 'Montserrat', sans-serif !important; }
          .font-serif { font-family: 'Playfair Display', serif !important; }
          body { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-amber-200 selection:text-amber-900 font-sans" id="main-content">
        <Navbar totalItems={totalItems} setIsCartOpen={setIsCartOpen} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
          <Route path="/producto/:id" element={<ProductDetailPage addToCart={addToCart} />} />
        </Routes>

        <Footer />
        <CartDrawer 
          isOpen={isCartOpen} 
          setIsOpen={setIsCartOpen} 
          cart={cart} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
        />
      </div>
    </MemoryRouter>
  );
};

export default App;