---
layout: post
title: Products Included with Microsoft 365 E5 Developer Subscriptions
subtitle: What is currently included when you sign up for a Microsoft 365 E5 developer subscription?
date:   2024-03-21 10:00:00 -0500
cover-img: 
thumbnail-img: 
share-img: 
tags: [Microsoft-365, M365, cloud]
categories: [Microsoft 365]
author: Sam Erde
gh-repo: samerde/powershell
---

Welcome back! This blog isn't DOA, but I definitely am still learning to create a habit of writing. Here's a quick hit that falls into the "make notes and share them" category.

During the first quarter of 2024, Microsoft [announced some unfortunate changes to the developer program](https://devblogs.microsoft.com/microsoft365dev/stay-ahead-of-the-game-with-the-latest-updates-to-the-microsoft-365-developer-program/). There have been many posts about how far fewer people will have access to this amazing learning and developing resource. I won't dive into that again in this post. For now, I wanted to create an easy reference for one other question that often comes up: "if it's E5, but not all services are actually included, which ones *are*?" (Spoiler: Microsoft Defender for Endpoint is still excluded.) The announcement states:

> **Updated service plans**. The Microsoft 365 developer subscription now includes service plans that were previously missing. For a complete list of the service plans that are included, see [Product names and service plan identifiers for licensing](https://learn.microsoft.com/en-us/entra/identity/users/licensing-service-plan-reference?source=devblogs).

If you've ever visited that page, you know how hard it is to read! This seems like a great opportunity for a GitHub action to scrape and remodel the table. For now, here's a quick copy/paste of the friendly names for all service plans included with the DEVELOPERPACK_E5 SKU.

```
Avatars for Teams
Avatars for Teams (additional)
Azure Information Protection Premium P1
Azure Information Protection Premium P2
Azure Rights Management
Commercial data protection for Microsoft Copilot
Common Data Service
Common Data Service for Teams
Customer Lockbox
Customer Lockbox (A)
Data Classification in Microsoft 365
Exchange Online (Plan 2)
Graph Connectors Search with Index
Information Protection and Governance Analytics - Premium
Information Protection for Office 365 - Premium
Information Protection for Office 365 - Standard
Microsoft 365 Advanced Auditing
Microsoft 365 Apps for enterprise
Microsoft 365 Audit Platform
Microsoft 365 Communication Compliance
Microsoft 365 Defender
Microsoft 365 Lighthouse (Plan 1)
Microsoft 365 Phone System
Microsoft Azure Multi-Factor Authentication
Microsoft Bookings
Microsoft Clipchamp
Microsoft Communications DLP
Microsoft Customer Key
Microsoft Data Investigations
Microsoft Defender for Cloud Apps
Microsoft Defender for Identity
Microsoft Defender for Office 365 (Plan 1)
Microsoft Defender for Office 365 (Plan 2)
Microsoft Entra ID P1
Microsoft Entra ID P2
Microsoft Excel Advanced Analytics
Microsoft Forms [Plan E5]
Microsoft Information Governance
Microsoft Insider Risk Management
Microsoft Intune Plan 1
Microsoft Loop
Microsoft ML-Based Classification
Microsoft MyAnalytics (Full)
Microsoft Planner
Microsoft Records Management
Microsoft Search
Microsoft StaffHub
Microsoft Stream for Office 365 E5
Microsoft Teams
Mobile Device Management for Office 365
Nucleus
Office 365 Advanced eDiscovery
Office 365 Cloud App Security
Office 365 Privileged Access Management
Office 365 SafeDocs
Office for the Web
Power Apps for Office 365 (Plan 3)
Power Automate for Office 365
Power BI Pro
Power Virtual Agents for Office 365
Project for Office (Plan E5)
Purview Discovery
RETIRED - Microsoft Communications Compliance
RETIRED - Microsoft Insider Risk Management
SharePoint (Plan 2)
Skype for Business Online (Plan 2)
Sway
To-Do (Plan 3)
Viva Learning Seeded
Whiteboard (Plan 3)
Yammer Enterprise
```

If you're reading this, I hope you've been fortunate enough to have your developer tenant renewed for now! 

Happy learning!
Sam
