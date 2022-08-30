import dayjs from 'dayjs'

function toDay(time) {
  return dayjs(time).format('YYYY-MM-DD')
}

function formatToken(token) {
// token.denom
// token.amount
  let denom = token.denom.toUpperCase()
  if (denom.charAt(0) === 'U') {
    denom = denom.substring(1)
  }
  return `${(token.amount / 1000000).toFixed()} ${denom}`
}

const handler = class DefaultHandler {
  commonProcess(res) {
    this.raw = res
    return res.result
  }

  processProposalTally(tally) {
    const result = this.commonProcess(tally)
    return result
  }

  processProposalList(proposals) {
    console.log(proposals)

    const ret = []
    this.commonProcess(proposals[0]).forEach(element => {
      const yes = Number(element.final_tally_result.yes)
      const no = Number(element.final_tally_result.no)
      const abstain = Number(element.final_tally_result.abstain)
      const veto = Number(element.final_tally_result.no_with_veto)
      //   const j = voting.indexOf(element.id)
      //   if (proposals.length > 2 && j > -1) {
      //     const update = this.commonProcess(proposals[j + 2])
      //     yes = update.yes
      //     no = update.no
      //     abstain = update.abstain
      //     veto = update.no_with_veto
      //   }

      // calculate total
      const pool = this.commonProcess(proposals[1])
      let total = yes + no + veto + abstain
      if (total < Number(pool.bonded_tokens)) total = Number(pool.bonded_tokens)

      ret.push({
        id: element.id,
        status: element.status,
        type: element.content.type,
        title: element.content.value.title,
        description: element.content.value.description,
        tally: {
          yes: ((yes / total) * 100).toFixed(2),
          no: ((no / total) * 100).toFixed(2),
          abstain: ((abstain / total) * 100).toFixed(2),
          veto: ((veto / total) * 100).toFixed(2),
          turnout: (((yes + no + abstain + veto) / total) * 100).toFixed(2),
          total,
        },
        submit_time: toDay(element.submit_time),
        voting_end_time: toDay(element.voting_end_time),
        voting_start_time: toDay(element.voting_start_time),
        total_deposit: formatToken(element.total_deposit[0]),
      })
    })
    console.log(ret)
    return ret
  }
}

export default handler
