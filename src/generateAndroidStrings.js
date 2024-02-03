const xlsx = require("xlsx");
const fs = require("fs");
const execSync = require('child_process').execSync


// Variables
const outputDir = __dirname + "/../output/";
const androidOutputDir = outputDir + "android/";
const stringsFile = androidOutputDir + "strings.xml";
const workbook = xlsx.readFile(__dirname + "/../Translations.xlsx");
const worksheet = workbook.Sheets["ALL"];
const json = xlsx.utils.sheet_to_json(worksheet);
const keyTab = "Android Key";
const languageTabs = ["EN", "ES", "FR", "CN", "VI", "AR", "KO", "JA", "DE", "FA", "HAW", "IW", "IT", "HY"];


// Helper Methods
function clearOutputDirectory() {
	execSync(`rm -rf ${outputDir}`)
	fs.mkdirSync(outputDir)
	fs.mkdirSync(androidOutputDir)
}

function generateHeaders() {
	fs.appendFileSync(stringsFile, `<resources xmlns:tools="http://schemas.android.com/tools">\n`);

	for (var language of languageTabs) {
		fs.appendFileSync(androidOutputDir + `${language.toLowerCase()}.xml`, `<?xml version="1.0" encoding="utf-8"?>
<resources>\n`);
	}
}

function generateStrings() {
	totalStrings = 0
	characterLengthArray = [] // Used to sort translations by character length

	for (var i = 0; i < json.length; i++) {
		var row = json[i];
		
		if (row) {
			var key = row[keyTab];
			if (key && key !== "") {
				totalStrings++;
				var englishValue = row["EN"];

				if (englishValue && englishValue !== "") {
					englishValue = englishValue.replace(/"/g, '\\"'); // Escape double quotes
					// englishValue = englishValue.replace(/'/g, `\\'`); // Escape single quotes
					characterLengthArray.push(`    <string name="${key}">${englishValue}</string>\n`);

					for (var language of languageTabs) {
						var otherLanguageValue = row[language];

						if (otherLanguageValue && otherLanguageValue !== "") {
							otherLanguageValue = otherLanguageValue.replace(/"/g, '\\"'); // Escape double quotes
							// otherLanguageValue = otherLanguageValue.replace(/'/g, `\\'`); // Escape single quotes
							fs.appendFileSync(androidOutputDir + `${language.toLowerCase()}.xml`, `    <string name="${key}">${otherLanguageValue}</string>\n`);
						}
					}
				}
			}
		}
	}

	characterLengthArray.sort((a, b) => {
		return a.length - b.length;
	})

	characterLengthArray.forEach((str) => {
		fs.appendFileSync(stringsFile, str);
	})

	fs.appendFileSync(stringsFile, "</resources>");

	for (var language of languageTabs) {
		fs.appendFileSync(androidOutputDir + `${language.toLowerCase()}.xml`, `</resources>`);
	}
}


// Run
clearOutputDirectory();
generateHeaders();
generateStrings();
console.log(`Job complete. Generated ${totalStrings} strings.`);