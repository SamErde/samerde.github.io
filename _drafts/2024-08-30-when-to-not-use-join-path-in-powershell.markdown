---
layout: post
title:  "When to Not Use Join-Path in PowerShell"
date:   2024-08-30 09:00:00 -0400
author: Sam Erde
categories: powershell
tags: powershell automation scripting
---

# When to Not Use Join-Path in PowerShell

Example 1

```powershell
# Join multiple child paths in Windows PowerShell or PowerShell
Join-Path -Path $HOME -ChildPath "Documents" | Join-Path -ChildPath "PowerShell" | Join-Path -ChildPath "Modules"

# Or, even worse:
Join-Path -Path $HOME -ChildPath "Documents" | Join-Path -ChildPath (Join-Path -Path "PowerShell" -ChildPath "Modules")
```
Example 2

```powershell
# Join multiple child paths in PowerShell
Join-Path -Path $HOME -ChildPath "Documents" -AdditionalChildPath @("PowerShell","Modules")

# The same as above, but with a variable
[string[]]$AdditionalChildPaths = @("PowerShell","Modules")
Join-Path -Path $HOME -ChildPath "Documents" -AdditionalChildPaths $AdditionalChildPaths
```
Example 3

```powershell
# Join multiple child paths in any version of PowerShell on Linux, macOS, or Windows
[System.IO.Path]::Combine($HOME,"Documents","PowerShell","Modules")

# The same as above, but with a variable
[string[]]$Segments = @($HOME,"Documents","PowerShell","Modules")
[System.IO.Path]::Combine($Segments)
```

Tie it all together.
