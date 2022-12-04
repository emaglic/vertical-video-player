# Segmented Video Player

## For playing segmented vertical or ultra-wide (horizontal) video on a standard 16:9 screen.

## Background

Many developers and other tech professionals these days are using vertical or ultra-wide monitors.

I personally use a setup with one standard (16:9), horizontal monitor as my primary display and then another vertically oriented (9:16) monitor as my secondary display. The vertical monitor I have split up into 3 equal sized "segments". This setup allows me to display 3 different windows on the monitor at once, almost like having 3 monitors in one.

A typical breakdown of my 3 segment setup would be:

- Segment 1: The browser, with whatever webpage or web-app I'm working on.
- Segment 2: Chrome-dev tools, so I can see errors, network requests, etc.
- Segment 3: Docker logs, terminal, etc.

The nice thing about this 3 segment setup is that I can see everything I need at once, on one screen, without needing to swap between different windows.

## Problem & Solution

There are times during development where I encounter a bug or other unintended behavior and I want to make a screen recording to share with other devs on the project.

### Problem

Screen recording my vertical monitor poses a bit of a problem, because unless the developers I'm sharing the video with have a vertical monitor, the video I record will be too small to be seen clearly on a horizontal (16:9) monitor.

I can of course screen record on my (primary) horizontal monitor and send that over, but that poses some other challenges:

- A 16:9 monitor can really only fit 2 windows side by side comfortably. Any more than that and they can be a bit too narrow.
- I can switch between the different windows to show the webpage then the dev-tools, then the logs, but then we aren't able to actually monitor everything in real time. Events that happen in quick succession can easily be lost.

### Solution

This web-app is my solution.

This app takes the provided vertical (or ultra-wide horizontal) video, breaks it down into the specified number of individual segments and then renders each segment at full-size (the full size of the browser window that is). The user can then use the arrow keys (or on-screen controls) to quickly swap between segments on the fly, while using spacebar (or the on-screen controls) to toggle playback (play/pause) of the video.

Sooo in truth this player can't actually display the entire vertical or (ultra-wide) video at once on a 16:9 screen, there's just no good way to do that. But what it does is the very next best thing.

The user can freely swap between visible segments on the fly, in real time while the video is playing. This allows them full control to view what is going on in any of the segment windows on demand, at any time over the course of playback.

## Gotchas

This player assumes that your segments are of equal sizes. The player will not work correctly with multiple segments of different sizes.

This does not mean you need to use special software or make all of your winodws the exact same size, it just means you have to consider where the player will be partitioning your video for playback. Try not to have the content you want to showcase fall in between 2 different segments because only part of it will be in view at any given time.

## Special Software

For Windows I recommend using Microsoft's free PowerToys suite of tools. It includes FancyZones which allows you to split your screen into and snap your windows into pre-defined "zones". You can easily setup a custom layout that breaks your monitor into equally sized zones for use with this web-app.

## Use the player

A live version of the player can be found on my website: http://eben.pizza/projects/segmentedvideo/

## Controls

- Pres Up/Down to switch between segments.
- Press Left/Right to scrub video +/- 1 second.
- Press SPACE to play/pause video playback.
- Press M to mute/unmute video.
- Press C to toggle control-bar visibility.
