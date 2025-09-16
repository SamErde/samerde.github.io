---
layout: post
title:  "Using the Microsoft Artifact Registry (MAR) with PowerShell"
subtitle: A trusted and secure source for PowerShell modules, packages, and other application components.
date:   2025-06-20 17:00:00 -0400
author: Sam Erde
categories: [PowerShell]
tags: [PowerShell, Scripting]
author: Sam Erde
gh-repo: samerde/powershell
comments: true
---
<!-- markdownlint-disable no-inline-html -->

The PowerShell Gallery has long been the "official" public source for PowerShell modules. It is convenient, but some organizations require more strictly vetted and approved software repositories for their environments. This can be achieved by [maintaining a private repository](https://learn.microsoft.com/powershell/gallery/how-to/working-with-local-psrepositories?view=powershellget-3.x&WT.mc_id=MVP_449935) in Azure DevOps, a NuGet-based web server, or even a file share with approved modules hosted in it. With thanks likely given to the [Secure Future Initiative](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative?msockid=0fb2870f6432600e325592a465d6612b&WT.mc_id=MVP_449935), those organizations now have an option called the [Microsoft Artifact Registry (MAR)](https://mcr.microsoft.com/en-us/?WT.mc_id=MVP_449935).

## What is the Microsoft Artifact Registry (MAR)?

> MAR is a public registry for housing Microsoft's official artifacts, such as container images. MAR enhances security by ensuring only Microsoft can publish official packages, eliminating risks like name squatting. It also improves software supply chain integrity by offering greater transparency and control over artifact provenance.

Far from being just a PowerShell module repository, MAR is a container registry that provides application frameworks, CI/CD runners, container images, SDKs, and more. At this time, the only PowerShell modules that I have found in it so far are the Az module and its myriad of sub-modules.

![A screen shot of the Microsoft Artifact Registry, with a view filtered to show the DevOps and Programming Languages categories.](/assets/img/content/Microsoft-Artifact-Registry.png)

Microsoft do have plans to publish more PowerShell modules to the MAR. We do not know how soon the different product teams will publish their modules to it, but they will first have to update their release pipeline to do so. For now, here's what you need to know:

Support for MAR was added to the **Microsoft.PowerShell.PSResourceGet v1.1.1** release on 2025/03/07. You may need to update if you have not already.

{: .box-note}
PowerShell 7.6-preview.4 includes **Microsoft.PowerShell.PSResourceGet v1.1.1**, so we can expect that version to be included when 7.6 becomes generally available.

## Getting Started with the Microsoft Artifact Registry

Here's how you can start using it:

```powershell
$MARUrl = 'https://mcr.microsoft.com'
Register-PSResourceRepository -Name MAR -Uri $MARUrl -ApiVersion ContainerRegistry -Trusted:$true
```

Now you can even set the MAR to have a higher priority than the PSGallery by running `Set-PSResourceRepository -Name MAR -Priority 10` (or any number lower than the current priority of the PSGallery).

You can confirm that this worked by running `Get-PSResourceRepository`.

![A screen shot of the Windows Terminal running the above commands.](/assets/img/content/MAR-Repository-Setup.png)

## Limitations

The **Microsoft.PowerShell.PSResourceGet** module does have some limitations when working with the MAR and other Microsoft container registries. It does *not* support the following search functionality that you *can* use with the PowerShell Gallery:

- Find by tag value
`Find-PSResource -Tag TagValue -Repository ACRDemoRepo`

- Find by command
`Find-PSResource -Command CommandName -Repository ACRDemoRepo`

- Find by DSC resource name
`Find-PSResource -DscResourceName ResourceName -Repository ACRDemoRepo`

- I did not expect wildcard searches to work, but surprisingly, this approach does work sometimes:
`Find-PSResource -Repository MAR -Type Module -Name "Az*"`

Let's install a couple of modules as a test. If you have followed along and changed the priority of the MAR, the `Install-PSResource` command will try the MAR first.

```powershell
Install-PSResource -Name Az.CognitiveServices -Scope CurrentUser
Install-PSResource -Name Az.Automation -Scope CurrentUser -Repository PSGallery
```

![The output of running `Get-InstalledPSResource -Name Az.*`.](/assets/img/content/MAR-Modules-Installed.png)

You can see here that it installed the **Az.CognitiveServices** module *and its dependency* (**Az.Accounts**) from the MAR automatically. The **Az.Automation** module was installed from the PSGallery because that source was specified in my command.

That's it for now! For more information, check the official documentation on [Microsoft Learn](https://learn.microsoft.com/powershell/gallery/powershellget/supported-repositories?view=powershellget-3.x&WT.mc_id=MVP_449935#azure-container-registry).

Thanks to Sean Wheeler for the tip and the great documentation, as always!

Have a great day! ☀️🙏
