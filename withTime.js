const EventEmitter = require('events');
const fetch = require('node-fetch');

class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    this.emit('begin');
    console.time('execute');

    const data = await asyncFunc(...args);
    console.log(data);

    console.timeEnd('execute');
    this.emit('end');
  }
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

console.log(withTime.rawListeners('end'));

const fetchData = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

withTime.execute(fetchData, 'https://jsonplaceholder.typicode.com/posts/1');