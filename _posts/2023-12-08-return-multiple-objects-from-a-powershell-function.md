---
layout: post
title: Return Multiple Objects from a PowerShell Function
subtitle: Hash tables are back with another slick use case!
date:   2023-12-08 09:00:00 -0500
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [PowerShell, Locksmith]
categories: [PowerShell]
author: Sam Erde
gh-repo: samerde/powershell
gh-badge: [star, follow]
---

One of the things that makes PowerShell so fun is the endless opportunities to learn new and better ways to do things. We all began learning it by trying out useful cmdlets and following tutorials to write basic functions. However, nothing sinks in as well as when we work on a project with specific goals that stretch our PowerShell knowledge.

For me, one such project has been [Locksmith](https://github.com/trimarcjake/locksmith), which I had the pleasure of joining earlier this year.

<img src="https://samerde.github.io/assets/img/locksmith.png" alt="An image of the first Locksmith sticker: a coral-colored padlock with the basic PowerShell prompt characters on the front. The top caption says, 'Got AD CS?' and the bottom caption says, 'Invoke-Locksmith' on a purple background." height="250" width="250"/>

While working on an enhancement for the Locksmith PowerShell module, I had to ask myself for the first time, **can I return multiple objects from a PowerShell function?**

The answer is yes, you can return multiple objects from a PowerShell function, and there are multiple ways to do it.

Here is one simple example:

```powershell
function Get-Food {
    $TreeFruit = @("Apple","Orange","Peach")
    $Squash = @("Pumpkin","Acorn Squash","Winter Squash")
    $RootVegetable = @("Potato","Sweet Potato","Turnip","Radish")

    Return $TreeFruit, $Squash, $RootVegetable
}

$Food = Get-Food
```

This function doesn’t do anything other than return three arrays, but you get the idea. You can return any kind of object, or a mix of different object types. Cool!

{: .box-note}
*At this point, it’s helpful to remember that everything in PowerShell is an object. (Yes, even strings are objects!) PowerShell lets us move those objects along the pipeline, doing whatever we need to with them in the process. It’s like a powerful little shell game!* 😉

…but there’s a problem! If you run this code, you’ll notice something that could be an issue: the objects are returned as what looks like an ambiguous list.
```>_$Food`
```powershell
Apple
Orange
Peach
Pumpkin
Acorn Squash
Winter Squash
Potato
Sweet Potato
Turnip
Radish
```

The array names are gone, so if you want to reference a specific “thing” from the function, you have to find a creative way to get it.

We can try using imatch to find arrays that might contain words we know:
```powershell
$TreeFruit = $Food -imatch "Apple"
$Squash = $Food -imatch "Squash"
$RootVegetable = $Food -imatch "Turnip"
```

This isn’t very friendly code and also depends on you knowing one of the values, which defeats the whole point to begin with.

We could try rebuilding the arrays by referencing the index of each object returned:

```powershell
$TreeFruit = $Food[0]
$Squash = $Food[1]
$RootVegetable = $Food[2]
```

While this does work, it is still unfriendly, error-prone, and requires you to already know the order of objects being returned. And what if the objects returned aren’t arrays? They could be integers or booleans. It is a very unreliable way to manage code for any project, especially one being developed by a team.

What if you need to enumerate the TreeFruit array, and then enumerate the RootVegetable array later in a different function?

After an embarrassingly long time, a light finally came on in my head. 

{: .box-note}
:bulb: *The value side of a hash table entry can be any kind of object!* :bulb:

What if I put the name of the object (the array, in this case) in the key, and store the actual arrays in the value?

Our function can be written to return a hash table like this:

```powershell
function Get-Food {
    $TreeFruit = @("Apple","Orange","Peach")
    $Squash = @("Pumpkin","Acorn Squash","Winter Squash")
    $RootVegetable = @("Potato","Sweet Potato","Turnip","Radish")

    Return @{
        TreeFruit = $TreeFruit
        Squash = $Squash
        RootVegetable = $RootVegetable
    }
}

$Results = Get-Food
```

This is especially useful because of the easy way you can reference the values of hash tables by their key names:

```powershell
> $Results['TreeFruit']
Apple
Orange
Peach

> $Results['Squash']   
Pumpkin
Acorn Squash
Winter Squash

> $Results['RootVegetable']
Potato
Sweet Potato
Turnip
Radish
```

Now you can get fancy and do whatever you want with those results:

```powershell
Write-Output @"
  Tree Fruit:
  $($Results['TreeFruit'] -join ', ')

  Squash:
  $($Results['Squash'] -join ', ')

  Root Vegetables:
  $($Results['RootVegetable'] -join ', ')
"@
```

Which gives you this:

```powershell
Tree Fruit:
Apple, Orange, Peach

Squash:
Pumpkin, Acorn Squash, Winter Squash

Root Vegetables:
Potato, Sweet Potato, Turnip, Radish
```

Hey, I like it! Let’s get back to [Locksmith](https://github.com/trimarcjake/locksmith) so you can see it put to practical use. My goal was to call a number of scans from a private function and then return the results of each scan back to the [main function](https://github.com/TrimarcJake/Locksmith/blob/2d54c5b1171f4a8c392e0b21a3a00eb7dd258149/Public/Invoke-Locksmith.ps1#L191). We needed to be able to reliably reference each result as a named array for the next steps.

```powershell
$Results = Invoke-Scans -Scans $Scans
```

The [Invoke-Scans](https://github.com/TrimarcJake/Locksmith/blob/main/Private/Invoke-Scans.ps1) function does its work and then returns the results with the following:

```powershell
# Start Condensed Example
[array]$AuditingIssues = Find-AuditingIssue -ADCSObjects $ADCSObjects
[array]$ESC1 = Find-ESC1 -ADCSObjects $ADCSObjects -SafeUsers $SafeUsers
[array]$ESC2 = Find-ESC2 -ADCSObjects $ADCSObjects -SafeUsers $SafeUsers
# End Condensed Example

# Later, at the end of the function: 
# Return a hash table of array names (keys) and arrays (values)
Return @{
    AllIssues = $AllIssues
    AuditingIssues = $AuditingIssues
    ESC1 = $ESC1
    ESC2 = $ESC2
    ESC3 = $ESC3
    ESC4 = $ESC4
    ESC5 = $ESC5
    ESC6 = $ESC6
    ESC8 = $ESC8
}
```

Back in the main [Invoke-Locksmith function](https://github.com/TrimarcJake/Locksmith/blob/2d54c5b1171f4a8c392e0b21a3a00eb7dd258149/Public/Invoke-Locksmith.ps1#L192), we can now work with these results much more easily. As noted above, hash table values can be pulled by referencing their key name, like `$Results['ESC1']`, which will return all findings in the `$ESC1` array.

Alternatively, we can save them as new variables in the main function, making things even easier for repeated use.

```powershell
$AllIssues      = $Results['AllIssues']
$AuditingIssues = $Results['AuditingIssues']
$ESC1           = $Results['ESC1']
$ESC2           = $Results['ESC2']
$ESC3           = $Results['ESC3']
$ESC4           = $Results['ESC4']
$ESC5           = $Results['ESC5']
$ESC6           = $Results['ESC6']
$ESC8           = $Results['ESC8']
```

That’s it! That’s the tip. Return multiple named objects from a function but using a hash table to name and store them. Let me know if this helps with any of your projects, or if you have an even better way to do it!

Peace.

Sam
