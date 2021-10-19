#!/opt/homebrew/bin/python3 -m pip3
# -*- coding: utf-8 -*-
# Skunkworks Group Ltd March 2020
# set up one complete folder for each monitor. Edit line 23 to set the monitor up.
# the script queries the system for the monitor resolutions each time it runs so changing resolutions is automatically handled.

from __future__ import division
import urllib
import sys
import os
import shutil
from PIL import Image, ImageFont
from datetime import datetime
from pytz import timezone

# user modifyable variables
time_zone = -1 # get your country centred - this is rough as it takes a set of data (values -1 to -22)
maxwidth = 1920 # your screen width
maxheight = 1200  # your screen height
dockH = 75  # your dock height <--- modify to suit
backgroundR, backgroundG, backgroundB = 0,0,0  # your desktop background colour <--- modify to suit (range 0 - 255)
trans = 255 # your desktop background transparency <--- modify to suit (range 0 - 255)
txt_columns  = int(maxwidth/10) # <-- modify to suit the width of text you want. This is in characters, not pixels. This will be affected by the font size you pick
fnt = ImageFont.truetype("./Fonts/Avenir.ttc", 12) # <-- modify to suit the font and size you want. Include the font in the Fonts folder in the application
style = 'natural' # 'natural' or 'enhanced' images are availible.
apikey = "DEMO_KEY" # Get an api key from here: https://api.nasa.gov
apikey ="vtFnldwWzZbyZDNdiVv4fJIgETyIdZzvTwIg4D3U"
# End of variables to modify

#set all variables
work_path = os.path.dirname(__file__) # get full working directory
work_path = work_path + '/' # filename = os.path.join(dirname, 'relative/path/to/file')
dstX = 0
dstY = 0
out_image = "imgfit.png"
img_default = "default.png"
img_new = "imgfull.png"

# timezone for the images
tz = timezone('EST')

time_now = datetime.now(tz)
today = time_now.strftime("%Y-%m-%d")

# url for the images
# this uses the NASA JSON api
url = "https://api.nasa.gov/EPIC/api/"+style+"/images?api_key="+apikey
import urllib.request

with urllib.request.urlopen(url) as url:
    nasa_api = url.read()

epic_data = eval(nasa_api)
epic_data = epic_data[time_zone]

date = epic_data['date']
date = date.replace("-", "/")
date = (date[0:10])
image = epic_data['image']

img_url = ("https://epic.gsfc.nasa.gov/archive/"+style+"/" + date + "/png/" + image + ".png")
# get the current image and caption
urllib.request.urlretrieve(img_url, work_path + img_new)

# get the caption
explan = (epic_data["caption"] + " " + date)

#get the image size (we could also check for FORMAT and TYPE)
srcimage = Image.open(work_path + img_new)
src_sizes = format(srcimage.size)
src_sizes = src_sizes.strip("(")
src_sizes = src_sizes.strip(")")
src_sizes = src_sizes.split(", ")

# assign the values
srcW = int(src_sizes[0])
srcH = int(src_sizes[1])
# calculate the new sizes
wdiff = (maxwidth/srcW)
hdiff = ((maxheight-dockH)/srcH)
if (wdiff < hdiff):
    newW = maxwidth
    aspect = (newW / srcW)
    newH = int(srcH * aspect)-dockH
    dstY = int((maxheight - newH)/2)
else:
    newH = maxheight-dockH
    aspect = (newH / srcH)
    newW = int(srcW * aspect)
    dstX = int((maxwidth - newW)/2)

# create base with alpha channel
new_image = Image.new('RGBA', (maxwidth, maxheight), color=(backgroundR, backgroundG, backgroundB))
new_image.save(work_path + out_image, "PNG")

# resize APOD image
resize_img = Image.open(work_path + img_new)
new_sized_img = resize_img.resize((newW, newH))
new_sized_img.save(work_path + "temp.png")
#open saved images for combining
new_image = Image.open(work_path + out_image).convert("RGBA")
new_sized_img = Image.open(work_path + "temp.png").convert("RGBA")
# combine
out_image_build = new_image.copy()
out_image_build.putalpha(trans)
out_image_build.paste(new_sized_img, (dstX, dstY))

# save the completed image
out_image_build.save(work_path + out_image)

print (explan)