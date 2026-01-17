import { definePageWithBoilerplate, head, body, main, h1, p, title } from '../dist/index.js';

const page = definePageWithBoilerplate(
    'standard',
    'Standard Layout',
    head(() => title('Standard Layout')),
    body(
        main(() => [h1('Standard Layout'), p('Header, main, footer with nav by default.')])
    )
);

console.log(page.renderToString());
