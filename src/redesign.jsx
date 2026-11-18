import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { products } from "./data";
import { useCampaignCarousel } from "./useCampaignCarousel";

const imageFor = id => products.find(p => p.id === id).image;
const campaigns = [
  {
    image: imageFor('01'),
    kicker: "THE OCCASION EDIT",
    title: "MAIN\nCHARACTER\nENERGY",
    sub: "Looks for wherever the night takes you.",
    to: "/category/dresses",
    color: "#adf0ce",
  },
  {
    image: imageFor('02'),
    fit: 'contain',
    kicker: "THE DENIM EDIT",
    title: "IN YOUR\nDENIM ERA",
    sub: "A little blue goes a long way.",
    to: "/category/denim",
    color: "#90c7ee",
  },
  {
    image: imageFor('04'),
    kicker: "THE STYLE EDIT",
    title: "DRESS FOR\nTHE PLOT",
    sub: "Consider this your sign to dress up.",
    to: "/category/dresses",
    color: "#ffc6dd",
  },
];
const featured = [
  {
    title: "SPECIAL\nPLANS",
    image: imageFor('01'),
    to: "/category/dresses",
    color: "#ec3982",
  },
  {
    title: "BETTER\nTOGETHER",
    image: imageFor('09'),
    to: "/category/co-ords",
    color: "#269bd0",
  },
  {
    title: "AFTER\nHOURS",
    image: imageFor('08'),
    to: "/category/dresses",
    color: "#d73575",
  },
  { title: "TOP\nFORM", image: imageFor('05'), to: "/category/tops", color: "#9bd13a" },
];
const cats = [
  { name: "Dresses", image: imageFor('01') },
  { name: "Tops", image: imageFor('03') },
  { name: "Denim", image: imageFor('02'), fit:'contain' },
  { name: "Bottoms", image: imageFor('06') },
  { name: "Co-ords", image: imageFor('09') },
  { name: "Winterwear", image: imageFor('10') },
];
export function NewHome({ Card }) {
  const carousel = useCampaignCarousel(campaigns.length);
  const { slide, navigate } = carousel;
  const rail = useRef(null);
  const start = useRef(null);
  const current = campaigns[slide];
  return (
    <>
      <section
        className="campaign-hero"
        aria-roledescription="carousel"
        aria-label="Fashion campaigns"
        style={{ "--campaign": current.color }}
        onMouseEnter={() => carousel.setHovered(true)}
        onMouseLeave={() => carousel.setHovered(false)}
        onFocus={() => carousel.setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget))
            carousel.setFocused(false);
        }}
        onTouchStart={(e) => (start.current = {x:e.touches[0].clientX,y:e.touches[0].clientY})}
        onTouchCancel={() => {start.current = null}}
        onTouchEnd={(e) => {
          if (start.current !== null) {
            const diff = e.changedTouches[0].clientX - start.current.x;
            const vertical = e.changedTouches[0].clientY - start.current.y;
            if (Math.abs(diff) > 60 && Math.abs(diff) > Math.abs(vertical)) navigate(diff < 0 ? 1 : -1);
            start.current = null;
          }
        }}
      >
        <div className="campaign-track" style={{transform:`translateX(-${slide * 100}%)`}}>
        {campaigns.map((campaign,index) => <div className="campaign-slide" key={campaign.image} inert={index !== slide} aria-hidden={index !== slide} style={{background:campaign.color}}>
        <div className="campaign-copy">
          <span>THE CONCEPT EDIT / 0{index + 1}</span>
          <div>
            <p>{campaign.kicker} ✳</p>
            <h1>{campaign.title}</h1>
            <p>{campaign.sub}</p>
            <Link to={campaign.to}>
              SHOP THE EDIT <ArrowUpRight size={17} />
            </Link>
          </div>
          <small>INDEPENDENT FASHION CONCEPT · EDITORIAL STOCK IMAGERY</small>
        </div>
        <div className="campaign-photo">
          <img
            src={campaign.image}
            style={{objectFit:campaign.fit || 'cover'}}
            alt={campaign.kicker + ' — licensed stock fashion photograph'}
          />
          <div className="campaign-photo-label">
            A NEW
            <br />
            POINT OF
            <br />
            VIEW ↗
          </div>
        </div>
        </div>)}
        </div>
        <div className="campaign-controls">
          <button onClick={() => navigate(-1)} aria-label="Previous campaign">
            <ArrowLeft />
          </button>
          <span
            aria-live={carousel.paused || carousel.focused ? "polite" : "off"}
          >
            0{slide + 1} / 0{campaigns.length}
          </span>
          <button
            onClick={carousel.togglePause}
            aria-label={carousel.paused ? "Play campaigns" : "Pause campaigns"}
            title={carousel.paused ? "Play campaigns" : "Pause campaigns"}
          >
            {carousel.paused ? <Play size={18}/> : <Pause size={18}/>}
          </button>
          <button onClick={() => navigate(1)} aria-label="Next campaign">
            <ArrowRight />
          </button>
        </div>
      </section>
      <section className="new-section">
        <div className="new-heading">
          <h2>
            FEATURED <span>THIS WEEK</span>
          </h2>
          <div className="rail-controls">
            <button
              aria-label="Previous featured campaigns"
              onClick={() =>
                rail.current?.scrollBy({
                  left: -rail.current.clientWidth * 0.8,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                })
              }
            >
              <ArrowLeft />
            </button>
            <button
              aria-label="Next featured campaigns"
              onClick={() =>
                rail.current?.scrollBy({
                  left: rail.current.clientWidth * 0.8,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                })
              }
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="featured-rail" ref={rail}>
          {featured.map((f, i) => (
            <Link
              className="feature-card"
              to={f.to}
              key={f.title}
              style={{ "--feature": f.color }}
            >
              <img src={f.image} alt="" loading="lazy" />
              <span className="feature-top">
                THE STYLE FILE / 0{i + 1} <ArrowUpRight size={17} />
              </span>
              <strong>{f.title}</strong>
              <span className="feature-bottom">EXPLORE THE EDIT ↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="new-section">
        <div className="new-heading">
          <h2>
            SHOP BY <span>CATEGORY</span>
          </h2>
          <Link to="/explore">
            EXPLORE ALL <ArrowRight size={17} />
          </Link>
        </div>
        <div className="campaign-categories">
          {cats.map((c, i) => (
            <Link
              to={`/category/${c.name.toLowerCase()}`}
              className={`campaign-category campaign-category-${i}`}
              key={c.name}
            >
              <img src={c.image} style={{objectFit:c.fit || 'cover'}} alt="" loading="lazy" />
              <div>
                <span>THE STYLE DIRECTORY / 0{i + 1}</span>
                <strong>{c.name.toUpperCase()}</strong>
                <ArrowUpRight />
              </div>
            </Link>
          ))}
        </div>
        <p className="editorial-note">
          Editorial stock photography is for inspiration only and does not
          depict actual NEWME products.
        </p>
      </section>
      <section className="new-section new-drops">
        <div className="new-heading">
          <h2>
            THE LATEST <span>EDIT</span>
          </h2>
          <Link to="/shop">
            SHOP ALL <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <Card key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
export function Explore() {
  const [active, setActive] = useState("Dresses");
  const selected = cats.find((c) => c.name === active);
  const related = products.filter((p) => p.category === active);
  return (
    <div className="explore-page">
      <div className="explore-head">
        <div>
          <span>YOUR STYLE DIRECTORY</span>
          <h1>
            Explore<span>.</span>
          </h1>
        </div>
        <p>Find your next favourite thing.</p>
      </div>
      <div className="explore-layout">
        <nav className="explore-nav" aria-label="Explore categories">
          {cats.map((c) => (
            <button
              key={c.name}
              className={active === c.name ? "selected" : ""}
              aria-pressed={active === c.name}
              onClick={() => setActive(c.name)}
            >
              {c.name}
              <ArrowRight size={15} />
            </button>
          ))}
        </nav>
        <div className="explore-content">
          <div className="explore-title">
            <div>
              <span>EXPLORE THE EDIT</span>
              <h2>{active}</h2>
            </div>
            <Link to={`/shop?category=${encodeURIComponent(active)}`}>
              SHOP ALL {active.toUpperCase()} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="explore-tiles">
            <Link
              className="explore-tile explore-feature"
              to={`/category/${active.toLowerCase()}`}
            >
              <img src={selected.image} style={{objectFit:selected.fit || 'cover'}} alt="" />
              <div>
                <small>THE STYLE EDIT</small>
                <strong>{active}</strong>
                <span>EXPLORE COLLECTION ↗</span>
              </div>
            </Link>
            {related.length ? (
              related.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  className="explore-tile explore-product"
                  to={`/product/${p.slug}`}
                >
                  <img
                    src={p.image}
                    style={{objectFit:p.imageFit || 'cover'}}
                    alt=""
                  />
                  <div>
                    <strong>{p.name}</strong>
                    <span>VIEW THE STYLE ↗</span>
                  </div>
                </Link>
              ))
            ) : (
              <Link
                className="explore-empty"
                to={`/shop?category=${encodeURIComponent(active)}`}
              >
                <strong>Explore {active}</strong>
                <span>VIEW COLLECTION ↗</span>
              </Link>
            )}
          </div>
          <p className="editorial-note">
            Stock images are editorial inspiration, not photographs of actual
            NEWME products.
          </p>
        </div>
      </div>
    </div>
  );
}
