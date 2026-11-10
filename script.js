const people = [
  { id: 'you', name: 'You', color: '#007aff', letter: '👤', total: 0 },
  { id: 'maya', name: 'Maya', color: '#ff6b9d', letter: 'M', total: 0 },
  { id: 'jonah', name: 'Jonah', color: '#34c759', letter: 'J', total: 0 },
  { id: 'priya', name: 'Priya', color: '#ff9500', letter: 'P', total: 0 },
];

const items = [
  { id: 1, name: 'Burrata', price: 18.00, assignees: [] },
  { id: 2, name: 'Cacio e Pepe', price: 24.00, assignees: [] },
  { id: 3, name: 'Rigatoni alla Vodka', price: 26.00, assignees: [] },
  { id: 4, name: 'Branzino', price: 34.00, assignees: [] },
  { id: 5, name: 'Margherita', price: 21.00, assignees: [] },
  { id: 6, name: 'Montepulciano (btl)', price: 58.00, assignees: [] },
  { id: 7, name: 'Tiramisu', price: 12.00, assignees: [] },
];

const TAX_RATE = 0.08875;
const TIP_RATE = 0.20;

let selectedId = null;

function formatMoney(n) {
  return '$' + n.toFixed(2);
}

function renderPeople() {
  const container = document.getElementById('people');
  container.innerHTML = people.map(p => `
    <div class="person ${p.id === selectedId ? 'selected' : ''}" data-id="${p.id}">
      <div class="avatar" style="background:${p.color}">${p.letter}</div>
      <div class="person-name">${p.name}</div>
      <div class="person-total">${formatMoney(p.total)}</div>
    </div>
  `).join('');

  container.querySelectorAll('.person').forEach(el => {
    el.addEventListener('click', () => {
      selectedId = el.dataset.id;
      renderPeople();
      updateInstruction();
    });
  });
}

function updateInstruction() {
  const el = document.getElementById('instruction');
  if (!selectedId) {
    el.textContent = 'Tap a person, then what they had';
    return;
  }
  const p = people.find(x => x.id === selectedId);
  el.innerHTML = `Tap what <strong style="color:${p.color}">${p.name}</strong> had`;
}

function renderItems() {
  const container = document.getElementById('items');
  container.innerHTML = items.map(item => {
    const shareCount = item.assignees.length;
    const badges = item.assignees.map(id => {
      const p = people.find(x => x.id === id);
      return `<div class="badge" style="background:${p.color}">${p.letter === '👤' ? 'Y' : p.letter}</div>`;
    }).join('');
    const fraction = shareCount > 1 ? `<span class="fraction">1/${shareCount}</span>` : '';
    return `
      <div class="item ${shareCount ? 'assigned' : ''}" data-id="${item.id}">
        <span class="item-qty">1</span>
        <span class="item-name">${item.name}${fraction}</span>
        <span class="item-price">${item.price.toFixed(2)}</span>
        <div class="badges">${badges}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      if (!selectedId) {
        alert('Select a person first');
        return;
      }
      const id = parseInt(el.dataset.id);
      const item = items.find(i => i.id === id);
      const idx = item.assignees.indexOf(selectedId);
      if (idx >= 0) {
        item.assignees.splice(idx, 1);
      } else {
        item.assignees.push(selectedId);
      }
      calculate();
      renderItems();
      renderPeople();
      renderTotals();
    });
  });
}

function calculate() {
  const subtotals = {};
  people.forEach(p => subtotals[p.id] = 0);

  items.forEach(item => {
    if (item.assignees.length === 0) return;
    const share = item.price / item.assignees.length;
    item.assignees.forEach(id => {
      subtotals[id] += share;
    });
  });

  const totalSub = Object.values(subtotals).reduce((a, b) => a + b, 0);
  const tax = totalSub * TAX_RATE;
  const tip = totalSub * TIP_RATE;

  people.forEach(p => {
    const sub = subtotals[p.id] || 0;
    const ratio = totalSub > 0 ? sub / totalSub : 0;
    p.total = sub + (tax * ratio) + (tip * ratio);
  });
}

function renderTotals() {
  const totalSub = items.reduce((s, i) => s + i.price, 0);
  const tax = totalSub * TAX_RATE;
  const tip = totalSub * TIP_RATE;
  const grand = totalSub + tax + tip;

  const container = document.getElementById('totals');
  container.innerHTML = `
    <div class="total-row"><span>SUBTOTAL</span><span>${totalSub.toFixed(2)}</span></div>
    <div class="total-row"><span>TAX 8.875%</span><span>${tax.toFixed(2)}</span></div>
    <div class="total-row"><span>TIP 20%</span><span>${tip.toFixed(2)}</span></div>
    <div class="total-row grand"><span>TOTAL</span><span>${grand.toFixed(2)}</span></div>
  `;
}

function showSummary() {
  const assigned = items.some(i => i.assignees.length > 0);
  if (!assigned) {
    alert('Assign some items first');
    return;
  }
  const modal = document.createElement('div');
  modal.className = 'summary-modal show';
  modal.innerHTML = `
    <div class="summary">
      <h2>Who owes what</h2>
      ${people.map(p => `<div class="summary-person"><span>${p.name}</span><strong>${formatMoney(p.total)}</strong></div>`).join('')}
      <p style="margin-top:16px;font-size:13px;color:#666">Tax and tip split by what each person ordered</p>
      <button class="done-btn" style="margin-top:16px;width:100%" onclick="this.closest('.summary-modal').remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

document.getElementById('done-btn').addEventListener('click', showSummary);
document.getElementById('close-btn').addEventListener('click', () => {
  if (confirm('Reset assignments?')) {
    items.forEach(i => i.assignees = []);
    selectedId = null;
    calculate();
    renderAll();
  }
});

function renderAll() {
  renderPeople();
  renderItems();
  renderTotals();
  updateInstruction();
}

// Init
calculate();
renderAll();
