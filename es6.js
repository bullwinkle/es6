//  --- GENERATORS ---

// 1. quiz generator
function* quiz(count=5){
   let results = {};
   let i = 0;
   while (++i && count >= i ) {
     results[`Answer #${i}`] = prompt(`Question #${i}`);
     yield results
   }
}
let quizGenerator = quiz(10);

// var results = quizGenerator.next().value; // ...
// or call all synchronously, like:
for (var results of quizGenerator ) {}

console.info("results\n", results)
