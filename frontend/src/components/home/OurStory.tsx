import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import "./OurStory.css";
export default function OurStory() {
  return (
    <section className="story" id="story" data-reveal>
      <img
        className="story-image"
        src="/editorial/story.webp"
        srcSet="/editorial/story-800.webp 800w, /editorial/story.webp 1600w"
        sizes="100vw"
        alt="A backpacker overlooking a mountain city at sunset"
        loading="lazy"
      />
      <div className="wrap story-inner">
        <div className="story-copy">
          <span className="eyebrow">OUR STORY</span>
          <h2>
            More Than
            <br />
            Just Shoes.
          </h2>
          <p>
            HEXSHOES combines performance-focused footwear with intelligent
            technology and data-driven discovery to create a smarter shopping
            experience.
          </p>
          <Link className="btn btn-solid" to="/about">
            OUR STORY <Icon name="arrow" />
          </Link>
        </div>
        <div className="story-words">
          <span>MOVEMENT</span>
          <span>PEOPLE</span>
          <span>TECHNOLOGY</span>
          <span>A BRIGHTER TOMORROW</span>
        </div>
      </div>
    </section>
  );
}
