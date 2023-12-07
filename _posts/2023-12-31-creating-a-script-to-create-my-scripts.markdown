---
layout: post
title:  "Creating a Script to Create My Scripts"
date:   2023-10-19 08:00:00 -0400
author: Sam Erde
categories: powershell
tags: powershell automation scripting
---

This week found a teammate and me looking through a list of scripts to be created for a PowerShell module. At first glance, the project looked like no less than 20 functions.

 > Spoilers: the list has grown to over 150! This is going to be a fun project!

After creating the first script, I copied and pasted it into a new file to reuse our standard function structure with comment based help. I changed all of the help notes to describe the new function and then got to work writing the code itself.

[Automate all of the things!.gif](https://#)

We all see where this is going, right? I'm a slow learner sometimes, but I get there eventually!

For the third PowerShell script, I created a `FunctionTemplate.ps1` file. Now we could copy/paste the file, rename the copy, enter the name of the new function in the code, and begin writing.

That's fine; learning is a journey, right? This is the part where the teacher taps the poster on the wall and says, "now class, what do we do with tasks that we perform more than twice?"

[Eddie Murphy thinking.gif](https://#)

The inspiration for this post really struck during a review of the environmental checks that we are writing scripts for. I pictured the process of copy, paste, rename, edit happening over and over again, and:

 > **Sam:** "We should write a script to stage the files for all of these scripts!"
 >
 > **Scripting Friend:** "We're not going to spend more time writing the script that creates the scripts than we'll actually spend writing the scripts, are we?"
 >
 > **Me, half joking:** "I hope so!"

And so it began. Let's get into the PowerShell goodness!

I began this project with [PSPublishModule](https://github.com/EvotecIT/PSPublishModule#readme) from @PrzemysławKłys. It is a very helpful module for anyone looking to jump start the PowerShell modules creation and publishing process. Here is the module's basic folder structure:

 > **Build**  
 > | _ Build-Module.ps1  
 > | _ FunctionTemplate.ps1  
 > | _ Build-FunctionFiles.ps1  
 > **Private**  
 > | - Function1.ps1  
 > | - Function2.ps1  
 > | - Function3.ps1  
 > | ...
