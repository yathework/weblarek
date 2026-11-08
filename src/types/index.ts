export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

import { categoryMap } from '../utils/constants';

export type TPayment = 'card' | 'cash';

export type TCategoryKey = keyof typeof categoryMap;

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IOrderRequest extends IBuyer {
    payment: TPayment;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

export interface ICard {
    title: string;
    price: number | null;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export type TCardCatalog = Pick<IProduct, 'title' | 'category' | 'price'> & {
    image: { src: string; alt: string };
};

export type TCardPreview = TCardCatalog & Pick<IProduct, 'description'> & {
    buttonText: string;
    buttonDisabled: boolean;
};

export type TCardBasket = Pick<IProduct, 'title' | 'price'> & {
    index: number;
};