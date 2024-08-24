// Functies om tokens op te slaan, op te halen en te verwijderen
export const storeToken = async (token) => {
  sessionStorage.setItem('jwtToken', token);
};

export const getToken = async () => {
  return sessionStorage.getItem('jwtToken');
};

export const removeToken = async () => {
  sessionStorage.removeItem('jwtToken');
};

// Event listener voor het afsluiten van de browser (alleen voor web)
window.addEventListener('beforeunload', () => {
  removeToken();
});
