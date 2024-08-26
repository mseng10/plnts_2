const API_BASE_URL = 'http://127.0.0.1:5000';

/** Wrapper for fetch with error handling and jsonifying. */
export const simpleFetch = (url) => {
  return fetch(`${API_BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};

/** Wrapper for fetch with error handling and jsonifying. */
export const simplePost = (url, model) => {
  return fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};

/** Wrapper for fetch with error handling and jsonifying. */
export const simplePatch = (url, patchModel) => {
  return fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchModel)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};
