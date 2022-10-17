import compareVersions from 'compare-versions'
import ProposalTally from './proposal-tally'

export default class Proposal {
  constructor() {
    this.element = null

    this.id = 0
    this.status = 1
    this.type = '-'
    this.title = '-'
    this.description = '-'
    this.tally = new ProposalTally()
    this.submit_time = '0000-00-00'
    this.voting_end_time = '0000-00-00'
    this.voting_start_time = '0000-00-00'
    this.total_deposit = '-'
    this.contents = null
  }

  init(element, total) {
    this.element = element

    this.id = element.proposal_id || element.id
    this.status = element.status
    this.tally = new ProposalTally().init(element.final_tally_result, total)
    this.submit_time = element.submit_time
    this.voting_end_time = element.voting_end_time
    this.voting_start_time = element.voting_start_time
    // eslint-disable-next-line prefer-destructuring
    this.total_deposit = element.total_deposit[0]
    this.contents = element.content.value || element.content
    if (this.contents) {
      this.title = this.contents.title
      this.description = this.contents.description
      this.type = element.content.type
      if (element.content['@type']) {
        this.type = element.content['@type']
      }
    }
    return this
  }

  hello() {
    return this.title
  }

  updateTally(newTally) {
    this.tally = newTally
  }

  versionFixed(ver) {
    if (compareVersions(ver, '0.46') >= 0) {
      if (this.element.metadata) {
        this.title = this.element.metadata.title || this.element.metadata
        this.description = this.element.metadata.description || this.element.metadata
      }
    } else if (compareVersions(ver, '0.30') >= 0) {
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
          // this.status = 1
      }
    }
    if (String(this.status).indexOf('PASSED') > -1) {
      this.status = 3
    } else if (String(this.status).indexOf('VOTING') > -1) {
      this.status = 2
    } else if (String(this.status).indexOf('REJECTED') > -1) {
      this.status = 4
    } else if (String(this.status).indexOf('DEPOSIT') > -1) {
      this.status = 1
    }
  }
}
