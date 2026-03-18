---
layout: post
title: "Microsoft Graph Updates for New Sovereign Cloud Partner Environments"
subtitle: Microsoft is building new national partner cloud environments and has updated the Graph PowerShell module to support them.
date:   2026-03-18 08:00:00 -0500
tags: [PowerShell, Azure, Microsoft Graph]
categories: [PowerShell, Azure, Microsoft Graph]
author: Sam Erde
cover-img: /assets/img/banners/_.jpg
thumbnail-img: /assets/img/thumbnails/_-small.jpg
share-img: "https://samerde.github.io/assets/img/social/_.png"
gh-repo: samerde/samerde.github.io
comments: true
---
<!-- markdownlint-disable no-inline-html -->

## Interesting Updates in Microsoft.Graph 2.36.0

You can often learn interesting things by looking at release notes. While reading the "what's changed" list for the msgraph-sdk-powershell project (Microsoft Graph PowerShell module), three things stood out:

> **Re-establish Separate Auth Paths for WAM Enabled/Disabled by @ramsessanchez in [#3542](https://github.com/microsoftgraph/msgraph-sdk-powershell/pull/3542)**
> Can we hope for continued improvements with WAM support in PowerShell?
>
> **fix: update msal dependencies by @gavinbarron in [#3548](https://github.com/microsoftgraph/msgraph-sdk-powershell/pull/3542)**
> Of interest to me due to my work on mitigating MSAL version conflicts for [Maester](https://maester.dev) and the [DLL Pickle](https://github.com/samerde/dllpickle) module.
>
> **Add BleuCloud, DelosCloud, and GovSGCloud sovereign cloud environments, remove deprecated Germany cloud by @Copilot in [#3523](https://github.com/microsoftgraph/msgraph-sdk-powershell/pull/3523)**
> What are these new names???

### Looking Deeper

#### Sovereign Cloud Changes

The EU has been keeping Microsoft busy, and in PR #3523, we see their latest developments spinning up, thanks to this GitHub Copilot prompt:

> Microsoft is building two new fully instanced national partner clouds in France an Germany. To support customers and ISV of these clouds to easily connect to these clouds the built-in environments should be updated to include the correct endpoints. In addition the current built-in environment for Germany (Blackforest) is not longer available and should be removed to avoid confusion for customers of the new national partner cloud in Germany which is owned and operated by Delos Cloud.

Subtasks in this plan include cleanup of deprecated Microsoft-managed environments and name clarifications:

- Remove the old Germany (Blackforest) environment from GraphEnvironmentConstants.cs
- Update GraphSettingsTests.cs to reflect new built-in environment count (6 instead of 5)
- Update NationalCloudHandlerTests.cs to test DelosCloud instead of removed Germany
- Add GovSGCloud sovereign cloud environment
- Update tests to reflect 7 built-in environments
- Fix PowerShell test to use DelosCloud instead of Germany
- Update GovSGCloud comment to "Sovereign Government Cloud"

Customers of national cloud partners will be able to add user-defined environments for these new partner clouds using the following commands:

**France**

```powershell
Add-MgEnvironment  -Name BleuCloud
-AzureAdEndpoint <https://login.sovcloud-identity.fr/> `
-GraphEndpoint <https://graph.svc.sovcloud.fr/>
```

**Germany**

```powershell
Add-MgEnvironment  -Name DelosCloud
-AzureAdEndpoint <https://login.sovcloud-identity.de/> `
-GraphEndpoint <https://graph.svc.sovcloud.de/>
```

**GovSGCloud**

```powershell
Add-MgEnvironment  -Name GovSGCloud
-AzureAdEndpoint <https://login.sovcloud-identity.sg/> `
-GraphEndpoint <https://graph.svc.sovcloud.sg/>
```

**Output**

```output
Name        AzureADEndpoint                    GraphEndpoint                           Type
----            ---------------                    -------------                           ----
USGovDoD        https://login.microsoftonline.us   https://dod-graph.microsoft.us          Built-in
USGov           https://login.microsoftonline.us   https://graph.microsoft.us              Built-in
China           https://login.chinacloudapi.cn     https://microsoftgraph.chinacloudapi.cn Built-in
Global          https://login.microsoftonline.com  https://graph.microsoft.com             Built-in
BleuCloud       https://login.sovcloud-identity.fr https://graph.svc.sovcloud.fr           Built-in
DelosCloud      https://login.sovcloud-identity.de https://graph.svc.sovcloud.de           Built-in
```

---

## Questions

What I don't see in the PR is any work on the `Singapore` environment that Copilot references (is this a hallucination or discovered fact?) or an explanation of what `GovSGCloud` is reserved for. Let me know if you have any insights into these developments or if you are waiting to migrate workloads to them!

Keep learning and discovering! Have a great day, friends!

Sam
