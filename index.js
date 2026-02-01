module.exports = async function (inputs) {
  const totalPago = parseFloat(inputs.amount_paid_brl);
  const taxas = parseFloat(inputs.fees_brl);
  const moedaRecebida = parseFloat(inputs.currency_received);
  
  const custoLiquido = totalPago - taxas;
  const taxaReal = moedaRecebida / custoLiquido; 

  return {
    status: "success",
    data: {
      sunk_cost: taxas.toFixed(2),
      net_cost: custoLiquido.toFixed(2),
      effective_rate: taxaReal.toFixed(4),
      advice: taxas > (totalPago * 0.05) ? "ALERTA: Taxas acima de 5%." : "Taxas aceitáveis."
    }
  };
};
