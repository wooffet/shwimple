export interface IPage {
    parser: DOMParser;
    createEmptyPage: (title?: string) => IPage;
    withStyle: (style: string) => IPage;
    withStyleLink: (style: string) => IPage;
    withHeaderSection: () => IPage;
    withHeaderContent: (content: string) => IPage;
    withContentSection: () => IPage;
    withContent: (content: string) => IPage;
}
