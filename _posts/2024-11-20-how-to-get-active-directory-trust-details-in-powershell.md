---
layout: post
title: How to Get Active Directory Trust Details in PowerShell
subtitle: In which .NET inspires a solution to a question I had for years.
date:   2024-11-20 12:00:00 -0500
# cover-img: /assets/img/banners/ken-suarez-4IxPVkFGJGI-unsplash.jpg
# thumbnail-img: /assets/img/thumbnails/ken-suarez-4IxPVkFGJGI-unsplash.jpg
# share-img: "https://samerde.github.io/assets/img/social/M365-E5-Developer-SKU.png"
tags: [Active Directory, PowerShell, .NET]
categories: [PowerShell]
author: Sam Erde
gh-repo: samerde/powershell
---

Through most of the past 16 years of working with Active Directory, I have supported and worked in multi-forest environments. This work has involved one forest being split into 3 forests, a cross-forest migration of Exchange Server (I was spared the first one), and multiple forest consolidation projects. At various points throughout that timeline, I have needed to write PowerShell scripts that rely on either the DNS name, NetBIOS name, or SID of domains in the trust relationship. This information is easy to get using the ActiveDirectory module's `Get-ADTrust` cmdlet.

```powershell
Get-ADTrust -Filter *

<# Example Output:
    Direction               : BiDirectional
    DisallowTransivity      : False
    DistinguishedName       : CN=example.com,CN=System,DC=domain,DC=com
    ForestTransitive        : True
    IntraForest             : False
    IsTreeParent            : False
    IsTreeRoot              : False
    Name                    : example.com
    ObjectClass             : trustedDomain
    ObjectGUID              : 00000000-0000-0000-0000-000000000000
    SelectiveAuthentication : False
    SIDFilteringForestAware : False
    SIDFilteringQuarantined : False
    Source                  : DC=domain,DC=com
    Target                  : example.com
    TGTDelegation           : False
    TrustAttributes         : 8
    TrustedPolicy           :
    TrustingPolicy          :
    TrustType               : Uplevel
    UplevelOnly             : False
    UsesAESKeys             : False
    UsesRC4Encryption       : False
#>
```

Now for the embarrassing part of this post: for a painfully long time, I thought the target domain's NetBIOS name and domain SID were not returned by the `Get-ADTrust` cmdlet. 🤦‍♂️

Guess what, Past Sam Erde?
It is there.
You just need to look closer. 🕵️‍♂️

This cmdlet can return the **flatName** property, which *is* the target domain's NetBIOS name, and **securityIdentifier**, which is the target domain's SID. All you needs is `Get-ADTrust -Filter * -Properties flatName,securityIdentifier`. To remind myself, let's display the results in a pretty table with labels that make sense:

```powershell
Get-ADTrust -Filter * -Properties Source,Target,flatName,securityIdentifier | Format-Table Source, Target, @{Name = "NetBIOSName"; Expression = {$_.flatName}}, @{Name = 'DomainSID'; Expression = {$_.securityIdentifier}} -AutoSize
```

Cool! Now then--what I *was* going to write about was 'a really cool solution to get this "missing" information using a .NET type.' The original premise of my post was wrong, but let's still talk about that option. Using a .NET type instead of the **Get-ADTrust** cmdlet is going to be very useful when the ActiveDirectory PowerShell module is not available and you cannot install it. It can also be more efficient to use, especially when pulling invalid trusts. For example, `Get-ADTrust` is a bit slower and waits for a timeout or error when it cannot validate the target domain. You probably won't notice the difference in most cases, though. Let's just look at the code!

```powershell
$Forest = [System.DirectoryServices.ActiveDirectory.Forest]::GetCurrentForest()
$TrustRelationships = $Forest.GetAllTrustRelationships()
$TrustRelationships.TrustedDomainInformation

> DnsName         NetBiosName     DomainSid                                Status
> -------         -----------     ---------                                ------
> example.com     EXAMPLE         S-1-5-21-000000000-1234567890-1234567890 Enabled
```

I honestly like this approach better!

If one-liners are your thing, we can do that as well: `[System.DirectoryServices.ActiveDirectory.Forest]::GetCurrentForest().GetAllTrustRelationships().TrustedDomainInformation`.

By using the `System.DirectoryServices.ActiveDirectory.Forest` type from .NET, we can directly interact with Active Directory objects and retrieve trust details without relying on the ActiveDirectory PowerShell module.

What do you think? Have you already moved your Active Directory scripts away from depending on the ActiveDirectory module? Let me know!
