const API_BASE_URL = 'http://127.0.0.1:8002';

export const APIS = {
  plant: {
    getAll: "/plants/",
    create: "/plants/",
    getOne: "/plants/{id}/",
    updateOne: "/plants/{id}/",
    deleteOne: "/plants/{id}/",
    waterMany: "/plants/water/",
    deprecateMany: "/plants/deprecate/"
  },
  system: {
    getAll: "/systems/",
    create: "/systems/",
    getOne: "/systems/{id}/",
    updateOne: "/systems/{id}/",
    deleteOne: "/systems/{id}/",
    plants: "/systems/{id}/plants/",
    alerts: "/systems/{id}/alerts/"
  },
  todo: {
    getAll: "/todos/",
    create: "/todos/",
    getOne: "/todos/{id}/",
    updateOne: "/todos/{id}/",
    deleteOne: "/todos/{id}/",
  },
  alert: {
    getAll: "/alerts/",
    deleteOne: "/alerts/{id}/",
  },
  light: {
    getAll: "/lights/",
    create: "/lights/",
    deleteOne: "/todos/{id}/",

  },
  meta: {
    getOne: "/meta/"
  },
  stats: {
    getOne: "/stats/"
  },
  mix: {
    getAll: "/mixes/",
    create: "/mixes/",
    updateOne: "/mixes/{id}/",
    deleteOne: "/todos/{id}/",
  },
  soil: {
    getAll: "/soils/"
  },
  species: {
    getAll: "/species/",
    create: "/species/",
    createAll: "/species/all", // sure
  },
  generaTypes: {
    getAll: "/genus_types/",
    create: "/genus_types/",
    genera: "/genus_types/{id}/tasks/{eid}/",
    generaCreate: "/genus_types/{id}/tasks/{eid}/"
  },
  task: {
    resolve: "/todos/{id}/tasks/{eid}/resolve",
    unresolve: "/todos/{id}/tasks/{eid}/unresolve"
  },
  app: {
    chat: "/chat/",
    health: "/health/"
  }
}

export const apiBuilder = (url) => {

  return {
    fullUrl: API_BASE_URL + url,
    setId(id) {
      this.fullUrl = this.fullUrl.replace('{id}', id);

      return this;
    },
    setEmbedId(id) {
      this.fullUrl = this.fullUrl.replace('{eid}', id);

      return this;
    },
    get() {

      return this.fullUrl;
    }
  };
};

/** Wrapper for fetch with error handling and jsonifying. */
export const simpleFetch = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};

/** Wrapper for fetch with error handling and jsonifying. */
export const simplePost = (url, model) => {
  return fetch(url, {
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

/** Wrapper for update handling and jsonifying. */
export const simplePatch = (url, patchModel) => {
  return fetch(url, {
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

/** Wrapper for delete handling and jsonifying. */
export const simpleDelete = (url) => {
  return fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }    
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return "";
    });
};
