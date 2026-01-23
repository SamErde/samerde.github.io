---
layout: post
title: Issues with Windows Update KB5066835 Cause Problems with Authentication Flows
subtitle: Security update breaks localhost listeners that are used to connect to Microsoft 365 services with PowerShell and affect other 3rd party applications such as Cisco Duo.
date:   2025-10-16 21:00:00 -0500
tags: [Issue, PowerShell, Windows, Microsoft-Teams]
categories: [Windows]
author: Sam Erde
gh-repo: samerde/samerde.github.io
comments: true
---

This Wednesday, October 15th, I encountered an unpleasant surprise when I began connecting to Microsoft 365 services to test the latest prerelease version of Maester: I could not connect to Microsoft Teams using PowerShell!

```powershell
Import-Module Maester
Connect-Maester -Service All -TenantId $MyTenantId
Connect-MicrosoftTeams: ~\Documents\PowerShell\Modules\Maester\1.3.90\public\Connect-Maester.ps1:284
Line |
 284 |                    Connect-MicrosoftTeams > $null
     |                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | One or more errors occurred. (An HttpListenerException occurred while listening on
     | http://localhost:52723/ for the system browser to complete the login. Possible cause and
     | mitigation: the app is unable to listen on the specified URL; run 'netsh http add
     | iplisten 127.0.0.1' from the Admin command prompt.)
Connect-MicrosoftTeams: ~\Documents\PowerShell\Modules\Maester\1.3.90\public\Connect-Maester.ps1:284
Line |
 284 |                    Connect-MicrosoftTeams > $null
     |                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | An HttpListenerException occurred while listening on http://localhost:52723/ for the
     | system browser to complete the login. Possible cause and mitigation: the app is unable to
     | listen on the specified URL; run 'netsh http add iplisten 127.0.0.1' from the Admin
     | command prompt.
Connect-MicrosoftTeams: ~\Documents\PowerShell\Modules\Maester\1.3.90\public\Connect-Maester.ps1:284
Line |
 284 |                    Connect-MicrosoftTeams > $null
     |                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | The request is not supported.
Connect-MicrosoftTeams: ~\Documents\PowerShell\Modules\Maester\1.3.90\public\Connect-Maester.ps1:284
Line |
 284 |                    Connect-MicrosoftTeams > $null
     |                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | One or more errors occurred. (An HttpListenerException occurred while listening on
     | http://localhost:52723/ for the system browser to complete the login. Possible cause and
     | mitigation: the app is unable to listen on the specified URL; run 'netsh http add
     | iplisten 127.0.0.1' from the Admin command prompt.)
```

The process still opened a browser, which proceeded to show a "localhost refused to connect" error.

The timing of this felt like it may have been patch related, but I do frequently test prerelease software and it honestly could have been anything. Then I was fortunate to see a Twitter/X post from [Bryan Dam](https://x.com/bdam555) and a reply from [Susan Bradley](https://x.com/SBSDiva) that validated the theory.

[![@bdam555 on X: "PSA: have heard multiple reports that this month's CS (ex. KB5066835) break/alter the hocalhost loopback in ways that has broken a fairly wide swath of software](/assets/img/content/twitter-KB5066835.png)](https://x.com/bdam555/status/1978935615807783322)

That post and the Cisco Duo article 9527 that Susan Brady shared ([Why is Duo Desktop not detected on my Windows device after installing updates to Windows 11?](https://help.duo.com/s/article/9527)) was the confirmation that I needed. (Additional information: [#2815434 on askwoody.com](https://www.askwoody.com/forums/topic/october-2025-updates-released/#post-2815434).)

The [October 14, 2025 KB5066835 update](https://support.microsoft.com/en-us/topic/october-14-2025-kb5066835-os-builds-26200-6899-and-26100-6899-1db237d8-9f3b-4218-9515-3e0a32729685) is definitely breaking apps and authentication processes that utilize the localhost loopback listener. I removed the two updates that the Cisco Duo article mentioned, rebooted, and the issue immediately went away.

I haven't found a publicly visible statement from Microsoft yet, but this explanation is included in the Windows release health message center:

> Following installation of updates releases on or after October 14 (the Originating KBs listed above), server-side applications that rely on HTTP.sys may experience issues with incoming connections. As a result, IIS websites might fail to load, displaying a message such as "Connection reset – error (ERR_CONNECTION_RESET)", or similar error. This includes websites hosted on http://localhost/, and other IIS connections.

Here's one way to resolve the issue until a new security patch or hotfix is released:

### Use WUSA to Remove the Patches

```powershell
# Remove specific Windows Updates
$KBs = 'KB5066835', 'KB5065789'

foreach ($KB in $KBs) {
    Write-Host "Attempting to uninstall $KB..."
    Start-Process -FilePath "wusa.exe" -ArgumentList "/uninstall /kb:$($KB -replace 'KB','') /quiet /norestart" -Wait
}
```

Or simply:

```shell
wusa /uninstall kb:5066835
wusa /uninstall kb:5065789
```

### Use DISM to Remove the Patches

```powershell
# Remove updates using DISM
$KBs = 'KB5066835', 'KB5065789'

foreach ($KB in $KBs) {
    Write-Host "Attempting to remove $KB using DISM..."
    Start-Process -FilePath "dism.exe" -ArgumentList "/Online /Remove-Package /PackageName:$KB /Quiet /NoRestart" -Wait
}
```

### Use the PSWindowsUpdate PowerShell Module

I used the PSWindowsUpdate PowerShell module to remove the patches:

```powershell
Install-PSResource -Name PSWindowsUpdate
Remove-WindowsUpdate -KBArticleID 5066835
Remove-WindowsUpdate -KBArticleID 5065789
```

After uninstalling, you will need to reboot your computer.

I'm sure there are many more details to spell out and more affected applications to list, but I wanted to get this post out quickly to help others that were struggling with this issue. Please add others that you know of in the comments!

Thank you!

Sam
