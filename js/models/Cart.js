export class Cart {
    constructor() {
        this.items = [];
    }

    addItem(product) {
        const existing = this.items.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ product, quantity: 1 });
        }
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }
}