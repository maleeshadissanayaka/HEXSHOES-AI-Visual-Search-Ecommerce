import type { ReactNode } from 'react';
type IconName = 'search' | 'heart' | 'bag' | 'menu' | 'close' | 'arrow' | 'play' | 'truck' | 'shield' | 'box' | 'upload' | 'chat' | 'instagram' | 'facebook' | 'video';
const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></>,
    heart: <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>,
    bag: <><path d="M3 3h2l3 13h11l3-10H6"/><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    play: <path d="m9 5 11 7-11 7Z"/>,
    truck: <><path d="M2 5h12v12H2M14 9h4l4 5v3h-8M2 9H0M2 13H0"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/></>,
    shield: <path d="m12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6l9-4Zm-4 10 3 3 5-6"/>,
    box: <path d="m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10L2 7m10 5 10-5M12 12v10M7 4.5l10 5"/>,
    upload: <path d="M7 18H5a4 4 0 0 1-1-8 7 7 0 0 1 13-3 5.5 5.5 0 0 1 2 11h-2M12 20V11m-4 4 4-4 4 4"/>,
    chat: <path d="M20 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    facebook: <path d="M14 22V13h3l1-4h-4V6c0-1 1-2 2-2h2V1h-3c-4 0-5 2-5 5v3H7v4h3v9"/>,
    video: <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/></>,
};
export default function Icon({ name, className = '' }: {
    name: IconName;
    className?: string;
}) {
    return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
