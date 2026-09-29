import React, {useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ArrowRight, Menu, X} from 'lucide-react'
import Dashboard from './Dashboard.jsx'
import './landing.css'

const products = [
  {id: 'cards', title: 'Карты', description: 'Для покупок и планов', symbol: '●', tone: 'green', details: 'Дебетовая карта Nalitchka для повседневных покупок. Это концепт продукта в демонстрационном проекте.'},
  {id: 'deposits', title: 'Вклады', description: 'Копите на важное', symbol: '◉', tone: 'purple', details: 'Следите за своими накоплениями в одном приложении. Условия вкладов в демонстрационной версии пока не представлены.'},
  {id: 'loans', title: 'Кредиты', description: 'Планы становятся ближе', symbol: '✦', tone: 'yellow', details: 'Раздел кредитов находится в разработке. Доступные предложения и условия появятся позже.'},
  {id: 'about', title: 'О банке', description: 'Технологии для людей', symbol: '➤', tone: 'blue', details: 'Nalitchka — учебный проект интернет-банка на React и Express. Здесь можно посмотреть интерфейс личного кабинета и выполнить учебный перевод между счетами.'},
]

function Landing() {
  const [active, setActive] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!active) return
    const onKeyDown = event => {if (event.key === 'Escape') setActive(null)}
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active])

  const openProduct = product => {setMenuOpen(false); setActive(product)}

  return <div className="landing">
    <div className="landing-shell">
      <header className="site-header">
        <a className="site-logo" href="/" aria-label="Nalitchka — главная"><span className="logo-dots" aria-hidden="true"><i/><i/></span>Nalitchka</a>
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Основная навигация">
          {products.map(product => <a key={product.id} href={`#${product.id}`} onClick={() => setMenuOpen(false)}>{product.title}</a>)}
        </nav>
        <a className="login-button" href="/app">Войти</a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <div className="lime-back"/>
            <div className="lime-stem"/>
            <div className="bank-card"><strong>Nalitchka</strong><span className="card-chip"/><b>МИР</b></div>
            <div className="phone">
              <div className="phone-screen">
                <strong className="phone-brand">Nalitchka</strong>
                <span className="phone-hello">Привет, Аня 👋</span>
                <div className="phone-balance"><span>Основной счёт</span><strong>124 390 ₽</strong></div>
                <div className="phone-actions">{['Пополнить', 'Перевести', 'Оплатить'].map(label => <div key={label}><span/>{label}</div>)}</div>
                <strong className="phone-heading">Мои карты</strong>
                <div className="phone-card-row"><span className="phone-card-icon">N</span><span><strong>•••• 4831</strong><small>Дебетовая карта</small></span></div>
              </div>
            </div>
          </div>
          <div className="hero-copy">
            <p className="hero-eyebrow">БОЛЬШЕ, ЧЕМ БАНК</p>
            <h1 id="hero-title">Деньги<br/>на твоей<br/>стороне</h1>
            <span className="hero-underline" aria-hidden="true"/>
            <p className="hero-description">Удобная карта и понятные инструменты<br className="desktop-break"/> для повседневных финансов.</p>
            <button className="order-button" onClick={() => openProduct(products[0])}>Заказать карту <ArrowRight size={23} strokeWidth={2.4}/></button>
            <p className="hero-note">Всё важное — в одном приложении</p>
          </div>
        </section>

        <section className="products" aria-label="Продукты Nalitchka">
          {products.map(product => <button type="button" id={product.id} key={product.id} className={`product-card ${product.tone}`} onClick={() => openProduct(product)} aria-label={`Подробнее: ${product.title}`}>
            <span className="product-symbol" aria-hidden="true">{product.symbol}</span>
            <span className="product-name">{product.title}</span>
            <span className="product-description">{product.description}</span>
            <span className="product-arrow" aria-hidden="true"><ArrowRight size={23}/></span>
          </button>)}
        </section>
      </main>
      <footer className="landing-footer">© 2026 Nalitchka · Демонстрационный проект</footer>
    </div>
    {active && <div className="product-modal-backdrop" onMouseDown={event => {if (event.target === event.currentTarget) setActive(null)}}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <button className="modal-close" aria-label="Закрыть" onClick={() => setActive(null)}><X size={21}/></button>
        <span className="modal-symbol" aria-hidden="true">{active.symbol}</span>
        <h2 id="product-modal-title">{active.title}</h2>
        <p>{active.details}</p>
        <a href="/app" className="modal-link">Посмотреть личный кабинет <ArrowRight size={18}/></a>
      </section>
    </div>}
  </div>
}

createRoot(document.getElementById('root')).render(location.pathname.startsWith('/app') ? <Dashboard/> : <Landing/>)
