export function getApiErrorMessage(error, fallbackMessage = 'Une erreur est survenue.') {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message === 'Network Error') {
    return 'Connexion au serveur impossible. Verifiez que le backend est bien demarre.';
  }

  return fallbackMessage;
}
