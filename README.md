
# MedEcare
Medical Emergency Care assistant

# MedEcare Backend Project

### Configuring Visual Studio Code for Optimal Debugging of a Node.js Express Project

This guide describes how to set up Visual Studio Code (VS Code) for optimal debugging of a Node.js Express project, including ESLint and Prettier configuration.

---

## 1. Requirements

Before you start, make sure you have the following software installed:

- **Node.js**: Make sure Node.js is installed. You can check this by running `node -v` in a terminal.
- **Visual Studio Code**: Download and install [VS Code](https://code.visualstudio.com/).
- **npm**: npm is the package manager installed with Node.js. Check the installation by running `npm -v` in a terminal.

## 2. Project Structure

Make sure your project has the following structure:

```
medecare_backend/
├── node_modules/
├── .eslintrc.json
├── .prettierrc
├── server.js
├── package.json
├── README.md
└── ...
```

## 3. Install VS Code Extensions

For an optimal development experience, install the following VS Code extensions:

1. **ESLint**: This extension integrates ESLint into VS Code.
   - Go to the Extensions (Ctrl+Shift+X) and search for "ESLint". Install the extension by Dirk Baeumer.

2. **Prettier - Code Formatter**: This extension ensures that Prettier automatically formats your code.
   - Search for "Prettier - Code formatter" and install the extension by Prettier.

## 4. Configure ESLint and Prettier in VS Code

1. **Configure ESLint**:
   - Ensure your `.eslintrc.json` configuration is correct.
   - Open the command palette (Ctrl+Shift+P) and type `Preferences: Open Settings (JSON)` to open your settings file.
   - Add the following lines to activate ESLint:
     ```json
     "eslint.validate": [
       "javascript",
       "javascriptreact",
       "typescript",
       "typescriptreact"
     ],
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
     ```

2. **Configure Prettier**:
   - Ensure your `.prettierrc` configuration is correct.
   - Add the following lines to your VS Code settings to use Prettier as the formatter:
     ```json
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true
     ```

## 5. Configure Debugging

1. **Launch Configuration**:
   - Click on the Debug icon on the left side of VS Code or press Ctrl+Shift+D.
   - Click on "create a launch.json file", choose "Node.js", and ensure the configuration looks something like this:
     ```json
     {
       "version": "0.2.0",
       "configurations": [
         {
           "type": "node",
           "request": "launch",
           "name": "Debug backend",
           "skipFiles": ["<node_internals>/**"],
           "program": "${workspaceFolder}/backend/server.js"
         }
       ]
     }
     ```

2. **Start Debugging**:
   - Place breakpoints in your code by clicking in the left margin of your `server.js` file.
   - Click the green "play" button in the Debug section or press F5 to start the debugger.

## 6. Useful VS Code Shortcuts

- **Format code**: Press `Shift+Alt+F` to format your current file with Prettier.
- **View linting issues**: Issues detected by ESLint are displayed at the bottom in the problems bar. Use `Ctrl+Shift+M` to open this panel.
- **Start debugging**: Press `F5` to debug your application. Use `F10` to step through the code and `Shift+F5` to stop debugging.

## 7. Troubleshooting

It is usually not necessary, but if you notice that settings or extensions are not working as expected after making changes, a quick restart of VS Code can resolve the issues.

- **ESLint or Prettier issues**: Check that your extensions are correctly installed and not conflicting. Also, check the output console for specific error messages.
- **Debugger not working properly**: Ensure your `launch.json` is correctly configured and that the path to your `server.js` file is correct.
