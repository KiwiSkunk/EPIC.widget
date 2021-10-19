import { React } from 'uebersicht';

// ***************** OPTIONS ******************
export const folder = "/APOD/"
export const durationMs = 60 * 60 * 1000 // duration with milliseconds
export const width = 2560 // your screen width
export const height = 1440 // your screen height
export const dock = 90 // height of your dock - so the caption will clear it
export const colour = "000000" // background colour
export const captionWidth = Math.floor(width * .7)
export const margin = Math.floor((width - captionWidth) / 2) - 20
export const ESToffset = -18 // get the hours offset for EST in the US.
export const apiKey = "vtFnldwWzZbyZDNdiVv4fJIgETyIdZzvTwIg4D3U" // get your api key at api.nasa.govt
export const imageOut = "imgfit.jpg"
// **************END OPTIONS ******************
export const refreshFrequency = durationMs;
export const initialState = { output: "\nLoading\n\nCopyright: Skunkworks\n2021\nwww.skunkworks.net.nz\n" };
export const num = Math.floor(Math.random() * 10000); // force update of image
export const stamp = Date() // force image refresh

export const className = `
  .background {
    position: absolute;
    top: 0px;
    left: 0px;
    width: ${width}px;
    height: ${height}px;
    z-index: 0;
  }
  .caption {
    position: absolute;
    bottom: ${dock}px;
    width: ${captionWidth}px;
    left: ${margin}px;
    right: ${margin}px;
    font-color: #ffffff;
    font-family: Helvetica;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    padding: 20px;
    color: #fff;
    background: rgba(000, 000, 000, 0.5);
    border-radius: 5px;
    z-index: 1;
  }
  a:link, a:visited {
    color: #fff;
    text-decoration: none;
  }
  .videoBox {
    position: absolute;
    margin-left: ${margin}px;
    width: ${captionWidth}px;
    height: ${videoHeight}px;
  }
`

// call the shell script that does the work
export const command = "bash ${HOME}/Library/Application\\ Support/Übersicht/widgets"+folder+"epic.sh "+folder+" "+width+" "+height+" "+dock+" "+colour+" "+ESToffset+" "+apiKey+" "+imageOut

export const render = ({ output }, refreshFrequency ) => {
  console.log(output);
  const commandValues = output.split("++");
  const imageCaption = commandValues[0];
  const date = commandValues[1];
  const image = commandValues[];

  return (
    <div className='background'>
      <div className="videoBox" >
        <iframe width="100%" height="100%" src={videourl} frameBorder="0" ></iframe>
      </div>
      <img src={image} />
      <div className='caption'>{imageCaption}<br /> {date}</div>
    </div>
  );
};