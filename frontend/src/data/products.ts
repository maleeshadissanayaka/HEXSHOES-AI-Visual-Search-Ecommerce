export interface Product {
    id: string;
    name: string;
    tag: string;
    desc: string;
    image?: string;
    catalogFilename?: string;
    sizes?: number[];
    price: string;
}
