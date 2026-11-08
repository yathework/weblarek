import { Form } from './Form';
import { TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderForm {
    payment: TPayment | null;
    address: string;
    valid: boolean;
    errors: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { value: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { value: 'cash' });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order.address:change', { value: this.addressInput.value });
        });
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}