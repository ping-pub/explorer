// Bank
export function MsgSend(
  senderAddress,
  {
    toAddress,
    amounts // [{ denom, amount}]
  }
) {
  return {
    type: `cosmos-sdk/MsgSend`,
    value: {
      amount: amounts,
      from_address: senderAddress,
      to_address: toAddress
    }
  };
}

// Staking
export function MsgDelegate(
  senderAddress,
  { validatorAddress, amount, denom }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgDelegate`,
    value: {
      amount: [{ amount, denom }],
      delegator_address: senderAddress,
      validator_address: validatorAddress
    }
  };
}

export function MsgUndelegate(
  senderAddress,
  { validatorAddress, amount, denom }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgUndelegate`,
    value: {
      amount: Coin({ amount, denom }),
      delegator_address: senderAddress,
      validator_address: validatorAddress
    }
  };
}

export function MsgRedelegate(
  senderAddress,
  { validatorSourceAddress, validatorDestinationAddress, amount, denom }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgBeginRedelegate`,
    value: {
      amount: Coin({ amount, denom }),
      delegator_address: senderAddress,
      validator_dst_address: validatorDestinationAddress,
      validator_src_address: validatorSourceAddress
    }
  };
}

// Governance
export function MsgSubmitProposal(
  senderAddress,
  {
    title,
    description,
    initialDeposits // [{ denom, amount }]
  }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgSubmitProposal`,
    value: {
      content: {
        type: "cosmos-sdk/TextProposal",
        value: {
          description,
          title
        }
      },
      initial_deposit: initialDeposits.map(Coin),
      proposer: senderAddress
    }
  };
}

export function MsgVote(senderAddress, { proposalId, option }) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgVote`,
    value: {
      option,
      proposal_id: proposalId,
      voter: senderAddress
    }
  };
}

export function MsgDeposit(
  senderAddress,
  {
    proposalId,
    amounts // [{ denom, amount }]
  }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgDeposit`,
    value: {
      amount: amounts.map(Coin),
      depositor: senderAddress,
      proposal_id: proposalId
    }
  };
}

export function MsgWithdrawDelegationReward(
  senderAddress,
  { validatorAddress }
) {
  /* istanbul ignore next */
  return {
    type: `cosmos-sdk/MsgWithdrawDelegationReward`,
    value: {
      delegator_address: senderAddress,
      validator_address: validatorAddress
    }
  };
}

function Coin({ amount, denom }) {
  return {
    amount: String(amount),
    denom
  };
}
