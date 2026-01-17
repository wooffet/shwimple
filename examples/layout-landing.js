import { definePageWithBoilerplate, head, body, main, h1, p, title } from '../dist/index.js';

const page = definePageWithBoilerplate(
    'landing',
    'Landing Layout',
    head(() => title('Landing Layout')),
    body(
        main(() => [h1('Landing Layout'), p('No nav by default, focused layout.')])
    )
);

console.log(page.renderToString());
