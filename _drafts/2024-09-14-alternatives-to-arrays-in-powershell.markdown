---
layout: post
title:  "Alternatives to Arrays in PowerShell"
subtitle: Flexibility and performance improvements are available if you avoid using the += operator with arrays.
date:   2024-09-14 09:00:00 -0400
author: Sam Erde
categories: powershell
tags: [powershell automation scripting]
author: Sam Erde
gh-repo: samerde/powershell
cover-img: /assets/img/banners/_____.jpg
thumbnail-img: /assets/img/thumbnails/_____.jpg
share-img: "https://samerde.github.io/assets/img/social/_____.png"
---

<#
    In Windows PowerShell and PowerShell [Core], using the += operator with arrays copies your entire array into a new one that includes the object you are adding. With small arrays, you never notice the affect this has on memory and on processing time, but on large arrays, the effect can become exponential.

    In PowerShell 7.5 (prerelease) a PR was submitted that dramatically improves the performance of the += operator, bringing it up to par with the performance of other methods. However, this improvement will not be available in Windows PowerShell 5.1, so here are two other options.
#>

<# ArrayList

    The [ArrayList] type has long been a popular alternative to [array] usage because of its additional methods and performance benefits. It is still very commonly used, however, you should be aware that Microsoft has labeled it as 'deprecated.' Here are some examples of how to use it:
#>

# Cast a new variable using the ArrayList type accelerator
[ArrayList]$Fruit = @('Apple','Banana')
# or using New-Object
$Fruit = New-Object -TypeName System.Collections.ArrayList
# or using the constructor method:
$Fruit = [System.Collections.ArrayList]::new()

# Add, insert, and remove methods are built-in:

$Fruit.Add('Pear')
$Fruit
> Apple, Banana, Pear

$Fruit.Insert(0,'Starfruit')
$Fruit
> Starfruit, Apple, Banana, Pear

$Fruit.Insert(2,'Orange')
$Fruit
> Starfruit, Apple, Orange, Banana, Pear

$Fruit.Remove('Banana')
$Fruit
> Starfruit, Apple, Orange, Pear

# Adding an item to an ArrayList returns the [int] index of the newly added item. This can be suppressed from the output in a couple of ways, and here are the two I most often use:
[void]$Fruit.Add('Guava')
$Fruit.Add('Papaya') | Out-Null
$Fruit
> Starfruit, Apple, Orange, Pear, Guava, Papaya

<# GenericList
    The "new" way to work with arrays is to use the GenericList type. This works very similarly to [ArrayList]. I do not know the intricate details and differences except for one thing that sometimes makes this slightly tricky to work with: you have to declare the type of object that you are building a list of. Let's look at those examples:
#>

# Create a GenericList using the same three approaches, but note how the type is cast within the List declaration.
[List[string]]$Vegetables = @()
$Vegetables = [System.Collections.Generic.List]::new()
$Vegetables = New-Object [System.Collections.Generic.List[string]]

# Other possibilities might use these types:
[List[array]]
[List[int]]
[List[PSCustomObject]]
[List[System.IO.FileSystemInfo]]
[List[MailAddress]]

# Or even, cheat if you don't know the technical type name!
[List[object]]

# Finally, they both also support the nifty .AddRange() method that works like this:
[System.Collections.ArrayList]$Numbers = @(1,2,3)
$Numbers.AddRange(5..10)

# There are more fun tricks, like adding an array in the AddRange method, but I don't recall how to make that work off the top of my head.

<#
    In summary, ArrayList and List can offer much better performance when working with large arrays of objects, and also offer the flexibility of add, remove, insert, and AddRange methods.
#>
