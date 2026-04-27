export class Cart {
    constructor() {
        this.items = [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ product, quantity: 1 });
        }
    }

    // Novo método para remover/diminuir item
    removeItem(productId) {
        const existingIndex = this.items.findIndex(item => item.product.id == productId);
        
        if (existingIndex > -1) {
            if (this.items[existingIndex].quantity > 1) {
                this.items[existingIndex].quantity -= 1; // Tira 1 se tiver mais de 1
            } else {
                this.items.splice(existingIndex, 1); // Remove completamente se for 1
            }
        }
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }
}