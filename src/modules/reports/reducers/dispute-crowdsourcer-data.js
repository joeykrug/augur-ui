import {
  UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  UPDATE_DISPUTE_CROWDSOURCERS_BALANCE
} from "modules/reports/actions/dispute-crowdsourcer-tokens-management";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(disputeCrowdsourcersData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_DISPUTE_CROWDSOURCERS_DATA: {
      const updatedDisputeCrowdsourcers = Object.keys(
        action.disputeCrowdsourcersData
      ).reduce((p, disputeCrowdsourcerID) => {
        p[disputeCrowdsourcerID] = {
          ...disputeCrowdsourcersData[disputeCrowdsourcerID],
          ...action.disputeCrowdsourcersData[disputeCrowdsourcerID]
        };
        return p;
      }, {});

      return {
        ...disputeCrowdsourcersData,
        ...updatedDisputeCrowdsourcers
      };
    }
    case UPDATE_DISPUTE_CROWDSOURCERS_BALANCE: {
      if (!action.disputeCrowdsourcerID) return disputeCrowdsourcersData;
      return {
        ...disputeCrowdsourcersData,
        [action.disputeCrowdsourcerID]: {
          ...disputeCrowdsourcersData[action.disputeCrowdsourcerID],
          balance: action.balance
        }
      };
    }
    case RESET_STATE:
    default:
      return disputeCrowdsourcersData;
  }
}
