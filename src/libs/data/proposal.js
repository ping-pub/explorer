import compareVersions from 'compare-versions'
import { toDay, formatToken, percent } from './data'

export default class Proposal {
  constructor(element, total) {
    this.element = element
    const yes = Number(element.final_tally_result.yes)
    const no = Number(element.final_tally_result.no)
    const abstain = Number(element.final_tally_result.abstain)
    const veto = Number(element.final_tally_result.no_with_veto)

    this.id = element.id
    this.status = element.status
    this.type = element.content.type
    this.title = element.content.value.title
    this.description = element.content.value.description
    this.tally = {
      yes: percent(yes / total),
      no: percent(no / total),
      abstain: percent(abstain / total),
      veto: percent(veto / total),
      turnout: percent((yes + no + abstain + veto) / total),
      total,
    }
    this.submit_time = toDay(element.submit_time)
    this.voting_end_time = toDay(element.voting_end_time)
    this.voting_start_time = toDay(element.voting_start_time)
    this.total_deposit = formatToken(element.total_deposit[0])
  }

  updateTally(newTally) {
    this.tally = newTally
  }

  versionFixed(ver) {
    console.log(ver, compareVersions(ver, '0.4'))
    if (compareVersions(ver, '0.40') >= 0) {
      // do nothing
    } else if (compareVersions(ver, '0.37') >= 0) {
      switch (this.element.proposal_status) {
        case 'Passed':
          this.status = 3
          break
        case 'VotingPeriod':
          this.status = 2
          break
        case 'Rejected':
          this.status = 4
          break
        default:
          this.status = 1
      }
      console.log(this)
    }
  }
}
