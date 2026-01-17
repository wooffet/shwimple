# shwimple

shwimple - a simple backend HTML writer/renderer

npm: <https://www.npmjs.com/package/shwimple>
demo app: <https://github.com/wooffet/shwimple-demo>

## Usage (component-style helpers)

```ts
import { definePage, component, head, body, main, el, h1, p, title } from 'shwimple';

const Hero = component('Hero', () =>
    el('section', { id: 'hero', className: 'hero' }, h1('Build from the backend'), p('No frontend logic required.'))
);

const SiteHead = component('SiteHead', () => title('Shwimple Demo'));

const page = definePage('Shwimple Demo', head(SiteHead), body(main(Hero)));
const html = page.renderToString();
```

## TODO

-   ~~Implement `ShwimplePageBuilder`~~
    -   ~~Implement `renderPipe` functionality~~
-   Implement `insertBefore`, `insertAfter`, `getParent` functions in `ShwimpleNode`
    -   getParent -> always return top level node if already main parent node e.g. <html></html>
-   ~~Move `ShwimpleDocument.createBoilerplateDocument` to semantic HTML~~
-   Add tests
