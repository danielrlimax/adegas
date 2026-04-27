export class WhatsAppFormatter {
    static generateLink(orderManager, phone) {
        const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let msg = `Novo Pedido - Adega Express\n`;
        msg += `-----------------------------------\n`;
        
        // Itens
        orderManager.cart.items.forEach(item => {
            msg += `${item.quantity}x - ${item.product.name}\n`;
        });
        
        msg += `-----------------------------------\n`;
        
        // Financeiro
        msg += `Subtotal: ${formatter.format(orderManager.cart.getSubtotal())}\n`;
        msg += `Frete: ${formatter.format(orderManager.deliveryFee)}\n`;
        msg += `Total: ${formatter.format(orderManager.getTotal())}\n`;
        
        msg += `-----------------------------------\n`;
        
        // Pagamento
        let nomePagamento = '';
        if (orderManager.paymentMethod === 'pix') nomePagamento = 'PIX';
        else if (orderManager.paymentMethod === 'cartao') nomePagamento = 'Cartão de Crédito';
        else if (orderManager.paymentMethod === 'dinheiro') nomePagamento = 'Dinheiro';

        msg += `Forma de pagamento: ${nomePagamento}\n`;
        
        if (orderManager.paymentMethod === 'dinheiro' && orderManager.troco.trim() !== '') {
            msg += `Troco para: ${orderManager.troco}\n`;
        }
        
        msg += `-----------------------------------\n`;
        
        // Endereço
        msg += `Entrega: ${orderManager.address.street}, nº ${orderManager.addressNumber}, ${orderManager.address.neighborhood}\n`;
        
        if (orderManager.complemento && orderManager.complemento.trim() !== '') {
            msg += `Comp: ${orderManager.complemento}\n`;
        }
        
        // Utiliza a cidade vinda dinamicamente da API ou caso prefira fixo: msg += `Cidade: Limeira\n`;
        msg += `Cidade: ${orderManager.address.city}\n`;
        
        // Converte a string final para URL
        const encodedMsg = encodeURIComponent(msg);
        return `https://wa.me/${phone}?text=${encodedMsg}`;
    }
}