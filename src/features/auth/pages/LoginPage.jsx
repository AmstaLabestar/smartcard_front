import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <section className="form-card">
      <h2>Connexion</h2>
      <p className="muted">On branchera l'API auth au sprint FE-1.</p>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button className="primary-button" type="button">
          Se connecter
        </button>
      </form>
      <p>
        Pas encore de compte ? <Link to="/register">Creer un compte</Link>
      </p>
    </section>
  );
}
