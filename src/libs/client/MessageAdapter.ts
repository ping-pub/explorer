import { EncodeObject } from "@cosmjs/proto-signing"
import { 
    createMsgWithdrawDelegatorReward, 
    createIBCMsgTransfer,
    createMsgSend,
    createMsgBeginRedelegate,
    createMsgDelegate,
    createMsgUndelegate,
    createMsgVote,
    // createMsgWithdrawValidatorCommission,
} from '@tharsis/proto'
import {
    MSG_WITHDRAW_DELEGATOR_REWARD_TYPES,
    MSG_BEGIN_REDELEGATE_TYPES,
    MSG_DELEGATE_TYPES,
    MSG_SEND_TYPES,
    MSG_UNDELEGATE_TYPES,
    MSG_VOTE_TYPES,
    IBC_MSG_TRANSFER_TYPES,
    MSG_WITHDRAW_VALIDATOR_COMMISSION_TYPES,
} from "@tharsis/eip712"


export interface MessageAdapter {
    toProto(message: EncodeObject): object
    getTypes: ()=> object
}

export class WithdrawMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        return createMsgWithdrawDelegatorReward(param.delegatorAddress, param.validatorAddress)
    }
    getTypes() {
        return MSG_WITHDRAW_DELEGATOR_REWARD_TYPES
    }
}

export class WithdrawCommissionMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        return createMsgWithdrawDelegatorReward(param.delegatorAddress, param.validatorAddress)
    }
    getTypes() {
        return MSG_WITHDRAW_VALIDATOR_COMMISSION_TYPES
    }
}

export class BeginRedelegateMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        return createMsgBeginRedelegate(
            param.delegatorAddress, 
            param.validatorSrcAddress, 
            param.validatorDstAddress, 
            param.amount.amount,
            param.amount.denom)
    }
    getTypes() {
        return MSG_BEGIN_REDELEGATE_TYPES
    }
}

export class DelegateMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        const amount = Array.isArray(param.amount) ? param.amount[0] : param.amount
        return createMsgDelegate(param.delegatorAddress, param.validatorAddress, amount.amount, amount.denom)
    }
    getTypes() {
        return MSG_DELEGATE_TYPES
    }
}

export class SendMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        const amount = Array.isArray(param.amount) ? param.amount[0] : param.amount
        return createMsgSend(param.fromAddress, param.toAddress, amount.amount, amount.denom)
    }
    getTypes() {
        return MSG_SEND_TYPES
    }
}

export class UndelegateMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        const amount = Array.isArray(param.amount) ? param.amount[0] : param.amount
        return createMsgUndelegate(param.delegatorAddress, param.validatorAddress, amount.amount, amount.denom)
    }
    getTypes() {
        return MSG_UNDELEGATE_TYPES
    }
}

export class VoteMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        return createMsgVote(param.proposalId, param.option, param.voter)
    }
    getTypes() {
        return MSG_VOTE_TYPES
    }
}

export class IBCMessageAdapter implements MessageAdapter {
    toProto(message: EncodeObject) {
        const param = message.value
        return createIBCMsgTransfer(
            param.sourcePort,
            param.sourceChannel,
            param.amount.amount,
            param.amount.denom,
            param.sender,
            param.receiver,
            param.revisionNumber,
            param.revisionHeight,
            param.timeoutTimestamp
        )
    }
    getTypes() {
        return IBC_MSG_TRANSFER_TYPES
    }
}


export const defaultMessageAdapter: Record<string, MessageAdapter> = {
    "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": new WithdrawMessageAdapter(),
    "/cosmos.staking.v1beta1.MsgDelegate": new DelegateMessageAdapter(),
    "/cosmos.staking.v1beta1.MsgBeginRedelegate": new BeginRedelegateMessageAdapter(),
    "/cosmos.staking.v1beta1.MsgUndelegate": new UndelegateMessageAdapter(),
    "/cosmos.bank.v1beta1.MsgSend": new SendMessageAdapter(),
    "/cosmos.gov.v1beta1.MsgVote": new VoteMessageAdapter(),
    "/ibc.applications.transfer.v1.MsgTransfer": new IBCMessageAdapter(),
    "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission": new WithdrawCommissionMessageAdapter()
}