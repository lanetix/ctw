require("babel-polyfill");
import API from '../lib/api'

export function handler (event, { succeed, fail }) {
  const { contents: { recordId, recordType, toStage } } = event
  const request = API(event) // Extracts JWT from event, returns authenticated request function
  const done = (e, res) => e ? fail(e) : succeed(res)

  if (event.contents.workflow !== 'fight_war') done(null, 'irrelevant workflow')

  const chance_to_win = ({
    arm: 0.25,
    fight: 0.50,
    assess_damage: 0.75,
    fight_war_complete: 1.00
  })[toStage]

  request({
    method: 'PATCH',
    path: `/v1/records/${recordType}/${recordId}`,
    body: { chance_to_win }
  }, done)
}
