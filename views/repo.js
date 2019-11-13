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

  const tocButton = document.createElement('button');
  tocButton.innerHTML = 'view table of contents on GitHub';

  const tocA = document.createElement('a');
  const fileAddress = 'https://github.com/' + userName + repoName + 'blob/master/exercises/table-of-contents.js';
  tocA.href = fileAddress;
  tocA.target = '_blank';
  tocA.appendChild(tocButton);

  const reportButton = document.createElement('button');
  reportButton.innerHTML = 'view raw report on GitHub';

  const reportA = document.createElement('a');
  reportA.href = 'https://github.com/' + userName + repoName + 'blob/master/exercises/report.json';
  reportA.target = '_blank';
  reportA.appendChild(reportButton);

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
  repoDiv.appendChild(tocA);
  repoDiv.appendChild(reportA);
  repoDiv.appendChild(document.createElement('br'));
  repoDiv.appendChild(document.createElement('br'));
  repoDiv.appendChild(statusStats);
  repoDiv.appendChild(filesListUl);

  return repoDiv;
}
