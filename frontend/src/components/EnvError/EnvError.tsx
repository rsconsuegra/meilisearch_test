import styles from "./EnvError.module.css";

interface EnvErrorProps {
  message: string;
}

export default function EnvError({ message }: EnvErrorProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configuration Error</h1>
      <p className={styles.message}>{message}</p>
      <p className={styles.hint}>
        Check your <code>.env</code> file against <code>.env.example</code> and restart the dev
        server.
      </p>
    </div>
  );
}
