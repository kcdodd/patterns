const Promise = require("bluebird");

const f = async (x, t) => {
  return new Promise((resolve, reject) => {

      setTimeout(() => {
        try{
          if (/damn/.test(x) || /sucks/.test(x)) {
            throw new Error("No curse words!");
          }

          console.log("  resolved: " + x);
          resolve(x);
        }catch(error){
          reject(error);
        }
      }, t);
  });
};

const g = async () => {
  try{
    console.log("sequence:");
    const a = await f("hi", 1000);
    const b = await f("there", 3000);
    const c = await f("boo", 2000);

    console.log("-> " + a + " " + b + " " + c);

    console.log("parallel:");
    const d = await Promise.all([f("hi", 1000), f("there", 3000), f("boo", 2000)]);

    console.log("-> " + d[0] + " " + d[1] + " " + d[2]);

    console.log("race:");
    const e = await Promise.some([f("hi", 2000), f("there", 3000), f("boo", 1000)], 1);
    console.log("-> " + e);

    console.log("fallback:");

    const m = await f("damn", 1000)
      .catch((error) => {
        console.error(error);
        return f("sucks", 1000);
      })
      .catch((error) => {
        console.error(error);
        return f("darn", 1000);
      });

      console.log("-> " + m);

  }catch(error) {
    console.error(error);
  }
};

g();
