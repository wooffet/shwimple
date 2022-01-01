import { HtmlPage } from '../HtmlPage/HtmlPage';
import { StringPage } from '../StringPage/StringPage';
import { ShwimplePage } from './ShwimplePage';

//renderPipe = (...fns) => (arg) => fns.reduce((value, fn) => fn(value), arg);

export class ShwimplePageBuilder {
    static buildPage<HtmlPage>(): ShwimplePage<HtmlPage>;
    static buildPage<T extends HtmlPage | StringPage>(): ShwimplePage<T>;

    static buildPage<T>(): unknown {
        return new ShwimplePage<T>().page.createEmptyPage().withHeaderSection().withContentSection();
    }
}
