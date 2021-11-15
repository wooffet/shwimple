export class Page {
    constructor() {
        this.html = "";
    }

    html: string;
    //renderPipe = (...fns) => (arg) => fns.reduce((value, fn) => fn(value), arg);
    createEmptyPage = () => {
        this.html = `<html><head></head><body></body></html>`;
        return this;
    };
    withTitle = (title: string) => {
        if (isNullOrEmpty(title)) {
            return this;
        }
        const headSection = this.html.split(`<head>`);
        this.html = `<head>${headSection[0]}<title>${title}</title>${headSection[1]}`;

        return this;
    };
    withStyle = (style: string) => {
        if (isNullOrEmpty(style)) {
            return this;
        }
        const headSection = this.html.split(`<head>`);
        this.html = `<head>${headSection[0]}<style>${style}</style>${headSection[1]}`;

        return this;
    };
    //TODO: make proper link tag
    withStyleLink = (style: string) => {
        if (isNullOrEmpty(style)) {
            return this;
        }
        const headSection = this.html.split(`<head>`);
        this.html = `<head>${headSection[0]}<style>${style}</style>${headSection[1]}`;

        return this;
    };
    withHeaderSection = () => {
        const innerBody = this.html.split(`<body>`);
        const headerSection = `<div id="header-section" class="header-section"></div>`;
        this.html = `${innerBody[0]}<body>${headerSection}${innerBody[1]}`;

        return this;
    };
    withHeaderContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const hasHeaderSection = this.html.includes("header-section");
        if (hasHeaderSection) {
            const headerSectionSplit = this.html.split(`<div id="header-section" class="header-section">`);
            this.html = `${headerSectionSplit[0]}<div id="header-section" class="header-section">${content}${headerSectionSplit[1]}`;
        }

        return this;
    };
    withContentSection = () => {
        const contentSection = `<div id="content-section" class="content-section"></div>`;
        const hasHeaderSection = this.html.includes("header-section");
        if (hasHeaderSection) {
            const headerSectionSplit = this.html.split(`</div>`);
            this.html = `${headerSectionSplit[0]}</div>${contentSection}${headerSectionSplit[1]}`;
        } else {
            const innerBody = this.html.split(`<body>`);
            this.html = `${innerBody[0]}<body>${contentSection}${innerBody[1]}`;
        }

        return this;
    };
    withContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const hasContentSection = this.html.includes("content-section");
        if (hasContentSection) {
            const contentSectionSplit = this.html.split(`<div id="content-section" class="content-section">`);
            this.html = `${contentSectionSplit[0]}<div id="content-section" class="content-section">${content}${contentSectionSplit[1]}`;
        }

        return this;
    };
};

export const bootstrapPage = () => {
    const page = new Page();
    page.createEmptyPage().withHeaderSection().withContentSection();
    return page;
};

const isNullOrEmpty = (value: string) => {
    if (!value || value.trim() === "" || value.trim().length === 0) {
        return true;
    }

    return false;
};
