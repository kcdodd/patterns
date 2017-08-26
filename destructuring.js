"use strict";

// parameters
const f = (firstArg, {a, b: {c, d:differentLocalName}}, [x,y], ...restOfArgs) => {
  console.log(firstArg);
  console.log(a);
  console.log(c);
  console.log(differentLocalName);
  console.log(x);
  console.log(y);
  restOfArgs.map(arg => console.log(arg));
};

f("hi", {a: "purple", b: {c: "cow", d: "moon"}}, ["rainbow", "gold"], "huh?", "idk.");
