import { IStringPage } from './IStringPage';
import { isNullOrEmpty } from '../utils/IsNullOrEmpty';

export class StringPage implements IStringPage {
    html: string = '';
    parser: DOMParser = new DOMParser();
    parsedHtml: Document = this.parser.parseFromString(this.html, 'text/html');

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
