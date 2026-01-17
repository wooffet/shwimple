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

### Run layout examples

```bash
npm run example:standard
npm run example:docs
npm run example:landing
npm run example:charts
```

## Example: Chart.js from CDN

This example pulls Chart.js from a CDN and renders a few charts with fake data.

```ts
import { definePageWithBoilerplate, head, body, main, el, h1, p, script } from 'shwimple';

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

## TODO

-   Add HTML escaping for text and attributes
-   Implement recursive query helpers (e.g., `querySelectorById`)
-   Add convenience helpers for head metadata (charset, viewport, stylesheet)
