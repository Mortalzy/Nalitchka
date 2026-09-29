import React, {useEffect, useMemo, useState} from 'react'
import {LayoutDashboard, CreditCard, ArrowLeftRight, ReceiptText, Settings, Bell, Search, Plus, ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronRight, Eye, EyeOff, Coffee, ShoppingBasket, Wallet, Plane, PiggyBank, Repeat2, Sparkles, Menu, X, Check, CircleHelp, ShieldCheck, LogOut} from 'lucide-react'
import './dashboard.css'

const rub = n => new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', minimumFractionDigits:2}).format(n)
const icons = {salary: ArrowDownLeft, coffee: Coffee, market: ShoppingBasket, transfer: Repeat2, subscription: Sparkles}
const menu = [{label:'Главная', Icon:LayoutDashboard}, {label:'Мои счета', Icon:CreditCard}, {label:'Переводы', Icon:ArrowLeftRight}, {label:'История', Icon:ReceiptText}]
function App() {
  const [data, setData] = useState(null)
  const [loadingError, setLoadingError] = useState('')
  const [page, setPage] = useState('Главная')
  const [modal, setModal] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [query, setQuery] = useState('')
  const [fromId, setFromId] = useState('main')
  const [toId, setToId] = useState('savings')
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')
  useEffect(() => {fetch('/api/dashboard').then(r => {if (!r.ok) throw Error(); return r.json()}).then(setData).catch(() => setLoadingError('Не удалось загрузить данные. Проверьте, запущен ли сервер.'))}, [])
  useEffect(() => {if (!toast) return; const t = setTimeout(() => setToast(''), 4000); return () => clearTimeout(t)}, [toast])
  const accounts = data?.accounts ?? []
  const transactions = data?.transactions ?? []
  const total = accounts.reduce((sum, a) => sum + a.balance, 0)
  const filtered = useMemo(() => transactions.filter(t => `${t.title} ${t.category}`.toLowerCase().includes(query.toLowerCase())), [transactions, query])
  const display = n => hidden ? '•••••• ₽' : rub(n)
  const navigate = label => {setSidebar(false); setPage(label); if (label === 'Переводы') setModal(true)}
  const submit = async e => {
    e.preventDefault(); setFormError('')
    const number = Number(amount.replace(',', '.'))
    if (!Number.isFinite(number) || number <= 0) {setFormError('Введите корректную сумму'); return}
    setSending(true)
    try {
      const res = await fetch('/api/transfers', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({fromId, toId, amount:number})})
      const json = await res.json()
      if (!res.ok) throw Error(json.error || 'Не удалось выполнить перевод')
      setData(json); setModal(false); setAmount(''); setToast('Перевод выполнен')
    } catch (err) {setFormError(err.message)} finally {setSending(false)}
  }
  return <div className="app-shell">
    <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark">н<span>.</span></div><span>nalitchka<span className="brand-dot">.</span></span><button className="mobile-close" onClick={() => setSidebar(false)} aria-label="Закрыть меню"><X size={20}/></button></div>
      <div className="sidebar-body"><div className="nav-title">МЕНЮ</div><nav>{menu.map(({label, Icon}) => <button key={label} className={`nav-link ${page === label ? 'active' : ''}`} onClick={() => navigate(label)}><Icon size={20} strokeWidth={1.9}/><span>{label}</span>{label === 'Главная' && <span className="nav-indicator"/>}</button>)}</nav>
        <div className="nav-title nav-extra">ДРУГОЕ</div><button className="nav-link" onClick={() => setToast('Раздел настроек появится позже')}><Settings size={20}/><span>Настройки</span></button><button className="nav-link" onClick={() => setToast('Служба поддержки появится позже')}><CircleHelp size={20}/><span>Помощь</span></button>
      </div>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><ShieldCheck size={20}/></div><strong>Мы рядом</strong><p>Ваша безопасность — наш приоритет.</p><button onClick={() => setToast('Служба поддержки появится позже')}>Нужна помощь? <ArrowUpRight size={15}/></button></div><div className="profile"><div className="avatar">М</div><div><strong>Максим</strong><small>Личный кабинет</small></div><ChevronDown size={17}/></div></div>
    </aside>
    {sidebar && <div className="sidebar-overlay" onClick={() => setSidebar(false)}/>}
    <main className="main"><header className="topbar"><div className="crumb"><button className="hamburger" onClick={() => setSidebar(true)} aria-label="Открыть меню"><Menu size={22}/></button><span>Личный кабинет</span><ChevronRight size={15}/><strong>{page}</strong></div><div className="top-actions"><span className="today">Вторник, 29 сентября 2026</span><button className="round-action" onClick={() => setToast('Новых уведомлений нет')} aria-label="Уведомления"><Bell size={19}/><i/></button><div className="top-avatar">М</div></div></header>
      <div className="content"><div className="welcome"><div><div className="eyebrow"><span className="status-dot"/> ВАШ ФИНАНСОВЫЙ ОБЗОР</div><h1>{page === 'Главная' ? 'Добрый день, Максим 👋' : page}</h1><p>{page === 'Главная' ? 'Всё, что важно о ваших финансах — в одном месте.' : 'Управляйте своими финансами с комфортом.'}</p></div><div className="welcome-date">29 сентября 2026 <span>·</span> Вторник</div></div>
      {loadingError && <div className="error-banner">{loadingError} <button onClick={() => location.reload()}>Повторить</button></div>}
      {!data ? !loadingError && <div className="loading">Загружаем данные…</div> : <>
      <section className="balance-card"><div className="balance-pattern"/><div className="balance-content"><div className="balance-top"><span>ОБЩИЙ БАЛАНС</span><button onClick={() => setHidden(!hidden)} aria-label={hidden ? 'Показать баланс' : 'Скрыть баланс'}>{hidden ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div><div className="balance-number">{display(total)}</div><p>На всех ваших счетах</p><div className="balance-bottom"><div className="balance-pill"><span className="pill-icon"><ArrowUpRight size={17}/></span><span>Ваши деньги — ваши возможности</span></div><div className="card-watermark">н<span>.</span></div></div></div></section>
      <div className="section-head account-head"><div><h2>Мои счета <span className="count">{accounts.length}</span></h2><p>Ваши деньги всегда под рукой</p></div><button className="text-link" onClick={() => navigate('Мои счета')}>Все счета <ArrowUpRight size={17}/></button></div>
      <div className="accounts-grid">{accounts.map(account => {const Icon = account.icon === 'savings' ? PiggyBank : account.icon === 'travel' ? Plane : CreditCard; return <div className="account-card" key={account.id}><div className="account-card-top"><div className={`account-icon ${account.color}`}><Icon size={23} strokeWidth={1.8}/></div><button onClick={() => setToast(`${account.name}: ${account.number}`)} aria-label={`Подробнее о счёте ${account.name}`}><ArrowUpRight size={18}/></button></div><div className="account-details"><span>{account.name}</span><small>{account.number}</small></div><strong>{display(account.balance)}</strong></div>})}</div>
      <div className="lower-grid"><section className="transactions panel"><div className="panel-head"><div><h2>Последние операции</h2><p>Всё движение средств</p></div><button className="text-link" onClick={() => navigate('История')}>Все операции <ArrowUpRight size={17}/></button></div><div className="search-box"><Search size={18}/><input placeholder="Поиск по операциям" value={query} onChange={e => setQuery(e.target.value)} aria-label="Поиск по операциям"/></div><div className="transaction-list">{filtered.length ? filtered.slice(0, page === 'История' ? undefined : 5).map(item => {const Icon = icons[item.icon] || Wallet; return <div className="transaction" key={item.id}><div className={`transaction-icon ${item.icon}`}><Icon size={20} strokeWidth={1.8}/></div><div className="transaction-copy"><strong>{item.title}</strong><small>{item.category} <span>·</span> {item.date}</small></div><strong className={`transaction-amount ${item.amount > 0 ? 'positive' : ''}`}>{hidden ? '•••• ₽' : `${item.amount > 0 ? '+' : '−'} ${rub(Math.abs(item.amount))}`}</strong></div>}) : <div className="empty">Операции не найдены</div>}</div></section>
      <section className="quick panel"><div className="panel-head"><div><h2>Быстрые действия</h2><p>Всё нужное в один клик</p></div></div><div className="quick-list"><button onClick={() => setModal(true)}><span className="quick-icon violet"><ArrowLeftRight size={20}/></span><span><strong>Перевести деньги</strong><small>Между своими счетами</small></span><ChevronRight size={18}/></button><button onClick={() => setToast('Пополнение счёта появится позже')}><span className="quick-icon mint"><Plus size={21}/></span><span><strong>Пополнить счёт</strong><small>Удобным способом</small></span><ChevronRight size={18}/></button><button onClick={() => navigate('История')}><span className="quick-icon amber"><ReceiptText size={20}/></span><span><strong>История операций</strong><small>Все ваши платежи</small></span><ChevronRight size={18}/></button></div><div className="promo"><div className="promo-decor">✳</div><span>НОВЫЕ ВОЗМОЖНОСТИ</span><h3>Деньги любят<br/>хороший план.</h3><p>Копите на важное с Nalitchka.</p><button onClick={() => setToast('Накопительный счёт уже доступен в списке счетов')}>Подробнее <ArrowUpRight size={16}/></button></div></section></div>
      </>}
      <footer className="footer"><span>© 2026 Nalitchka. Демонстрационный проект.</span><span>Сделано с заботой о ваших деньгах <span className="heart">♥</span></span></footer>
      </div></main>
    {toast && <div className="toast" role="status"><Check size={18}/>{toast}<button onClick={() => setToast('')} aria-label="Закрыть"><X size={16}/></button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => {if (e.target === e.currentTarget) setModal(false)}}><form className="modal" onSubmit={submit}><div className="modal-head"><div><span className="eyebrow">БЫСТРО И УДОБНО</span><h2>Перевод между счетами</h2></div><button type="button" onClick={() => setModal(false)} aria-label="Закрыть"><X size={20}/></button></div><label>Со счёта<select value={fromId} onChange={e => setFromId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name} · {rub(a.balance)}</option>)}</select></label><label>На счёт<select value={toId} onChange={e => setToId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name} · {rub(a.balance)}</option>)}</select></label><label>Сумма, ₽<input inputMode="decimal" type="number" min="0.01" step="0.01" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} required/></label>{formError && <div className="form-error" role="alert">{formError}</div>}<p className="modal-note">Это учебный перевод. Данные сбросятся после перезапуска сервера.</p><button className="submit" disabled={sending}>{sending ? 'Переводим…' : 'Перевести'} <ArrowUpRight size={18}/></button></form></div>}
  </div>
}

export default App
