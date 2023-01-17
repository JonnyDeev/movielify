import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/popular',
  params: {api_key: 'f84687f95399197af9ce7f3a47b94660', language: 'en-US'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});