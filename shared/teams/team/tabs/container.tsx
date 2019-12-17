import * as Constants from '../../../constants/teams'
import * as Types from '../../../constants/types/teams'
import Tabs from '.'
import * as Container from '../../../util/container'
import {anyWaiting} from '../../../constants/waiting'

type OwnProps = {
  teamID: Types.TeamID
  selectedTab: string
  setSelectedTab: (tab: Types.TabKey) => void
}

export default Container.connect(
  (state, {teamID, selectedTab, setSelectedTab}: OwnProps) => {
    const teamDetails = Constants.getTeamDetails(state, teamID)
    const yourOperations = Constants.getCanPerformByID(state, teamID)
    const _bots = [...(teamDetails.members?.values() ?? [])].filter(
      m => m.type === 'restrictedbot' || m.type === 'bot'
    )
    const _memberCount = teamDetails.memberCount - _bots.length
    return {
      admin: yourOperations.manageMembers,
      botCount: _bots.length,
      loading: anyWaiting(
        state,
        Constants.teamWaitingKey(teamDetails.teamname),
        Constants.teamTarsWaitingKey(teamDetails.teamname)
      ),
      memberCount: _memberCount,
      newTeamRequests: state.teams.newTeamRequests,
      numInvites: teamDetails.invites?.size ?? 0,
      numRequests: teamDetails.requests?.size ?? 0,
      numSubteams: teamDetails.subteams?.size ?? 0,
      resetUserCount: Constants.getTeamResetUsers(state, teamDetails.teamname).size,
      selectedTab,
      setSelectedTab,
      showSubteams: yourOperations.manageSubteams,
      teamname: teamDetails.teamname,
    }
  },
  () => ({}),
  (stateProps, _, ownProps) => {
    return {
      admin: stateProps.admin,
      botCount: stateProps.botCount,
      loading: stateProps.loading,
      memberCount: stateProps.memberCount,
      newRequests: stateProps.newTeamRequests.get(ownProps.teamID) || 0,
      numInvites: stateProps.numInvites,
      numRequests: stateProps.numRequests,
      numSubteams: stateProps.numSubteams,
      resetUserCount: stateProps.resetUserCount,
      selectedTab: stateProps.selectedTab,
      setSelectedTab: stateProps.setSelectedTab,
      showSubteams: stateProps.showSubteams,
    }
  }
)(Tabs)
