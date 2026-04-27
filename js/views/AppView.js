import { WhatsAppFormatter } from '../services/WhatsAppFormatter.js';

export class AppView {
    constructor(orderManager) {
        this.orderManager = orderManager;
        this.formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        this.cacheDOM();
        this.bindEvents();
    }

    cacheDOM() {
        this.productListEl = document.getElementById('product-list');
        this.cartItemsEl = document.getElementById('cart-items');
        this.subtotalEl = document.getElementById('subtotal-val');
        this.freteEl = document.getElementById('frete-val');
        this.totalEl = document.getElementById('total-val');
        
        this.btnCalcFrete = document.getElementById('btn-calc-frete');
        this.cepInput = document.getElementById('cep');
        this.paymentSelect = document.getElementById('pagamento');
        this.btnFinalizar = document.getElementById('btn-finalizar');

        this.enderecoGroup = document.getElementById('endereco-group');
        this.enderecoResumo = document.getElementById('endereco-resumo'); 
        this.numeroInput = document.getElementById('numero');
        this.complementoInput = document.getElementById('complemento'); 
        
        this.trocoGroup = document.getElementById('troco-group');
        this.trocoInput = document.getElementById('troco');

        // Elementos exclusivos do Mobile
        this.checkoutSection = document.getElementById('checkout-section');
        this.btnVerCarrinho = document.getElementById('btn-ver-carrinho');
        this.btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
        this.mobileCartTotal = document.getElementById('mobile-cart-total');
    }

    bindEvents() {
        this.btnCalcFrete.addEventListener('click', () => this.handleCalculateFrete());
        this.paymentSelect.addEventListener('change', (e) => this.handlePaymentChange(e));
        this.btnFinalizar.addEventListener('click', () => this.handleCheckout());
        
        this.numeroInput.addEventListener('input', (e) => {
            this.orderManager.setAddressNumber(e.target.value);
            this.updateEnderecoResumo();
            this.checkCheckoutState();
        });

        this.complementoInput.addEventListener('input', (e) => {
            this.orderManager.setComplemento(e.target.value);
        });

        this.trocoInput.addEventListener('input', (e) => {
            this.orderManager.setTroco(e.target.value);
        });

        // Eventos dos botões Mobile - TRAVANDO O SCROLL AQUI
        this.btnVerCarrinho.addEventListener('click', () => {
            this.checkoutSection.classList.add('active');
            document.body.classList.add('no-scroll');
        });

        this.btnFecharCarrinho.addEventListener('click', () => {
            this.checkoutSection.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    updateEnderecoResumo() {
        if (!this.orderManager.address) return;
        
        const rua = this.orderManager.address.street;
        const bairro = this.orderManager.address.neighborhood;
        const numText = this.orderManager.addressNumber ? `, nº ${this.orderManager.addressNumber}` : '';
        
        this.enderecoResumo.textContent = `${rua}${numText}, ${bairro}`;
    }

    renderProducts(catalog) {
        this.productListEl.innerHTML = '';
        catalog.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${this.formatter.format(product.price)}</p>
                </div>
                <button data-id="${product.id}">Adicionar</button>
            `;
            
            div.querySelector('button').addEventListener('click', () => {
                this.orderManager.cart.addItem(product);
                this.updateCartUI();
            });
            this.productListEl.appendChild(div);
        });
    }

    updateCartUI() {
        this.cartItemsEl.innerHTML = '';
        this.orderManager.cart.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.quantity}x ${item.product.name}</span> <span>${this.formatter.format(item.product.price * item.quantity)}</span>`;
            this.cartItemsEl.appendChild(li);
        });

        this.updateFinancialsUI();
        this.checkCheckoutState();
    }

    async handleCalculateFrete() {
        const cep = this.cepInput.value;
        if (!cep) return alert('Digite um CEP válido.');
        
        this.btnCalcFrete.textContent = 'Buscando...';
        
        try {
            await this.orderManager.applyCep(cep);
            this.updateEnderecoResumo();
            this.enderecoGroup.classList.remove('hidden');
        } catch (error) {
            alert('CEP não encontrado ou inválido.');
            this.enderecoGroup.classList.add('hidden');
            this.orderManager.deliveryFee = 0;
            this.orderManager.address = null;
        } finally {
            this.btnCalcFrete.textContent = 'Buscar';
        }
        
        this.updateFinancialsUI();
        this.checkCheckoutState();
    }

    handlePaymentChange(e) {
        const method = e.target.value;
        this.orderManager.setPaymentMethod(method);
        
        if (method === 'dinheiro') {
            this.trocoGroup.classList.remove('hidden');
        } else {
            this.trocoGroup.classList.add('hidden');
            this.orderManager.setTroco(''); 
            this.trocoInput.value = '';     
        }

        this.updateFinancialsUI();
        this.checkCheckoutState();
    }

    updateFinancialsUI() {
        const subtotalStr = this.formatter.format(this.orderManager.cart.getSubtotal());
        
        this.subtotalEl.textContent = subtotalStr;
        this.freteEl.textContent = this.formatter.format(this.orderManager.deliveryFee);
        this.totalEl.textContent = this.formatter.format(this.orderManager.getTotal());

        // Atualiza dinamicamente o valor do botão flutuante no celular
        this.mobileCartTotal.textContent = subtotalStr;
    }

    checkCheckoutState() {
        const hasItems = !this.orderManager.cart.isEmpty();
        const hasFrete = this.orderManager.deliveryFee > 0;
        const hasPayment = this.orderManager.paymentMethod !== '';
        const hasNumero = this.orderManager.addressNumber.trim() !== '';
        
        this.btnFinalizar.disabled = !(hasItems && hasFrete && hasPayment && hasNumero);
    }

    handleCheckout() {
        const numeroWhatsApp = "5519997103303"; 
        const urlWhatsApp = WhatsAppFormatter.generateLink(this.orderManager, numeroWhatsApp);
        window.open(urlWhatsApp, '_blank');
        setTimeout(() => location.reload(), 1000);
    }
}