# MedEcare Backend Project

## I. Configuring Visual Studio Code for Optimal Debugging of a Node.js Express Project

This guide describes how to set up Visual Studio Code (VS Code) for optimal debugging of a Node.js Express project, including ESLint and Prettier configuration.

---

### 1. Requirements

Before you start, make sure you have the following software installed:

- **Node.js**: Make sure Node.js is installed. You can check this by running `node -v` in a terminal.
- **Visual Studio Code**: Download and install [VS Code](https://code.visualstudio.com/).
- **npm**: npm is the package manager installed with Node.js. Check the installation by running `npm -v` in a terminal.

### 2. Project Structure

Make sure your project has the following structure:

```bash
medecare/backend/
├── node_modules/
├── .eslintrc.json
├── .prettierrc
├── server.js
├── package.json
├── README.md
└── ...
```

### 3. Install VS Code Extensions

For an optimal development experience, install the following VS Code extensions:

1. **ESLint**: This extension integrates ESLint into VS Code.

   - Go to the Extensions (Ctrl+Shift+X) and search for "ESLint". Install the extension by Dirk Baeumer.

2. **Prettier - Code Formatter**: This extension ensures that Prettier automatically formats your code.
   - Search for "Prettier - Code formatter" and install the extension by Prettier.

### 4. Configure ESLint and Prettier in VS Code

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

### 5. Configure Debugging

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

### 6. Useful VS Code Shortcuts

- **Format code**: Press `Shift+Alt+F` to format your current file with Prettier.
- **View linting issues**: Issues detected by ESLint are displayed at the bottom in the problems bar. Use `Ctrl+Shift+M` to open this panel.
- **Start debugging**: Press `F5` to debug your application. Use `F10` to step through the code and `Shift+F5` to stop debugging.

### 7. Troubleshooting

It is usually not necessary, but if you notice that settings or extensions are not working as expected after making changes, a quick restart of VS Code can resolve the issues.

- **ESLint or Prettier issues**: Check that your extensions are correctly installed and not conflicting. Also, check the output console for specific error messages.
- **Debugger not working properly**: Ensure your `launch.json` is correctly configured and that the path to your `server.js` file is correct.

## II. Deploying to Windows

### Configuring PM2 as a Windows Service using NSSM on Windows Servers

This section explains how to deploy your Node.js application on a Windows Server by configuring PM2 as a Windows service using NSSM (Non-Sucking Service Manager). This setup ensures that your Node.js application runs continuously, even after system reboots, and automatically restarts if it crashes.

#### Steps to Set Up PM2 as a Windows Service:

1. **Install NSSM**: Download and install NSSM, a tool that allows any application (including PM2) to be managed as a Windows service.

2. **Configure the Service**: Use NSSM to configure PM2 as a Windows service, specifying the correct paths and arguments. This will allow PM2 to manage your Node.js application as a background service, ensuring it runs independently of any logged-in user sessions.

3. **Set Up Automatic Restart**: Within NSSM, configure the service to automatically restart in case of failures, ensuring maximum uptime for your application.

By following these steps, your Node.js application will be deployed in a robust, production-ready environment on a Windows Server, with PM2 ensuring continuous operation and easy management of your application processes.

---

## Requirements

- Windows Server 2019 DC
- Node.js and NPM installed
- NSSM (Non-Sucking Service Manager)
- PM2 installed

## Installation

### 1. Install Node.js and NPM

1. Download and install Node.js from the [official website](https://nodejs.org/).
2. Verify the installation by running the following commands in the command prompt:

   ```bash
   node -v
   npm -v
   ```

### 2. Install PM2

1. Install PM2 globally by running the following command:

   ```bash
   npm install pm2 -g
   ```

2. Verify the installation by checking the PM2 version:

   ```bash
   pm2 -v
   ```

### 3. Install NSSM

1. Download NSSM from the [official website](https://nssm.cc/download).
2. Extract the downloaded file to a location like `C:\nssm`.

### 4. Configure PM2 as a Windows Service using NSSM

Follow these steps to configure PM2 as a Windows service, based on [this guide](https://lakin-mohapatra.medium.com/register-pm2-as-a-service-in-the-windows-server-747f19e2ff2a):

1. Open a command prompt as an administrator.
2. Run the following command to find the full path to the PM2 binary:

   ```bash
   where pm2
   ```

   - Note the path returned, for example: `C:\Users\Filip\AppData\Roaming\npm\pm2.cmd`.

3. Navigate to the NSSM directory:

   ```bash
   cd C:\nssm\win64
   ```

4. Run the following command to install PM2 as a service:

   ```bash
   nssm install PM2
   ```

5. In the NSSM configuration window that appears:

   - **Path**: Enter the path you obtained from the `where pm2` command, for example: `C:\Users\Username\AppData\Roaming\npm\pm2.cmd`.
   - **Startup directory**: Enter your project directory, for example: `C:\Users\Username\Documents\MediShiftsServer`.
   - **Arguments**: Enter `start server.js --name MediShiftsServer`.

6. Configure Exit Actions:

   - Go to the `Exit Actions` tab.
   - Set the `Action if exit` option to `No Action`. This is required because PM2 exits the command prompt once it starts and then runs in the background.

7. Optional: Configure Service I/O:

   - Go to the `I/O` tab in the NSSM GUI.
   - Set the path for **Output (stdout log)** and **Error (stderr log)** to capture output and error logs. For example:
     - **Output (stdout)**: `C:\nssm\logs\output.log`
     - **Error (stderr)**: `C:\nssm\logs\error.log`
   - This ensures that all console output and any errors from the Node.js Express server are logged to files for later analysis.

8. Ensure that the `Startup Type` is set to `Automatic`.
9. Click "Install service" to complete the configuration.

### 5. Start and Verify

1. Start the service via `Services.msc` or with the following command:

   ```bash
   nssm start PM2
   ```

2. Check the status of the PM2 service and ensure your server is running:

   ```bash
   pm2 list
   ```

3. Test the server by visiting the URL in your browser or making an API request to the server.

## Logs and Monitoring

PM2 provides extensive logging and monitoring capabilities. View the logs with:

```bash
pm2 logs MediShiftsServer
```

If you configured the I/O settings in NSSM, you can also view the log files set for output and error:

- **Output log**: `C:\nssm\logs\output.log`
- **Error log**: `C:\nssm\logs\error.log`

## Common Issues

### PM2 Startup Error

If you encounter the error `Init system not found` when running `pm2 startup`, you can skip this step and proceed with the configuration using NSSM as described above.

## Maintenance

Ensure you regularly check PM2 and perform updates as necessary. Use the following command to manage your PM2 processes:

```bash
pm2 status
```

## III. Configuring Domain Name and HTTPS with Dynamic DNS Updates

This section details the steps required to set up your domain name with dynamic DNS updates using GoDaddy and configuring HTTPS with a free Let's Encrypt certificate using the win-acme tool.

---

## 1. Setting Up Dynamic DNS Updates

To ensure that your domain name always points to the correct IP address, even when your external IP changes, you can use a PowerShell script to automatically update the DNS records on GoDaddy.

### PowerShell Script for Dynamic DNS Updates

Here’s a PowerShell script that checks your current external IP address and compares it with the IP address stored in GoDaddy's DNS records. If the IP has changed, the script updates the DNS record accordingly.

```powershell
$mydomain = "your.domainname.be"
$myhostname = "your_server_name"
$gdapikey = "your_godaddy_api_key"

# Retrieve the current external IP
$myip = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()
$dnsdata = Invoke-RestMethod "https://api.godaddy.com/v1/domains/$mydomain/records/A/$myhostname" -Headers @{ Authorization = "sso-key $gdapikey" }
$gdip = $dnsdata.data.Trim()

Write-Output "$(Get-Date -Format 'u') - Current External IP is $myip, GoDaddy DNS IP is $gdip"

# Check if the IP addresses differ and update if necessary
if ($myip -ne $gdip) {
    Write-Output "IP has changed! Updating on GoDaddy"
    $updateBody = @{ data = $myip } | ConvertTo-Json
    Invoke-RestMethod -Method PUT -Uri "https://api.godaddy.com/v1/domains/$mydomain/records/A/$myhostname" -Headers @{ Authorization = "sso-key $gdapikey" } -ContentType "application/json" -Body $updateBody
} else {
    Write-Output "No update required. IP has not changed."
}
```

### Explanation of the Script

- **$mydomain**: Your domain name.
- **$myhostname**: The hostname for your server (e.g., "www" or "@").
- **$gdapikey**: Your GoDaddy API key for authentication.

The script:

- Retrieves the current external IP address using the `ipify` service.
- Fetches the current DNS record from GoDaddy.
- Compares the current external IP with the IP in the DNS record.
- Updates the DNS record on GoDaddy if the IP address has changed.

### Adding the Script to Windows Task Scheduler

To ensure that this script runs automatically at regular intervals, you can schedule it using the Windows Task Scheduler.

#### Steps to Schedule the PowerShell Script:

1. **Open Task Scheduler**:

   - Press `Win + R`, type `taskschd.msc`, and press `Enter`.

2. **Create a New Task**:

   - In the Task Scheduler window, click on "Create Task" in the "Actions" pane on the right.

3. **General Tab**:

   - Name your task something descriptive, like "Update GoDaddy DNS".
   - Select "Run whether user is logged on or not".
   - Check "Run with highest privileges" to ensure it runs with sufficient permissions.

4. **Triggers Tab**:

   - Click "New..." to create a new trigger.
   - Set the trigger to start the task "Daily" or "Hourly", depending on how frequently you want to check for IP changes.
   - Configure the time and frequency as needed.

5. **Actions Tab**:

   - Click "New..." to create a new action.
   - Set "Action" to "Start a program".
   - In the "Program/script" field, enter `powershell.exe`.
   - In the "Add arguments (optional)" field, enter:

     ```bash
     -ExecutionPolicy Bypass -File "C:\path\to\your\script.ps1"
     ```

   - Replace `"C:\path\to\your\script.ps1"` with the actual path to your PowerShell script.

6. **Conditions Tab**:

   - If desired, you can adjust the conditions for when the task should run, such as only if the computer is idle or on AC power.

7. **Settings Tab**:

   - Ensure "Allow task to be run on demand" is checked.
   - Consider checking "Run task as soon as possible after a scheduled start is missed" to ensure the task runs if it was unable to run at the scheduled time.

8. **Finish**:
   - Click "OK" to create the task.
   - If prompted, enter the credentials of an administrator account to save the task.

By setting up this task, your PowerShell script will automatically run at the intervals you specified, ensuring that your DNS records with GoDaddy are always up to date with your current IP address.

## 2. Configuring HTTPS with Let's Encrypt

To secure your website with HTTPS, you can use Let's Encrypt to obtain a free SSL/TLS certificate. The win-acme tool simplifies the process of getting and renewing certificates on Windows servers.

### Steps to Set Up HTTPS with win-acme

1. **Download and Install win-acme**:

   - Download the latest version of [win-acme](https://github.com/win-acme/win-acme) and extract it to a directory on your server.

2. **Run win-acme to Obtain a Certificate**:

   - Open a command prompt as an administrator.
   - Navigate to the directory where you extracted win-acme.
   - Run the following command to start the certificate request process:

     ```bash
     wacs.exe
     ```

   - Follow the prompts to:
     - Select "Create new certificate (simple for IIS)".
     - Choose your site from the list.
     - Select "Manual input" if your site is not listed or if you're using a custom domain.

3. **Set Up Automatic Renewal**:

   - win-acme automatically configures a scheduled task to renew the certificate before it expires. You can adjust the settings if needed.

4. **Bind the Certificate to Your Website**:

   - win-acme can automatically bind the certificate to your IIS site, but you may also do this manually via the IIS Manager.

5. **Verify HTTPS Configuration**:
   - After obtaining and binding the certificate, verify that your website is accessible via HTTPS

## IV. Configuring IIS on Windows Server 2019 DC to Run the Node.js Express Server with a Reverse Proxy

This section details how to configure IIS on Windows Server 2019 DC to host a Node.js Express server within an existing site using a reverse proxy. The reverse proxy will route requests from `../medishifts/api` to the Node.js Express server. We'll use URL Rewrite and Application Request Routing (ARR) to achieve this.

---

### 1. Prerequisites

Before configuring IIS, ensure the following prerequisites are met:

- **Node.js and Express**: Your Node.js Express server should be installed and running.
- **IIS Installed**: IIS (Internet Information Services) should be installed on your Windows Server 2019 DC.
- **Application Request Routing (ARR)** and **URL Rewrite Module** should be installed on IIS.

### 2. Installing URL Rewrite and ARR Modules

1. **Install URL Rewrite Module**:
   - Download and install the URL Rewrite module from the [official IIS website](https://www.iis.net/downloads/microsoft/url-rewrite).
2. **Install Application Request Routing (ARR)**:
   - Download and install ARR from the [official IIS website](https://www.iis.net/downloads/microsoft/application-request-routing).

### 3. Configuring the Reverse Proxy

1. **Open IIS Manager**:

   - Open IIS Manager on your Windows Server.

2. **Select Your Site**:

   - In the Connections pane, expand the node for your server and then expand the "Sites" node.
   - Select the existing site where you want to configure the reverse proxy.

3. **Add a New Server Farm** (Optional, but recommended for ARR configuration):

   - In the left pane, right-click on "Server Farms" and select "Create Server Farm."
   - Enter a name for the server farm (e.g., `MedishiftsAPI`), then click "Next."
   - Add the server where your Node.js Express server is running (use `localhost` if it’s on the same machine).
   - Configure load balancing settings if needed, otherwise, click "Finish."
   - When prompted to create an inbound rule for the server farm, choose "Yes."

4. **Configure URL Rewrite**:

   - With your site selected, double-click the "URL Rewrite" option in the middle pane.
   - Click "Add Rule(s)…" on the right side under "Actions."
   - Choose "Reverse Proxy" from the list of rule templates.
   - In the "Inbound Rules" section, specify the following:
     - **Pattern:** `medishifts/api/(.*)`
     - **Rewrite URL:** `http://localhost:<port>/{R:1}`
       - Replace `<port>` with the port number your Node.js Express server is listening on.
     - **Append Query String:** Make sure this option is checked.
     - **Stop Processing of Subsequent Rules:** Check this box to ensure that no other rules are applied after this one. This ensures that the reverse proxy rule is the final action for requests matching the pattern.
   - In the "Outbound Rules" section, you can leave the default settings or add specific rules as needed.
   - Click "Apply" to save the rule.

5. **Configure ARR Settings**:

   - Go back to the main IIS Manager window, select the server node, and double-click "Application Request Routing Cache."
   - Under "Proxy," ensure the "Enable proxy" option is checked.
   - You may also want to enable SSL offloading if your Node.js Express server is handling HTTPS traffic directly.

6. **Testing the Configuration**:
   - Restart IIS to apply all the changes.
   - Navigate to `http://.../medishifts/api` in your browser. The requests should be forwarded to your Node.js Express server.

### 4. Additional Considerations

- **SSL Configuration**: If your main site uses SSL (HTTPS), ensure that the reverse proxy is correctly configured to handle SSL. You may need to adjust the bindings and configure SSL settings in ARR.
- **Performance**: Monitor the performance of your reverse proxy setup using IIS logs and adjust the ARR settings as needed to optimize performance.
- **Security**: Ensure that appropriate security measures, such as firewall rules and authentication settings, are in place to protect your Node.js Express server.

By following these steps, your Node.js Express server will be integrated into your existing IIS site and accessible via the specified path (`/medishifts/api`), with IIS handling the reverse proxying to your Express server.
