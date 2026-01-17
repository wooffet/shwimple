import { ShwimpleElementNode, ShwimpleNode, ShwimpleTextNode } from './ShwimpleDocument';

export type ShwimpleAttributes = {
    id?: string;
    className?: string;
    classList?: string[];
    attrs?: Record<string, string>;
};

export type ShwimpleChild = ShwimpleNode | string | number | boolean | null | undefined;

export type ShwimpleClassValue = string | number | boolean | null | undefined;
export type ShwimpleAttributeMap = Record<string, string | number | boolean | null | undefined>;

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

export const cx = (...values: ShwimpleClassValue[]) =>
    values
        .flatMap((value) => {
            if (value === null || value === undefined || value === false) {
                return [];
            }

            if (typeof value === 'number') {
                return [String(value)];
            }

            if (typeof value === 'boolean') {
                return [];
            }

            return String(value)
                .split(' ')
                .map((entry) => entry.trim())
                .filter((entry) => entry.length > 0);
        })
        .join(' ');

const normalizeAttributeValue = (value: string | number | boolean | null | undefined) => {
    if (value === null || value === undefined || value === false) {
        return undefined;
    }

    if (value === true) {
        return '';
    }

    return String(value);
};

const prefixAttributes = (prefix: string, attrs: ShwimpleAttributeMap) =>
    Object.entries(attrs).reduce<Record<string, string>>((result, [key, value]) => {
        const normalizedValue = normalizeAttributeValue(value);

        if (normalizedValue === undefined) {
            return result;
        }

        result[`${prefix}${key}`] = normalizedValue;
        return result;
    }, {});

export const dataAttrs = (attrs: ShwimpleAttributeMap) => prefixAttributes('data-', attrs);
export const ariaAttrs = (attrs: ShwimpleAttributeMap) => prefixAttributes('aria-', attrs);

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

    const normalizedClassList = attrs?.classList?.filter((value) => value && value.trim().length > 0) ?? [];
    const classListValue = normalizedClassList.length > 0 ? normalizedClassList.join(' ') : undefined;
    const combinedClassName = [attrs?.className, classListValue].filter(Boolean).join(' ') || undefined;

    const node = attrs ? new ShwimpleElementNode(tag, attrs.id ?? '', combinedClassName) : new ShwimpleNode(tag);

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
export const mainElement = createElementFactory('main');
export const article = createElementFactory('article');
export const aside = createElementFactory('aside');
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

export const metaCharset = (charset: string = 'utf-8') =>
    meta({ attrs: { charset } });

export const metaViewport = (content: string = 'width=device-width, initial-scale=1') =>
    meta({ attrs: { name: 'viewport', content } });

export const stylesheet = (href: string) =>
    link({ attrs: { rel: 'stylesheet', href } });
