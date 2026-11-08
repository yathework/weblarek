import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(protected events: IEvents) {}

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:changed');
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed');
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed');
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed');
    }

    validate(): TValidationErrors {
        const errors: TValidationErrors = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.email.trim()) errors.email = 'Укажите эмэйл';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';
        if (!this.address.trim()) errors.address = 'Укажите адрес';
        return errors;
    }
}