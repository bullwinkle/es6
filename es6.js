//  --- GENERATORS ---

// 1. quiz generator
function* quiz(count=Infinity){
   let results = {};
   let defaultQ = 'Question';
   let i = 0;
   while (++i && count >= i ) {
     let q = yield results;
     results[`${i}.${q||defaultQ}`] = prompt(`${i}. ${q||defaultQ}`);
   }
}
var quizGenerator = quiz(5);

quizGenerator.next();// start

var results = quizGenerator.next('Your question').value; // ...
// or call all synchronously, like:
//for (var results of quizGenerator ) {}

console.info("results\n", results)






class ObjectIterator {
	
	constructor (params) {
		const obj = {...params};
		const items = Object.keys(obj)
			.map(key => ({key,value: obj[key]}));
		const arr = [...items];
		this.next = this.next.bind(this,arr);
		this.return = this.return.bind(this,arr);
		this.throw = this.throw.bind(this,arr);
		this.restart = this.restart.bind(this,arr,items);
	}

	[Symbol.iterator] () {return this;}

	next (arr) {
		const done = !arr.length; // have to be first;
		const value = arr.shift();
		return {value,done}
	}

	throw (arr) {}

	return (arr) {}

	restart (arr,items) {
		arr.splice(0);
		arr.push(...items);
		return this;
	}

}

function makeIterable (obj) {
   obj[Symbol.iterator] = function () { return new ObjectIterator(obj) }
   return obj;
}

// usage
const o = {
	foo:2,
	bar:3,
};
// console.log([...o]);
makeIterable(o);
console.log([...o]);




/**
 * @description This is async queue automatic handler;
 * @example 
 *  const queue = new AsyncQueue();
 *  queue.subscribe( it => console.log(it));
 *  queue.push(1,2,3,4,5);
 */
class AsyncQueue extends Array {
  /**
   *
   * @param options Object
   *  - [handleBy] Number : count to handle tasks by.
   *    - 0 is not aloud;
   *    - if negative will handle by all tasks in one tick;
   */
  constructor (options) {
    super();

    const { handleBy } = AsyncQueue.normalizeOptions(options);

    Object.defineProperty(this, 'stateKey', {
      value: Symbol('privateState'),
      enumerable: false,
      configurable: false,
    });

    this[this.stateKey] = {
      running: true,
      subscriptions: [],
      handleBy,
    };

    this.checkQueue = this.checkQueue.bind(this);

    this.start();
  }

  start () {
    this[this.stateKey].running = true;
    this.tick(this.checkQueue);
  }

  stop () {
    this[this.stateKey].running = false;
  }

  subscribe (callback) {
    this[this.stateKey].subscriptions.push(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe (callback) {
    const index = this[this.stateKey].subscriptions.indexOf(callback);
    if (index > -1) {
      this[this.stateKey].subscriptions.splice(index, 1);
    }
  }

  checkQueue () {
    if (!this[this.stateKey].running) {
      return false;
    }

    if (this.length > 0) {
      this.splice(0, this[this.stateKey].handleBy > 0 ? this[this.stateKey].handleBy : this.length)
        .forEach(task => {
          this[this.stateKey].subscriptions.forEach(handler => {
            if (typeof handler === 'function') {
              handler(task);
            }
          });
        });
    }

    if (!this[this.stateKey].running) {
      return false;
    }

    this.tick(this.checkQueue);
  };

  tick (callback) {
    return requestAnimationFrame(callback);
  }

  static get defaults () {
    return {
      handleBy: 1,
    };
  }

  static normalizeOptions (options = {}) {
    options.handleBy = options.handleBy === 0 ? 1 : options.handleBy;

    return Object.assign(
      this.defaults,
      options,
    );
  }
}

