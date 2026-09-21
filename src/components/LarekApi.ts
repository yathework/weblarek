import { IApi, IProductListResponse, IOrderRequest, IOrderResult } from '../types';

export class LarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    postOrder(order: IOrderRequest): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}