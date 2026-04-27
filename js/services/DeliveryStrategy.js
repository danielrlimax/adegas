export class DeliveryStrategy {
    async calculate(cep) { throw new Error("Método não implementado"); }
}

export class ViaCepDeliveryService extends DeliveryStrategy {
    async calculate(cep) {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) throw new Error("CEP inválido");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                throw new Error("CEP não encontrado");
            }

            const fee = data.uf === 'SP' ? 15.00 : 35.00;

            return {
                fee: fee,
                address: {
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }
            };
        } catch (error) {
            throw error;
        }
    }
}