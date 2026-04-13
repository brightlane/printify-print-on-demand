const { exec } = require("child_process");

// run generator immediately
function runJob() {
  console.log("RUNNING SEO GENERATION JOB...");

  exec("node generator/generate.js", (err, stdout, stderr) => {
    if (err) {
      console.error("ERROR:", err);
      return;
    }
    if (stderr) console.error(stderr);

    console.log(stdout);
    console.log("JOB COMPLETE");
  });
}

// run once immediately
runJob();

// then repeat every 24 hours
setInterval(() => {
  runJob();
}, 1000 * 60 * 60 * 24);
