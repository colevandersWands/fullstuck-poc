// later: warnings

function renderDirectory(directory) {

  const dirColor = directory.status === 'no reports'
    ? 'black'
    : directory.status === 'error'
      ? 'red'
      : directory.status === 'passing'
        ? 'lightGreen'
        : directory.status === 'on hold'
          ? 'black'
          : directory.status === 'in progress'
            ? 'orange'
            : 'violet';

  const dirNameTextEl = document.createElement('text');
  dirNameTextEl.innerHTML = directory.dirName;
  dirNameTextEl.style.color = dirColor;

  const dirNameH2 = document.createElement('h2');
  dirNameH2.appendChild(dirNameTextEl);

  const statusTextEl = document.createElement('text');
  statusTextEl.innerHTML = directory.status + ': ' + directory.timeStamp;

  const filesListUl = Object.keys(directory.files)
    .map(fileName => {
      const fileColor = directory.files[fileName] === 'no reports'
        ? 'white'
        : directory.files[fileName] === 'error'
          ? 'red'
          : directory.files[fileName] === 'passing'
            ? 'lightGreen'
            : directory.files[fileName] === 'on hold'
              ? 'yellow'
              : directory.files[fileName] === 'in progress'
                ? 'orange'
                : 'violet';

      const newButton = document.createElement('button');
      newButton.innerHTML = fileName;
      newButton.style.backgroundColor = fileColor;

      const newLi = document.createElement('li');

      const reportPath = './exercises/' + directory.dirName + '/report.json';
      newLi.onclick = () => {
        if (cache.hasOwnProperty(reportPath)) {
          render(renderFile(directory, fileName));
        } else {
          fetch(reportPath)
            .then(resp => resp.json())
            .then(directory => {
              cache[reportPath] !== undefined ? cache[reportPath] = directory : null;
              render(renderFile(directory, fileName));
            })
            .catch(err => console.log(err));
        };
      };
      newLi.appendChild(newButton);
      return newLi
    })
    .reduce((ul, li) => {
      ul.appendChild(li);
      return ul;
    }, document.createElement('ul'));

  const directoryDiv = document.createElement('div');
  directoryDiv.appendChild(dirNameH2);
  directoryDiv.appendChild(statusTextEl);
  directoryDiv.appendChild(document.createElement('br'));
  directoryDiv.appendChild(document.createElement('br'));
  directoryDiv.appendChild(filesListUl);

  return directoryDiv;
}
