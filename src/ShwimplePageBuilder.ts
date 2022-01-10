import { ShwimpleDocument } from './ShwimpleDocument';

export type ShwimpleBuildFunction = {
    id?: string;
    (value: ShwimpleDocument): ShwimpleDocument;
};

export type TryAddFuncResult = {
    success: boolean;
    id: string;
};

const buildPipe =
    (...fns: ShwimpleBuildFunction[]) =>
    (arg: ShwimpleDocument) =>
        fns.reduce((value, fn) => fn(value), arg);

export class ShwimplePageBuilder {
    page: ShwimpleDocument;
    buildFunctions: ShwimpleBuildFunction[] = [];

    constructor(title?: string) {
        this.page = ShwimpleDocument.createBoilerplateDocument(title);
    }

    addRenderFunction = (func: ShwimpleBuildFunction) => {
        // TODO: This check can probably be refactored somehow
        if (!func.id) {
            func.id = 'blah'; // TODO: implement proper uuid generation
        }

        this.buildFunctions.push(func);
        return func.id;
    };
    addRenderFunctionAt = (func: ShwimpleBuildFunction, index: number) => {
        if (!func.id) {
            func.id = 'blah'; // TODO: implement proper uuid generation
        }

        this.buildFunctions.splice(index, 0, func);
        return func.id;
    };
    tryAddRenderFunctionBeforeFuncId = (func: ShwimpleBuildFunction, locatorId: string) => {
        if (!func.id) {
            func.id = 'blah'; // TODO: implement proper uuid generation
        }

        const result: TryAddFuncResult = { success: false, id: func.id };

        const funcLocation = this.buildFunctions.findIndex((bf) => bf.id === locatorId);
        const index = funcLocation - 1 < 0 ? 0 : funcLocation - 1;
        if (index) {
            this.buildFunctions.splice(index, 0, func);
            result.success = true;
        }

        return result;
    };
    tryAddRenderFunctionAfterFuncId = (func: ShwimpleBuildFunction, locatorId: string) => {
        if (!func.id) {
            func.id = 'blah'; // TODO: implement proper uuid generation
        }

        const result: TryAddFuncResult = { success: false, id: func.id };

        const funcLocation = this.buildFunctions.findIndex((bf) => bf.id === locatorId);
        const currentLastIndex = this.buildFunctions.length - 1;
        const index = funcLocation + 1 > currentLastIndex ? currentLastIndex : funcLocation - 1;
        if (index) {
            this.buildFunctions.splice(index, 0, func);
            result.success = true;
        }

        return result;
    };
    private builder = buildPipe(...this.buildFunctions);
    build = () => {
        if (this.buildFunctions.length <= 0) {
            return undefined;
        }

        const builder = buildPipe(...this.buildFunctions);

        return builder(this.page);
    };
    buildAsString = () => {
        if (this.buildFunctions.length <= 0) {
            return undefined;
        }

        const builder = buildPipe(...this.buildFunctions);

        const builtPage = builder(this.page);
        return builtPage.getHtmlAsString();
    };
}
