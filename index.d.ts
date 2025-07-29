declare module "payssion-nodejs" {
  interface CreateParams {
    pm_id: string;
    amount: number;
    currency: string;
    order_id: string;
    description?: string;
    return_url?: string;
    notify_url?: string;
    [key: string]: any;
  }

  interface DetailsParams {
    transaction_id?: string;
    order_id?: string;
    [key: string]: any;
  }

  interface RefundParams {
    transaction_id: string;
    amount: number;
    currency: string;
    [key: string]: any;
  }

  interface PayssionResponse {
    result_code: number;
    description?: string;
    redirect_url?: string;
    transaction_id?: string;
    order_id?: string;
    [key: string]: any;
  }

  class PayssionClient {
    static readonly VERSION: string;

    constructor(apiKey: string, secretKey: string, isLivemode?: boolean);

    setLiveMode(isLivemode: boolean): void;
    setUrl(url: string): void;
    setSSLverify(sslVerify: boolean): void;
    getIsSuccess(): boolean;

    create(params: CreateParams): Promise<PayssionResponse>;
    getDetails(params: DetailsParams): Promise<PayssionResponse>;
    refund(params: RefundParams): Promise<PayssionResponse>;
  }

  export = PayssionClient;
}
