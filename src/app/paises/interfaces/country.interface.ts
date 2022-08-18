export interface Country {
    name: Name;
    cca3: string;
    alpha3Code?: string;
    borders?: string [];
}

export interface Name {
    common:     string;
    official:   string;
    nativeName: { [key: string]: NativeName };
}

export interface NativeName {
    official: string;
    common:   string;
}

export interface Borders{
    borders: string []
}
