let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function parsePrice(valor) {
  if (!valor) return 0;
  return Number(valor) || 0;
}

function montarResumo() {
  resumoPedido.innerHTML = '';
  let subtotal = 0;
  let descontoTotal = 0;
  let quantidadeTotal = 0;

  if (!carrinho.length) {
    resumoPedido.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalSpan.textContent = "R$ 0,00";
    badge.textContent = 0;
    return;
  }

  carrinho.forEach(item => {
    const q = Number(item.quantidade || 1);
    const precoDe = parsePrice(item.preco?.de);
    const precoPor = parsePrice(item.preco?.por);

    subtotal += precoDe * q;
    descontoTotal += (precoDe - precoPor) * q;
    quantidadeTotal += q;

    const div = document.createElement('div');
    div.classList.add('produto');
    const precoTexto = (precoDe > precoPor ? `<s>${precoDe.toFixed(2)}</s> ` : '') + `${precoPor*q}`;
    div.innerHTML = `<span>${item.nome} x${q}</span><span>${precoTexto}</span>`;
    resumoPedido.appendChild(div);
  });

  badge.textContent = quantidadeTotal;

  const frete = parsePrice(freteSelect.value);

  const linhaSubtotal = document.createElement('div');
  linhaSubtotal.classList.add('produto', 'final');
  linhaSubtotal.innerHTML = `<span>Subtotal</span><span>${subtotal.toFixed(2)}</span>`;
  resumoPedido.appendChild(linhaSubtotal);

  if (descontoTotal > 0) {
    const linhaDesconto = document.createElement('div');
    linhaDesconto.classList.add('produto', 'final');
    linhaDesconto.innerHTML = `<span>Desconto</span><span>- ${descontoTotal.toFixed(2)}</span>`;
    resumoPedido.appendChild(linhaDesconto);
  }

  const linhaFrete = document.createElement('div');
  linhaFrete.classList.add('produto', 'final');
  linhaFrete.innerHTML = `<span>Frete</span><span>${frete.toFixed(2)}</span>`;
  resumoPedido.appendChild(linhaFrete);

  totalSpan.textContent = (subtotal - descontoTotal + frete).toFixed(2);
}