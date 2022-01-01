export interface IPage {
    parser: DOMParser;
    createEmptyPage: (title?: string) => IPage;
    withStyle: (style: string) => IPage;
    withStyleLink: (style: string) => IPage;
    withHeaderSection: () => IPage;
    withHeaderContent: (content: string) => IPage;
    withContentSection: () => IPage;
    withContent: (content: string) => IPage;
}

export interface IStringPage extends IPage {
    html: string;
    parsedHtml: Document;
    setHtmlWithDocument: (document: Document) => void;
}

export interface IHtmlPage extends IPage {
    document: Document;
}

export class StringPage implements IStringPage {
    html: string = '';
    parser: DOMParser = new DOMParser();
    parsedHtml: Document = this.parser.parseFromString(this.html, 'text/html');

    //renderPipe = (...fns) => (arg) => fns.reduce((value, fn) => fn(value), arg);

    setHtmlWithDocument = (document: Document) => {
        this.html = document.documentElement.outerHTML;
    };

    createEmptyPage = (title?: string) => {
        let document = new Document();
        document = document.implementation.createHTMLDocument(title);
        this.setHtmlWithDocument(document);
        return this;
    };

    withStyle = (style: string) => {
        if (isNullOrEmpty(style)) {
            return this;
        }
        const head = this.parsedHtml.querySelector('head');
        const styleNode = this.parsedHtml.createElement('style');

        styleNode.textContent = style;
        head!.appendChild(styleNode);

        this.setHtmlWithDocument(this.parsedHtml);
        return this;
    };

    withStyleLink = (styleUrl: string) => {
        if (isNullOrEmpty(styleUrl)) {
            return this;
        }

        const head = this.parsedHtml.querySelector('head');
        const styleNode = this.parsedHtml.createElement('link');
        styleNode.rel = 'stylesheet';
        styleNode.type = 'text/css';
        styleNode.href = styleUrl;

        head!.appendChild(styleNode);

        this.setHtmlWithDocument(this.parsedHtml);
        return this;
    };

    withHeaderSection = () => {
        const body = this.parsedHtml.body;
        const headerSectionNode = this.parsedHtml.createElement('div');
        headerSectionNode.id = 'header-section';
        headerSectionNode.className = 'header-section';

        body.insertBefore(headerSectionNode, body.firstChild);

        this.setHtmlWithDocument(this.parsedHtml);
        return this;
    };

    withHeaderContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const body = this.parsedHtml.body;
        const headerSectionNode = body.querySelector('#header-section');

        if (headerSectionNode) {
            headerSectionNode.textContent = content;
            this.setHtmlWithDocument(this.parsedHtml);
        }

        return this;
    };

    withContentSection = () => {
        const body = this.parsedHtml.body;
        const contentSection = this.parsedHtml.createElement('div');
        contentSection.id = 'content-section';
        contentSection.className = 'content-section';

        body.appendChild(contentSection);

        this.setHtmlWithDocument(this.parsedHtml);
        return this;
    };

    withContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const body = this.parsedHtml.body;
        const contentSectionNode = body.querySelector('#content-section');

        if (contentSectionNode) {
            contentSectionNode.textContent = content;
            this.setHtmlWithDocument(this.parsedHtml);
        }

        return this;
    };
}

export class HtmlPage implements IHtmlPage {
    document: Document = new Document();
    parser: DOMParser = new DOMParser();

    createEmptyPage = (title?: string) => {
        this.document = this.document.implementation.createHTMLDocument(title);
        return this;
    };

    withStyle = (style: string) => {
        if (isNullOrEmpty(style)) {
            return this;
        }
        const head = this.document.querySelector('head');
        const styleNode = this.document.createElement('style');

        styleNode.textContent = style;
        head!.appendChild(styleNode);

        return this;
    };

    withStyleLink = (styleUrl: string) => {
        if (isNullOrEmpty(styleUrl)) {
            return this;
        }

        const head = this.document.querySelector('head');
        const styleNode = this.document.createElement('link');
        styleNode.rel = 'stylesheet';
        styleNode.type = 'text/css';
        styleNode.href = styleUrl;

        head!.appendChild(styleNode);

        return this;
    };

    withHeaderSection = () => {
        const body = this.document.body;
        const headerSectionNode = this.document.createElement('div');
        headerSectionNode.id = 'header-section';
        headerSectionNode.className = 'header-section';

        body.insertBefore(headerSectionNode, body.firstChild);

        return this;
    };

    withHeaderContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const body = this.document.body;
        const headerSectionNode = body.querySelector('#header-section');

        if (headerSectionNode) {
            headerSectionNode.textContent = content;
        }

        return this;
    };

    withContentSection = () => {
        const body = this.document.body;
        const contentSection = this.document.createElement('div');
        contentSection.id = 'content-section';
        contentSection.className = 'content-section';

        body.appendChild(contentSection);

        return this;
    };

    withContent = (content: string) => {
        if (isNullOrEmpty(content)) {
            return this;
        }

        const body = this.document.body;
        const contentSectionNode = body.querySelector('#content-section');

        if (contentSectionNode) {
            contentSectionNode.textContent = content;
        }

        return this;
    };
}

export const bootstrapStringPage = () => {
    return new StringPage().createEmptyPage().withHeaderSection().withContentSection();
};

export const bootstrapHtmlPage = () => {
    return new HtmlPage().createEmptyPage().withHeaderSection().withContentSection();
};

const isNullOrEmpty = (value: string) => {
    if (!value || value.trim() === '' || value.trim().length === 0) {
        return true;
    }

    return false;
};
