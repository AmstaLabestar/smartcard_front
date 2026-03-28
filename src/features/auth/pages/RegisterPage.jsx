import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <section className="form-card">
      <h2>Inscription</h2>
      <p className="muted">Sprint FE-1: formulaire connecte au backend.</p>
      <form>
        <input type="text" placeholder="Prenom" />
        <input type="text" placeholder="Nom" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button className="primary-button" type="button">
          Creer mon compte
        </button>
      </form>
      <p>
        Deja un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </section>
  );
}
