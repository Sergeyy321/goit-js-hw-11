import axios from 'axios';
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '33447079-0ba3d1fd30cda0252aa7b7ada';
const perPage = 40;
let page = 1; //ця змінна нічого не робить, у тебе в класі прописана змінна, котра далі використовується в коді
export default class imagesAPIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
       const width = window.innerWidth;
       if (width >= 704) {
         return (this.count = 3);
       }
       if (width < 704) {
         return (this.count = 4);
    } 
    console.log(width);
  }
  async fetchImages() {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          page: this.page, //+this тут необхідно додати this. бо ти працюєш зі змінною класу
          per_page: perPage,
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

