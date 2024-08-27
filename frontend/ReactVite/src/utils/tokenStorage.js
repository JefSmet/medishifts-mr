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

export function parseJwt(bearerToken) {
  // Verwijder "Bearer " om het daadwerkelijke token te verkrijgen
  const token = bearerToken.replace('Bearer ', '');

  const base64Url = token.split('.')[1]; // Neem het payload-gedeelte
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// Event listener voor het afsluiten van de browser (alleen voor web)
window.addEventListener('beforeunload', () => {
  removeToken();
});
