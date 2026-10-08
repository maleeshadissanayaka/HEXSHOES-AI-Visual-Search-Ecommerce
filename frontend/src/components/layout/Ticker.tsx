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
            FREE SHIPPING WORLDWIDE<small>Orders over $150</small>
          </span>
        </span>
        <span>
          <span>
            FW26 DROP LIVE NOW<small>Limited quantities</small>
          </span>
        </span>
        <span>
          <Icon name="box" />
          <span>
            30-DAY RETURNS<small>Hassle free</small>
          </span>
        </span>
        <Link to="/visual-search">
          <Icon name="search" />
          <span>
            AI VISUAL SEARCH<small>Find your style instantly</small>
          </span>
        </Link>
        <span className="ticker-location">Sri Lanka (LKR)</span>
      </div>
    </div>
  );
}
