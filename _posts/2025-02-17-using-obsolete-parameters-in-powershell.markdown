---
layout: post
title:  "Using Obsolete Parameters in PowerShell"
subtitle: How to deprecate a parameter in your PowerShell functions without breaking existing scripts.
date:   2025-02-17 07:00:00 -0400
author: Sam Erde
categories: [PowerShell]
tags: [PowerShell, Scripting]
author: Sam Erde
gh-repo: samerde/powershell
cover-img: /assets/img/banners/jadon-kelly-zCnOv_jlbiw-unsplash-cropped.jpg
thumbnail-img: /assets/img/thumbnails/jadon-kelly-zCnOv_jlbiw-unsplash.jpg
share-img: "https://samerde.github.io/assets/img/social/Using-Obsolete-Parameters-In-PowerShell.png"
comments: true
---
<!-- markdownlint-disable no-inline-html -->

When you maintain PowerShell code for long enough, you may eventually want to stop using one of your original parameters in a function. It may have been used to provide a switch that is no longer needed or an input that is no longer supported. However, you do not want to completely remove that parameter and risk breaking scripts that rely on it. Instead, you can begin deprecating that parameter and mark it as obsolete. The **System.Obsolete** attribute is used to do this.

```powershell
param (
    [System.Obsolete("'Mode' is being replaced by a more flexible set of parameters. It will be removed in a future release. Please use 'Get-Help Test-Obsolete' or visit <https://day3bits.com/2025-02-17-using-obsolete-parameters-in-powershell/> for more information.")]
    [int16]$Mode
)
```

When this parameter is used in a function, the user is warned that it is obsolete, but it will still continue to work.

Here is a full example of the **Obsolete** attribute in use:

```powershell
function Test-Obsolete {
    param (
        # Test mode parameter.
        [Parameter(Mandatory)]
        [Obsolete("'Mode' is being replaced by a more flexible set of parameters. It will be removed in a future release.`n`nPlease use 'Get-Help Test-Obsolete' or visit <https://day3bits.com/2025-02-17-using-obsolete-parameters-in-powershell/> for more information.")]
        [ValidateNotNullOrEmpty()]
        [ValidateRange(0, 5)]
        [int16]
        $Mode
    )

    Write-Output "You chose mode ${Mode}."
} # end function Test-Obsolete
```

The output of this function will look like this:

```output
PS C:\Code> Test-Obsolete -Mode 3
WARNING: Parameter 'Mode' is obsolete. 'Mode' is being replaced by a more flexible set of parameters. It will be removed in a future release.

Please use 'Get-Help Test-Obsolete -Full' or visit <https://day3bits.com/2025-02-17-using-obsolete-parameters-in-powershell/> for more information.
You chose mode 3.
PS C:\Code>
```

You can download this sample function ([Test-Obsolete.ps1](https://github.com/SamErde/PowerShell/blob/main/Snippets/Test-Obsolete.ps1)) and a few hundred others from my [PowerShell repository](https://github.com/SamErde/PowerShell).

This is just one of those little things you can do to improve the experience for people who use your code. Take advantage of it to make your PowerShell code 1% better every day!

Have a great day! ☀️🙏
