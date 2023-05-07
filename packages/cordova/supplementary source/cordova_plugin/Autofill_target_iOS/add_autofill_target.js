const fs = require('fs');
const path = require('path');
const xcode = require('xcode');
const process = require('process');

module.exports = function(context) {
    console.log(context);
    let cordovaRoot = context.opts.projectRoot;
    let projectRoot = path.join(cordovaRoot, 'platforms/ios');
    let pluginRoot = context.opts.plugin.dir;
    let resRoot = path.join(pluginRoot, 'res');
    let resourceDir = path.join(pluginRoot, 'res');
    let projectFile = path.join(cordovaRoot, 'platforms/ios/Padloc.xcodeproj/project.pbxproj');

    let xcodeProject = xcode.project(projectFile);
    xcodeProject.parseSync();

    /// # add target #
    let targetName = 'Autofill';
    let target = xcodeProject.addTarget(targetName, 'app_extension');
    console.log(target);

    /// update plist path
    let infoPlistPath = path.join(resRoot, 'Info.plist');
    xcodeProject.updateBuildProperty('INFOPLIST_FILE', infoPlistPath, null, target.pbxNativeTarget.name);

    let phase = xcodeProject.addBuildPhase(
        ['AuthenticationServices.framework'],
        'PBXFrameworksBuildPhase',
        'AuthenticationServices.framework',
        target.uuid
    );
    console.log(phase);

    // create group
    let groupName = 'Autofill';
    let autofillGroupPath = path.join(projectRoot, groupName)
    if (!fs.existsSync(autofillGroupPath)) {
        fs.mkdirSync(path.join(projectRoot, groupName));
    }
    let theGroup = xcodeProject.addPbxGroup([], groupName, groupName);

    // add to group CustomTemplate
    let customTemplate = xcodeProject.pbxGroupByName('CustomTemplate');
    let customTemplateGroupKey = xcodeProject.findPBXGroupKey({name: 'CustomTemplate'}, 'PBXGroup');
    xcodeProject.addToPbxGroup(theGroup.uuid, customTemplateGroupKey);

    // add files to the group
    xcodeProject.addFile(path.join(resRoot, 'Autofill.entitlements'), theGroup.uuid);
    xcodeProject.addFile(path.join(resRoot, 'Info.plist'), theGroup.uuid);

    fs.writeFileSync(projectFile, xcodeProject.writeSync());
}
