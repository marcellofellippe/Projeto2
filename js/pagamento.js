let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function parsePrice(valor) {
  if (!valor) return 0;
  if (typeof valor === 'number') return valor;
  let s = String(valor).replace(/[Rr]\$\s?/,'').replace(/\./g,'').replace(',', '.').trim();
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function formatarPrecoBr(valor) {
  return "R$ " + Number(valor).toFixed(2).replace('.', ',');
}

function montarResumo() {
  resumoPedido.innerHTML = '';
  let subtotal = 0;
  let descontoTotal = 0;
  let quantidadeTotal = 0;

  if (!carrinho.length) {
    resumoPedido.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalSpan.textContent = formatarPrecoBr(0);
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
    const precoTexto = (precoDe > precoPor ? `<s>${formatarPrecoBr(precoDe)}</s> ` : '') + `${formatarPrecoBr(precoPor*q)}`;
    div.innerHTML = `<span>${item.nome} x${q}</span><span>${precoTexto}</span>`;
    resumoPedido.appendChild(div);
  });

  badge.textContent = quantidadeTotal;

  const frete = parsePrice(freteSelect.value);

  // Linha subtotal
  const linhaSubtotal = document.createElement('div');
  linhaSubtotal.classList.add('produto', 'final');
  linhaSubtotal.innerHTML = `<span>Subtotal</span><span>${formatarPrecoBr(subtotal)}</span>`;
  resumoPedido.appendChild(linhaSubtotal);

  // Linha desconto (só aparece se houver desconto)
  if (descontoTotal > 0) {
    const linhaDesconto = document.createElement('div');
    linhaDesconto.classList.add('produto', 'final');
    linhaDesconto.innerHTML = `<span>Desconto</span><span>- ${formatarPrecoBr(descontoTotal)}</span>`;
    resumoPedido.appendChild(linhaDesconto);
  }

  // Linha frete
  const linhaFrete = document.createElement('div');
  linhaFrete.classList.add('produto', 'final');
  linhaFrete.innerHTML = `<span>Frete</span><span>${formatarPrecoBr(frete)}</span>`;
  resumoPedido.appendChild(linhaFrete);

  // Total final
  const totalFinal = subtotal - descontoTotal + frete;
  totalSpan.textContent = formatarPrecoBr(totalFinal);
}

// Inicializa o resumo
montarResumo();
freteSelect.addEventListener('change', montarResumo);
