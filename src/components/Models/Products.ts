import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:changed');
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}