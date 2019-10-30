export default class DefaultSettings {
    static DefaultDeploymentSettings: string = `
    {
        "Environments": [
            {
                "Name": "Development",
                "Settings" : {
                    "MessageToUser": "Your account has been restricted",
                    "UrlToThing": "https://test.com"
                }
            },
            {
                "Name": "Production",
                "Settings" : {
                    "MessageToUser": "Your account has been restricted",
                    "UrlToThing": "https://production.com"
                }
            }
        ]
    }`;
}