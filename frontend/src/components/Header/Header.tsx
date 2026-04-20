import { useNavigate } from "react-router-dom";

import { searchConfig } from "../../config/searchConfig";
import { createResetState } from "../../types/navigation";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header} data-testid="app-header">
      <a
        className={styles.link}
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/", { state: createResetState() });
        }}
      >
        {searchConfig.appTitle}
      </a>
    </header>
  );
}

export default Header;
