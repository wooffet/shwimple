# shwimple

shwimple - a simple backend HTML writer/renderer

npm: <https://www.npmjs.com/package/shwimple>
demo app: <https://github.com/wooffet/shwimple-demo>

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
```

## TODO

-   ~~Implement `ShwimplePageBuilder`~~
    -   ~~Implement `renderPipe` functionality~~
-   Implement `insertBefore`, `insertAfter`, `getParent` functions in `ShwimpleNode`
    -   getParent -> always return top level node if already main parent node e.g. <html></html>
-   ~~Move `ShwimpleDocument.createBoilerplateDocument` to semantic HTML~~
-   Add tests
