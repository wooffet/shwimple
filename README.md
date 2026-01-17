# shwimple

shwimple - an opinionated, backend-first HTML builder for composing pages without a frontend framework

npm: <https://www.npmjs.com/package/shwimple>
demo app: <https://github.com/wooffet/shwimple-demo>

SemVer: Starting from `4.0.0`, releases follow semantic versioning.

## What is it?

shwimple lets you assemble HTML documents using reusable functions (components) on the server. It favors a simple, consistent structure so you can build full pages without writing frontend JavaScript logic or a separate templating layer.

## Usage (component-style helpers)

```ts
import { definePage, component, head, body, main, el, h1, p, title, cx } from 'shwimple';

const Hero = component('Hero', () =>
    el(
        'section',
        { id: 'hero', className: cx('hero', 'text-center', 'mt-10') },
        h1('Build from the backend'),
        p('No frontend logic required.')
    )
);

const SiteHead = component('SiteHead', () => title('Shwimple Demo'));

const page = definePage('Shwimple Demo', head(SiteHead), body(main(Hero)));
const html = page.renderToString();
```

## Boilerplate layouts

Built-in layouts: `standard`, `docs`, `landing`.

```ts
import { definePageWithBoilerplate, head, body, main } from 'shwimple';

const page = definePageWithBoilerplate(
    'docs',
    'Docs Site',
    head(() => null),
    body(main(() => null))
);
const html = page.renderToString();
```

### Head metadata helpers

```ts
import { head, metaCharset, metaViewport, stylesheet } from 'shwimple';

const headBlock = head(() => [metaCharset(), metaViewport(), stylesheet('https://cdn.example.com/app.css')]);
```

### Run layout examples

```bash
npm run example:standard
npm run example:docs
npm run example:landing
npm run example:charts
npm run example:htmx
npm run example:alpine
```

## Example: Chart.js from CDN

This example pulls Chart.js from a CDN and renders a few charts with fake data.

```ts
import { definePageWithBoilerplate, head, body, main, el, h1, p, script, style } from 'shwimple';

const Charts = () =>
    el(
        'section',
        { id: 'charts', className: 'charts' },
        h1('Charts Demo'),
        p('Chart.js loaded from CDN'),
        el(
            'div',
            { className: 'grid' },
            el('canvas', { id: 'salesChart' }),
            el('canvas', { id: 'trafficChart' }),
            el('canvas', { id: 'regionChart' })
        )
    );

const page = definePageWithBoilerplate(
    'standard',
    'Charts Demo',
    head(() => [
        script({ attrs: { src: 'https://cdn.jsdelivr.net/npm/chart.js' } }),
        script(
            {
                attrs: { type: 'text/javascript' },
            },
            `
            window.addEventListener('load', () => {
                const sales = document.getElementById('salesChart');
                const traffic = document.getElementById('trafficChart');
                const region = document.getElementById('regionChart');

                new Chart(sales, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        datasets: [{ label: 'Sales', data: [12, 19, 7, 14, 9] }]
                    }
                });

                new Chart(traffic, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        datasets: [{ label: 'Visitors', data: [120, 180, 90, 200, 160] }]
                    }
                });

                new Chart(region, {
                    type: 'pie',
                    data: {
                        labels: ['Americas', 'EMEA', 'APAC'],
                        datasets: [{ label: 'Regions', data: [45, 30, 25] }]
                    }
                });
            });
        `
        ),
    ]),
    body(main(Charts))
);

const html = page.renderToString();
```

## Reactivity (3rd-party scripts)

shwimple keeps the core non-reactive. For interactive behavior, use lightweight libraries such as htmx or Alpine.js.

```ts
import { el, dataAttrs, ariaAttrs } from 'shwimple';

const button = el(
    'button',
    {
        className: 'btn',
        attrs: {
            ...dataAttrs({ action: 'toggle', target: 'details' }),
            ...ariaAttrs({ expanded: false, controls: 'details' }),
        },
    },
    'Toggle'
);
```

### Example: htmx (CDN)

```ts
import { definePageWithBoilerplate, head, body, main, el, h1, p, script } from 'shwimple';

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
```

### Example: Alpine.js (CDN)

```ts
import { definePageWithBoilerplate, head, body, main, el, h1, p, script, style } from 'shwimple';

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
```

## TODO

-   Add a plugin system to extend functionality without changing core behavior
