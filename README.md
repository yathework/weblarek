# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/Models/ — папка с моделями данных
- src/components/views/ — папка с компонентами представления

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения (Презентер)
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

    npm install
    npm run dev

или

    yarn
    yarn dev

## Сборка

    npm run build

или

    yarn build

## Интернет-магазин «Web-Larёk»

«Web-Larёk» — интернет-магазин с товарами для веб-разработчиков: просмотр каталога, добавление товаров в корзину, оформление заказа с отправкой на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View:

- Model — слой данных, отвечает за хранение и изменение данных.
- View — слой представления, отвечает за отображение данных на странице.
- Presenter — содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события, используя методы как Моделей, так и Представлений.

## Базовый код

### Абстрактный класс Component

Является базовым классом для всех компонентов интерфейса. Класс является дженериком и принимает в переменной T тип данных, которые могут быть переданы в метод render для отображения.

- Конструктор: `constructor(container: HTMLElement)` — принимает ссылку на DOM-элемент, за отображение которого он отвечает.
- Поля: `container: HTMLElement` — поле для хранения корневого DOM-элемента компонента.
- Методы:
  - `render(data?: Partial<T>): HTMLElement` — принимает данные, записывает их в поля класса и возвращает ссылку на DOM-элемент.
  - `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для модификации DOM-элементов img.

### Класс Api

Содержит в себе базовую логику отправки запросов.

- Конструктор: `constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый адрес сервера и опциональный объект с заголовками запросов.
- Поля: `baseUrl: string`, `options: RequestInit`.
- Методы:
  - `get(uri: string): Promise<object>` — выполняет GET-запрос на переданный ендпоинт и возвращает промис с объектом.
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — отправляет данные в JSON в теле запроса на переданный ендпоинт. Метод можно переопределить.
  - `handleResponse(response: Response): Promise<object>` — защищённый метод, проверяющий ответ сервера на корректность.

### Класс EventEmitter

Брокер событий реализует паттерн «Наблюдатель», позволяющий отправлять события и подписываться на события, происходящие в системе. Интерфейс `IEvents` экспортируется из этого же файла и используется во всех компонентах.

- Конструктор: не принимает параметров.
- Поля: `_events: Map<string | RegExp, Set<Function>>` — хранит коллекцию подписок на события.
- Методы:
  - `on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие.
  - `emit<T extends object>(event: string, data?: T): void` — инициализация события.
  - `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию-триггер.

## Данные

### IProduct

Описывает товар.

    interface IProduct {
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number | null;
    }

- id — уникальный идентификатор товара.
- description — текстовое описание товара.
- image — путь к изображению товара.
- title — название товара.
- category — категория товара.
- price — цена товара (null означает, что товар недоступен).

### IBuyer

Описывает данные покупателя.

    interface IBuyer {
        payment: TPayment | null;
        email: string;
        phone: string;
        address: string;
    }

- payment — выбранный способ оплаты (null, если ещё не выбран).
- email — электронная почта покупателя.
- phone — контактный телефон покупателя.
- address — адрес доставки заказа.

### TPayment

Описывает доступные способы оплаты.

    type TPayment = 'card' | 'cash';

- card — оплата картой.
- cash — оплата наличными.

### TCategoryKey

Тип ключей для объекта категорий. Выводится автоматически из `categoryMap` в `utils/constants.ts`.

    type TCategoryKey = keyof typeof categoryMap;

### TValidationErrors

Тип для результата валидации данных покупателя.

    type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

Ключи — поля покупателя, значения — текст ошибки. Если поле валидно, оно отсутствует в возвращаемом объекте.

### IOrderRequest

Расширяет IBuyer и добавляет информацию о заказе.

    interface IOrderRequest extends IBuyer {
        payment: TPayment;
        total: number;
        items: string[];
    }

- payment — способ оплаты (обязательно выбран).
- total — общая сумма заказа.
- items — массив идентификаторов товаров, входящих в заказ.

### IOrderResult

Описывает объект, который возвращает сервер в ответ на успешно оформленный заказ.

    interface IOrderResult {
        id: string;
        total: number;
    }

- id — идентификатор оформленного заказа.
- total — подтверждённая сумма заказа.

### IProductListResponse

Описывает объект, который возвращает сервер при запросе списка товаров каталога.

    interface IProductListResponse {
        total: number;
        items: IProduct[];
    }

- total — общее количество товаров на сервере.
- items — массив товаров.

## Модели данных

Модели данных отвечают только за хранение и работу с данными. Они не имеют инструментов для отображения данных и не зависят от других классов приложения.

### Класс Products

Назначение и зона ответственности: хранит каталог всех товаров, доступных в приложении, а также товар, выбранный пользователем для подробного отображения.

- Конструктор: `constructor(events: IEvents)` — принимает экземпляр брокера событий.
- Поля:
  - private items: IProduct[] — массив всех товаров каталога. По умолчанию — пустой массив.
  - private preview: IProduct | null — товар, выбранный для подробного отображения. По умолчанию — null.
- Методы:
  - setItems(items: IProduct[]): void — сохраняет переданный массив товаров в модель и генерирует событие `catalog:changed`.
  - getItems(): IProduct[] — возвращает массив всех товаров из модели.
  - getItemById(id: string): IProduct | undefined — находит и возвращает товар по его идентификатору.
  - setPreview(item: IProduct): void — сохраняет товар, выбранный для подробного отображения, и генерирует событие `preview:changed`.
  - getPreview(): IProduct | null — возвращает товар, выбранный для подробного отображения.

### Класс Cart

Назначение и зона ответственности: хранит товары, выбранные покупателем для покупки.

- Конструктор: `constructor(events: IEvents)` — принимает экземпляр брокера событий.
- Поля:
  - private items: IProduct[] — массив товаров, добавленных в корзину. По умолчанию — пустой массив.
- Методы:
  - getItems(): IProduct[] — возвращает массив товаров, находящихся в корзине.
  - addItem(item: IProduct): void — добавляет товар в массив корзины и генерирует событие `basket:changed`.
  - removeItem(id: string): void — удаляет товар из массива корзины по его идентификатору и генерирует событие `basket:changed`.
  - clear(): void — полностью очищает корзину и генерирует событие `basket:changed`.
  - getTotalPrice(): number — возвращает суммарную стоимость всех товаров в корзине. Товары с ценой null не учитываются.
  - getItemCount(): number — возвращает количество товаров в корзине.
  - hasItem(id: string): boolean — проверяет наличие товара в корзине по его идентификатору.

### Класс Buyer

Назначение и зона ответственности: хранит данные покупателя, которые тот указывает при оформлении заказа, а также занимается их валидацией.

- Конструктор: `constructor(events: IEvents)` — принимает экземпляр брокера событий.
- Поля:
  - private payment: TPayment | null — выбранный способ оплаты. По умолчанию — null.
  - private email: string — электронная почта покупателя. По умолчанию — пустая строка.
  - private phone: string — телефон покупателя. По умолчанию — пустая строка.
  - private address: string — адрес доставки. По умолчанию — пустая строка.
- Методы:
  - setPayment(payment: TPayment): void — сохраняет способ оплаты и генерирует событие `buyer:changed`.
  - setEmail(email: string): void — сохраняет электронную почту и генерирует событие `buyer:changed`.
  - setPhone(phone: string): void — сохраняет телефон и генерирует событие `buyer:changed`.
  - setAddress(address: string): void — сохраняет адрес доставки и генерирует событие `buyer:changed`.
  - getData(): IBuyer — возвращает все данные покупателя в виде объекта IBuyer.
  - clear(): void — очищает все данные покупателя и генерирует событие `buyer:changed`.
  - validate(): TValidationErrors — валидирует данные покупателя. Возвращает объект с ошибками. Если поле валидно, оно отсутствует в объекте. Пустой объект означает, что все поля валидны.

## Слой коммуникации

Слой коммуникации отвечает за взаимодействие приложения с сервером. Он использует функциональность класса Api из базового кода при помощи композиции.

### Класс LarekApi

Назначение и зона ответственности: отвечает за получение данных о товарах с сервера и за отправку данных о заказе на сервер.

- Конструктор: `constructor(api: IApi)` — принимает экземпляр класса, реализующего интерфейс IApi.
- Поля: `private api: IApi` — экземпляр API, используемый для выполнения запросов.
- Методы:
  - getProducts(): Promise<IProductListResponse> — выполняет GET-запрос на ендпоинт /product/ и возвращает промис с объектом, в котором находится массив товаров.
  - postOrder(order: IOrderRequest): Promise<IOrderResult> — выполняет POST-запрос на ендпоинт /order/, передавая в теле запроса данные о заказе, и возвращает промис с объектом, подтверждающим покупку.

## Слой представления (View)

Слой View отвечает за отображение данных и генерацию событий при действиях пользователя. Все компоненты наследуются от абстрактного класса `Component`.

### Класс Header
- **Назначение:** шапка сайта, отображает логотип и счетчик корзины.
- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`.
- **Поля:** `protected counterElement: HTMLElement` (счетчик), `protected basketButton: HTMLButtonElement` (кнопка корзины).
- **Методы:** 
  - Сеттер `counter(value: number)` обновляет цифру на счетчике. 
  - При клике на кнопку корзины генерирует событие `basket:open`.

### Класс Gallery
- **Назначение:** каталог товаров на главной странице.
- **Конструктор:** `constructor(container: HTMLElement)`.
- **Поля:** `protected catalogElement: HTMLElement` — контейнер для карточек.
- **Методы:** Сеттер `catalog(items: HTMLElement[])` принимает массив готовых DOM-элементов карточек и вставляет их в контейнер.

### Класс Modal
- **Назначение:** универсальное модальное окно.
- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`.
- **Поля:** `protected closeButton: HTMLButtonElement`, `protected contentElement: HTMLElement`.
- **Методы:** 
  - `open()` и `close()` управляют видимостью окна. 
  - Сеттер `content(value: HTMLElement)` вставляет переданный компонент. 
  - При клике на крестик или фон генерирует событие `modal:close`.

### Абстрактный класс Card<T extends ICard>
- **Назначение:** базовый класс для карточек.
- **Конструктор:** `constructor(container: HTMLElement)`.
- **Поля:** `protected titleElement: HTMLElement`, `protected priceElement: HTMLElement`.
- **Методы:** Сеттеры `title(value: string)` и `price(value: number | null)`.

### Класс CardCatalog extends Card<TCardCatalog>
- **Назначение:** карточка в каталоге.
- **Конструктор:** `constructor(container: HTMLElement, actions: ICardActions)`.
- **Поля:** `protected imageElement: HTMLImageElement`, `protected categoryElement: HTMLElement`.
- **Методы:** 
  - Сеттер `image(value: { src: string; alt: string })` устанавливает картинку.
  - Сеттер `category(value: string)` устанавливает текст и цветовую модификацию.
  - Вызывает переданный обработчик `onClick` при клике на карточку.

### Класс CardPreview extends Card<TCardPreview>
- **Назначение:** карточка в модальном окне.
- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`.
- **Поля:** `protected imageElement`, `protected categoryElement`, `protected descriptionElement`, `protected buttonElement`.
- **Методы:** Сеттеры `image`, `category`, `description`, `buttonText`, `buttonDisabled`. При клике на кнопку генерирует событие `card:action`.

### Класс CardBasket extends Card<TCardBasket>
- **Назначение:** карточка в корзине.
- **Конструктор:** `constructor(container: HTMLElement, actions: ICardActions)`.
- **Поля:** `protected indexElement: HTMLElement`, `protected deleteButton: HTMLButtonElement`.
- **Методы:** Сеттер `index(value: number)` устанавливает порядковый номер. Кнопка удаления вызывает переданный обработчик `onClick`.

### Класс Basket
- **Назначение:** содержимое корзины.
- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`.
- **Поля:** `protected listElement`, `protected totalElement`, `protected buttonElement`.
- **Методы:** 
  - Сеттеры `items`, `total`, `disabled`. 
  - Сеттер `items` также управляет BEM-модификатором `basket_empty` для сжатия окна при пустой корзине. 
  - При клике на «Оформить» генерирует событие `order:open`.

### Абстрактный класс Form<T extends IFormState>
- **Назначение:** базовый класс для форм.
- **Конструктор:** `constructor(events: IEvents, container: HTMLFormElement)`.
- **Поля:** `protected submitButton: HTMLButtonElement`, `protected errorsElement: HTMLElement`.
- **Методы:** Сеттеры `valid` и `errors`. Обрабатывает `submit` и генерирует событие `${container.name}:submit`.

### Класс OrderForm extends Form<IOrderForm>
- **Назначение:** первая форма (способ оплаты и адрес).
- **Конструктор:** `constructor(events: IEvents, container: HTMLFormElement)`.
- **Поля:** `protected cardButton`, `protected cashButton`, `protected addressInput`.
- **Методы:** Сеттеры `payment`, `address`. Генерирует `order.payment:change` и `order.address:change`.

### Класс ContactsForm extends Form<IContactsForm>
- **Назначение:** вторая форма (email и телефон).
- **Конструктор:** `constructor(events: IEvents, container: HTMLFormElement)`.
- **Поля:** `protected emailInput`, `protected phoneInput`.
- **Методы:** Сеттеры `email`, `phone`. Генерирует `contacts.email:change` и `contacts.phone:change`.

### Класс Success
- **Назначение:** окно успешного оформления заказа.
- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`.
- **Поля:** `protected closeButton`, `protected descriptionElement`.
- **Методы:** Сеттер `total(value: number)`. Кнопка генерирует событие `success:close`.

## События

В приложении используется событийно-ориентированный подход. Все события генерируются через брокер `EventEmitter`. Согласно контракту брокера, все данные передаются в виде объектов.

- `catalog:changed` — изменился массив товаров в каталоге (генерируется `Products`).
- `preview:changed` — изменился товар для подробного просмотра (генерируется `Products`).
- `basket:changed` — изменилось содержимое корзины (генерируется `Cart`).
- `buyer:changed` — изменились данные покупателя (генерируется `Buyer`).
- `card:select` — клик по карточке в каталоге (генерируется `CardCatalog`, передает `{ id: string }`).
- `basket:open` — клик по иконке корзины (генерируется `Header`).
- `order:open` — клик по «Оформить» (генерируется `Basket`).
- `order.payment:change` — выбор способа оплаты (генерируется `OrderForm`).
- `order.address:change` — ввод адреса (генерируется `OrderForm`).
- `order:submit` — нажатие «Далее» (генерируется `OrderForm`).
- `contacts.email:change` — ввод email (генерируется `ContactsForm`).
- `contacts.phone:change` — ввод телефона (генерируется `ContactsForm`).
- `contacts:submit` — нажатие «Оплатить» (генерируется `ContactsForm`).
- `card:action` — нажатие на кнопку в превью товара (генерируется `CardPreview`).
- `basket:item:remove` — нажатие на кнопку удаления в корзине (генерируется `CardBasket`, передает `{ id: string }`).
- `success:close` — закрытие окна успешного заказа (генерируется `Success`).
- `modal:close` — закрытие модального окна (генерируется `Modal`).

## Презентер

Презентер реализован в файле `main.ts`. Он связывает модели данных и компоненты представления через брокер событий (`EventEmitter`). 

Презентер подписывается на события от моделей и компонентов View. В обработчиках событий он вызывает методы моделей для изменения данных или методы компонентов View для обновления интерфейса. 

В презентере отсутствует генерация событий — он только обрабатывает их. Архитектура приложения полностью соответствует паттерну MVP.