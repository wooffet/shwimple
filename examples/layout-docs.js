import { definePageWithBoilerplate, head, body, main, h1, p, title } from '../dist/index.js';

const page = definePageWithBoilerplate(
    'docs',
    'Docs Layout',
    head(() => title('Docs Layout')),
    body(
        main(() => [h1('Docs Layout'), p('Adds an aside section for docs navigation.')])
    )
);

console.log(page.renderToString());
