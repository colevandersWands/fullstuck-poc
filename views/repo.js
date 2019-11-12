// later: warnings
// depends on global renderDirectory function

function renderRepo(repo) {

  console.log('directories:', repo.directories);

  if (repo.warnings && Object.keys(repo.warnings).length > 0) {
    Object.keys(repo.warnings).forEach(warningKey => {
      console.warn(repo.warnings[warningKey]);
    });
  }

  const repoColor = repo.status === 'no reports'
    ? 'black'
    : repo.status === 'error'
      ? 'red'
      : repo.status === 'passing'
        ? 'lightGreen'
        : repo.status === 'on hold'
          ? 'black'
          : repo.status === 'in progress'
            ? 'orange'
            : 'violet';


  const repoNameH1 = document.createElement('h1');
  repoNameH1.innerHTML = repo.repoName;
  repoNameH1.style.color = repoColor;

  const statusStats = document.createElement('text');
  statusStats.innerHTML = repo.timeStamp;

  const timeStampTextEl = document.createElement('text');
  timeStampTextEl.innerHTML = repo.timeStamp;

  const filesListUl = Object.keys(repo.directories)
    .map(dirName => renderDirectory(repo.directories[dirName]))
    .reduce((ul, li) => {
      ul.appendChild(li);
      return ul;
    }, document.createElement('ul'));

  const repoDiv = document.createElement('div');
  repoDiv.appendChild(repoNameH1);
  repoDiv.appendChild(statusStats);
  repoDiv.appendChild(filesListUl);

  return repoDiv;
}
