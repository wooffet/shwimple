import { IHtmlPage } from '../HtmlPage/IHtmlPage';
import { IStringPage } from '../StringPage/IStringPage';

export interface IShwimplePage {
    page: IHtmlPage | IStringPage;
}
