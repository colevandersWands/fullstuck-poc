// later: warnings
// depends on global Prism & renderReport (an alert and log for now)
// renders single file from all file data, could be more efficient

function renderFile(dirData, fileName) {

  const fileData = dirData.files.filter(file => file.fileName === fileName)[0];
  renderReport(fileName, fileData.report);

  const fileColor = fileData.status === 'no reports'
    ? 'black'
    : fileData.status === 'error'
      ? 'red'
      : fileData.status === 'passing'
        ? 'green'
        : fileData.status === 'on hold'
          ? 'black'
          : fileData.status === 'in progress'
            ? 'orange'
            : 'purple';

  const header = document.createElement('h2');
  header.innerHTML = dirData.dirName + '/' + fileName;
  header.style.color = fileColor;

  const statusStats = document.createElement('text');
  statusStats.innerHTML = fileData.status + ': ' + fileData.timeStamp;

  const timeStampEl = document.createElement('text');
  timeStampEl.innerHTML = fileData.timeStamp;

  const filePath = './exercises/' + dirData.dirName + '/' + fileName;
  fetch(filePath)
    .then(resp => resp.text())
    .then(code => {
      const codeEl = document.createElement('code');
      codeEl.innerHTML = code;
      codeEl.className = "language-js line-numbers";


      const pre = document.createElement('pre');
      pre.appendChild(codeEl);
      pre.style.fontSize = '80%';
      Prism.highlightAllUnder(pre);

      fileDiv.appendChild(pre);
    })
    .catch(err => console.log(err));

  const viewSourceButton = document.createElement('button');
  viewSourceButton.innerHTML = 'view source on GitHub';

  const viewSourceA = document.createElement('a');
  const fileAddress = 'https://github.com/' + userName + repoName + './blob/master/' + filePath;
  console.log(fileAddress)
  viewSourceA.href = fileAddress;
  viewSourceA.target = '_blank';
  viewSourceA.appendChild(viewSourceButton);


  const backButton = document.createElement('button');
  backButton.innerHTML = 'back to index';
  backButton.onclick = () => {
    render(renderRepo(cache['./exercises/report.json']));
  };

  const fileDiv = document.createElement('div');
  fileDiv.appendChild(header);
  fileDiv.appendChild(statusStats);
  fileDiv.appendChild(document.createElement('br'));
  fileDiv.appendChild(document.createElement('br'));
  fileDiv.appendChild(backButton);
  fileDiv.appendChild(viewSourceA);

  return fileDiv;
}

