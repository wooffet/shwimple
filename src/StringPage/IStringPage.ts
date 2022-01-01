import { IPage } from '../Page/IPage';

export interface IStringPage extends IPage {
    html: string;
    parsedHtml: Document;
    setHtmlWithDocument: (document: Document) => void;
}
