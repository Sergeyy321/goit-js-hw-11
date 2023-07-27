import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '33447079-0ba3d1fd30cda0252aa7b7ada';

export default class imagesAPIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.count = 40;
  }

  async fetchImages() {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          page:  this.page,
          per_page: this.count,
          safesearch: true,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}