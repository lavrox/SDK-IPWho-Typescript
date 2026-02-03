interface IPWhoResponse {
    success: boolean;
    message?: string;
    data?: any;
    [key: string]: any;
}

declare class IPWho {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    private fetcher;
    getIp(ip: string): Promise<IPWhoResponse>;
    getMe(): Promise<IPWhoResponse>;
}

export { IPWho, type IPWhoResponse };
