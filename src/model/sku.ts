export enum Sku {
    ipd = 'ipd',
    mbp = 'mbp',
    atv = 'atv',
    vga = 'vga'
};

export type SkuKeyType = keyof typeof Sku;