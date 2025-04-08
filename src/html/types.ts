export interface HtmlParseResult {
    body: HTMLElement;
    head?: HTMLElement;
}

export interface ParsedHead {
    title: string;
    metaTags: HTMLMetaElement[];
    linkTags: HTMLLinkElement[];
    styleTags: HTMLStyleElement[];
}

export interface ParseHtmlOptions {
    sanitize?: boolean;
    container?: HTMLElement;
    fetchExternalStylesheets?: boolean;
    //fetchExternalFonts?: boolean;
    extractStyleElements?: boolean;
    convertStyles?: boolean;
    preprocessHtml?: boolean; // Enable/disable HTML pre-processing to remove empty elements and normalize structure
    //acceptedFonts?: string[];
}