const cache = {};

const userName = window.location.origin
  .split('https://').join('')
  .split('http://').join('')
  .split('.')
  .shift();
const repoName = window.location.pathname
  .split('index.html').join('');

window.onload = () => {
  fetch('./exercises/report.json')
    .then(resp => resp.json())
    .then(repoData => {
      cache['./exercises/report.json'] = repoData;
      render(renderRepo(repoData));
    })
    .catch(err => console.log(err));
};
