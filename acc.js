const fs = require('fs')
const input = require('readline').createInterface({input: process.stdin, output: process.stdout})
let gdPath = process.env.HOME || process.env.USERPROFILE + "/AppData/Local/GeometryDash"
let profilePath = gdPath + "/Profiles"
let gdFiles = ["CCGameManager.dat", "CCGameManager2.dat", "CCLocalLevels.dat", "CCLocalLevels2.dat"]

if (!fs.existsSync(gdPath)) {console.log("Your Geometry Dash directory could not be found! Make sure it's in AppData/Local/GeometryDash"); process.exit()}
if (!fs.existsSync(profilePath)) {console.log("*No profiles folder found, created a new one"); fs.mkdirSync(profilePath)}

function reset(text) {
    console.clear();
    console.log(text + "\n")
    run()
}

console.clear();
console.log("Welcome to the GD Profile Manager!")
console.log("Note: Please make sure that GD is closed before managing profiles.\n")

function run() {

let profiles = []
fs.readdirSync(profilePath).forEach(f => {
if (fs.lstatSync(profilePath + "/" + f).isDirectory()) profiles.push(f)})

input.question("What would you like to do?\n[1] Save profile\n[2] Load profile\n> ", (mode) => {
    console.clear();

    if (mode == 1) {
        input.question(`Enter the name to save under\nExisting profiles: ${profiles.join(", ") || "(none)"}\n> `, (name) => {
            let overwrite = profiles.find(x => x.toLowerCase() == name.toLowerCase())
            if (!overwrite) {console.log(`\nCreating a new profile named ${name}...`); fs.mkdirSync(profilePath + "/" + name)}
            let foundFiles = fs.readdirSync(gdPath).filter(x => gdFiles.includes(x))
            foundFiles.forEach(f => {
                fs.copyFile(`${gdPath}/${f}`, `${profilePath}/${overwrite || name}/${f}`, (err) => {if (err) console.log(err)});
            })
            return reset(`Successfully saved under ${overwrite || name}!`)
        })
    }

    else if (mode == 2) {
        input.question(`Choose a profile to load\nYour current save data will be overwritten!\nProfiles: ${profiles.join(", ") || "(none)"}\n> `, (profile) => {
            let selected = profiles.find(x => x.toLowerCase() == profile.toLowerCase())
            if (!selected) return reset("That profile doesn't exist!")
            let path = profilePath + "/" + selected
            let foundFiles = fs.readdirSync(path).filter(x => gdFiles.includes(x))
            if (!foundFiles.length) return reset("That profile is empty!")
            foundFiles.forEach(f => {
                fs.copyFile(`${path}/${f}`, `${gdPath}/${f}`, (err) => {if (err) console.log(err)});
            })
            return reset(`Successfully loaded ${selected}!`)
        })

    }
    else return reset("Invalid option!")
})
}

run()


