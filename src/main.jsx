import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { categories, filterProducts, money, products } from "./data";
import { initialState, reducer, sanitize, subtotal } from "./store";
import "./styles.css";
import "./case-study.css";
import "./redesign.css";
import { NewHome, Explore } from "./redesign";

const Store = createContext(null);
function Provider({ children }) {
  const [warning, setWarning] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      return sanitize(JSON.parse(localStorage.getItem("newme-concept-v1")));
    } catch {
      return initialState;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("newme-concept-v1", JSON.stringify(state));
    } catch {
      setWarning(true);
    }
  }, [state]);
  return (
    <Store.Provider value={{ state, dispatch }}>
      {state.previousCatalog && <aside className="catalog-notice" role="status">Our concept catalogue photography and garments have changed. Previous bag items and saves are archived in this browser, not replaced. Please review the new styles before saving or adding them again. <a download="newme-previous-saves.json" href={`data:application/json,${encodeURIComponent(JSON.stringify(state.previousCatalog))}`}>Download previous selections</a></aside>}
      {children}
      {warning && (
        <div className="storage-warning" role="status">
          Your browser couldn’t save changes. Your bag and wishlist may not
          persist.
        </div>
      )}
    </Store.Provider>
  );
}
const useStore = () => useContext(Store);
function Art({ product, className = "", label = true, alternate = false }) {
  const src = alternate
    ? product.additionalImages[0] || product.image
    : product.image;
  return (
    <div className={`art photo-art ${className}`}>
      <img
        src={src}
        style={{ objectFit: product.imageFit || "cover" }}
        alt={`${product.name} — ${product.color}; stock photograph for a fictional concept`}
        loading="lazy"
      />
      {label && (
        <span className="placeholder-label">CONCEPT STYLE · STOCK PHOTO</span>
      )}
    </div>
  );
}
function Header() {
  const { state } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location.pathname, location.search]);
  const matches = query.trim()
    ? filterProducts(products, { q: query }).slice(0, 4)
    : [];
  function submit(e) {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearch(false);
  }
  return (
    <>
      <div className="concept-bar">
        AN INDEPENDENT DESIGN CONCEPT <span>✳</span> NOT AFFILIATED WITH NEWME{" "}
        <Link to="/case-study">VIEW CASE STUDY ↗</Link>
      </div>
      <header className="header">
        <button
          className="icon-btn mobile-menu"
          aria-label="Open menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Link to="/" className="logo" aria-label="NEWME concept home">
          NEWME
        </Link>
        <nav
          className={`nav ${menu ? "nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/shop">SHOP ALL</NavLink>
          <NavLink to="/explore">EXPLORE</NavLink>
          <NavLink to="/category/dresses">DRESSES</NavLink>
          <NavLink to="/category/tops">TOPS</NavLink>
          <NavLink to="/category/denim">DENIM</NavLink>
          <NavLink to="/case-study">THE CONCEPT</NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="icon-btn"
            aria-label="Search"
            aria-expanded={search}
            onClick={() => setSearch(!search)}
          >
            <Search />
          </button>
          <Link
            className="icon-btn"
            to="/wishlist"
            aria-label={`Wishlist, ${state.wishlist.length} items`}
          >
            <Heart />
            <span className="counter">{state.wishlist.length}</span>
          </Link>
          <Link
            className="icon-btn"
            to="/bag"
            aria-label={`Shopping bag, ${state.bag.reduce((n, x) => n + x.quantity, 0)} items`}
          >
            <ShoppingBag />
            <span className="counter">
              {state.bag.reduce((n, x) => n + x.quantity, 0)}
            </span>
          </Link>
        </div>
      </header>
      {search && (
        <div className="search-panel">
          <form onSubmit={submit}>
            <Search size={20} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your next favourite"
              aria-label="Search products"
            />
            <button type="submit">
              SEARCH <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close search"
              onClick={() => setSearch(false)}
            >
              <X />
            </button>
          </form>
          {query && (
            <div className="suggestions">
              <span>PRODUCTS</span>
              {matches.length ? (
                matches.map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`}>
                    {p.name}
                    <ArrowUpRight size={15} />
                  </Link>
                ))
              ) : (
                <p>No matching products. Try another search.</p>
              )}
              <Link to={`/shop?q=${encodeURIComponent(query)}`}>
                See all results <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">
            NEWME
          </div>
          <p>
            A little more you.
            <br />A lot more possibilities.
          </p>
        </div>
        <div>
          <strong>EXPLORE</strong>
          <Link to="/shop">Shop all</Link>
          <Link to="/category/dresses">Dresses</Link>
          <Link to="/category/tops">Tops</Link>
        </div>
        <div>
          <strong>THE PROJECT</strong>
          <Link to="/case-study">The case study</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/bag">Shopping bag</Link>
        </div>
        <div className="footer-note">
          <strong>A NOTE ON THIS PROJECT</strong>
          <p>
            This is an independent, unofficial design concept. Not affiliated
            with or endorsed by NEWME. Products and prices are fictional.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 INDEPENDENT CONCEPT PROJECT</span>
        <span>MADE FOR THE LOVE OF GETTING DRESSED ✳</span>
      </div>
    </footer>
  );
}
function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<NewHome Card={Card} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/case-study" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
function Card({ product }) {
  const { state, dispatch } = useStore();
  const saved = state.wishlist.includes(product.id);
  return (
    <article className="product-card">
      <div className="card-image">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
        >
          <Art product={product} />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`heart ${saved ? "active" : ""}`}
          aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
          onClick={() => dispatch({ type: "wishlist", id: product.id })}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-info">
        <Link to={`/product/${product.slug}`}>{product.name}</Link>
        <div className="price">
          {money(product.price)}{" "}
          {product.oldPrice && <del>{money(product.oldPrice)}</del>}
        </div>
      </div>
      <p className="card-color">
        {product.color} <span>·</span> Fictional product
      </p>
    </article>
  );
}
function SectionHead({ eyebrow, title, link, to }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <Link className="text-link" to={to}>
        {link} <ArrowRight size={17} />
      </Link>
    </div>
  );
}
function Shop() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const values = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    size: params.get("size") || "",
    color: params.get("color") || "",
    price: params.get("price") || "",
    sort: params.get("sort") || "featured",
  };
  const result = filterProducts(products, values);
  function update(key, value) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  }
  return (
    <div className="page-wrap">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link> / SHOP
      </div>
      <div className="shop-heading">
        <div>
          <div className="eyebrow">THE GOOD STUFF, ALL IN ONE PLACE</div>
          <h1>{values.q ? `Results for “${values.q}”` : "Find your thing."}</h1>
          <p>New favourites for every version of you.</p>
        </div>
        <span>THE EDIT / {products.length} STYLES</span>
      </div>
      <div className="category-tabs" aria-label="Product categories">
        {categories.map((c) => (
          <button
            className={
              values.category.toLowerCase() ===
              (c === "All" ? "" : c.toLowerCase())
                ? "selected"
                : ""
            }
            key={c}
            onClick={() => update("category", c === "All" ? "" : c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="listing-toolbar">
        <button
          className="filter-toggle"
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          <SlidersHorizontal size={17} /> FILTER {filters ? "−" : "+"}
        </button>
        <span>
          {result.length} {result.length === 1 ? "STYLE" : "STYLES"}
        </span>
        <label className="sort">
          SORT BY{" "}
          <select
            aria-label="Sort products"
            value={values.sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <ChevronDown size={15} />
        </label>
      </div>
      {filters && (
        <div className="filter-panel">
          <label>
            SIZE
            <select
              value={values.size}
              onChange={(e) => update("size", e.target.value)}
            >
              <option value="">All sizes</option>
              {["XS", "S", "M", "L", "XL"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            COLOR
            <select
              value={values.color}
              onChange={(e) => update("color", e.target.value)}
            >
              <option value="">All colors</option>
              {[...new Set(products.map(p => p.color))].sort().map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            PRICE
            <select
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
            >
              <option value="">All prices</option>
              <option value="under1500">Under ₹1,500</option>
              <option value="1500plus">₹1,500 and above</option>
            </select>
          </label>
          <button onClick={() => setParams({})}>
            CLEAR ALL FILTERS <X size={14} />
          </button>
        </div>
      )}
      {result.length ? (
        <div className="product-grid shop-grid">
          {result.map((p) => (
            <Card key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing here just yet.</h2>
          <p>Try a different search or clear your filters.</p>
          <button className="button dark" onClick={() => setParams({})}>
            CLEAR FILTERS <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
function Category() {
  const { slug } = useParams();
  const category = categories.find((x) => x.toLowerCase() === slug);
  if (!category || category === "All") return <NotFound />;
  const items = filterProducts(products, { category });
  return (
    <div className="page-wrap">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link> / {category.toUpperCase()}
      </div>
      <div className="category-banner">
        <div>
          <div className="eyebrow">
            THE CATEGORY EDIT / {category.toUpperCase()}
          </div>
          <h1>
            Meet your
            <br />
            <em>{category.toLowerCase()} era.</em>
          </h1>
          <p>
            Good outfits start here. Discover your next favourite in our
            fictional {category.toLowerCase()} edit.
          </p>
          <Link className="button dark" to={`/shop?category=${category}`}>
            SHOP {category.toUpperCase()} <ArrowRight size={17} />
          </Link>
        </div>
        <Art product={items[0]} />
      </div>
      <SectionHead
        eyebrow="CURATED FOR YOU"
        title={`The ${category.toLowerCase()} edit.`}
        link="VIEW ALL"
        to={`/shop?category=${category}`}
      />
      <div className="product-grid category-products">
        {items.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
function Product() {
  const { slug } = useParams();
  const p = products.find((x) => x.slug === slug);
  const [size, setSize] = useState("");
  const [view, setView] = useState(0);
  const [message, setMessage] = useState("");
  const { state, dispatch } = useStore();
  useEffect(() => {
    setSize("");
    setView(0);
    setMessage("");
  }, [slug]);
  if (!p) return <NotFound />;
  const saved = state.wishlist.includes(p.id);
  function add() {
    if (!size) {
      setMessage("Please select a size first.");
      return;
    }
    dispatch({ type: "add", item: { id: p.id, size, color: p.color } });
    setMessage("Added to your bag.");
  }
  return (
    <div className="page-wrap product-page">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link> / <Link to="/shop">SHOP</Link> /{" "}
        {p.category.toUpperCase()}
      </div>
      <div className="product-layout">
        <div className="gallery">
          <div className="gallery-thumbs">
            {[p.image,...p.additionalImages].map((image,i) => (
              <button
                className={view === i ? "selected" : ""}
                key={i}
                aria-label={`View editorial image ${i + 1}`}
                aria-pressed={view === i}
                onClick={() => setView(i)}
              >
                <Art product={p} alternate={i === 1} label={false} />
              </button>
            ))}
          </div>
          <Art product={p} className="gallery-main" alternate={view === 1} />
          <div className="gallery-count">0{view + 1} / 0{1+p.additionalImages.length}</div>
        </div>
        <div className="product-details">
          <div className="eyebrow">
            THE NEWME CONCEPT / {p.category.toUpperCase()}
          </div>
          <div className="detail-title">
            <h1>{p.name}</h1>
            <button
              className={`heart detail-heart ${saved ? "active" : ""}`}
              aria-label={`${saved ? "Remove from" : "Add to"} wishlist`}
              aria-pressed={saved}
              onClick={() => dispatch({ type: "wishlist", id: p.id })}
            >
              <Heart fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="detail-price">
            {money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}
          </div>
          <p className="tax-note">Fictional price · Concept product</p>
          <p className="detail-description">{p.description}</p>
          <div className="selection-label">
            COLOR <span>{p.color}</span>
          </div>
          <button
            className="color-swatch"
            style={{ background: p.tone }}
            aria-label={`${p.color}, selected color`}
            aria-pressed="true"
          />
          <div className="selection-label size-label">
            SELECT SIZE <span>CONCEPT SIZING</span>
          </div>
          <div className="sizes">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                className={size === s ? "selected" : ""}
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setMessage("");
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="button dark add-button" onClick={add}>
            ADD TO BAG <ArrowRight size={18} />
          </button>
          <div className="feedback" role="status">
            {message}
            {message === "Added to your bag." && (
              <>
                {" "}
                <Link to="/bag">View bag →</Link>
              </>
            )}
          </div>
          <div className="detail-accordion">
            <details>
              <summary>
                THE DETAILS <Plus size={16} />
              </summary>
              <p>
                Thoughtfully imagined for this independent design concept.
                Material and fit information are illustrative, not product
                claims.
              </p>
            </details>
            <details>
              <summary>
                ABOUT THIS CONCEPT <Plus size={16} />
              </summary>
              <p>
                This is not a real product. No orders or payments can be placed.
              </p>
            </details>
          </div>
        </div>
      </div>
      <section className="recommendations">
        <SectionHead
          eyebrow="A LITTLE MORE TO LOVE"
          title="You might also like."
          link="SHOP ALL"
          to="/shop"
        />
        <div className="product-grid">
          {products
            .filter((x) => x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <Card key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
function Wishlist() {
  const { state } = useStore();
  const items = products.filter((p) => state.wishlist.includes(p.id));
  return (
    <div className="page-wrap utility-page">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link> / WISHLIST
      </div>
      <div className="utility-heading">
        <div>
          <div className="eyebrow">SAVED FOR LATER</div>
          <h1>
            Your wishlist<span>.</span>
          </h1>
        </div>
        <span>
          {items.length} SAVED {items.length === 1 ? "STYLE" : "STYLES"}
        </span>
      </div>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <Card key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Heart size={32} />
          <h2>Love at first save.</h2>
          <p>Your wishlist is empty. Find something that feels like you.</p>
          <Link className="button dark" to="/shop">
            EXPLORE THE EDIT <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
function Bag() {
  const { state, dispatch } = useStore();
  return (
    <div className="page-wrap utility-page">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link> / SHOPPING BAG
      </div>
      <div className="utility-heading">
        <div>
          <div className="eyebrow">THE GOOD STUFF</div>
          <h1>
            Your bag<span>.</span>
          </h1>
        </div>
        <span>{state.bag.reduce((n, x) => n + x.quantity, 0)} ITEMS</span>
      </div>
      {state.bag.length ? (
        <div className="bag-layout">
          <div>
            {state.bag.map((item) => {
              const p = products.find((x) => x.id === item.id);
              return (
                <div
                  className="bag-item"
                  key={`${item.id}-${item.color}-${item.size}`}
                >
                  <Link to={`/product/${p.slug}`}>
                    <Art product={p} label={false} />
                  </Link>
                  <div>
                    <Link className="bag-name" to={`/product/${p.slug}`}>
                      {p.name}
                    </Link>
                    <p>
                      {item.color} / {item.size}
                    </p>
                    <div className="quantity">
                      <button
                        aria-label={`Decrease quantity of ${p.name}`}
                        disabled={item.quantity === 1}
                        onClick={() =>
                          dispatch({
                            type: "quantity",
                            item,
                            quantity: item.quantity - 1,
                          })
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${p.name}`}
                        disabled={item.quantity === 99}
                        onClick={() =>
                          dispatch({
                            type: "quantity",
                            item,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className="remove"
                      onClick={() => dispatch({ type: "remove", item })}
                    >
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                  <strong>{money(p.price * item.quantity)}</strong>
                </div>
              );
            })}
          </div>
          <aside className="bag-summary">
            <h2>The summary.</h2>
            <div>
              <span>Subtotal</span>
              <strong>{money(subtotal(state.bag))}</strong>
            </div>
            <p>
              Fictional products and prices. No delivery, taxes, or payment will
              be calculated.
            </p>
            <button className="button dark" disabled>
              CHECKOUT UNAVAILABLE
            </button>
            <small>DEMO ONLY — NO REAL ORDERS</small>
          </aside>
        </div>
      ) : (
        <div className="empty">
          <ShoppingBag size={32} />
          <h2>Nothing in the bag yet.</h2>
          <p>Let’s find something worth making plans for.</p>
          <Link className="button dark" to="/shop">
            START EXPLORING <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
function CaseStudy() {
  return (
    <div className="case-study">
      <section className="case-hero">
        <div className="eyebrow">AN INDEPENDENT DESIGN CONCEPT / 2026</div>
        <h1>
          A new perspective
          <br />
          on <em>NEWME.</em>
        </h1>
        <p>
          A desktop-first fashion experience imagined for a generation that
          refuses to be put in a box.
        </p>
        <a className="text-link" href="#the-idea">
          EXPLORE THE PROJECT <ArrowDown size={16} />
        </a>
      </section>
      <div className="case-intro" id="the-idea">
        <div className="eyebrow">01 / THE OPPORTUNITY</div>
        <div>
          <h2>
            More room for
            <br />
            <em>self-expression.</em>
          </h2>
          <p>
            The supplied recording shows a narrow storefront centered within a
            wider desktop browser in that captured session. Other viewport and
            device behavior was not independently verified. A constrained layout
            may be intentional; screenshots and user testing are needed to
            understand the tradeoffs.
          </p>
          <p>
            This concept explores what a more expansive, editorial shopping
            journey could look like—without claiming measured improvements in
            usability or conversion.
          </p>
        </div>
      </div>
      <section className="case-compare">
        <div className="eyebrow">02 / THE COMPARISON</div>
        <h2>One brand. Two desktop experiences.</h2>
        <p className="case-comparison-intro">NEWME’s official website and this unofficial, independent desktop concept. Screenshots retain their original proportions; select an image to inspect it at full size.</p>
        <div className="case-evidence-grid">
          <figure className="case-evidence">
            <div className="case-evidence-bar"><span>BEFORE</span><span>ORIGINAL WEBSITE CAPTURE</span></div>
            <div className="case-evidence-withheld"><p>Original website screenshot withheld from public deployment pending publication-rights review.</p></div>
            <figcaption><h3>Original NEWME desktop experience — captured during browsing.</h3><small>NEWME’s official website. Third-party screenshot for local comparison only, pending publication-rights review.</small></figcaption>
          </figure>
          <figure className="case-evidence">
            <div className="case-evidence-bar"><span>AFTER</span><span>ACTUAL HOMEPAGE CAPTURE</span></div>
            <a href="/images/case-study/home-desktop.png" target="_blank" rel="noreferrer" aria-label="Open concept homepage screenshot at full size in a new tab">
              <img src="/images/case-study/home-desktop.png" width="1280" height="632" loading="lazy" alt="Actual independent concept homepage at 1280 by 632: desktop navigation spans the header above a green campaign panel and a photograph of a model wearing a green dress." />
            </a>
            <figcaption><h3>Independent responsive desktop concept.</h3><small>Unofficial project, not NEWME’s official website. Captured at 1280 × 632 CSS pixels, at 2× resolution. Select the image to inspect it at full size in a new tab.</small></figcaption>
          </figure>
        </div>
        <div className="case-observations">
          <article><span>01 / SPACE</span><h3>Desktop screen utilization</h3><p>The concept spreads navigation and campaign content across the desktop canvas, with bounded content widths for larger screens.</p></article>
          <article><span>02 / CAMPAIGNS</span><h3>Campaign presentation</h3><p>Photography and campaign copy sit side by side on desktop, with responsive crops and accessible controls for automatic or manual browsing.</p></article>
          <article><span>03 / PRODUCTS</span><h3>Product browsing and comparison</h3><p>Four-column desktop listings place garment images, titles, colors and fictional prices alongside one another; mobile listings use two columns.</p></article>
          <article><span>04 / DISCOVERY</span><h3>Category and filtering navigation</h3><p>Desktop links, two-panel Explore, and URL-based search, filters and sorting provide several routes into the catalogue.</p></article>
        </div>
        <p className="case-evidence-note">These are design changes, not measured outcomes. Effects on usability, conversion or sales have not been established through testing.</p>
      </section>
      <section className="case-principles">
        <div className="eyebrow">03 / THE DESIGN RESPONSE</div>
        <h2>
          Made to make
          <br />
          <em>space for more.</em>
        </h2>
        <div className="principles-grid">
          <div>
            <span>01</span>
            <h3>Editorial by nature.</h3>
            <p>
              Bold typography and a visual-first layout create room for
              personality and discovery.
            </p>
          </div>
          <div>
            <span>02</span>
            <h3>Easy to explore.</h3>
            <p>
              Clear navigation, product filters and search bring the catalog
              into focus.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>Designed to adapt.</h3>
            <p>
              Layouts reshape from large desktop screens to smaller devices
              without losing their point of view.
            </p>
          </div>
        </div>
      </section>
      <section className="case-tech">
        <div>
          <div className="eyebrow">04 / UNDER THE HOOD</div>
          <h2>
            Considered from
            <br />
            every angle.
          </h2>
        </div>
        <div>
          <p>
            Built with React, Vite, Tailwind CSS, React Router and Lucide icons.
            Search and filters use the URL; a local reducer and browser storage
            power the fictional wishlist and shopping bag.
          </p>
          <p>
            Illustrations are original placeholders. Products, prices and
            inventory are fictional. There is no backend, checkout or payment.
          </p>
          <Link to="/shop" className="button dark">
            EXPLORE THE EXPERIENCE <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <div className="case-disclaimer">
        <strong>INDEPENDENT CONCEPT, CLEARLY.</strong>
        <p>
          This is an independent, unofficial portfolio project. It is not
          affiliated with, endorsed by, or an official website of NEWME. All
          product content is fictional.
        </p>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="empty not-found">
      <div className="eyebrow">404 / NOT FOUND</div>
      <h1>Well, this is unexpected.</h1>
      <p>We couldn’t find that page. Let’s get you back to the good stuff.</p>
      <Link to="/shop" className="button dark">
        <ArrowLeft size={16} /> BACK TO SHOP
      </Link>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <Layout />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
