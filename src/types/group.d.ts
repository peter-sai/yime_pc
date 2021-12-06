// Aoelailiao.Login.UserGetFriendsAndGroupsListReq
export interface IGroupListItem {
  groupIcon: string;
  groupId: number;
  groupName: string;
  groupState: number;
  qrCode: string;
  root: boolean;
  admin: boolean;
  groupAttachInfo: {
    allowEveryoneJoin: number;
    allowMemberGetHisotyMsg: number;
    allowMemberInviteJoin: number;
    groupMemberSplit: number;
  };
  groupNoticeInfo: {
    editorUid: number;
  };
  groupMemberLists: {
    adminUidList: number[];
    botUidList: number[];
    memberUserInfos: {
      memberUid: number; //群成员uid
      joinType: number; //入群方式,1--邀请入群
      inviteUid: number; //入群邀请人
      remarkName: number; //我在群里面的备注名称
    };
    rootUid: number;
  };
}
