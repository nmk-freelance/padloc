const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');

module.exports = function(context) {
    console.log(context);
    let cordovaRoot = context.opts.projectRoot;
    let projectRoot = path.join(cordovaRoot, 'platforms/ios');
    let pluginRoot = context.opts.plugin.dir;
    let projectFile = path.join(cordovaRoot, 'platforms/ios/Padloc.xcodeproj/project.pbxproj');
    let patchScript = path.join(cordovaRoot, 'supplementary source/cordova_plugin/Autofill_target_iOS/patch.sh');
    let diffRoot = path.join(cordovaRoot, 'supplementary source/cordova_plugin/Autofill_target_iOS/diff');
    let patchFile = path.join(cordovaRoot, 'supplementary source/Patch/Plugins/Fingerprint.swift.patch');
    let fingerprintFile = path.join(projectRoot, 'Padloc/Plugins/cordova-plugin-fingerprint-aio/Fingerprint.swift');

    // check
    let projectData = fs.readFileSync(projectFile).toString();
    let targetUuid = '63E4AB572A08DBFD00C29FAA';
    if (projectData.includes(targetUuid)) {
        console.log('Extension ready');
        return;
    }
    console.log('Setting up extension');

    // create group folder
    let groupName = 'Autofill';
    let autofillGroupPath = path.join(projectRoot, groupName)
    if (!fs.existsSync(autofillGroupPath)) {
        fs.mkdirSync(path.join(projectRoot, groupName));
    }

    // copy entitlements files
    let padlocFolder = path.join(projectRoot, 'Padloc');
    let resRoot = path.join(pluginRoot, 'res');
    
    for (file of ['Entitlements-Debug.plist', 'Entitlements-Release.plist']) {
        fs.copyFileSync(path.join(resRoot, file), path.join(padlocFolder, file));
    }

    // patch project
    let out = execFileSync(patchScript, [projectFile, diffRoot]);
    fs.writeFileSync(projectFile, out);

    // patch fingerprint
    execSync(`patch "${fingerprintFile}" "${patchFile}"`);
}
