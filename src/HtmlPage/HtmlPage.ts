import { isNullOrEmpty } from '../utils/IsNullOrEmpty';
import { IHtmlPage } from './IHtmlPage';

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
