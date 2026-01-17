import { definePage, component, head, body, main, el, h1, p, title } from '../dist/index.js';

const Hero = component('Hero', () =>
    el('section', { id: 'hero', className: 'hero' }, h1('Build from the backend'), p('No frontend logic required.'))
);

const SiteHead = component('SiteHead', () => title('Shwimple Demo'));

const page = definePage('Shwimple Demo', head(SiteHead), body(main(Hero)));
const html = page.renderToString();

console.log(html);
