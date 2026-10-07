import Icon from './Icon';
import type { InfoTopic } from './InfoModal';
import './OurStory.css';
export default function OurStory({ onOpenInfo }: {
    onOpenInfo: (topic: InfoTopic) => void;
}) {
    return <section className="story" id="story" data-reveal><img className="story-image" src="/editorial/story.png" alt="A backpacker overlooking a mountain city at sunset" loading="lazy"/><div className="wrap story-inner"><div className="story-copy"><div className="eyebrow">OUR STORY</div><h2>More Than<br />Just Shoes.</h2><p>HEXSHOES is a modern footwear experience built around movement, design and intelligent technology.<br />We combine performance-focused products with data-driven discovery to help people find footwear with greater confidence.</p><button type="button" className="btn btn-solid" onClick={() => onOpenInfo('about')}>Our Story <Icon name="arrow"/></button></div><div className="story-words"><span>H O V E R</span><span>ELEGANCE</span><span>XPERIENCE</span></div></div></section>;
}
