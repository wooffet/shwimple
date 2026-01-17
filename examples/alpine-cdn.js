import { definePageWithBoilerplate, head, body, main, el, h1, p, script, style } from '../dist/index.js';

const AlpineDemo = () =>
    el(
        'section',
        { id: 'alpine-demo', className: 'demo', attrs: { 'x-data': '{ count: 0 }' } },
        h1('Alpine.js Demo'),
        p('A simple counter with x-data and x-on.'),
        el('button', { className: 'btn', attrs: { 'x-on:click': 'count++' } }, 'Increment'),
        el('span', { className: 'count', attrs: { 'x-text': 'count' } })
    );

const page = definePageWithBoilerplate(
    'standard',
    'Alpine Demo',
    head(() => [
        style(`
            body { font-family: system-ui, sans-serif; padding: 2rem; }
            .demo { display: grid; gap: 0.75rem; max-width: 480px; }
            .btn { background: #111827; color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; }
            .count { font-weight: 600; }
        `),
        script({ attrs: { defer: '', src: 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js' } }),
    ]),
    body(main(AlpineDemo))
);

console.log(page.renderToString());
