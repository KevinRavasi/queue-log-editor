import {Button, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core"
import {Alert, AlertTitle} from "@material-ui/lab"
import React, {useCallback, useEffect, useRef, useState} from "react"
import "./App.css"
import {actions} from "./Constants"
import {
  copyToClipboard,
  generateQueueLogFile,
  generateQueueLogRecord,
  getFormFromAction,
} from "./Utils"

function App() {
  const queueLogRef = useRef()

  const [messages, setMessages] = useState([])
  const [action, setAction] = useState(actions.ADDMEMBER.verb)
  const [data, setData] = useState()
  const [queueLog, setQueueLog] = useState("")
  const [lineCounter, setLineCounter] = useState(0)
  const [messageTimeout, setMessageTimeout] = useState()

  useEffect(() => {
    if (messages.length > 0) {
      if (messageTimeout) {
        clearInterval(messageTimeout)
      }
      setMessageTimeout(
        setInterval(() => {
          setMessages([])
        }, 2000)
      )
    }
  }, [messages])

  const changeCallback = useCallback(
    (newData) => {
      setData(newData)
    },
    [setData]
  )

  const writeToQueueLog = (line) => {
    setQueueLog(queueLog + "\n" + line)
    setLineCounter(lineCounter + 1)
  }

  const renderedMessages = messages.map((m) => {
    return (
      <Alert severity={m.severity} className="Alert">
        <AlertTitle>{m.title}</AlertTitle>
        {m.text}
      </Alert>
    )
  })

  return (
    <div className="appContainer">
      {renderedMessages}
      <h1>Queue Log Editor</h1>
      <FormControl variant="outlined" className="formControl">
        <InputLabel id="demo-simple-select-outlined-label">Action</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={action}
          onChange={(e) => {
            setAction(e.target.value)
          }}
          label="Action">
          {Object.keys(actions).map((action) => (
            <MenuItem value={actions[action].verb}>{actions[action].verb}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {getFormFromAction(action, changeCallback)}
      <Button
        variant="contained"
        color="primary"
        onClick={() => generateQueueLogRecord(action, data, writeToQueueLog)}>
        Generate
      </Button>
      <Button variant="contained" color="primary" onClick={() => generateQueueLogFile(queueLog)}>
        Download
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setMessages([
            {
              severity: "success",
              title: "Copied to Clipboard!",
              text: "The queue_log file has been copied to your Clipboard.",
            },
          ])
          copyToClipboard(queueLogRef)
        }}>
        Copy to Clipboard
      </Button>
      <Button variant="contained" color="primary" onClick={() => setQueueLog("")}>
        Clear
      </Button>
      <textarea
        ref={queueLogRef}
        rows={lineCounter >= 10 ? lineCounter + 1 : 10}
        cols="112"
        value={queueLog}
        onChange={(e) => setQueueLog(e.target.value)}
      />
    </div>
  )
}

export default App
