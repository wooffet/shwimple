import { ShwimpleBodyNode, ShwimpleDocument, ShwimpleElementNode, ShwimpleHeadNode, ShwimpleNode } from './ShwimpleDocument';
import { ShwimpleBuildFunction, ShwimplePageBuilder } from './ShwimplePageBuilder';
import { el, text } from './ShwimpleElements';

export type ShwimpleMountTarget = 'head' | 'body' | 'main';

export type ShwimpleContext = {
    document: ShwimpleDocument;
    head: ShwimpleHeadNode;
    body: ShwimpleBodyNode;
    el: typeof el;
    text: typeof text;
    mount: (target: ShwimpleMountTarget, nodes: ShwimpleNode | ShwimpleNode[]) => void;
};

export type ShwimpleComponent = (context: ShwimpleContext) => ShwimpleNode | ShwimpleNode[] | void;

export type ShwimplePage = {
    render: () => ShwimpleDocument | undefined;
    renderToString: () => string | undefined;
    builder: ShwimplePageBuilder;
};

const normalizeNodes = (nodes?: ShwimpleNode | ShwimpleNode[] | void) => {
    if (!nodes) {
        return [];
    }

    return Array.isArray(nodes) ? nodes : [nodes];
};

const findMainNode = (body: ShwimpleBodyNode) => {
    const nodes = [...(body.children ?? [])];

    while (nodes.length > 0) {
        const current = nodes.shift();

        if (!current) {
            continue;
        }

        if (current instanceof ShwimpleElementNode && (current.tag === 'main' || current.id === 'content-section')) {
            return current;
        }

        if (current.children && current.children.length > 0) {
            nodes.push(...current.children);
        }
    }

    const mainNode = new ShwimpleElementNode('main', 'content-section', 'content-section');
    body.appendChild(mainNode);
    return mainNode;
};

const mountNodes = (target: ShwimpleMountTarget, document: ShwimpleDocument, nodes: ShwimpleNode[]) => {
    if (nodes.length === 0) {
        return;
    }

    if (target === 'head') {
        nodes.forEach((node) => document.getHead().appendChild(node));
        return;
    }

    if (target === 'body') {
        nodes.forEach((node) => document.getBody().appendChild(node));
        return;
    }

    const mainNode = findMainNode(document.getBody() as ShwimpleBodyNode);
    nodes.forEach((node) => mainNode.appendChild(node));
};

const createContext = (document: ShwimpleDocument): ShwimpleContext => ({
    document,
    head: document.getHead() as ShwimpleHeadNode,
    body: document.getBody() as ShwimpleBodyNode,
    el,
    text,
    mount: (target: ShwimpleMountTarget, nodes: ShwimpleNode | ShwimpleNode[]) =>
        mountNodes(target, document, normalizeNodes(nodes)),
});

const section =
    (target: ShwimpleMountTarget, ...components: ShwimpleComponent[]): ShwimpleBuildFunction =>
    (document: ShwimpleDocument) => {
        const context = createContext(document);

        components.forEach((component) => {
            const nodes = normalizeNodes(component(context));
            mountNodes(target, document, nodes);
        });

        return document;
    };

export const component = (name: string, fn: ShwimpleComponent) => {
    const wrapped = fn as ShwimpleComponent & { displayName?: string };
    wrapped.displayName = name;
    return wrapped;
};

export const head = (...components: ShwimpleComponent[]) => section('head', ...components);
export const body = (...components: ShwimpleComponent[]) => section('body', ...components);
export const main = (...components: ShwimpleComponent[]) => section('main', ...components);

export const definePage = (
    titleOrSection?: string | ShwimpleBuildFunction,
    ...sections: ShwimpleBuildFunction[]
): ShwimplePage => {
    let title: string | undefined;
    let buildSections: ShwimpleBuildFunction[] = sections;

    if (typeof titleOrSection === 'string') {
        title = titleOrSection;
    } else if (typeof titleOrSection === 'function') {
        buildSections = [titleOrSection, ...sections];
    }

    const builder = new ShwimplePageBuilder(title);
    buildSections.forEach((section) => builder.addRenderFunction(section));

    return {
        render: () => builder.build(),
        renderToString: () => builder.buildAsString(),
        builder,
    };
};
