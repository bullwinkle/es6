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
