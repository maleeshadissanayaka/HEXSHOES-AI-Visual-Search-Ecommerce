import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import "./Ticker.css";
export default function Ticker() {
  return (
    <div className="ticker">
      <div className="wrap ticker-inner">
        <span>
          <Icon name="truck" />
          <span>
            BUILT FOR MOVEMENT
            <small>Considered footwear. New perspectives.</small>
          </span>
        </span>
        <span>
          <span>
            FW26 / COLLECTION<small>Explore the HEX design direction</small>
          </span>
        </span>
        <span>
          <Icon name="box" />
          <span>
            EVERYDAY / BEYOND<small>Find your next move</small>
          </span>
        </span>
        <Link to="/visual-search">
          <Icon name="search" />
          <span>
            AI VISUAL SEARCH<small>Explore similar styles</small>
          </span>
        </Link>
        <span className="ticker-location">CATALOG / USD</span>
      </div>
    </div>
  );
}
