import { Card } from './Card';
import { TCardPreview, TCategoryKey } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card<TCardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:action');
        });
    }

    set image(value: { src: string; alt: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as TCategoryKey], key === value);
        }
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}