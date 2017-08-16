/**
 * https://jakearchibald.com/2017/async-iterators-and-generators/
 */
"use strict";
import Promise from "bluebird";
import fetch from "isomorphic-unfetch";

// Note the * after "function"
async function * asyncRandomNumbers() {
  // This is a web service that returns a random number
  const url = 'https://www.random.org/decimal-fractions/?num=1&dec=10&col=1&format=plain&rnd=new';

  let last = -1;
  let count = 0;

  while (last < 0.95 && count < 5) {
    count++;

    const response = await fetch(url);
    const text = await response.text();
    const num = Number(text);
    last = num;

    yield num;
  }

  return count;
}



async function example() {
  try {

    let count = 0;
    async function * randos() {
      // delegate generation using yield* and get return value.
      count = yield* asyncRandomNumbers();
    };

    for await(const number of randos()) {
      console.log(number);
    }

    console.log(`count: ${count}`);
  } catch (e) {
    console.error(e);
  }
}

example();
