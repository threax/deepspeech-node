export interface ISendArgs {
    body: ArrayBuffer;
    name: string;
}

export interface IParseResult{
    result: string,
    inferenceTime: number,
    audioLength: number,
}