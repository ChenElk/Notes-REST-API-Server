import axios from 'axios'

const baseUrl = 'http://127.0.0.1:3001/notes'

type getAllParams = {
  activePage: number;
  POSTS_PER_PAGE: number;
};

type NoteInput = {
  title: string;
  author?: {
    name: string;
    email: string;
  }| null;
  content: string;
};

let token: string | null = null;

const setToken = (newToken: string | null) => {
  token = newToken ? `Bearer ${newToken}` : null;
};

const getAll = ({ activePage, POSTS_PER_PAGE }: getAllParams) => {
  return axios.get(baseUrl, {
    params: {
      _page: activePage,
      _per_page: POSTS_PER_PAGE
    }
  });
}

const create = (newObject: NoteInput) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id: string, newObject: NoteInput) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const remove = (id: string) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken
}