export interface IShwimpleDocument {
    mainNode: ShwimpleMainNode;
    headNode: ShwimpleHeadNode;
    bodyNode: ShwimpleBodyNode;
    childNodes: ShwimpleNode[];
    // createBoilerplateDocument: (title?: string) => ShwimpleDocument;
    // createEmptyDocument: () => ShwimpleDocument;
    createElement: (tag: string, id: string, className?: string) => ShwimpleNode;
    querySelectorById: (nodeId: string) => ShwimpleNode | null;
    querySelectorByIndex: (nodeIndex: number) => ShwimpleNode | null;
    getHead: () => ShwimpleNode;
    getBody: () => ShwimpleNode;
    getHtmlAsString: () => string | null;
}

export interface IShwimpleNode {
    appendChild: (child: ShwimpleNode) => void;
    children?: ShwimpleNode[];
    insertBefore: (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => void;
    insertAfter: (nodeToInsert: ShwimpleNode, locatorNode: ShwimpleNode) => void;
    getParent: () => ShwimpleNode; // TODO: Always return top level node if already main parent node e.g. <html></html>
    tag: string;
    textContent?: string;
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
        this.html = '';
    }

    static createBoilerplateDocument = (title?: string) => {
        const doc = new ShwimpleDocument();
        const titleNode = new ShwimpleNode('title', title);
        const headerSectionNode = new ShwimpleElementNode('div', 'header-section', 'header-section');
        const contentSectionNode = new ShwimpleElementNode('div', 'content-section', 'content-section');
        doc.headNode.appendChild(titleNode);
        doc.bodyNode.appendChild(headerSectionNode);
        doc.bodyNode.appendChild(contentSectionNode);
        return doc;
    };
    static createEmptyDocument = () => {
        return new ShwimpleDocument();
    };
    createElement = (tag: string, id: string, className?: string) => {
        return new ShwimpleElementNode(tag, id, className);
    };
    querySelectorById = (nodeId: string) => {
        let result: ShwimpleNode | null = null;
        const node = this.childNodes.find((n) => n instanceof ShwimpleElementNode && n.id === nodeId);

        if (node) {
            result = node;
        }

        return result;
    };
    querySelectorByIndex = (nodeIndex: number) => {
        let result: ShwimpleNode | null = null;

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

    private html: string;
    getHtmlAsString = () => {
        if (!this.mainNode) {
            return null;
        }

        this.html = `<${this.mainNode.tag}>`;

        this.childNodes.forEach((node) => {
            this.parseChildNodes(node);
        });

        this.html += `</${this.mainNode.tag}>`;

        return this.html;
    };

    private parseChildNodes = (node: ShwimpleNode) => {
        this.html += `<${node.tag}>`;

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
}

export class ShwimpleNode implements IShwimpleNode {
    children?: ShwimpleNode[];
    tag: string;
    textContent?: string;

    constructor(tag: string, textContent?: string) {
        this.tag = tag;
        this.textContent = textContent;
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

    constructor(tag: string, id: string, className?: string, textContent?: string) {
        super(tag, textContent);
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
