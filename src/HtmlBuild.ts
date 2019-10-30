import * as vscode from 'vscode';
import fs = require('fs');
import path = require('path');
import DefaultSettings from './DefaultSettings';
export default class HtmlBuild {
    static appSettingsPath: string;
    static rootPath: string;
    static Build() {

        if ((!vscode.workspace.workspaceFolders) || (vscode.workspace.workspaceFolders.length == 0)) {
            vscode.window.showWarningMessage("To build an HTML file you need to open the containing folder in VS code");
            return;
        }
        //set static appsettings path for loading or creating
        HtmlBuild.rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        HtmlBuild.appSettingsPath = path.join(HtmlBuild.rootPath, "appsettings.json");

        // Check if appsettings.json exists under for root folder
        vscode.workspace.findFiles(new vscode.RelativePattern(vscode.workspace.rootPath as string, 'appsettings.json'))
            .then((appsettings) => {

                if (!appsettings || appsettings.length == 0) {
                    vscode.window.showQuickPick(["Yes", "No"], { placeHolder: 'The appsettings.json file is missing, do you want to create?' })
                        .then(result => {
                            if (!result || result === "No")
                                return;
                            this.createAppSettingsFile();
                        });
                }
                else {
                    // Read all policy files from the root directory
                    vscode.workspace.findFiles(new vscode.RelativePattern(vscode.workspace.rootPath as string, '*.{html}'))
                        .then((uris) => {
                            return this.loadHtmlFiles(uris);
                        }).then((htmlFiles) => {
                            this.createEnvironmentFiles(htmlFiles);
                        });
                }

            });
    };


    private static createAppSettingsFile() {
         // Create app settings file with default values
         fs.writeFile(HtmlBuild.appSettingsPath, DefaultSettings.DefaultDeploymentSettings, 'utf8', (err) => {
            if (err) throw err;

            vscode.workspace.openTextDocument(HtmlBuild.appSettingsPath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        });
    }

    private static loadHtmlFiles(uris: vscode.Uri[]) : HtmlFile[]{
        let htmlFiles: HtmlFile[] = [];
        uris.forEach((uri) => {
            if (uri.fsPath.indexOf("?") <= 0) {
                var data = fs.readFileSync(uri.fsPath, 'utf8');
                htmlFiles.push(new HtmlFile(path.basename(uri.fsPath), data.toString()))
            }
        });
        return htmlFiles;
    }
    private static createEnvironmentFiles(htmlFiles: HtmlFile[]){
        vscode.workspace.openTextDocument(HtmlBuild.appSettingsPath).then(doc => {
            var appSettings = JSON.parse(doc.getText());
            var environmentsRootPath = path.join(HtmlBuild.rootPath, "Environments");

            // Ensure environments folder exists
            if (!fs.existsSync(environmentsRootPath)) {
                fs.mkdirSync(environmentsRootPath);
            }
            // Iterate through environments  
            appSettings.Environments.forEach(function (entry) {
                if (entry.Settings == null) {
                    vscode.window.showErrorMessage("Can't generate '" + entry.Name + "' environment policies. Error: Accepted Settings element is missing.");
                }
                else {
                    var environmentRootPath = path.join(environmentsRootPath, entry.Name);
                    // Ensure environment folder exists
                    if (!fs.existsSync(environmentRootPath)) {
                        fs.mkdirSync(environmentRootPath);
                    }
                    // Iterate through the list of settings
                    htmlFiles.forEach(function (file) {
                        var htmlContent = file.Data;
                        // Replace the rest of the policy settings
                        Object.keys(entry.Settings).forEach(key => {
                            htmlContent = htmlContent.replace(new RegExp("\{Settings:" + key + "\}", "gi"), entry.Settings[key]);
                        });
                        // Save the file
                        fs.writeFile(path.join(environmentRootPath, file.FileName), htmlContent, 'utf8', (err) => {
                            if (err) throw err;
                        });
                    });
                    vscode.window.showInformationMessage("You files successfully exported and stored under the Environment folder.");
                }
            });
        });
    }
}

export class HtmlFile {
    public FileName: string;
    public Data: string;

    constructor(fileName: string, data: string) {
        this.FileName = fileName;
        this.Data = data;
    }
}