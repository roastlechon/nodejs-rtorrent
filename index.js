try {
  process.chdir('src/node');
} catch (err) {
  console.log(err);
}

require('./src/node/app');