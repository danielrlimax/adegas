export class OrderManager {
    constructor(cart, deliveryStrategy) {
        this.cart = cart;
        this.deliveryStrategy = deliveryStrategy;
        this.deliveryFee = 0;
        this.paymentMethod = '';
        this.cep = '';
        this.address = null; 
        this.addressNumber = ''; 
        this.complemento = '';
        this.troco = ''; // Nova propriedade
    }

    async applyCep(cep) {
        this.cep = cep;
        const result = await this.deliveryStrategy.calculate(cep);
        this.deliveryFee = result.fee;
        this.address = result.address; 
    }

    setAddressNumber(number) {
        this.addressNumber = number;
    }

    setComplemento(comp) {
        this.complemento = comp;
    }

    setPaymentMethod(method) {
        this.paymentMethod = method;
    }

    setTroco(valor) {
        this.troco = valor;
    }

    getTotal() {
        let total = this.cart.getSubtotal() + this.deliveryFee;
        if (this.paymentMethod === 'pix') {
            total *= 0.95;
        }
        return total;
    }
}