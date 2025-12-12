import styles from "../styles/Menu.module.scss";
import Link from 'next/link';

export default function Menu() {
  return (
    <header className={styles.menu}>
      <div className={styles.logo}>
        <span className={styles.pigIcon}>
          <img
            src="https://cdn.melhorplano.net/cms/2022/10/27/635ab82c7c24dmelhorplano-net-logo-nova.svg"
            alt="Logo MelhorPlano.net"
            style={{ height: 40, width: "auto" }}
          />
        </span>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">INTERNET</a>
          </li>
          <li>
            <a href="#">CELULAR</a>
          </li>
          <li>
            <a href="#">TV E STREAMING</a>
          </li>
          <li>
            <a href="#">FIXO E COMBO</a>
          </li>
          <li>
            <a href="#">OPERADORAS</a>
          </li>
          <li>
            <a href="#">GUIAS E FERRAMENTAS</a>
          </li>
          <li>
            <Link 
              href="/recommend" 
              style={{ 
                color: '#ff6b35', 
                fontWeight: 'bold',
                background: '#fff3e0',
                padding: '8px 16px',
                borderRadius: '20px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              🎯 RECOMENDAÇÃO INTELIGENTE
            </Link>
          </li>
          <li>
            <a href="#">CADASTRAR PROVEDOR</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}