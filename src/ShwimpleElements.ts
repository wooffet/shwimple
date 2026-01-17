import { ShwimpleElementNode, ShwimpleNode, ShwimpleTextNode } from './ShwimpleDocument';

export type ShwimpleAttributes = {
    id?: string;
    className?: string;
    attrs?: Record<string, string>;
};

export type ShwimpleChild = ShwimpleNode | string | number | boolean | null | undefined;

type ElementFactory = (attrsOrChild?: ShwimpleAttributes | ShwimpleChild, ...children: ShwimpleChild[]) => ShwimpleNode;

const isAttributes = (value: unknown): value is ShwimpleAttributes => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    if (value instanceof ShwimpleNode || value instanceof ShwimpleTextNode) {
        return false;
    }

    return true;
};

const normalizeChildren = (children: ShwimpleChild[]) => {
    const nodes: ShwimpleNode[] = [];

    children.forEach((child) => {
        if (child === null || child === undefined || child === false) {
            return;
        }

        if (child instanceof ShwimpleNode) {
            nodes.push(child);
            return;
        }

        nodes.push(new ShwimpleTextNode(String(child)));
    });

    return nodes;
};

export const text = (value: string | number | boolean) => new ShwimpleTextNode(String(value));

export const el = (tag: string, attrsOrChild?: ShwimpleAttributes | ShwimpleChild, ...restChildren: ShwimpleChild[]) => {
    let attrs: ShwimpleAttributes | undefined;
    let children: ShwimpleChild[] = [];

    if (isAttributes(attrsOrChild)) {
        attrs = attrsOrChild;
        children = restChildren;
    } else if (attrsOrChild !== undefined) {
        children = [attrsOrChild, ...restChildren];
    } else {
        children = restChildren;
    }

    const node = attrs ? new ShwimpleElementNode(tag, attrs.id ?? '', attrs.className) : new ShwimpleNode(tag);

    if (attrs?.attrs) {
        node.attributes = { ...attrs.attrs };
    }

    const normalizedChildren = normalizeChildren(children);
    normalizedChildren.forEach((child) => node.appendChild(child));

    return node;
};

const createElementFactory =
    (tag: string): ElementFactory =>
    (attrsOrChild?: ShwimpleAttributes | ShwimpleChild, ...children: ShwimpleChild[]) =>
        el(tag, attrsOrChild as ShwimpleAttributes | ShwimpleChild, ...children);

export const div = createElementFactory('div');
export const span = createElementFactory('span');
export const section = createElementFactory('section');
export const header = createElementFactory('header');
export const footer = createElementFactory('footer');
export const nav = createElementFactory('nav');
export const h1 = createElementFactory('h1');
export const h2 = createElementFactory('h2');
export const h3 = createElementFactory('h3');
export const p = createElementFactory('p');
export const ul = createElementFactory('ul');
export const ol = createElementFactory('ol');
export const li = createElementFactory('li');
export const a = createElementFactory('a');
export const img = createElementFactory('img');
export const button = createElementFactory('button');
export const input = createElementFactory('input');
export const form = createElementFactory('form');
export const label = createElementFactory('label');
export const strong = createElementFactory('strong');
export const em = createElementFactory('em');
export const code = createElementFactory('code');
export const pre = createElementFactory('pre');
export const br = createElementFactory('br');
export const title = createElementFactory('title');
export const meta = createElementFactory('meta');
export const link = createElementFactory('link');
export const script = createElementFactory('script');
export const style = createElementFactory('style');
