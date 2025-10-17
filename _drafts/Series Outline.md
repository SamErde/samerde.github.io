# Setting up Your Tools and Environment for Work and Personal Projects

A series of blog posts that describe steps to optimize your coding environment with clean separation of your work and personal projects. Look for opportunities to improve or to make this easier using GitKraken Desktop and `gk` CLI for the Ambassador Program.

## Part 1: Intro Series and Folder Structure

### What and Why

### Folder Structure

- Create a directory under which to nest all of your coding projects and cloned repositories
  - Decide where to put this directory
    - OS-specific considerations vs cross-platform ease of use
    - Under Documents directory benefits from potential OneDrive sync, but doesn't exist across platforms and you may prefer not to sync this as a part of your business/personal account.
    - Under your home directory (profile root) is a good place that can be easily referenced across platforms
    - Use `subst` command or a Linux alias to shorten (and also mask for privacy) the literal path
- Create a sub-directory for your personal account (or more if you have multiple personal accounts on GitHub, GitLab, Azure DevOps, etc)
- Create a sub-directory for your work account(s)

An example directory structure might look like this:

```text
/Users/SamErde/Code/
├── Personal/
│   ├── PSPreworkout/
│   ├── TheCleaners/
│   ├── PowerShell/
│   ├── DLLPickle/
│   ├── f_Maester/
│   └── f_Locksmith/
└── Work/
    ├── Project1/
    ├── Project2/
    ├── SharedScripts/
    ├── ClientScripts/
    └── Module1/
```

Now you can see a clean directory structure that separates my personal and work-related projects. In the example above, the `f_` prefix is what I usually use for forked repositories.

Once I start working on these projects, the full path to some repository files can get quite long. If the `Code` directory is created under a OneDrive-redirected Documents folder, then the path gets *much* longer. To make it shorter and easier to work with, and to provide some privacy when sharing screenshots, errors, or PRs; I like to suggest masking the path with one of several techniques.

1. Create a drive letter that maps to the `Code` path, or even create separate drive letters for the `Personal` and `Work` paths.
   A. Windows:
      - Use the `subst` command, which can be added to your startup or profile and is usable in Windows Explorer or the shell.
      - Use the related **PSProvider** cmdlet (I forget the name right now), which has the downside of only working in PowerShell.
   B. Non-Windows:
      - Create an alias.
   C. Honorable mention for all platforms: Create a junction point.
2. Use a custom PowerShell prompt that replaces the value of `$HOME` in the `$PWD` segment of your prompt with a `~`.

And finally, pin the location of your `Code` folder to your Quick Access list in Windows Explorer, the SideBar favorites in macOS, or the equivalent feature in your Linux desktop environment of choice.

## Part 2: Git Config

Use a base `.gitconfig` file that includes custom `.gitconfig` segments depending on the path of the currently opened repository path. Each custom config file will at the very least contain the `user.email` setting along with anything else you might want to customize for your work or personal project needs.

Possible sidebar to PGP and SSH authentication for Git commits, but probably separate post

## Part 3: VS Code Profiles

## Part 4: VS Code Workspaces

## Part 5: Wrap Up

Wrap the series up and tie it all back to Git. Provide links to additional resources and possibly some information about GitKraken.
