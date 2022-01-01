import { HtmlPage } from '../HtmlPage/HtmlPage';
import { IHtmlPage } from '../HtmlPage/IHtmlPage';
import { IStringPage } from '../StringPage/IStringPage';
import { StringPage } from '../StringPage/StringPage';
import { IShwimplePage } from './IShwimplePage';

export class ShwimplePage<T = IHtmlPage | IStringPage> implements IShwimplePage {
    page: IHtmlPage | IStringPage;

    constructor() {
        const pageType = <T>{};
        if (pageType instanceof HtmlPage) {
            this.page = new HtmlPage().createEmptyPage().withHeaderSection().withContentSection();
        } else if (pageType instanceof StringPage) {
            this.page = new StringPage().createEmptyPage().withHeaderSection().withContentSection();
        } else {
            throw Error('Invalid page type: ' + typeof pageType);
        }
    }
}
