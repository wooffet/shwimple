export interface IShwimpleDocument {
    mainNode: ShwimpleMainNode;
    headNode: ShwimpleHeadNode;
    bodyNode: ShwimpleBodyNode;
    childNodes: ShwimpleNode[];
    createElement: (tag: string, id: string, className?: string) => ShwimpleNode;
    querySelectorById: (nodeId: string) => ShwimpleNode | undefined;
    querySelectorByIndex: (nodeIndex: number) => ShwimpleNode | undefined;
    getHead: () => ShwimpleNode;
    getBody: () => ShwimpleNode;
    getHtmlAsString: () => string | undefined;
}

export interface IShwimpleNode {
    appendChild: (child: ShwimpleNode) => void;
    children?: ShwimpleNode[];
    insertBefore: (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => void;
    insertAfter: (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => void;
    getParent: () => ShwimpleNode; // TODO: Always return top level node if already main parent node e.g. <html></html>
    tag: string;
    textContent?: string;
    attributes?: Record<string, string>;
}

export interface IShwimpleElementNode extends IShwimpleNode {
    className?: string;
    id: string;
}

export interface IShwimpleHeadElementNode extends IShwimpleNode {
    rel?: string;
    typeName?: string;
    href?: string;
}

export type ShwimpleBoilerplateLayout = 'standard' | 'docs' | 'landing';

export class ShwimpleDocument implements IShwimpleDocument {
    mainNode: ShwimpleNode;
    headNode: ShwimpleHeadNode;
    bodyNode: ShwimpleBodyNode;
    childNodes: ShwimpleNode[];

    constructor() {
        this.childNodes = [];
        this.mainNode = new ShwimpleNode('html');
        this.headNode = new ShwimpleHeadNode();
        this.bodyNode = new ShwimpleBodyNode();
        this.childNodes.push(this.headNode);
        this.childNodes.push(this.bodyNode);
    }

    static createBoilerplateDocument = (title?: string, layout: ShwimpleBoilerplateLayout = 'standard') => {
        const doc = new ShwimpleDocument();
        const charsetNode = new ShwimpleNode('meta', undefined, { charset: 'utf-8' });
        const viewportNode = new ShwimpleNode('meta', undefined, {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
        });
        const titleNode = new ShwimpleNode('title', title ?? '');
        const headerSectionNode = new ShwimpleElementNode('header', 'header-section', 'header-section');
        const contentSectionNode = new ShwimpleElementNode('main', 'content-section', 'content-section');
        const footerSectionNode = new ShwimpleElementNode('footer', 'footer-section', 'footer-section');
        doc.headNode.appendChild(charsetNode);
        doc.headNode.appendChild(viewportNode);
        doc.headNode.appendChild(titleNode);

        if (layout !== 'landing') {
            const navSectionNode = new ShwimpleElementNode('nav', 'nav-section', 'nav-section');
            headerSectionNode.appendChild(navSectionNode);
        }

        doc.bodyNode.appendChild(headerSectionNode);
        doc.bodyNode.appendChild(contentSectionNode);

        if (layout === 'docs') {
            const asideSectionNode = new ShwimpleElementNode('aside', 'aside-section', 'aside-section');
            doc.bodyNode.appendChild(asideSectionNode);
        }

        doc.bodyNode.appendChild(footerSectionNode);
        return doc;
    };
    static createEmptyDocument = () => {
        return new ShwimpleDocument();
    };
    createElement = (tag: string, id: string, className?: string) => {
        return new ShwimpleElementNode(tag, id, className);
    };
    querySelectorById = (nodeId: string) => {
        let result: ShwimpleNode | undefined = undefined;
        const node = this.childNodes.find((n) => n instanceof ShwimpleElementNode && n.id === nodeId);

        if (node) {
            result = node;
        }

        return result;
    };
    querySelectorByIndex = (nodeIndex: number) => {
        let result: ShwimpleNode | undefined = undefined;

        if (nodeIndex > this.childNodes.length) {
            return result;
        }

        const node = this.childNodes[nodeIndex];
        if (node) {
            result = node;
        }

        return result;
    };
    getHead = () => this.headNode;
    getBody = () => this.bodyNode;

    private html: string = '';
    getHtmlAsString = () => {
        if (!this.mainNode) {
            return undefined;
        }

        this.html = `<${this.mainNode.tag}>`;

        this.childNodes.forEach((node) => {
            this.parseChildNodes(node);
        });

        this.html += `</${this.mainNode.tag}>`;

        return this.html;
    };

    private parseChildNodes = (node: ShwimpleNode) => {
        if (node instanceof ShwimpleTextNode) {
            if (node.textContent) {
                this.html += node.textContent;
            }

            return;
        }

        const attributes = this.getAttributes(node);
        this.html += `<${node.tag}${attributes}>`;

        if (node.textContent) {
            this.html += node.textContent;
        }

        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                this.parseChildNodes(child);
            });
        }

        this.html += `</${node.tag}>`;
    };

    private getAttributes = (node: ShwimpleNode) => {
        const attributes: Record<string, string> = { ...(node.attributes ?? {}) };

        if (node instanceof ShwimpleElementNode) {
            if (node.id) {
                attributes.id = node.id;
            }

            if (node.className) {
                attributes.class = node.className;
            }
        }

        const pairs = Object.entries(attributes)
            .filter(([, value]) => value !== undefined && value !== '')
            .map(([key, value]) => {
                const attributeKey = key === 'className' ? 'class' : key;
                return `${attributeKey}="${value}"`;
            });

        if (pairs.length === 0) {
            return '';
        }

        return ` ${pairs.join(' ')}`;
    };
}

export class ShwimpleNode implements IShwimpleNode {
    children?: ShwimpleNode[];
    tag: string;
    textContent?: string;
    attributes?: Record<string, string>;

    constructor(tag: string, textContent?: string, attributes?: Record<string, string>) {
        this.tag = tag;
        this.textContent = textContent;
        this.attributes = attributes;
    }

    appendChild = (child: ShwimpleNode) => {
        if (!this.children) {
            this.children = [];
        }

        this.children.push(child);
    };
    insertBefore = (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => {};
    insertAfter = (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => {};
    getParent = () => {
        return this;
    };
}

export class ShwimpleElementNode extends ShwimpleNode implements IShwimpleElementNode {
    className?: string;
    id: string;

    constructor(tag: string, id: string, className?: string, textContent?: string, attributes?: Record<string, string>) {
        super(tag, textContent, attributes);
        this.id = id;
        this.className = className;
    }
}

export class ShwimpleHeadElementNode extends ShwimpleNode implements IShwimpleHeadElementNode {
    rel?: string;
    typeName?: string;
    href?: string;

    constructor(rel?: string, typeName?: string, href?: string, textContent?: string) {
        super('head', textContent);
        this.rel = rel;
        this.typeName = typeName;
        this.href = href;
    }
}

export class ShwimpleTextNode extends ShwimpleNode implements IShwimpleNode {
    constructor(textContent: string) {
        super('#text', textContent);
    }
}

export class ShwimpleMainNode extends ShwimpleNode implements IShwimpleNode {
    constructor() {
        super('html');
    }
}

export class ShwimpleHeadNode extends ShwimpleNode implements IShwimpleNode {
    constructor() {
        super('head');
    }
}

export class ShwimpleBodyNode extends ShwimpleNode implements IShwimpleNode {
    constructor() {
        super('body');
    }
}
