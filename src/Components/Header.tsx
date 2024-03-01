import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Decimal from 'decimal.js';
import styles from './Header.module.scss';

export default function Header() {
  const [balanceDec, setBalanceDec] = useState(new Decimal(0));

  return (
    <div className={styles.header}>
      <div className={styles.nav}>
        <Link to="/">
          <div className={styles.logo}>SDG 募資平台</div>
        </Link>
        <div className={styles.menuItem}>
          <Link to="/explore">
            <div className={styles.link}>探索</div>
          </Link>
          <Link to="/propose">
            <div className={styles.link}>提案</div>
          </Link>
          <Link to="/showcase">
            <div className={styles.link}>成果</div>
          </Link>
          <Link to="/contracts">
            <div className={styles.link}>NFT</div>
          </Link>
          <Link to="/contracts">
            <div className={styles.link}>關於</div>
          </Link>
        </div>
      </div>
      <div className={styles.account}>
        <p className={styles.balance}>Balance: {balanceDec.toFixed(2)}</p>
        <p className={styles.balance}>
          <Link to="/signin">
            <div className={styles.link}>登入</div>
          </Link> </p>
        {/* <ConnectButton /> Placeholder for ConnectButton or similar functionality */}
      </div>
    </div>
  );
}
