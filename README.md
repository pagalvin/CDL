CDL
===

Categorized Document Library Listing (last updated 11/02/14)

This solution aims to support a resource library that an IT department or HR department might provide to their community.  For example, IT creates a few dozen guides and other types of help in PDF, DOC, etc. format.  These cover topics like "how to use the phone", "OMG, I forgot my password" and stuff like that.  

IT uploads these documents into a document library, tags them as normal and then provide a nice view to that library using this solution.

Why not use standard SharePoint you ask?  You may well want to do that, but this is a nicer, cleaner and more user friendly look.

Recent updates as of 11/2/14:
I added a new configuration function and it now actually connects to and pull content from a SharePoint document library :).
Here are some screenshots of the configuration function:

General Settings:

![General Settings](http://goo.gl/dBIlmH)

Configuring the document library to use:

![Configure Document Library](http://goo.gl/fxZtNq)

Advanced Settings:

![Advanced Configuration Settings](http://goo.gl/tTFMDj)

![As of 10/19/2014](http://goo.gl/SH3tt8)

Installation:
=============
This early version (as of 10/15) doesn't include any real installation process.  Follow these two steps to install it now:
1. Copy the github package into a document library in your SP site.
2. Create a web part page in a "pages" folder, slap on a CEWP and link it to ../html/CDLIndex.html
3. Create another web part page in the "pages" folder, add a CEWP and point it at: ../html/CDLAdmin.html.

Walk through the admin pages in CDLAdmin.aspx and play around with some test data.  Each section has some help associated with it so that you should get you started.  You don't need a document library (youu can use test data if you like, it's probably easier to get started that way).

The end user experience looks something like this:
![Library structure](http://goo.gl/2zNLML)

Brief History:
==============
10/15/2014: Initial repo created in github with MIT license

10/19/2014: First steps toward search.  Added category counts and a bit of a message indicating when a category has no actual documents associated with it.  Changed the "selected categories" from a simple array to an array of objects (cat name and cat count).

11/02/2014: Significant check-in.  Added the first round of major administration functionality.  Getting close to where it's really functional. 

Older Screenshots
=================
![As of 10/15/2014](http://goo.gl/QK8xFZ)
