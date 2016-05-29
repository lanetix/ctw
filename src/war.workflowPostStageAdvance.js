require("babel-polyfill");
import API from '../lib/api'

// {
//     "id": "16483",
//     "organizationId": 2731114,
//     "userId": 2731180,
//     "subject": "workflowPostStageAdvance",
//     "payload": {
//         "record": {
//             "id": 12737030,
//             "apiName": "project"
//         },
//         "workflow": {
//             "apiName": "sure_start"
//         },
//         "fromStage": "qualified",
//         "toStage": "proposed"
//     },
//     "jwt": "blah"
// }

export function handler (event, { succeed, fail }) {
  console.log(`event: ${JSON.stringify(event, null, 2)}`)

  const recordId = event.payload.record.id
  const recordType = event.payload.record.apiName
  const workflowName = event.payload.workflow.apiName

  const { payload: { fromStage, toStage } } = event
  const request = API(event) // Extracts JWT from event, returns authenticated request function
  const done = (e, res) => e ? fail(e) : succeed(res)

  if (workflowName !== 'sure_start') done(null, 'irrelevant workflow')

  const chance_to_win = ({
    'prospect': 0,
    'qualified': 25,
    'proposed': 50,
    'contract': 75,
    'go_live': 100,
    'stabilization': 0
  })[toStage]

  console.log(`chance_to_win: ${chance_to_win}`)

  request({
    method: 'PATCH',
    path: `/v1/records/${recordType}/${recordId}`,
    body: { chance_to_win }
  }, function (err, res) {
    console.log(`err: ${err}, res: ${res}`)
    done()
  })
}
