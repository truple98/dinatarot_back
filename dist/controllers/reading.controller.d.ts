import { Request, Response } from 'express';
export declare class ReadingController {
    private llmService;
    private ragService;
    private cardsData;
    private spreadsData;
    private dataLoadPromise;
    constructor();
    private loadData;
    interpretTarot(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=reading.controller.d.ts.map