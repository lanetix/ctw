require("babel-polyfill");
import API from '../lib/api'

export function handler (event, { succeed, fail }) {
  const { lxMessage: { message: { contents: { recordId, recordType, toStage, workflow } } } } = event
  const request = API(event) // Extracts JWT from event, returns authenticated request function
  const done = (e, res) => e ? fail(e) : succeed(res)

  console.log(`event: ${JSON.stringify(event, null, 2)}`)

  if (workflow.name !== 'sure_start') done(null, 'irrelevant workflow')

  const chance_to_win = ({
    'prospect': 0,
    'qualified': 25,
    'proposed': 50,
    'contract': 75,
    'go-live': 100,
    'stabilization': 0
  })[toStage]

  request({
    method: 'PATCH',
    path: `/v1/records/${recordType}/${recordId}`,
    body: { chance_to_win }
  }, done)
}
