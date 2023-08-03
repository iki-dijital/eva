import esbuild from 'esbuild';

let getEnv = null;
let startTime;



process.argv.forEach((val) => {
  if (val === 'production') {
    getEnv = val;
  } else {
    getEnv = process.env.NODE_ENV || 'development';
  }
});


if (getEnv !== undefined) {
  console.log(`\x1b[33m Running under ${getEnv} build. \x1b[039m`);
} else {
  console.log(
    `\x1b[31m WARNING! No environment found. Running under development build as default. You can create .env file or manually declare NODE_ENV \x1b[039m`
  );
}



const watchPlugin = {
  name: 'watch-plugin',
  setup(build) {
    build.onStart(() => {
      startTime = new Date().getTime();
      console.log(`\x1b[96m Build started. \x1b[039m`);
    });
    build.onEnd((result) => {
      if (result.errors.length > 0) {
        console.log(
          `\x1b[31m Build failed. Error: ${result.errors[0].text} \x1b[039m`
        );
      } else {
        console.log(
          `\x1b[32m Build completed in ${
            new Date().getTime() - startTime
          }ms.  [${new Date().toLocaleTimeString('en-GB', {
            hour12: false,
          })}]  \x1b[039m`
        );
      }
    });
  },
};

const options = {
  entryPoints: ["src/js/pages/main.js"],
  bundle: true,
  minify: getEnv === 'production',
  logLevel: 'warning',
  treeShaking: getEnv === 'production',
  sourcemap: getEnv === 'production' ? false : 'inline',
  color: true,
  outdir: "theme/assets/js",
  plugins: [watchPlugin],
};


if (getEnv !== 'production') {
  let ctx = await esbuild.context(options);
  ctx.watch();
} else {
  await esbuild.build(options);
}
