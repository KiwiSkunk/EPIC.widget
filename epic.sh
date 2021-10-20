#!/usr/bin/env bash
export LC_ALL=C.UTF-8
set -o allexport

# ***************** VARIABLES PASSED ******************
folderName=$1 # path to your folder
maxwidth=$2  # your screen width
maxheight=$3 # your screen height
dockH=$4 # dock height in pixels
colour=$5
today=$(date -v $6H +"%Y/%m/%d") # get the date for EST in the US. Edit the -17H here for the offset from EST to your timeszone. I'm 17 hours ahead so needed to subtract -17 hours. If you don't know make it -24H and it won't break anything but you'll be late to the party!
apikey=$7
imageOut=$8
style=$9
# ***************** EXTRAS ******************

epicFull=epicFull.jpg

# change to working directory
cd "${HOME}/Library/Application Support/Übersicht/widgets$folderName" || exit

# build download link
epicURL="https://api.nasa.gov/EPIC/api/${style}?api_key=${apikey}"
#epicURL="https://api.nasa.gov/EPIC/api/natural?api_key=vtFnldwWzZbyZDNdiVv4fJIgETyIdZzvTwIg4D3U"

# download the 'json' text
curl ${epicURL} -o 'epic.json' -ks

# find the text for caption
regex2="(?:\"caption\":\")(.*?)(?:\")" # minor change to this would make this give groups - but groups aren't avalible in bash
captionsection="$(grep -oiE "${regex2}" epic.json)"
captionTrim="$(cut -d ':' -f2 <<<${captionsection})" # get everything after the first :
IFS="\"" read -ra maintext <<<${captionTrim}
caption=${maintext%????????} # remove last two characters

# find the text for date
regex3="(?:\"date\":\")(.*?)(?:\",)"
datesection="$(grep -oiE "${regex3}" epic.json)"
capture="$(cut -d ':' -f2 <<<${datesection})"
IFS="\"" read -ra date <<<${capture}
date=${date%??} # remove last two characters
date="$(sed 's/-/\//g' <<<"$date")"
date="$(sed 's/ //g' <<<"$date")"

# find the text for hdurl
regex="(?:\"image\":\")(.*?)(?:\")" 
imageurlsection="$(grep -oiE "${regex}" epic.json)" 
# so we do more to get the required part
capture="$(cut -d ':' -f2 <<<${imageurlsection})"
imageurl="$(cut -d '"' -f2 <<<${capture})"
IFS="\"" read -ra imageurl <<<${imageurl}

hdURL="https://api.nasa.gov/EPIC/archive/${style}/${date}/png/${imageurl}.png?api_key=${apikey}"

# pass data back to React
if [ ! -s epic.json ]; then
    # we could write the last ouput to disk and read it back but I don't see the point.
    output="EPIC Image++Display the image of the day on your desktop++Skunkworks Group Ltd 2021 http//:www.skunkworks.net.nz" # this is nonsense but passes something back to process
else
    # lets get the image and process it...
    curl -o ${epicFull} ${hdURL} -ks
    #get the image details and assign the values
    srcW=$(sips --getProperty pixelWidth ${epicFull} | awk '/pixelWidth/ {print $2}')
    srcH=$(sips --getProperty pixelHeight ${epicFull} | awk '/pixelHeight/ {print $2}')
    # calculate the new sizes - no integers in bash
    wdiff=$(printf "%d" "$((1000 * $maxwidth / $srcW))")
    hdiff=$(printf "%d" "$((1000 * $maxheight / $srcH))")
    newW=$maxwidth
    newH=$maxheight
    # Process fitting to screen
    if [ $wdiff -lt $hdiff ]; then
        newH=$(($srcH * $wdiff / 1000))
        newH=$(($newH - $dockH))
    else
        newW=$(($srcW * $hdiff / 1000))
        newH=$(($newH - $dockH))
    fi
    # process with sips with '&> /dev/null' to suppress warnings, errors etc
    sips -z $newH $newW ${epicFull} --out ${imageOut} &> /dev/null
    sips ${imageOut} -p $maxheight $maxwidth --padColor $colour &> /dev/null
fi
output="${caption[0]}++${date}++${folderName}${imageOut}?ver=$(date)"

echo -e "${output}"