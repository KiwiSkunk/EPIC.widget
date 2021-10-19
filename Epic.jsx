import { React, run, css} from 'uebersicht'

// ***************** OPTION ******************
export const durationMs = 3600 * 1000 // duration with miliseconds
export const width = 1920
export const height = 1200
export const colour = 888
export const captionWidth = 800
export const margin = Math.floor((width - captionWidth) / 2)
export const dock = 90
export const folderName = 'epic-view.widget' // name of the folder this is in (path = ~/Library/Application Support/Übersicht/widgets/"folderName"/)
// ***************** OPTION ******************

export const num = Math.floor(Math.random() * 10); // force update of image
export const download = `export LANG=en_NZ.UTF-8; '/opt/homebrew/bin/python3' '` + folderName + `/epic.py'`
export const initialState = {
  output: null
}
export const refreshFrequency = durationMs;
export const command = download;
export const className = `
  .background {
    top: 0px;
    left: 0px;
    width: ${width}px;
    height: ${height}px;
    color: #${colour};
    z-index: -1;
    background: url(/epic-view.widget/imgfit.png?ver=${num});
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
    background: rgba(125, 125, 125, 0.4);
    border-radius: 5px;
  }
`
export const render = ({output, error}) => {
  return error ? (
    <div>Something went wrong: <strong>{String(error)}</strong></div>
    ) : (
    <div class='background'>
    <div class='caption'>{output}</div>
    </div>
    );
};