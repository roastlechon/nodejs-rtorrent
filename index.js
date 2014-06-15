try {
  process.chdir('app/server');
} catch (err) {
  console.log(err);
}

require('./app/server/app');