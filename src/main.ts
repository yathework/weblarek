import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/LarekApi';

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

console.log('=== Тестирование модели Products ===');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390'));
productsModel.setPreview(apiProducts.items[0]);
console.log('Товар для подробного отображения:', productsModel.getPreview());

console.log('=== Тестирование модели Cart ===');
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotalPrice());
console.log('Количество товаров:', cartModel.getItemCount());
console.log('Наличие товара по id:', cartModel.hasItem(apiProducts.items[0].id));
cartModel.removeItem(apiProducts.items[0].id);
console.log('Товары в корзине после удаления:', cartModel.getItems());
cartModel.clear();
console.log('Товары в корзине после очистки:', cartModel.getItems());

console.log('=== Тестирование модели Buyer ===');
buyerModel.setPayment('card');
buyerModel.setEmail('test@test.ru');
buyerModel.setPhone('+71234567890');
buyerModel.setAddress('Spb Vosstania 1');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация заполненных данных:', buyerModel.validate());
buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Валидация пустых данных:', buyerModel.validate());
buyerModel.setEmail('test@test.ru');
console.log('Валидация с частично заполненными данными:', buyerModel.validate());

console.log('=== Запрос к серверу ===');
larekApi.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
        console.log('Каталог товаров, полученный с сервера:', productsModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка при запросе к серверу:', error);
    });