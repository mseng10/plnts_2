const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchAlerts = () => {
  return fetch(`${API_BASE_URL}/alert/check`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};

/*** Resolve the specific plant alert.  */
export const resolveAlert = (alertId) => {
  return fetch(`${API_BASE_URL}/alert/plant/${alertId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    });
};