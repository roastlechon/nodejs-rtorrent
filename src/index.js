console.log('Starting directory: ' + process.cwd());

try {
  process.chdir('server');
  console.log('New directory: ' + process.cwd());
} catch (err) {
  console.log('chdir: ' + err);
}

require('./server/app');