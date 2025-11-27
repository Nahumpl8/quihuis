import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star, Info, Phone, Instagram, MapPin, X, Plus, Minus, ChevronRight, UtensilsCrossed, Wine, ChevronDown, ChevronUp, Quote, User, LayoutGrid, List } from 'lucide-react';

/**
 * --- DATOS DE LA APLICACIÓN ---
 */

const PRODUCTS_DATA = [
  {
    id: 1,
    name: "The Classic Graze",
    description: "La combinación perfecta para cualquier reunión. Incluye 3 tipos de quesos (Brie, Gouda, Manchego), jamón serrano, salami, frutas de temporada, nueces caramelizadas, aceitunas y crackers artesanales.",
    price: 850,
    serves: "4-6 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1621801306660-dbf07d643924?auto=format&fit=crop&q=80&w=800",
    popular: true
  },
  {
    id: 2,
    name: "Date Night Box",
    description: "Diseñada para compartir en pareja. Selección premium de quesos suaves, prosciutto, fresas cubiertas de chocolate, miel de abeja y baguette rústica.",
    price: 550,
    serves: "2 personas",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 3,
    name: "Royal Gathering",
    description: "Nuestra charola más abundante. 5 tipos de quesos importados, selección de carnes frías maduradas, dips de la casa, frutos secos, chocolate amargo y variedad de panes.",
    price: 1600,
    serves: "10-12 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9674c0e5?auto=format&fit=crop&q=80&w=800",
    popular: true
  },
  {
    id: 4,
    name: "Brunch Platter",
    description: "Ideal para la mañana. Waffles belgas, croissants, queso crema con hierbas, jamón de pavo, mermeladas caseras y fruta fresca picada.",
    price: 780,
    serves: "4-5 personas",
    category: "Brunch",
    image: "https://images.unsplash.com/photo-1605296830784-9cda631a7420?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 5,
    name: "Solo Graze Box",
    description: "El regalo corporativo perfecto o un capricho personal. Una mini selección gourmet de nuestros mejores quesos y carnes.",
    price: 250,
    serves: "1 persona",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1516709322056-b043db731055?auto=format&fit=crop&q=80&w=800",
    popular: false
  },
  {
    id: 6,
    name: "Veggie Delight",
    description: "Opción vegetariana con quesos premium, hummus casero, crudités de vegetales frescos, falafel, frutas y nueces.",
    price: 700,
    serves: "4-6 personas",
    category: "Boards",
    image: "https://images.unsplash.com/photo-1595507663246-88d4078864f1?auto=format&fit=crop&q=80&w=800",
    popular: false
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Ana Sofía R.",
    text: "Pedí la Royal Gathering para el cumpleaños de mi esposo y fue un éxito total. La presentación es impecable y los quesos estaban deliciosos.",
    stars: 5
  },
  {
    id: 2,
    name: "Carlos M.",
    text: "La mejor opción para regalos corporativos. Enviamos 20 Solo Graze Boxes a nuestros clientes y quedaron encantados. ¡Súper recomendados!",
    stars: 5
  },
  {
    id: 3,
    name: "Valeria G.",
    text: "Me encanta que tengan opciones vegetarianas tan completas. El hummus casero es espectacular. Definitivamente volveré a pedir.",
    stars: 4
  },
  {
    id: 4,
    name: "Roberto L.",
    text: "El servicio al cliente es excelente. Me ayudaron a personalizar la tabla para evitar nueces por una alergia. Llegó todo puntual.",
    stars: 5
  },
  {
    id: 5,
    name: "Lucía P.",
    text: "La Date Night Box es perfecta. El vino maridaba genial con los quesos seleccionados. Una experiencia muy romántica.",
    stars: 5
  }
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

// Componente para animar elementos al hacer scroll
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Componente de Acordeón para FAQ
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 last:border-0">
      <button 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-700' : 'text-stone-800 group-hover:text-amber-700'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-amber-700" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [scrolled, setScrolled] = useState(false);
  
  // Nuevo estado para controlar las columnas de visualización (2 por defecto en escritorio)
  const [gridColumns, setGridColumns] = useState(2); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        ...product,
        qty: (prev[product.id]?.qty || 0) + 1
      }
    }));
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId].qty > 1) {
        newCart[productId].qty -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    let message = "Hola Quihuis Grazing! Me gustaría hacer el siguiente pedido:\n\n";
    Object.values(cart).forEach(item => {
      message += `- ${item.qty}x ${item.name} ($${item.price * item.qty})\n`;
    });
    message += `\nTotal: $${totalPrice}`;
    message += "\n\n¿Tienen disponibilidad para envío?";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/521234567890?text=${encodedMessage}`, '_blank');
  };

  const categories = ["Todos", ...new Set(PRODUCTS_DATA.map(p => p.category))];
  const filteredProducts = activeCategory === "Todos" 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-amber-200 selection:text-amber-900 font-sans">
      
      {/* INYECCIÓN DE FUENTES
        Montserrat para el texto cuerpo (font-sans)
        Playfair Display para los títulos (font-serif)
      */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          
          /* Sobreescribir las clases de Tailwind */
          .font-sans {
            font-family: 'Montserrat', sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', serif !important;
          }
          /* Asegurar que todo el documento use Montserrat por defecto */
          body {
            font-family: 'Montserrat', sans-serif;
          }
        `}
      </style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold font-serif">Q</div>
            <span className={`text-xl font-serif font-bold tracking-tight ${scrolled ? 'text-stone-900' : 'text-stone-900'}`}>
              Quihuis<span className="text-amber-700">Grazing</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#menu" className="hidden md:block text-sm font-medium hover:text-amber-700 transition-colors">Menú</a>
            <a href="#creator" className="hidden md:block text-sm font-medium hover:text-amber-700 transition-colors">La Creadora</a>
            <a href="#testimonials" className="hidden md:block text-sm font-medium hover:text-amber-700 transition-colors">Testimonios</a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-stone-100 rounded-full transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-stone-700 group-hover:text-amber-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Animated Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <FadeIn className="flex-1 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-amber-800 uppercase bg-amber-100 rounded-full">
                Experiencias Gourmet
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-stone-900 leading-[1.1] mb-6">
                El arte de <br/>
                <span className="text-amber-700 italic">compartir</span> momentos.
              </h1>
              <p className="text-lg text-stone-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                Charolas de quesos y carnes frías curadas artesanalmente. Diseñadas para convertir cualquier reunión en un recuerdo inolvidable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#menu" className="px-8 py-4 bg-stone-900 text-white font-medium rounded-full hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Ver Menú <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#creator" className="px-8 py-4 bg-white text-stone-900 border border-stone-200 font-medium rounded-full hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                  Conócenos
                </a>
              </div>
            </FadeIn>
            
            <FadeIn delay={200} className="flex-1 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <img 
                  src="https://images.unsplash.com/photo-1625938145744-e38051541e44?auto=format&fit=crop&q=80&w=800" 
                  alt="Grazing Board" 
                  className="w-full h-auto object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 border-2 border-amber-800/20 rounded-3xl -rotate-3 z-0 scale-105"></div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Nuestra Selección</h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Ingredientes frescos, quesos importados y charcutería fina. Elige la opción perfecta para tu ocasión.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat 
                        ? 'bg-stone-900 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'Boards' ? 'Tablas' : cat === 'Boxes' ? 'Cajas' : cat}
                  </button>
                ))}
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
                <button 
                  onClick={() => setGridColumns(1)}
                  className={`p-2 rounded-md transition-all ${gridColumns === 1 ? 'bg-white shadow text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
                  title="Vista de Lista (1 Columna)"
                >
                  <List className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setGridColumns(2)}
                  className={`p-2 rounded-md transition-all ${gridColumns === 2 ? 'bg-white shadow text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
                  title="Vista de Cuadrícula (2 Columnas)"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </FadeIn>

          <div className={`grid gap-8 transition-all duration-500 ${gridColumns === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filteredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 100} className="h-full">
                <div className={`group bg-stone-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-stone-100 flex h-full ${gridColumns === 1 ? 'flex-row items-center' : 'flex-col'}`}>
                  
                  {/* Imagen */}
                  <div className={`relative overflow-hidden ${gridColumns === 1 ? 'w-48 h-48 shrink-0' : 'h-64 w-full'}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.popular && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-800" /> <span className={gridColumns === 1 ? 'hidden sm:inline' : ''}>Popular</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif font-bold text-stone-900">{product.name}</h3>
                      <span className="text-lg font-bold text-amber-700">${product.price}</span>
                    </div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">{product.serves}</p>
                    <p className={`text-stone-600 text-sm leading-relaxed mb-6 flex-1 ${gridColumns === 1 ? 'line-clamp-2 md:line-clamp-none' : ''}`}>
                      {product.description}
                    </p>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-white border border-stone-200 text-stone-900 font-medium rounded-xl hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Agregar <span className="hidden sm:inline">al Pedido</span>
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- CREATOR SECTION --- */}
      <section id="creator" className="py-24 bg-stone-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <FadeIn className="md:w-1/2 relative">
              <div className="relative z-10 rounded-full overflow-hidden w-80 h-80 md:w-[28rem] md:h-[28rem] border-8 border-white shadow-2xl mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800" 
                  alt="La Señora Quihuis" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute top-10 -left-10 w-20 h-20 bg-amber-200 rounded-full blur-xl opacity-60"></div>
              <div className="absolute bottom-10 -right-10 w-32 h-32 bg-orange-200 rounded-full blur-xl opacity-60"></div>
            </FadeIn>
            
            <FadeIn delay={200} className="md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <User className="w-4 h-4" /> La Creadora
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
                Conoce a la<br/>
                <span className="text-amber-700 italic">Sra. Quihuis</span>
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6 font-light">
                "Todo comenzó como un pequeño hobby en mi cocina, preparando tablas para las reuniones familiares. Mi obsesión por los detalles y la búsqueda de la combinación perfecta de sabores me llevó a crear Quihuis Grazing."
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                Hoy, cada tabla que sale de mi taller lleva un pedacito de esa pasión. No solo vendemos comida, curamos experiencias para que tú te dediques a lo más importante: disfrutar con los tuyos.
              </p>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" 
                alt="Firma" 
                className="h-12 opacity-50 mx-auto md:mx-0" 
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- FEATURES MINI --- */}
      <section className="py-20 bg-stone-900 text-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <FadeIn delay={0} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-amber-400">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Artesanal & Fresco</h3>
              <p className="text-stone-400">Cada tabla se arma al momento con ingredientes seleccionados el mismo día.</p>
            </FadeIn>
            <FadeIn delay={200} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-amber-400">
                <Wine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Maridaje Perfecto</h3>
              <p className="text-stone-400">Quesos pensados para acompañar tus vinos favoritos y crear una experiencia completa.</p>
            </FadeIn>
            <FadeIn delay={400} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-amber-400">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Diseño Único</h3>
              <p className="text-stone-400">Cuidamos cada detalle visual para que tu mesa luzca espectacular.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Horizontal Scroll) --- */}
      <section id="testimonials" className="py-24 bg-amber-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Lo que dicen nuestros clientes</h2>
            <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full mb-6"></div>
            <p className="text-sm text-stone-500 hidden md:block">Desliza para ver más</p>
          </FadeIn>

          {/* Scroll Container */}
          <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {TESTIMONIALS_DATA.map((testimonial, idx) => (
              <div 
                key={testimonial.id} 
                className="snap-center shrink-0 w-[85vw] md:w-[400px]"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full relative border border-stone-100 flex flex-col justify-between">
                  <div>
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-100 fill-amber-100" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-stone-700 italic mb-6 leading-relaxed font-serif">"{testimonial.text}"</p>
                  </div>
                  
                  <div className="flex items-center gap-3 border-t border-stone-100 pt-4 mt-auto">
                    <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-500 text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <span className="font-bold text-stone-900 text-sm">{testimonial.name}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Espacio final para mejor scroll en movil */}
            <div className="w-4 shrink-0 md:hidden"></div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
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

      {/* --- FOOTER --- */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-serif font-bold text-white mb-2">Quihuis Grazing</h4>
            <p className="text-sm">Creando momentos deliciosos, una tabla a la vez.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><Phone className="w-5 h-5" /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><MapPin className="w-5 h-5" /></a>
          </div>
          <p className="text-xs text-stone-700">© 2024 Quihuis Grazing. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-0 z-[60] overflow-hidden pointer-events-none ${isCartOpen ? 'pointer-events-auto' : ''}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        />
        
        <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <h2 className="text-xl font-serif font-bold text-stone-900">Tu Pedido</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(cart).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                <p>Tu lista está vacía.</p>
                <p className="text-sm mt-2">¡Agrega algunas delicias del menú!</p>
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
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-stone-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-stone-50 border-t border-stone-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-500">Total Estimado</span>
              <span className="text-2xl font-bold text-stone-900">${totalPrice}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={totalItems === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                totalItems === 0 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-200'
              }`}
            >
              <Phone className="w-5 h-5" />
              Pedir por WhatsApp
            </button>
            <p className="text-xs text-center text-stone-400 mt-3">
              Serás redirigido a WhatsApp para confirmar disponibilidad y pago.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;