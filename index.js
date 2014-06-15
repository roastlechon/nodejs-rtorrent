try {
  process.chdir('server');
} catch (err) {
  console.log(err);
}

require('./app/server/app');