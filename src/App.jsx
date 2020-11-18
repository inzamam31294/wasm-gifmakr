import React, { useState, useEffect } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import './App.css'

const ffmpeg = createFFmpeg({ log: true })

function App() {

const [ready, setReady] = useState(false)
const [video, setVideo] = useState()
const [gif, setGif] = useState()
const [gifLength, setGifLength] = useState()
const [startingPoint, setStartingPoint] = useState()

const load = async() => {

  await ffmpeg.load()
  setReady(true)

} 

  useEffect(() => {

    load()

  }, []);


  const convertToGif = async() => {

    const uVideo = await fetchFile(video)
    const gifTime = gifLength
    const ss = startingPoint

    ffmpeg.FS('writeFile', video.name, uVideo)

    await ffmpeg.run('-i', video.name, '-t', gifTime, '-ss', ss, '-f', 'gif', 'out.gif')

    const data = ffmpeg.FS('readFile', 'out.gif')

    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))

    setGif(url)

  }

  return ready ? (
    <div className="App">
      {video && <video controls width='250' src={URL.createObjectURL(video)} />}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <div style={{ padding: '10px' }}>
      <input type="number" onChange={(e) => setGifLength(e.target.value)} />
      <input type="number" onChange={(e) => setStartingPoint(e.target.value)} />
      </div>

      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && <img src={gif} width='250' /> }
    </div>
  ) :
  (<p>loading....</p>)
}

export default App;
