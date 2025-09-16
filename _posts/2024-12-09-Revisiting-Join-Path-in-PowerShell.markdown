---
layout: post
title:  "Revisiting Join-Path in PowerShell"
subtitle: Tips for using Join-Path in backwards-compatible and cross-platform PowerShell scripts.
date:   2024-12-09 06:45:00 -0400
author: Sam Erde
categories: [PowerShell]
tags: [PowerShell, Scripting, .NET]
author: Sam Erde
gh-repo: samerde/powershell
cover-img: /assets/img/banners/jens-lelie-paths-u0vgcIOQG08-medium.jpg
thumbnail-img: /assets/img/thumbnails/jens-lelie-paths-u0vgcIOQG08-th.jpg
share-img: "https://samerde.github.io/assets/img/social/Revisiting Join-Path in PowerShell.png"
comments: true
---

Many people have already written about the benefits of using PowerShell's `Join-Path` cmdlet. Instead of repeating the details, let's review some of the less common tricks, and then look at the differences between Windows PowerShell 5.1 and newer versions of PowerShell.

The syntax in Windows PowerShell is pretty basic. You can provide a parent path and a child path.

```powershell
Join-Path
    [-Path] <String[]>
    [-ChildPath] <String>
    [-Resolve]
    [-Credential <PSCredential>]
    [-UseTransaction]
    [<CommonParameters>]
```

You may not have realized that it supports wildcards in the parent and child paths, and can return an array of strings that represent paths.
```powershell
Join-Path -Path "$Home\AppData\Local*" -ChildPath "Microsoft*" -Resolve
```
![A screen shot of PowerShell in Windows Terminal running the command 'Join-Path -Path "$Home\AppData\Local*" -ChildPath "Microsoft*" -Resolve'.](https://samerde.github.io/assets/img/content/Join-Path-Wildcards.png)

It can also accept multiple parent paths and return multiple resolved paths:
```powershell
Join-Path -Path C:\, C:\Windows, $env:LOCALAPPDATA -ChildPath "Temp" -Resolve
```
![A screen shot of PowerShell in Windows Terminal running an example of Join-Path with multiple parent paths.](https://samerde.github.io/assets/img/content/Join-Path-Multiple-Parents.png)

The difference between Windows PowerShell and PowerShell becomes apparent when you want to join more than one child path. PowerShell added the **AdditionalPath** parameter, which allows you to add virtually unlimited child paths like this:

```powershell
# Join multiple child paths in PowerShell
Join-Path -Path $HOME -ChildPath "Documents" -AdditionalChildPath 'PowerShell'

# Join multiple child paths with an array of additional child paths
[string[]]$AdditionalChildPaths = @('Personal','PSPreworkout','src','PSPreworkout','Public')
Join-Path -Path C:\ -ChildPath 'Code' -AdditionalChildPath $AdditionalChildPaths

# Or even the very ugly but still functional:
Join-Path \ a b c d e f g h 1 2 3 4 5 6
```

Since Windows PowerShell doesn't have the **AdditionalPath** parameter, how can we do this on older systems? There are a few ways to expand its functionality:

```powershell
# Join multiple child paths in Windows PowerShell (or PowerShell) by piping to the next Join-Path:
Join-Path -Path $HOME -ChildPath "Documents" | Join-Path -ChildPath "PowerShell" | Join-Path -ChildPath "Modules"

# Or, even worse: join multiple child paths in Windows PowerShell (or PowerShell) by nesting commands:
Join-Path -Path $HOME -ChildPath "Documents" | Join-Path -ChildPath (Join-Path -Path "PowerShell" -ChildPath "Modules")
```

I like to dig into things like this when writing scripts that should be able to work cross-platform and on both editions of PowerShell. The last two examples shown above do work on Windows PowerShell 5.1, but can get hard to follow once you go more than two paths deep.

You might notice an emerging theme when we look into one more option that works on PowerShell, Windows PowerShell, and across platforms: .NET again! The **System.IO.Path** type's `Combine` method takes a list of path segments and joins them easily.

```powershell
# Join multiple child paths in any version of PowerShell on Linux, macOS, or Windows
[System.IO.Path]::Combine($HOME,"Documents","PowerShell","Modules")

# The same as above, but with a variable
[string[]]$Segments = @($HOME,"Documents","PowerShell","Modules")
[System.IO.Path]::Combine($Segments)
```

![A screen shot of Windows Terminal running the following command in Ubuntu (WSL): '[System.IO.Path]::Combine($HOME,"Documents","PowerShell","Modules")'.](https://samerde.github.io/assets/img/content/Path-Combine.png)

That looks like a nice, clean option that runs almost anywhere and is easy to read!

Photo by <a href="https://unsplash.com/@madebyjens?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jens Lelie</a> on <a href="https://unsplash.com/photos/two-roads-between-trees-u0vgcIOQG08?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
