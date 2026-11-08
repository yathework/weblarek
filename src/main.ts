import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { TPayment } from './types';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const headerContainer = ensureElement<HTMLElement>('.header', document.body);
const galleryContainer = ensureElement<HTMLElement>('.gallery', document.body);
const modalContainer = ensureElement<HTMLElement>('#modal-container', document.body);

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(events, modalContainer);

const basket = new Basket(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const success = new Success(events, cloneTemplate('#success'));

const cardPreview = new CardPreview(events, cloneTemplate('#card-preview'));

larekApi.getProducts()
    .then(data => productsModel.setItems(data.items))
    .catch(err => console.error(err));

// --- ПРЕЗЕНТЕР ---

events.on('catalog:changed', () => {
    const itemCards = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:select', { id: item.id })
        });
        return card.render({
            title: item.title,
            image: { src: `${CDN_URL}${item.image}`, alt: item.title },
            category: item.category,
            price: item.price
        });
    });
    gallery.render({ catalog: itemCards });
});

events.on<{ id: string }>('card:select', ({ id }) => {
    const item = productsModel.getItemById(id);
    if (item) {
        productsModel.setPreview(item);
    }
});

events.on('preview:changed', () => {
    const item = productsModel.getPreview();
    if (!item) return;

    const isInCart = cartModel.hasItem(item.id);
    let buttonText = 'Купить';
    let buttonDisabled = false;

    if (item.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (isInCart) {
        buttonText = 'Удалить из корзины';
    }

    modal.render({
        content: cardPreview.render({
            title: item.title,
            image: { src: `${CDN_URL}${item.image}`, alt: item.title },
            category: item.category,
            description: item.description,
            price: item.price,
            buttonText,
            buttonDisabled
        })
    });
    modal.open();
});

events.on('card:action', () => {
    const item = productsModel.getPreview();
    if (!item) return;

    if (cartModel.hasItem(item.id)) {
        cartModel.removeItem(item.id);
    } else {
        cartModel.addItem(item);
    }
    modal.close();
});

events.on('basket:changed', () => {
    header.render({ counter: cartModel.getItemCount() });
    basket.render({
        items: cartModel.getItems().map((item, index) => {
            const card = new CardBasket(cloneTemplate('#card-basket'), {
                onClick: () => events.emit('basket:item:remove', { id: item.id })
            });
            return card.render({ title: item.title, price: item.price, index: index + 1 });
        }),
        total: cartModel.getTotalPrice(),
        disabled: cartModel.getItemCount() === 0
    });
});

events.on<{ id: string }>('basket:item:remove', ({ id }) => {
    cartModel.removeItem(id);
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
    modal.open();
});

events.on('order:open', () => {
    modal.render({ content: orderForm.render() });
});

events.on('order.payment:change', (data: { value: TPayment }) => {
    buyerModel.setPayment(data.value);
});

events.on('order.address:change', (data: { value: string }) => {
    buyerModel.setAddress(data.value);
});

events.on('contacts.email:change', (data: { value: string }) => {
    buyerModel.setEmail(data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
    buyerModel.setPhone(data.value);
});

events.on('buyer:changed', () => {
    const errors = buyerModel.validate();
    
    const orderErrors = Object.values({ payment: errors.payment, address: errors.address }).filter(Boolean).join('; ');
    orderForm.render({
        payment: buyerModel.getData().payment,
        address: buyerModel.getData().address,
        valid: !errors.payment && !errors.address,
        errors: orderErrors
    });

    const contactsErrors = Object.values({ email: errors.email, phone: errors.phone }).filter(Boolean).join('; ');
    contactsForm.render({
        email: buyerModel.getData().email,
        phone: buyerModel.getData().phone,
        valid: !errors.email && !errors.phone,
        errors: contactsErrors
    });
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
});

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderData = {
        ...buyerData,
        payment: buyerData.payment as TPayment,
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map(item => item.id)
    };

    larekApi.postOrder(orderData)
        .then((result) => {
            cartModel.clear();
            buyerModel.clear();
            modal.render({ content: success.render({ total: result.total }) });
        })
        .catch(err => console.error(err));
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
    modal.close();
});

cartModel.clear();
buyerModel.clear();