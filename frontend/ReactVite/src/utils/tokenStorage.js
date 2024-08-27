// Functies om tokens op te slaan, op te halen en te verwijderen
export const storeToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

// Event listener voor het afsluiten van de browser (alleen voor web)
window.addEventListener('beforeunload', () => {
  removeToken();
});
