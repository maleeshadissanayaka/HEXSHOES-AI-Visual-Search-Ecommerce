import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import { useProducts } from "../../hooks/useStore";
import { matchesCategory } from "../../utils/product";
const categories = [
  {
    name: "RUNNERS",
    subtitle: "Speed meets style",
    image: "/editorial/hero-grid-800.webp",
  },
  {
    name: "TRAIL & BOOT",
    subtitle: "Built for more",
    image: "/editorial/trail-800.webp",
  },
  {
    name: "SLIDES",
    subtitle: "All-day comfort",
    image: "/editorial/slides-800.webp",
  },
];
import "./BrandSections.css";
export default function CategorySection() {
  const { products } = useProducts();
  return (
    <section className="cats section-space" id="cats" data-reveal>
      <div className="wrap">
        <div className="section-heading">
          <h2>SHOP BY CATEGORY</h2>
          <Link to="/shop">
            VIEW ALL <Icon name="arrow" />
          </Link>
        </div>
        <p className="catalog-note">
          Campaign concepts. Category assignments await verified product data.
        </p>
        <div className="cat-grid">
          {categories.map((category) => (
            <Link
              className="cat-tile"
              to={
                products.some((p) =>
                  matchesCategory(
                    p,
                    category.name === "TRAIL & BOOT"
                      ? "Trail & Boot"
                      : category.name === "RUNNERS"
                        ? "Runners"
                        : "Slides",
                  ),
                )
                  ? `/shop?category=${encodeURIComponent(category.name === "TRAIL & BOOT" ? "Trail & Boot" : category.name === "RUNNERS" ? "Runners" : "Slides")}`
                  : "/shop"
              }
              key={category.name}
            >
              <img src={category.image} alt="" loading="lazy" />
              <div className="category-copy">
                <h3>{category.name}</h3>
                <p>{category.subtitle}</p>
              </div>
              <span className="round-arrow">
                <Icon name="arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
