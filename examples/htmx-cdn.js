import { definePageWithBoilerplate, head, body, main, el, h1, p, script, style } from '../dist/index.js';

const HtmxDemo = () =>
    el(
        'section',
        { id: 'htmx-demo', className: 'demo' },
        h1('htmx Demo'),
        p('This button uses htmx attributes.'),
        el(
            'button',
            {
                className: 'btn',
                attrs: {
                    'hx-get': '/demo',
                    'hx-target': '#htmx-output',
                    'hx-swap': 'innerHTML',
                },
            },
            'Load content'
        ),
        el('div', { id: 'htmx-output', className: 'output' }, 'Waiting for response...')
    );

const page = definePageWithBoilerplate(
    'standard',
    'htmx Demo',
    head(() => [
        style(`
            body { font-family: system-ui, sans-serif; padding: 2rem; }
            .demo { display: grid; gap: 0.75rem; max-width: 480px; }
            .btn { background: #2563eb; color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; }
            .output { padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; }
        `),
        script({ attrs: { src: 'https://unpkg.com/htmx.org@1.9.10' } }),
    ]),
    body(main(HtmxDemo))
);

console.log(page.renderToString());
