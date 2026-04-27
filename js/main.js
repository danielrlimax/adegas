import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';
import { OrderManager } from './models/OrderManager.js';
import { ViaCepDeliveryService } from './services/DeliveryStrategy.js';
import { AppView } from './views/AppView.js';

document.addEventListener('DOMContentLoaded', () => {
    const catalog = [
        new Product(1, 'Vinho Tinto Seco Reservado 750ml', 89.90),
        new Product(2, 'Cerveja Artesanal IPA 500ml', 24.50),
        new Product(3, 'Whisky Escocês 12 Anos 1L', 199.00),
        new Product(4, 'Gin London Dry 750ml', 115.00),
        new Product(5, 'Espumante Brut 750ml', 65.00),
        new Product(6, 'Vodka Premium 1L', 145.00)
    ];

    const cart = new Cart();
    const deliveryService = new ViaCepDeliveryService(); 
    const orderManager = new OrderManager(cart, deliveryService);

    const app = new AppView(orderManager);
    app.renderProducts(catalog);
});