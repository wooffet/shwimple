import { definePageWithBoilerplate, head, body, main, el, h1, p, script } from '../dist/index.js';

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
            { attrs: { type: 'text/javascript' } },
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

console.log(page.renderToString());
