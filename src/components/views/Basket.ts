import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasket {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        this.container.classList.toggle('basket_empty', items.length === 0);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}