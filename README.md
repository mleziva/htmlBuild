# VSCode - HTMLBuild README

This VS Code extension replaces placeholders in HTML files with values in a json file. Use it to manage and generate HTML files for different environments. Based on the azure-ad-b2c vscode extensions available here: https://github.com/azure-ad-b2c/vscode-extension


## Get Started
-----------------------------------------------------------------------------------------------------------
To get started, open the folder which contains your html files. Run the HtmlBuild command of the extension for the first time to generate the sample appsettings.json file.

Review the created file

Update your html file to contain some settings to replace

Run the BuildHtml command to generate the output files

Review the output files

-----------------------------------------------------------------------------------------------------------
## Notes
The logic for the replace works on a case-insensitive match to {Settings:[settingname]}, so if you have content in your html file that happens to match that, it will be erroneously replaced.

## Known Issues

None

## Release Notes

Very first release ever

### 0.0.1

Initial release

-----------------------------------------------------------------------------------------------------------


