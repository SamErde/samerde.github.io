---
layout: post
title: Installing PowerShell with the .NET Tool
subtitle: The .NET Tool (dotnet) can be used to easily install the LTS or STS version of PowerShell without local admin rights, but it does have some limitations.
date:   2025-07-09 07:00:00 -0500
categories: [PowerShell]
tags: [PowerShell, .NET]
author: Sam Erde
gh-repo: samerde/samerde.github.io
---

There are a surprising number of ways that you can install PowerShell on a system. Today we'll look at how to install it as a ".NET tool." _**This approach is not necessary or ideal for everyday use**_, but it does have some valid use cases and conveniently does not require local admin rights.

{: .box-note}
A .NET tool is a special NuGet package that contains a console application. You can read more about them on [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools).

## Installation

The first thing you will need to do is download and install the .NET (dotnet) tool from Microsoft:

```powershell
# Download Microsoft's dotnet tool install script to the TEMP directory.
$DownloadPath = Join-Path -Path $env:TEMP -ChildPath 'dotnet-install.ps1'
Invoke-WebRequest 'https://dot.net/v1/dotnet-install.ps1' -OutFile $DownloadPath

# Remove the MOTW (mark of the web).
Unblock-File -Path $DownloadPath

# Install current stable release (STS) of the dotnet tool in your profile directory.
.$DownloadPath -InstallDir '~/.dotnet' -Channel 'STS'

# Clean up the download.
Remove-Item -Path $DownloadPath -Confirm:$false
```

{: .box-warning}
The .NET tool includes the latest LTS (long term support) release of .NET by default. PowerShell provides both LTS and STS (current stable) releases that are aligned with .NET's LTS and STS releases. If you want to run the latest version of PowerShell as a .NET tool, you have to ensure that the .NET tool is installed using the `Channel 'STS'` parameter.

Install PowerShell using the `dotnet` tool:
```powershell
dotnet tool install --global PowerShell
```

If you have Windows Terminal installed, you should now see a new profile for this:

![Windows Terminal with a profile added for the PowerShell .NET tool](/assets/img/content/Windows-Terminal-PowerShell-dotnet-global-tool-profile.png)

## Using a Script

Copy and paste if you'd like, but here's the whole thing wrapped in a script that also checks if the dotnet tool is already installed:

```powershell
if ( (Get-Command -Name 'dotnet' -ErrorAction SilentlyContinue) ) {
    Write-Verbose 'dotnet is already installed.'
} else {
    $DownloadPath = Join-Path -Path $env:TEMP -ChildPath 'dotnet-install.ps1'
    try {
        Invoke-WebRequest 'https://dot.net/v1/dotnet-install.ps1' -OutFile $DownloadPath
        Unblock-File -Path $DownloadPath
    } catch {
        Write-Error "Failed to download dotnet-install.ps1 to '$DownloadPath'."
        throw $_
    }

    try {
        .$DownloadPath -InstallDir '~/.dotnet' -Channel 'STS'
    } catch {
        throw $_
    }
}

try {
    dotnet tool install --global PowerShell
    $env:PATH += ';' + [System.IO.Path]::Combine($HOME, '.dotnet', 'tools')
} catch {
    throw $_
}

if (Test-Path -Path $DownloadPath) {
    Remove-Item -Path $DownloadPath -Confirm:$false
}
```

This script is also available on GitHub at [SamErde/PowerShell/General/Install-PowerShellAsDotNetTool.ps1](https://github.com/SamErde/PowerShell/blob/main/General/Install-PowerShellAsDotNetTool.ps1)

## Installing LTS

What if your organization has a requirement that only LTS versions of software may be installed? I should (and will) update the above script with a parameter to specify LTS or STS, but for the sake of time, here are the steps.

```powershell
# Download Microsoft's dotnet tool install script to the TEMP directory.
$DownloadPath = Join-Path -Path $env:TEMP -ChildPath 'dotnet-install.ps1'
Invoke-WebRequest 'https://dot.net/v1/dotnet-install.ps1' -OutFile $DownloadPath

# Remove the MOTW (mark of the web).
Unblock-File -Path $DownloadPath

# Install the .NET Tool with support for the LTS version of .NET ('STS' is the default).
.$DownloadPath -InstallDir '~/.dotnet' -Channel 'LTS'
```

When installing PowerShell with the .NET (dotnet) Tool, you can specify the `--version 7.4.11` parameter, but there is no option to simply install the LTS version. Let's find a way to get the latest LTS release of PowerShell:

```powershell
$LTSVersion = (Invoke-RestMethod -Uri https://aka.ms/pwsh-buildinfo-lts).ReleaseTag.Replace('v','')
dotnet tool install --global PowerShell --version $LTSVersion
```

As a alternative, we can also get the LTS version number from the `metadata.json` file in the PowerShell repository: `(Invoke-RestMethod -Uri 'https://raw.githubusercontent.com/PowerShell/PowerShell/master/tools/metadata.json').LTSReleaseTag.Replace('v','')`.

Both of these two URIs that I queried provide some details about PowerShell releases, as you can see in this screenshot:
![PowerShell in Windows Terminal showing the output of Invoke-RestMethod getting two PowerShell release info URIs. ](/assets/img/content/PowerShell-LTS-Version-Release-Commands.png)

You should now have a fresh installation of PowerShell as a .NET tool on either the LTS or STS release.

{: .box-note}
This setup is completely independent of any versions of .NET and PowerShell that you already have installed on your system from an MSI, WinGet, or the Microsoft Store.

## Limitations

PowerShell as a .NET tool is easy to setup, but it does have some limitations.

- Updates must be managed via `dotnet tool update` instead of WinGet, Windows Updates, or the Microsoft Store.
- PowerShell remoting and WinRM might be unreliable or unsupported.
- Base PowerShell modules may not be available or may have reduced functionality due to missing dependencies.
- Modules such as **Microsoft.Graph** may fail due to dependencies on the full PowerShell host.
- GUI-based modules that rely on Windows Forms or WPF won't work.

## Closing Thoughts

Despite these limitations, this can be a useful tool for development and testing, or when you need a lightweight installation option that doesn't require local admin rights.
