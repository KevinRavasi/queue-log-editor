import AddMemberForm from "./AddMemberForm"
import AgentLoginForm from "./AgentLoginForm"
import AgentLogoffForm from "./AgentLogoffForm"
import CompleteAgentForm from "./CompleteAgentForm"
import CompleteCallerForm from "./CompleteCallerForm"
import ConnectForm from "./ConnectForm"
import EnterqueueForm from "./EnterqueueForm"
import PauseAllForm from "./PauseAllForm"
import RemoveMemberForm from "./RemoveMemberForm"
import UnpauseAllForm from "./UnpauseAllForm"

export function getFormFromAction(action, changeCallback) {
  switch (action) {
    case "AGENTLOGIN":
      return <AgentLoginForm onChange={changeCallback} />
    case "AGENTLOGOFF":
      return <AgentLogoffForm onChange={changeCallback} />
    case "ADDMEMBER":
      return <AddMemberForm onChange={changeCallback} />
    case "REMOVEMEMBER":
      return <RemoveMemberForm onChange={changeCallback} />
    case "PAUSEALL":
      return <PauseAllForm onChange={changeCallback} />
    case "UNPAUSEALL":
      return <UnpauseAllForm onChange={changeCallback} />
    case "ENTERQUEUE":
      return <EnterqueueForm onChange={changeCallback} />
    case "CONNECT":
      return <ConnectForm onChange={changeCallback} />
    case "COMPLETEAGENT":
      return <CompleteAgentForm onChange={changeCallback} />
    case "COMPLETECALLER":
      return <CompleteCallerForm onChange={changeCallback} />
    default:
      return "Still no form"
  }
}

export function generateQueueLogRecord(action, data, writeToQueueLog) {
  Object.keys(data).forEach((key) => {
    var value = data[key]
    localStorage.setItem(key, value)
    console.log("Saving key: ", key, " value: ", value, " to localStorage")
  })

  console.log("Generating action: ", action, " with data: ", data)

  const now = Math.floor(Date.now() / 1000)

  switch (action) {
    case "AGENTLOGIN":
      localStorage.setItem(data.agentExtension + "-agentLoginTimestamp", now)
      writeToQueueLog(
        now + "|" + randomActionId(32) + "|NONE|" + data.agentExtension + "|AGENTLOGIN|-"
      )
      break

    case "AGENTLOGOFF":
      var loginTimestamp = localStorage.getItem(data.agentExtension + "-agentLoginTimestamp")
      var loginTime = now - loginTimestamp
      writeToQueueLog(
        now +
          "|" +
          randomActionId(32) +
          "|NONE|" +
          data.agentExtension +
          "|AGENTLOGOFF|-|" +
          loginTime
      )
      break

    case "ADDMEMBER":
      writeToQueueLog(now + "|MANAGER|" + data.queue + "|" + data.agentExtension + "|ADDMEMBER|")
      break

    case "REMOVEMEMBER":
      writeToQueueLog(now + "|MANAGER|" + data.queue + "|" + data.agentExtension + "|REMOVEMEMBER|")
      break

    case "PAUSEALL":
      writeToQueueLog(
        now +
          "|NONE|NONE|" +
          data.agentExtension +
          "|PAUSEALL|" +
          "\n" +
          now +
          "|" +
          randomActionId(32) +
          "|NONE|" +
          data.agentExtension +
          "|PAUSEREASON|" +
          data.pauseCode
      )
      break

    case "UNPAUSEALL":
      writeToQueueLog(now + "|NONE|NONE|" + data.agentExtension + "|UNPAUSEALL|")
      break

    case "ENTERQUEUE":
      writeToQueueLog(
        now +
          "|" +
          data.callUniqueId +
          "|" +
          data.queue +
          "|NONE|ENTERQUEUE||" +
          data.callerId +
          "|" +
          data.position
      )
      localStorage.setItem(data.callUniqueId + "-enterqueueTimestamp", now)
      localStorage.setItem(data.callUniqueId + "-position", data.position)
      break

    case "CONNECT":
      const connectHoldTime = now - localStorage.getItem(data.callUniqueId + "-enterqueueTimestamp")
      writeToQueueLog(
        now +
          "|" +
          data.callUniqueId +
          "|" +
          data.queue +
          "|" +
          data.agentExtension +
          "|CONNECT|" +
          connectHoldTime
      )
      localStorage.setItem(data.callUniqueId + "-holdTime", connectHoldTime)
      localStorage.setItem(data.callUniqueId + "-connectTimestamp", now)
      break

    case "COMPLETEAGENT":
      const completeAgentHoldTime = localStorage.getItem(data.callUniqueId + "-holdTime")
      const completeAgentCallTime =
        now - localStorage.getItem(data.callUniqueId + "-connectTimestamp")
      const completeAgentOriginalPosition = localStorage.getItem(data.callUniqueId + "-position")

      writeToQueueLog(
        now +
          "|" +
          data.callUniqueId +
          "|" +
          data.queue +
          "|" +
          data.agentExtension +
          "|COMPLETEAGENT|" +
          completeAgentHoldTime +
          "|" +
          completeAgentCallTime +
          "|" +
          completeAgentOriginalPosition
      )

      localStorage.removeItem(data.callUniqueId + "-holdTime")
      localStorage.removeItem(data.callUniqueId + "-connectTimestamp")
      localStorage.removeItem(data.callUniqueId + "-position")
      break

    case "COMPLETECALLER":
      const completeCallerHoldTime = localStorage.getItem(data.callUniqueId + "-holdTime")
      const completeCallerCallTime =
        now - localStorage.getItem(data.callUniqueId + "-connectTimestamp")
      const completeCallerOriginalPosition = localStorage.getItem(data.callUniqueId + "-position")

      writeToQueueLog(
        now +
          "|" +
          data.callUniqueId +
          "|" +
          data.queue +
          "|" +
          data.agentExtension +
          "|COMPLETECALLER|" +
          completeCallerHoldTime +
          "|" +
          completeCallerCallTime +
          "|" +
          completeCallerOriginalPosition
      )

      localStorage.removeItem(data.callUniqueId + "-holdTime")
      localStorage.removeItem(data.callUniqueId + "-connectTimestamp")
      localStorage.removeItem(data.callUniqueId + "-position")
      break

    default:
      break
  }
}

export function generateQueueLogFile(queueLog) {
  const element = document.createElement("a")
  const file = new Blob([queueLog], {type: ""})
  element.href = URL.createObjectURL(file)
  element.download = "queue_log"
  document.body.appendChild(element)
  element.click()
}

function randomActionId(length) {
  var result = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function copyToClipboard(objectRef) {
  if (objectRef && objectRef.current) {
    objectRef.current.select()
    objectRef.current.setSelectionRange(0, 99999) /* For Mobile */
    document.execCommand("copy")
  }
}
