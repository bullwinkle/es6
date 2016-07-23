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
