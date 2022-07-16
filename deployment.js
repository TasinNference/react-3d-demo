/*eslint-disable*/
const execSync = require('child_process').execSync

const customExec = script => {
  //   console.log(`(Running script: ${script}) \n`);
  return execSync(script, { encoding: 'utf-8' })
}

const printInfo = function(basename = '', env, space = '') {
  const currentBranch = customExec('git rev-parse --abbrev-ref HEAD')
  console.log(`${space}Current Branch  :  ${currentBranch}`)
  console.log(`${space}Basename        :  ${basename}\n`)
  console.log(`${space}Env             :  ${env}`)
  console.log('##########################################################')
}

const installDependencies = function() {
  console.log('Installing dependencies...')
  const installDep = customExec('npm install')
  console.log(installDep.toString())
  console.log('##########################################################')
}

const generateBuild = function (basename = '', env) {
  console.log(`Generating new build...`);
  let buildProject = '';
  if (basename) {
      buildProject = customExec(`npm run build:${env} --public_url=/${basename}/`);
  } else {
      buildProject = customExec(`npm run build:${env}`);
  }
  console.log(buildProject.toString());
  console.log('##########################################################');
};

const removeBuild = function(directoryPath) {
  console.log(`Removing old build from ${directoryPath} ...`)
  try {
    const removeBuild = customExec(`sudo rm -r ${directoryPath}`)
    console.log(removeBuild.toString())
  } catch (e) {}
  console.log('##########################################################')
}

const copyNewBuild = function(directoryPath) {
  console.log(`Copying build to ${directoryPath} ...`)
  const copyBuild = customExec(`sudo cp -r ./build ${directoryPath}`)
  console.log(copyBuild.toString())
  console.log('##########################################################')
}

const buildGeneratedInfo = function(basename = '', env) {
  console.log(
    'Build updated!! Please refresh the page to reflect the changes.\n',
  )
  console.log('\t\t Serving!\n')
  printInfo(basename, env, `\t\t - `)
}

const stopServerWithPm2 = function(pm2ProcessName) {
  console.log('Deleting old instance...')
  try {
    customExec(`pm2 delete ${pm2ProcessName}`)
  } catch (e) {}
  console.log('##########################################################')
}

const startServerWithPm2 = function(pm2ProcessName, port, basename = '', env) {
  const buildFolderName = 'build'
  customExec(
    `pm2 serve ${buildFolderName}/ ${port} --name ${pm2ProcessName} --spa`,
  )
  console.log('Starting server...\n')
  console.log('\t\t Serving!\n')
  printInfo(basename, env, `\t\t - `)
}

const modifyBuildAccess = function(directoryPath, access = 777) {
  console.log(`Modifying ${directoryPath}'s permission to ${access} ...`)
  const modifyAccess = customExec(`sudo chmod -R ${access} ${directoryPath}`)
  console.log(modifyAccess.toString())
  console.log('##########################################################')
}

module.exports = {
  printInfo,
  installDependencies,
  generateBuild,
  removeBuild,
  copyNewBuild,
  buildGeneratedInfo,
  stopServerWithPm2,
  startServerWithPm2,
  modifyBuildAccess,
}
