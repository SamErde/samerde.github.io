---
layout: post
title:  "The Benefits of Removing the Az and Microsoft.Graph PowerShell Modules"
subtitle: Save time and simplify your workspace by removing all unused PowerShell modules.
date:   2024-09-05 09:00:00 -0400
author: Sam Erde
categories: [PowerShell]
tags: [PowerShell, Automation, Scripting, Azure, Microsoft Graph]
author: Sam Erde
gh-repo: samerde/powershell
cover-img: /assets/img/banners/samu-lopez-T6u10VL2kjo-unsplash.jpg
thumbnail-img: /assets/img/thumbnails/samu-lopez-T6u10VL2kjo-unsplash.jpg
share-img: "https://samerde.github.io/assets/img/social/Removing the Az and Microsoft.Graph PowerShell Modules to Save Time.png"
---

The Microsoft Graph SDK v2.23.0 was released today, and with it, the updated Microsoft Graph PowerShell module. You can use `Update-Module` or `Update-PSResource` to update this module, or you can try out my new [PSPReworkout](https://day3bits.com/PSPreworkout) module's `Update-AllTheThings` function.

{: .box-note}
> `Update-AllTheThings` was built to update all installed PowerShell modules and scripts, PowerShell help, WinGet packages, and Chocolatey packages in one shot. (It also has the beginnings of very basic support for Linux and macOS packages.) Please try it out and share your feedback to help it improve!
> ```powershell
> Install-Module -Name PSPreworkout
> Import-Module -Name PSPreworkout
> Update-AllTheThings
> ```

Regardless of how you update, you may find that it takes a terribly long time to update these modules. Minutes, even!!! 😱 Many people have probably followed the same steps that I did to get here, and many of us have wasted hours while waiting for the `Update-Module` and `Update-Help` commands to finish.

```powershell
# We installed ALL OF THE THINGS 🧹🤪
Install-Module -Name Az
Install-Module -Name Microsoft.Graph
```

When we use these commands, we don't just install one module or two modules. As of this writing:
- The [Az module](https://github.com/Azure/azure-powershell/blob/main/documentation/azure-powershell-modules.md) includes 171 service submodules.
- The [Microsoft.Graph PowerShell module](https://github.com/microsoftgraph/msgraph-sdk-powershell/wiki/MS-Graph-PowerShell-Modules) includes 38 service submodules.

We just installed 211 modules on our system, and many of us will only ever use 10-20 of them! This is where my click-baity title comes in. 😜

My advice to you now is to review the modules installed on your system and uninstall any that you do not use. Start with `Get-InstalledModule` to view a list of all modules that you have installed.

{: .box-tip}
> Using `Get-InstalledModule` instead of `Get-Module -ShowAvailable` will help filter out the modules that come pre-installed with your OS. Don't waste more time by trying to manually filter through that list.

If you need to remove modules that were installed for the AllUsers scope, then you will need to begin this process with an elevated PowerShell session.

If your list is very long, and possibly includes multiple versions of each, manually removing the unused ones could be a very tedious process. Here's a quick way to clean the slate before only installing the ones that you will actually use:

```powershell
$AzGraphModules = Get-InstalledModule -Name Az,Az.*,Microsoft.Graph,Microsoft.Graph.* -ErrorAction SilentlyContinue
foreach ($module in $AzGraphModules) { Uninstall-Module -Name $module.Name -AllVersions -Force }
```

This may take a few minutes to run. After completing, you should see a much shorter list when running `Get-InstalledModule`. At this point, you can re-install only the modules that you will likely need, and expand the list as your needs grow. I would suggest starting with the following ones:

- Az.Accounts
- Az.Resources
- Az.Tools.Predictor
- Microsoft.Graph.Applications
- Microsoft.Graph.Authentication
- Microsoft.Graph.Groups
- Microsoft.Graph.Users
- Microsoft.Graph.Identity.DirectoryManagement
- Microsoft.Graph.Identity.SignIns

Whether you install this list, or others, installing them in batch is fairly straightforward with an array:

```powershell
$ModulesToInstall = @('Az.Accounts','Az.Resources','Az.Tools,Predictor','Microsoft.Graph.Applications','Microsoft.Graph.Authentication','Microsoft.Graph.Groups','Microsoft.Graph.Users','Microsoft.Graph.Identity.DirectoryManagement','Microsoft.Graph.Identity.SignIns')
foreach ($module in $ModulesToInstall) { Install-Module -Name $module -Scope CurrentUser }
```

Check your results with `Get-InstalledModule`. (What other modules do you have installed? Let me know!) You can now reap the benefits of having fewer PowerShell modules installed:

- **Faster Auto-Import and Tab-Completion:** With fewer modules, PowerShell has fewer cmdlets and functions to load and index, which can speed up the auto-import process and make tab-completion more responsive.
- **Reduced Memory Usage:** Each module loaded into a PowerShell session consumes memory. By removing unused modules, you can reduce the overall memory footprint of your PowerShell environment.
- **Avoiding Conflicts:** Having many modules installed can sometimes lead to cmdlet name conflicts, where multiple modules define cmdlets with the same name. Reducing the number of installed modules can help avoid these conflicts.
- **Improved Security:** Unused modules might not be regularly updated, potentially leaving security vulnerabilities unpatched. Removing them reduces the attack surface and helps maintain a more secure environment.
- **Simplified Management:** Fewer modules mean less complexity in managing updates and dependencies, making it easier to keep your environment up to date and stable.

Try it out and let me know if you notice the difference!
