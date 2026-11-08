import { Card } from './Card';
import { TCardCatalog, TCategoryKey } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions: { onClick: () => void }) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: { src: string; alt: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as TCategoryKey],
                key === value
            );
        }
    }
}