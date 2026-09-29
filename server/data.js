export const initialAccounts = [
  { id: 'main', name: 'Основной счёт', number: '•• 4829', balance: 142580.50, icon: 'card', color: 'dark' },
  { id: 'savings', name: 'Накопительный счёт', number: '•• 0916', balance: 386420.00, icon: 'savings', color: 'violet' },
  { id: 'travel', name: 'На путешествие', number: '•• 7304', balance: 86450.00, icon: 'travel', color: 'peach' }
]
export const initialTransactions = [
  { id: 't1', title: 'Зарплата', category: 'Поступление', date: '29 сентября, 10:42', amount: 125000, icon: 'salary', accountId: 'main' },
  { id: 't2', title: 'Кофейня Дринкит', category: 'Кафе и рестораны', date: '28 сентября, 16:20', amount: -490, icon: 'coffee', accountId: 'main' },
  { id: 't3', title: 'Перекрёсток', category: 'Супермаркеты', date: '28 сентября, 13:05', amount: -2840.50, icon: 'market', accountId: 'main' },
  { id: 't4', title: 'Перевод в накопления', category: 'Между своими счетами', date: '27 сентября, 18:30', amount: -15000, icon: 'transfer', accountId: 'main' },
  { id: 't5', title: 'Подписка Яндекс Плюс', category: 'Подписки', date: '26 сентября, 09:15', amount: -399, icon: 'subscription', accountId: 'main' },
  { id: 't6', title: 'Пополнение', category: 'Поступление', date: '25 сентября, 11:40', amount: 5000, icon: 'salary', accountId: 'main' }
]
export function createStore() {
  return {accounts: structuredClone(initialAccounts), transactions: structuredClone(initialTransactions), nextId: 7}
}
export function transfer(store, {fromId, toId, amount}) {
  if (typeof fromId !== 'string' || typeof toId !== 'string' || fromId === toId) return {error: 'Выберите разные счета', status: 400}
  const from = store.accounts.find(a => a.id === fromId)
  const to = store.accounts.find(a => a.id === toId)
  if (!from || !to) return {error: 'Счёт не найден', status: 404}
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount * 100)) return {error: 'Введите сумму больше нуля с точностью до копеек', status: 400}
  const kopecks = Math.round(amount * 100)
  if (kopecks > Math.round(from.balance * 100)) return {error: 'Недостаточно средств', status: 400}
  from.balance = (Math.round(from.balance * 100) - kopecks) / 100
  to.balance = (Math.round(to.balance * 100) + kopecks) / 100
  const date = new Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Samara'}).format(new Date())
  store.transactions.unshift({id: `t${store.nextId++}`, title: `Перевод на ${to.name.toLowerCase()}`, category: 'Между своими счетами', date, amount: -amount, icon: 'transfer', accountId: from.id})
  return {accounts: store.accounts, transactions: store.transactions}
}
