# Activity 02.b: Media and Paths in HTML

In this activity you will explore the use of media HTML elements and their attributes. You will also explore the use of relative and absolute paths in HTML.

## Activity Resources

1. [&lt;video&gt; HTML Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) documentation on MDN
2. Assets
   * [Video (mp4)](files/video.mp4)
   * [Video (webm)](files/video.webm)
   * [Poster Image](files/poster.jpg)

## Task 1: Embedding Video in HTML

For this activity you are given a video in two formats: `mp4` and `webm`. You will also receive an image file in `jpg` format to be used as a "poster" or thumbnail of the video. You will use these files to embed the video in an HTML page that meets the requirements below:

* Embed the video in the HTML page twice.
  * The first video should autoplay and loop continuously when the page loads. This video should also preload and play inline on mobile devices. The user should not be given the option to control the playback of the video.
  * The second video should not autoplay, loop, or preload. The user should be given the option to control the playback of the video.
* Both videos should be 200px tall, be muted by default, and display a poster image while the video is loading.


### Steps

1. Create an new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the video and image files from the resources above and place them in the new folder.
3. Create and initialize a new HTML file next to the videos.
4. Determine how to embed the video in the page. (use Resource 1)
5. Write the HTML code to embed the video in the page. Make sure you are specifying the location of the assets as relative paths.
6. Configure the embedded videos to meet the Task 1 requirements. (use Resource 1)
7. Open the HTML file in a browser to test the video playback and functionality.

## Task 2: Same Page, Different Location

You are now being asked to provide this page at the same time in its current location as well as in a subdirectory called "videos".

### Steps

1. Create a copy of the HTML file from Task 1 and place it in a subdirectory called "videos". Do *not* move or copy the videos.
2. Update the paths in the new HTML file to point to the video and poster image in their original location. Make sure you are specifying the location of the assets as relative paths.
3. Open the HTML file in a browser to test the video playback and functionality. The HTML file from Task 1 should still work as expected.

## Task 3: Relocating Media files

Finally, you will move the video and poster image to a new location and update the paths in the HTML file to reflect the new location of the files.

### Steps

1. Create a new directory called "media" and move the videos and poster image to this directory.
2. Update the paths in the HTML files from the previous two tasks to work with the new location of the files.
3. Open the HTML files in a browser to test the video playback and functionality. The HTML files from Tasks 1 and 2 should work as before.
