const cache = {};

window.onload = () => {
  fetch('./exercises/report.json')
    .then(resp => resp.json())
    .then(repoData => {
      cache['./exercises/report.json'] = repoData;
      render(renderRepo(repoData));
    })
    .catch(err => console.log(err));
};
