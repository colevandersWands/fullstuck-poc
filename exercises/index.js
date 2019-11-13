/* next steps
    if the array is some sort of observable, async pushes to the report can updated the .json file
      for async exercises
*/

const fs = require('fs');
const path = require('path');
const tableOfContents = require('./table-of-contents.js');

const tocKeys = Object.keys(tableOfContents);

const toLog = process.argv.length > 2
  ? process.argv.slice(2, process.argv.length)
  : tocKeys;

console.log('\ngenerating reports ...\n');

const oldRepoReport = (() => {
  try {
    const rawOldReport = fs.readFileSync('./report.json');
    const parsedOldReport = JSON.parse(rawOldReport);
    if (parsedOldReport.warnings['unable to load previous report']) {
      delete parsedOldReport.warnings['unable to load previous report'];
    }
    return parsedOldReport
  } catch (err) {
    return {
      warnings: {
        'unable to load previous report': err.message
      },
      directories: []
    };
  };
})();


// to preserve any fresh warnings
const newRepoReport = Object.assign({}, oldRepoReport, {
  repoName: 'js-in-node',
  status: 'unknown',
  directories: []
});

toLog.forEach(key => {
  if (key in tableOfContents) {

    const directory = key;
    const logsPath = '/' + directory + '/*.js';
    console.log('\n--- ' + logsPath + ' ---');

    const oldDirectoryReport = (() => {
      try {
        const rawOldReport = fs.readFileSync('./' + directory + '/report.json');
        const parsedOldReport = JSON.parse(rawOldReport);
        if (parsedOldReport.warnings['unable to load previous report']) {
          delete parsedOldReport.warnings['unable to load previous report'];
        }
        return parsedOldReport
      } catch (err) {
        return {
          warnings: {
            'unable to load previous report': err.message
          },
          files: []
        };
      };
    })();

    // to preserve any fresh warnings
    const newDirectoryReport = Object.assign({}, oldDirectoryReport, {
      dirName: directory,
      status: 'unknown',
      files: []
    });

    fs.readdirSync(directory)
      .filter(function (file) {
        return path.extname(file) === '.js';
      })
      .filter(function (file) {
        const evaluateFile = tableOfContents[directory].indexOf(file) !== -1;
        if (!evaluateFile) {
          const newFileReport = { fileName: file, status: 'on hold' };
          const oldFileIndex = oldDirectoryReport.files.findIndex(x => x.fileName === file);
          if (oldFileIndex !== -1) {
            newFileReport.timeStamp = oldDirectoryReport.files[oldFileIndex].timeStamp;
          }
          newFileReport.report = ['on hold, nothing to report'];
          newDirectoryReport.files.push(newFileReport);
        }
        return evaluateFile;
      })
      .forEach(function (file) {

        const newFileReport = { fileName: file, status: 'unknown' };

        const evaluation = (() => {
          try {
            return require('./' + directory + '/' + file);
          } catch (err) {
            return err;
          }
        })();

        if (evaluation instanceof Error) {
          newFileReport.status = 'error';
          newFileReport.error = {
            message: evaluation.message,
          };
          evaluation.hasOwnProperty('type')
            ? newFileReport.error.type = report.type : null;
          evaluation.hasOwnProperty('arguments')
            ? newFileReport.error.arguments = report.arguments : null;

        } else {
          newFileReport.status = (() => {
            if (evaluation instanceof Array) {
              return evaluation.length === 0
                ? 'no reports'
                : evaluation.every(x => x.length === 1)
                  ? 'passing'
                  : 'in progress';
            } else {
              return 'invalid';
            }
          })();
          newFileReport.report = (() => {
            if (evaluation instanceof Array) {
              return evaluation.map(entry => {
                if (entry instanceof Array) {
                  if (entry.length === 1) {
                    return '✔ ' + String(entry[0])
                  } else {
                    const secondItemParsed = (() => {
                      try {
                        const restOfEntry = entry.slice(1, entry.length);
                        const restParsed = restOfEntry.map(x => {
                          if (x instanceof Error) {
                            if (x.name === 'AssertionError') {
                              const errorLog = {};
                              errorLog.actual = x.actual;
                              errorLog.expected = x.expected;
                              errorLog.operator = x.operator;
                              // x.hasOwnProperty('name') ? errorLog.name = x.name : null;
                              return errorLog;
                            } else {
                              fileReport.error = {
                                message: evaluation.message,
                              };
                              evaluation.hasOwnProperty('type') ? fileReport.error.type = evaluation.type : null;
                              evaluation.hasOwnProperty('arguments') ? fileReport.error.arguments = evaluation.arguments : null;
                              return errorLog;
                            }
                          } else {
                            return typeof x === 'function'
                              ? x.toString()
                              : x
                          }
                        });
                        if (restParsed instanceof Array && restParsed.length === 1) {
                          return restParsed[0];
                        } else {
                          return restParsed;
                        }
                      } catch (err) {
                        return x;
                      }
                    })();
                    return { ['✗ ' + String(entry[0])]: secondItemParsed };
                  }
                } else {
                  return typeof x === 'function'
                    ? x.toString()
                    : x;
                }
              })
            } else {
              return {
                invalidReport: evaluation,
                expectedType: 'Array',
                actualType: typeof evaluation,
              };
            }
          })();
        }
        newFileReport.timeStamp = (new Date()).toLocaleString();

        newDirectoryReport.files.push(newFileReport);

      });

    newDirectoryReport.timeStamp = (new Date()).toLocaleString();

    // // not necessary, time is preserved if they are ignored.  that's the only piece to carry forward anyway
    // const preservedFileReports = oldDirectoryReport.files.filter(previousFileReport => {
    //   const indexInNew = newDirectoryReport.files.findIndex(file => file.fileName === previousFileReport.fileName);
    //   const noNewReport_keepOldReport = indexInNew === -1;
    //   return noNewReport_keepOldReport;
    // })

    // newDirectoryReport.files = [...newDirectoryReport.files, ...preservedFileReports];


    newDirectoryReport.status = (() => {
      if (!newDirectoryReport.files.every(file => file.status !== 'error')) {
        return 'error';
      } else if (newDirectoryReport.files.every(file => file.status === 'no reports')) {
        return 'no reports';
      } else if (newDirectoryReport.files.every(file => file.status === 'passing')) {
        return 'passing';
      } else if (newDirectoryReport.files.every(file => file.status === 'on hold')) {
        return 'on hold';
      } else if (!newDirectoryReport.files.every(file => file.status !== 'in progress')) {
        return 'in progress';
      } else {
        return 'on hold'; // weak
      }
    })();

    const newDirStr = JSON.stringify(newDirectoryReport, (key, value) => value === undefined ? '_undefined_' : value, 2);
    fs.writeFileSync('./' + directory + '/report.json', newDirStr);

    const slimDirectoryReport = {
      dirName: newDirectoryReport.dirName,
      status: newDirectoryReport.status,
      files: newDirectoryReport.files
        .map(file => ({ [file.fileName]: file.status }))
        .reduce((acc, fileSlim) => Object.assign(acc, fileSlim), {}),
      timeStamp: newDirectoryReport.timeStamp
    };

    newRepoReport.directories.push(slimDirectoryReport)
  } else {
    console.log('\nwarning: tableOfContents["' + key + '"] is undefined');
  }

})


newRepoReport.timeStamp = (new Date()).toLocaleString();

const inTableOfContents = oldRepoReport.directories.filter(dir => tocKeys.indexOf(dir.dirName) !== -1);

const preservedDirectoryReports = inTableOfContents.filter(previousDirReport => {
  const indexInNew = newRepoReport.directories.findIndex(dir => dir.dirName === previousDirReport.dirName);
  const noNewReport_keepOldReport = indexInNew === -1;
  return noNewReport_keepOldReport;
})

newRepoReport.directories = [...newRepoReport.directories, ...preservedDirectoryReports];

newRepoReport.status = (() => {
  if (!newRepoReport.directories.every(directory => directory.status !== 'error')) {
    return 'error';
  } else if (newRepoReport.directories.every(directory => directory.status === 'no reports')) {
    return 'no reports';
  } else if (newRepoReport.directories.every(directory => directory.status === 'passing')) {
    return 'passing';
  } else if (newRepoReport.directories.every(directory => directory.status === 'on hold')) {
    return 'on hold';
  } else if (!newRepoReport.directories.every(directory => directory.status !== 'in progress')) {
    return 'in progress';
  } else {
    return 'on hold'; // weak
  }
})();

const newRepoStr = JSON.stringify(newRepoReport, (key, value) => value === undefined ? '_undefined_' : value, 2);
fs.writeFileSync('./report.json', newRepoStr);

console.log('\n... all done!');
