export function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function truncateHash(hash, start = 8, end = 8) {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function truncateId(id, start = 10, end = 6) {
  if (!id) return '';
  if (id.length <= start + end) return id;
  return `${id.slice(0, start)}...${id.slice(-end)}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function groupByMonth(transactions) {
  const map = {};
  transactions.forEach(tx => {
    const key = new Date(tx.timestamp).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    if (!map[key]) map[key] = { month: key, count: 0, volume: 0 };
    map[key].count++;
    map[key].volume += tx.amount;
  });
  return Object.values(map).reverse();
}

export function getUniqueWallets(transactions) {
  const wallets = new Set();
  transactions.forEach(tx => { wallets.add(tx.sender); wallets.add(tx.receiver); });
  return [...wallets];
}
