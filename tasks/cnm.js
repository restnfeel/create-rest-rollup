#!/usr/bin/env node
/**
 * Copyright seo jeong hwan [restnfeel@gmail.com]
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const chalk = require("chalk");
const path = require("path");
const commander = require("commander");
const _cliProgress = require("cli-progress");
const fs = require("fs-extra");
const os = require("os");

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];

const tempLoc = path.resolve(
  __dirname,
  "../packages/create-rest-module-template"
);

/**
 * 사용자가 입력한 위치에서 모듈명을 결합시켜줍니다.
 */
const userDirCheck = function(dName) {
  let currentDir = process.cwd();
  let makeDirName = path.resolve(currentDir, dName);
  return makeDirName;
};

/**
 * 템플릿을 사용자가 지정한 프로젝트로 복사합니다.
 */
const copyTemplateToUserDir = function(userPath) {
  fs.copy(tempLoc, userPath, function(errr) {
    return false;
  });
  return true;
};

const showCompleteMessage = function(createDirName, modulename) {
  console.log(
    chalk.cyan(
      "##################################################################"
    )
  );
  console.log();
  console.log(
    chalk.cyan(" Welcome! Create REST Rollup CLI, Made by RestNFeel")
  );
  console.log();
  console.log(chalk.cyan(" REST Rollup이 생성되었습니다."));
  console.log(chalk.cyan(" [생성위치] : %s"), createDirName);
  console.log(
    chalk.cyan(" 아래 절차대로 초기 세팅후 모듈개발을 하시기 바랍니다.")
  );
  console.log();
  console.log(chalk.cyan(" cd %s"), modulename);
  console.log(chalk.cyan(" yarn install"));
  console.log();
  console.log(chalk.cyan(" yarn build"));
  console.log();
  console.log(chalk.cyan(" yarn start"));
  console.log();
  console.log(
    chalk.cyan(
      "##################################################################"
    )
  );
};

/**
 * package.json 만들기.
 */
const makePackageJson = async function(modulename) {
  let packageJson = {
    name: modulename,
    version: "0.1.0",
    description: "",
    main: "./dist/" + modulename + ".min.js",
    scripts: {
      start:
        "node ./node_modules/rollup/bin/rollup --config rollup.config.dev.js -w -m",
      build: "node ./node_modules/rollup/bin/rollup -c -m",
      doc: "./node_modules/.bin/esdoc",
      test: "jest --watchAll"
    },
    keywords: ["create-rest-module", modulename],
    author: "Developer [" + os.hostname + "]",
    license: "MIT",
    dependencies: {
      axios: "^0.18.0",
      mobx: "^5.5.1",
      "mobx-react": "^5.3.4",
      npm: "^6.4.1",
      "prop-types": "^15.6.2",
      react: "^16.5.2",
      "react-dom": "^16.5.2",
      "rollup-plugin-img": "^1.1.0",
      "rollup-plugin-inject": "^2.2.0",
      "styled-components": "^4.0.3"
    },
    devDependencies: {
      "@babel/core": "^7.1.0",
      "@babel/plugin-external-helpers": "^7.0.0",
      "@babel/plugin-proposal-class-properties": "^7.1.0",
      "@babel/plugin-proposal-decorators": "^7.1.0",
      "@babel/plugin-syntax-dynamic-import": "^7.0.0",
      "@babel/plugin-transform-parameters": "^7.1.0",
      "@babel/plugin-transform-runtime": "^7.0.0",
      "@babel/polyfill": "^7.0.0",
      "@babel/preset-env": "^7.0.0",
      "@babel/preset-flow": "^7.0.0",
      "@babel/preset-react": "^7.0.0",
      "@babel/register": "^7.0.0",
      "@babel/runtime": "^7.0.0",
      "babel-core": "7.0.0-bridge.0",
      "babel-jest": "^23.6.0",
      "babel-plugin-transform-class-properties": "^6.24.1",
      "babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
      "babel-preset-jest": "^23.2.0",
      "babel-preset-mobx": "^2.0.0",
      enzyme: "^3.6.0",
      "enzyme-adapter-react-16": "^1.5.0",
      "enzyme-to-json": "^3.3.4",
      esdoc: "^1.1.0",
      "esdoc-ecmascript-proposal-plugin": "^1.0.0",
      "esdoc-flow-plugin": "^1.0.0",
      "esdoc-flow-type-plugin": "^1.1.0",
      "esdoc-jsx-plugin": "^1.0.0",
      "esdoc-standard-plugin": "^1.0.0",
      "flow-bin": "^0.82.0",
      "flow-typed": "^2.5.1",
      jest: "^23.6.0",
      "react-test-renderer": "^16.5.2",
      "regenerator-runtime": "^0.12.1",
      rollup: "^0.65.2",
      "rollup-plugin-alias": "^1.4.0",
      "rollup-plugin-babel": "^4.0.3",
      "rollup-plugin-commonjs": "^9.1.6",
      "rollup-plugin-flow": "^1.1.1",
      "rollup-plugin-livereload": "^0.6.0",
      "rollup-plugin-node-builtins": "^2.1.2",
      "rollup-plugin-node-globals": "^1.4.0",
      "rollup-plugin-node-resolve": "^3.4.0",
      "rollup-plugin-postcss": "^1.6.2",
      "rollup-plugin-img": "^1.1.0",
      "rollup-plugin-replace": "^2.0.0",
      "rollup-plugin-serve": "^0.4.2",
      "rollup-plugin-uglify": "^5.0.2"
    }
  };

  await fs.writeFileSync(
    path.join(tempLoc, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL,
    function(errr) {
      return false;
    }
  );
  return true;
};

/**
 * 생성되는 테스트를 위한 contentBase index.html 생성처리.
 */
const makePublicHtml = function(modulename) {
  let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">

    <title>Rest Module Development</title>
    <link rel="stylesheet" href="default.css"/>

</head>
<body>
    <noscript>
    You need to enable JavaScript to run this app.
    </noscript>

    <div class="restheader">
        <h3>REST Module Development</h3>
    </div>
    

    <div id="root"></div>

    <script src="${modulename}.min.js"></script>
</body>
</html>
        `;

  fs.writeFileSync(path.join(tempLoc + "/dist", "index.html"), html, function(
    errr
  ) {
    return false;
  });
  return true;
};

if (major < 8) {
  console.error(
    chalk.red(
      "You are running Node " +
        currentNodeVersion +
        ".\n" +
        "Create Rest Module CLI는 node 8 버전 이상에서 작동됩니다. \n" +
        "node 버전 업데이트를 하십시오."
    )
  );
  process.exit(1);
} else {
  // 사용자가 입력한 폴더를 생성하고 템플릿 소스를 넣어준다.
  commander
    .arguments("<modulename>")
    .action(async function(modulename) {
      let createDirName = userDirCheck(modulename);

      const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      bar.start(100, 0);

      let step1 = await makePublicHtml(modulename);
      let promiseOne = new Promise((resolve, reject) => {
        if (step1) {
          resolve("success");
        } else {
          reject("make index html file error");
        }
      });

      let step2 = await makePackageJson(modulename);
      let promiseTwo = new Promise((resolve, reject) => {
        if (step2) {
          resolve("success");
        } else {
          reject("make package json file error");
        }
      });

      let step3 = await copyTemplateToUserDir(createDirName);
      let promiseThree = new Promise((resolve, reject) => {
        if (step3) {
          resolve("success");
        } else {
          reject("copyTemplateToUserDir error");
        }
      });

      // promise go
      promiseOne
        .then(res1 => {
          bar.update(30);
          return promiseTwo;
        })
        .then(res2 => {
          bar.update(70);
          return promiseThree;
        })
        .then(res3 => {
          bar.update(100);
          bar.stop();

          showCompleteMessage(createDirName, modulename);
        })
        .catch(err => {
          console.error("[REST Module Error] ", err);
          process.exit(1);
        });
    })
    .parse(process.argv);
}
