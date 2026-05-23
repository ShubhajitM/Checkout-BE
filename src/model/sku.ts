export enum Sku {
    ipd = 'ipd',
    mbp = 'mbp',
    atv = 'atv',
    vga = 'vga',
    hpd = 'hpd'
};

export type SkuKeyType = keyof typeof Sku;