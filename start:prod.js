/*eslint-disable*/
const {
  printInfo,
  installDependencies,
  generateBuild,
  removeBuild,
  copyNewBuild,
  buildGeneratedInfo,
  stopServerWithPm2,
  startServerWithPm2,
  modifyBuildAccess,
} = require("./deployment.js");

// VARIABLES //
const deployWithAnyProxy = true;
const BASENAME = "3d_viewer";
const DIRECTORY_PATH = `/var/www/html/${BASENAME}`;
const ENV = "prod";

// SCRIPTS //
console.log("##########################################################");

/**
 * To deploy code with any kind of proxy apache, haproxy, etc. It will serve the site on the port on which proxy is running and with basename
 * Example, Apache running on port 80: localhost/<basename>
 */
if (deployWithAnyProxy) {
  const basename = BASENAME;
  printInfo(basename, ENV);
  installDependencies();
  generateBuild(basename, ENV);
  removeBuild(DIRECTORY_PATH);
  copyNewBuild(DIRECTORY_PATH);
  buildGeneratedInfo(basename, ENV);
  modifyBuildAccess(DIRECTORY_PATH);
}
