const { exec } = require('child_process')

module.exports = class Installer {

    constructor() {

    }

    isInstalled(package_name, callback) {
        exec('npm ls ' + package_name, { cwd: root_directory }, (err, stdout, stderr) => {
            let installed = 0
            if (err) {
                // node couldn't execute the command
                installed = 0
            } else if (stdout == '' || stderr != '') {
                installed = 0
            } else if (stdout != '') {
                installed = 1
            }

            // the *entire* stdout and stderr (buffered)
            // console.log(`stdout: ${stdout}`)
            // console.log(`stderr: ${stderr}`)
            if (callback !== undefined) callback(installed)
        })
    }

    installIfNot(package_name, callback) {
        this.isInstalled(package_name, (installed) => {
            if (installed == 0) {
                this.install(package_name, () => {
                    if (callback !== undefined) callback()
                })
            } else {
                if (callback !== undefined) callback() // already installed
            }
        })
    }

    install(package_name, callback) {
        console.log(">> Installing dependency {" + package_name + "} ...")
        exec('npm i --save ' + package_name, { cwd: root_directory }, (err, stdout, stderr) => {
            if (err) {
                console.log(">> Unable to install Package:" + package_name)
            }

            // the *entire* stdout and stderr (buffered)
            // console.log(`stdout: ${stdout}`)
            // console.log(`stderr: ${stderr}`)
            if (callback !== undefined) callback()
        })
    }

}