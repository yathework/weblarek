import { IProduct } from '../../types';

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}