import type { ReactNode } from "react";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div data-testid="app-layout" className={styles.container}>
      {children}
    </div>
  );
}

export default Layout;
