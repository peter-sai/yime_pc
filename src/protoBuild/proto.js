/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  Aoelailiao: {
    nested: {
      Bot: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          BotMsgInfo: {
            fields: {
              botId: {
                type: "uint32",
                id: 1
              },
              userId: {
                type: "uint32",
                id: 2
              },
              content: {
                type: "string",
                id: 3
              },
              type: {
                type: "uint32",
                id: 4
              },
              isGroupMsg: {
                type: "uint32",
                id: 5
              },
              language: {
                type: "uint32",
                id: 6
              }
            }
          }
        }
      },
      Common: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          CommonAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ThirdUserInfo: {
            fields: {
              nickname: {
                type: "string",
                id: 1
              },
              icon: {
                type: "string",
                id: 2
              }
            }
          },
          UserAttachInfo: {
            fields: {
              remarkName: {
                type: "string",
                id: 1
              },
              destoryReaded: {
                type: "uint32",
                id: 2
              },
              msgTop: {
                type: "uint32",
                id: 3
              },
              msgMute: {
                type: "uint32",
                id: 4
              },
              msgScreenShotNotify: {
                type: "uint32",
                id: 5
              },
              msgAtNotify: {
                type: "uint32",
                id: 6,
                options: {
                  "default": 1
                }
              }
            }
          },
          UserInfo: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              nickname: {
                type: "string",
                id: 2
              },
              icon: {
                type: "string",
                id: 3
              },
              userAttachInfo: {
                type: "UserAttachInfo",
                id: 4
              },
              onlineState: {
                type: "uint32",
                id: 5
              },
              imAccount: {
                type: "string",
                id: 6
              },
              lastOnlineTime: {
                type: "uint32",
                id: 7
              },
              isBotUser: {
                type: "uint32",
                id: 8
              }
            }
          },
          UserDetailInfo: {
            fields: {
              userInfo: {
                type: "UserInfo",
                id: 1
              },
              isFriend: {
                type: "uint32",
                id: 2
              },
              friendQueryType: {
                type: "uint32",
                id: 3
              },
              phone: {
                type: "string",
                id: 4
              },
              qrCode: {
                type: "string",
                id: 5
              },
              isRealnameAuth: {
                type: "uint32",
                id: 6
              },
              isInMyBlacklist: {
                type: "uint32",
                id: 7
              },
              isSetPassword: {
                type: "uint32",
                id: 8
              },
              userSex: {
                type: "uint32",
                id: 9
              },
              cityCode: {
                type: "string",
                id: 10
              },
              userSign: {
                type: "string",
                id: 11
              },
              labelLists: {
                rule: "repeated",
                type: "LabelInfo",
                id: 12
              },
              findMeGroup: {
                type: "uint32",
                id: 13
              },
              source: {
                type: "string",
                id: 14
              },
              sourceId: {
                type: "uint32",
                id: 15
              },
              sourceType: {
                type: "uint32",
                id: 16
              }
            }
          },
          UserBlackListInfo: {
            fields: {
              blacklistUidLists: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              }
            }
          },
          GroupNoticeInfo: {
            fields: {
              groupNoticeContent: {
                type: "string",
                id: 1
              },
              updateTime: {
                type: "uint32",
                id: 2
              },
              editorUid: {
                type: "uint32",
                id: 3
              },
              noticeId: {
                type: "uint64",
                id: 4
              }
            }
          },
          GroupMemberUserInfo: {
            fields: {
              memberUid: {
                type: "uint32",
                id: 1
              },
              joinType: {
                type: "uint32",
                id: 2
              },
              inviteUid: {
                type: "uint32",
                id: 3
              },
              remarkName: {
                type: "string",
                id: 4
              }
            }
          },
          GroupMemberListInfo: {
            fields: {
              rootUid: {
                type: "uint32",
                id: 1
              },
              adminUidList: {
                rule: "repeated",
                type: "uint32",
                id: 2,
                options: {
                  packed: false
                }
              },
              memberUserInfos: {
                rule: "repeated",
                type: "GroupMemberUserInfo",
                id: 3
              },
              botUidList: {
                rule: "repeated",
                type: "uint32",
                id: 4,
                options: {
                  packed: false
                }
              }
            }
          },
          GroupAttachInfo: {
            fields: {
              groupTop: {
                type: "uint32",
                id: 1
              },
              groupMsgMute: {
                type: "uint32",
                id: 2
              },
              groupSaveInGrouplist: {
                type: "uint32",
                id: 3
              },
              groupDestoryReaded: {
                type: "uint32",
                id: 4
              },
              groupScreenShotNotify: {
                type: "uint32",
                id: 5
              },
              groupJoinAuthType: {
                type: "uint32",
                id: 6
              },
              groupMemberSplit: {
                type: "uint32",
                id: 7
              },
              groupMsgGag: {
                type: "uint32",
                id: 8
              },
              groupUnableEditNickname: {
                type: "uint32",
                id: 9
              },
              groupRemarkName: {
                type: "string",
                id: 10
              },
              groupMsgClean: {
                type: "uint32",
                id: 11
              },
              allowMemberGetHisotyMsg: {
                type: "uint32",
                id: 12
              },
              allowEveryoneJoin: {
                type: "uint32",
                id: 13,
                options: {
                  "default": 1
                }
              },
              allowMemberInviteJoin: {
                type: "uint32",
                id: 14,
                options: {
                  "default": 1
                }
              },
              groupInviteState: {
                type: "uint32",
                id: 15
              },
              groupMsgAtNotify: {
                type: "uint32",
                id: 16,
                options: {
                  "default": 1
                }
              }
            }
          },
          GroupInfo: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              groupName: {
                type: "string",
                id: 2
              },
              groupIcon: {
                type: "string",
                id: 3
              },
              groupMemberLists: {
                type: "GroupMemberListInfo",
                id: 5
              },
              groupAttachInfo: {
                type: "GroupAttachInfo",
                id: 6
              },
              qrCode: {
                type: "string",
                id: 7
              },
              groupNoticeInfo: {
                type: "GroupNoticeInfo",
                id: 8
              },
              groupState: {
                type: "uint32",
                id: 9
              },
              isEncrypt: {
                type: "uint32",
                id: 11
              }
            }
          },
          PhoneContactUserInfo: {
            fields: {
              contactName: {
                type: "string",
                id: 1
              },
              contactPhone: {
                type: "string",
                id: 2
              },
              contactUserInfo: {
                type: "UserDetailInfo",
                id: 3
              },
              cannotChat: {
                type: "uint32",
                id: 4
              }
            }
          },
          SwitchSettingInfo: {
            fields: {
              pushSound: {
                type: "uint32",
                id: 1
              },
              pushShake: {
                type: "uint32",
                id: 2
              },
              newMessage: {
                type: "uint32",
                id: 3
              },
              videoCall: {
                type: "uint32",
                id: 4
              },
              pokeSound: {
                type: "uint32",
                id: 5
              },
              pokeShake: {
                type: "uint32",
                id: 6
              },
              findMePhone: {
                type: "uint32",
                id: 11
              },
              findMeImAccount: {
                type: "uint32",
                id: 12
              },
              findMeNickname: {
                type: "uint32",
                id: 13
              },
              findMeGroup: {
                type: "uint32",
                id: 14
              },
              findMeRecommend: {
                type: "uint32",
                id: 15
              },
              recommendContactsUser: {
                type: "uint32",
                id: 16
              },
              readMessageState: {
                type: "uint32",
                id: 17
              },
              findMeShareLink: {
                type: "uint32",
                id: 18
              },
              whoCanInviteMeGroup: {
                type: "uint32",
                id: 19
              },
              refuseStrangerMessage: {
                type: "uint32",
                id: 20
              },
              whoCanSeeMyPhone: {
                type: "uint32",
                id: 21
              }
            }
          },
          FileInfo: {
            fields: {
              fileUrl: {
                type: "string",
                id: 1
              },
              fileName: {
                type: "string",
                id: 2
              },
              fileSize: {
                type: "uint64",
                id: 3
              }
            }
          },
          UserWriteState: {
            fields: {
              fromId: {
                type: "uint32",
                id: 1
              },
              toId: {
                type: "uint32",
                id: 2
              },
              type: {
                type: "uint32",
                id: 3
              },
              writeState: {
                type: "uint32",
                id: 4
              }
            }
          },
          GroupCallState: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              callState: {
                type: "uint32",
                id: 2
              },
              userId: {
                rule: "repeated",
                type: "uint32",
                id: 3,
                options: {
                  packed: false
                }
              }
            }
          },
          LabelInfo: {
            fields: {
              labelId: {
                type: "uint32",
                id: 1
              },
              labelContent: {
                type: "string",
                id: 2
              }
            }
          },
          LabelUserInfo: {
            fields: {
              labelInfo: {
                type: "LabelInfo",
                id: 1
              },
              userId: {
                rule: "repeated",
                type: "uint32",
                id: 2,
                options: {
                  packed: false
                }
              }
            }
          }
        }
      },
      InnerServer: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          FriendInfo: {
            fields: {
              friendUid: {
                type: "uint32",
                id: 1
              },
              friendQueryType: {
                type: "uint32",
                id: 2
              },
              friendAttachInfo: {
                type: "Aoelailiao.Common.UserAttachInfo",
                id: 3
              }
            }
          },
          FriendInfoLists: {
            fields: {
              friendInfoLists: {
                rule: "repeated",
                type: "FriendInfo",
                id: 1
              }
            }
          },
          UserGroupInfo: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              groupAttachInfo: {
                type: "Aoelailiao.Common.GroupAttachInfo",
                id: 2
              },
              receiveGmsgid: {
                type: "uint32",
                id: 3
              }
            }
          },
          UserGroupInfoLists: {
            fields: {
              userGroupInfoLists: {
                rule: "repeated",
                type: "UserGroupInfo",
                id: 1
              }
            }
          },
          UserConversationLists: {
            fields: {
              userConversationInfos: {
                rule: "repeated",
                type: "UserConversationInfo",
                id: 1
              }
            }
          },
          UserConversationInfo: {
            fields: {
              relationId: {
                type: "uint64",
                id: 1
              },
              isEncrypt: {
                type: "uint32",
                id: 2
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              objectId: {
                type: "uint32",
                id: 4
              },
              groupMsgidMin: {
                type: "uint32",
                id: 5
              },
              receivedMsgId: {
                type: "uint64",
                id: 6
              },
              readedMsgId: {
                type: "uint64",
                id: 7
              }
            }
          },
          ConversationGlobleReadedStateInfo: {
            fields: {
              relationId: {
                type: "uint64",
                id: 1
              },
              isEncrypt: {
                type: "uint32",
                id: 2
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              fromId: {
                type: "uint32",
                id: 4
              },
              toId: {
                type: "uint32",
                id: 5
              },
              readedMsgId: {
                type: "uint64",
                id: 6
              }
            }
          },
          UserUnReceivedMsgIdListInfo: {
            fields: {
              unreceivedMsgIds: {
                rule: "repeated",
                type: "uint64",
                id: 1,
                options: {
                  packed: false
                }
              }
            }
          },
          PushMessage: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              pushToken: {
                type: "string",
                id: 2
              },
              pushMsg: {
                type: "string",
                id: 3
              },
              pushMsgBadge: {
                type: "uint32",
                id: 4
              },
              useSandbox: {
                type: "uint32",
                id: 5
              },
              allowSound: {
                type: "uint32",
                id: 6
              },
              pushSdk: {
                type: "uint32",
                id: 7
              }
            }
          },
          FileUploadTokenInfo: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              token: {
                type: "string",
                id: 3
              }
            }
          },
          ThirdPlatformUserInfo: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              nickName: {
                type: "string",
                id: 3
              },
              avatarUrl: {
                type: "string",
                id: 4
              }
            }
          },
          UserInfoInRedis: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              nickName: {
                type: "string",
                id: 2
              },
              icon: {
                type: "string",
                id: 3
              },
              sex: {
                type: "uint32",
                id: 4
              },
              phone: {
                type: "string",
                id: 5
              },
              userSign: {
                type: "string",
                id: 6
              },
              imAccount: {
                type: "string",
                id: 7
              }
            }
          },
          GroupInfoInRedis: {
            fields: {
              ownerUid: {
                type: "uint32",
                id: 1
              },
              icon: {
                type: "string",
                id: 2
              },
              name: {
                type: "string",
                id: 3
              }
            }
          },
          UpdateUserSex: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              sex: {
                type: "uint32",
                id: 2
              }
            }
          },
          OperateGroupApplyUidList: {
            fields: {
              uid: {
                rule: "repeated",
                type: "string",
                id: 1
              }
            }
          },
          RouteDataInfo: {
            fields: {
              cid: {
                type: "uint32",
                id: 1
              },
              clientVersion: {
                type: "uint32",
                id: 2
              },
              clientType: {
                type: "uint32",
                id: 3
              },
              uid: {
                type: "uint32",
                id: 4
              },
              reserved: {
                type: "uint32",
                id: 5
              },
              connUuid: {
                type: "string",
                id: 6
              },
              excludeConn: {
                type: "string",
                id: 7
              },
              sessionId: {
                type: "uint64",
                id: 8
              },
              loggerId: {
                type: "string",
                id: 9
              },
              data: {
                type: "bytes",
                id: 10
              }
            }
          },
          RouteDataInfo_Backup: {
            fields: {
              cid: {
                type: "uint32",
                id: 1
              },
              recvUid: {
                type: "uint32",
                id: 2
              },
              format: {
                type: "uint32",
                id: 3
              },
              routeBinData: {
                type: "bytes",
                id: 4
              },
              routeJsonData: {
                type: "string",
                id: 5
              },
              connUuid: {
                type: "string",
                id: 6
              },
              requestUid: {
                type: "uint32",
                id: 7
              },
              sessionId: {
                type: "uint64",
                id: 8
              },
              serviceId: {
                type: "uint32",
                id: 9
              },
              loggerId: {
                type: "string",
                id: 10
              }
            }
          },
          SMSNotifyInfo: {
            fields: {
              phone: {
                type: "string",
                id: 1
              },
              code: {
                type: "string",
                id: 2
              },
              type: {
                type: "uint32",
                id: 3
              }
            }
          },
          SyncGroupOperateInfo: {
            fields: {
              groupId: {
                type: "string",
                id: 1
              },
              groupName: {
                type: "string",
                id: 2
              },
              memberIds: {
                rule: "repeated",
                type: "string",
                id: 3
              },
              operationId: {
                type: "string",
                id: 4
              },
              type: {
                type: "uint32",
                id: 5
              }
            }
          },
          GroupVideoCallEndNotify: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              channelId: {
                type: "string",
                id: 2
              },
              endTime: {
                type: "uint32",
                id: 3
              }
            }
          },
          GroupVideoCallStateNotify: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              channelId: {
                type: "string",
                id: 2
              },
              endTime: {
                type: "uint32",
                id: 3
              },
              memberUids: {
                rule: "repeated",
                type: "uint32",
                id: 4,
                options: {
                  packed: false
                }
              }
            }
          },
          UserLoginInfo: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              loginType: {
                type: "uint32",
                id: 2
              },
              isAutoLogin: {
                type: "uint32",
                id: 3
              },
              loginTime: {
                type: "uint32",
                id: 4
              },
              privateIp: {
                type: "string",
                id: 5
              },
              publicIp: {
                type: "string",
                id: 6
              },
              deviceUuid: {
                type: "string",
                id: 7
              },
              distributionChannel: {
                type: "string",
                id: 8
              }
            }
          },
          UserMessageStateInfo: {
            fields: {
              uid: {
                type: "uint64",
                id: 1
              },
              msgId: {
                type: "uint64",
                id: 2
              }
            }
          },
          GroupMsgReq: {
            fields: {
              appId: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              groupId: {
                type: "uint32",
                id: 2
              },
              pushType: {
                type: "uint32",
                id: 3
              },
              userId: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          PullGroupReq: {
            fields: {
              comId: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          PullGroupAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              group: {
                rule: "repeated",
                type: "PullGroup",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          PullGroup: {
            fields: {
              appId: {
                type: "uint32",
                id: 1
              },
              groupId: {
                type: "uint32",
                id: 2
              },
              userId: {
                rule: "repeated",
                type: "uint32",
                id: 3,
                options: {
                  packed: false
                }
              }
            }
          },
          UserContactUserInfo: {
            fields: {
              contactName: {
                type: "string",
                id: 1
              },
              contactPhone: {
                type: "string",
                id: 2
              },
              contactPhoneFixed: {
                type: "string",
                id: 3
              }
            }
          },
          UserContactUserInfoList: {
            fields: {
              userContactUserInfos: {
                rule: "repeated",
                type: "UserContactUserInfo",
                id: 1
              }
            }
          },
          UserReloginSuccessNotify: {
            fields: {
              userId: {
                type: "uint32",
                id: 1
              },
              equipmentInformation: {
                type: "Aoelailiao.Login.EquipmentInformation",
                id: 27
              }
            }
          }
        }
      },
      Login: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          UserPlatformInfo: {
            fields: {
              loginType: {
                type: "uint32",
                id: 1
              },
              loginId: {
                type: "string",
                id: 2
              },
              loginPasswdToken: {
                type: "string",
                id: 3
              },
              wxUnionId: {
                type: "string",
                id: 4
              },
              thirdUserInfo: {
                type: "Aoelailiao.Common.ThirdUserInfo",
                id: 5
              }
            }
          },
          EquipmentInformation: {
            fields: {
              deviceUuid: {
                type: "string",
                id: 1
              },
              deviceBrand: {
                type: "string",
                id: 2
              },
              deviceModel: {
                type: "string",
                id: 3
              },
              deviceOsVersion: {
                type: "string",
                id: 4
              },
              releaseVersion: {
                type: "string",
                id: 5
              },
              devicePrivateIp: {
                type: "string",
                id: 6
              },
              devicePublicIp: {
                type: "string",
                id: 7
              },
              distributionChannelId: {
                type: "string",
                id: 8
              }
            }
          },
          GetAuthCodeReq: {
            fields: {
              phone: {
                type: "string",
                id: 1
              },
              type: {
                type: "uint32",
                id: 2
              },
              registerDeviceUuid: {
                type: "string",
                id: 3
              },
              iosIdfa: {
                type: "string",
                id: 30
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetAuthCodeAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          AuthAuthCodeReq: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              phone: {
                type: "string",
                id: 2
              },
              authCode: {
                type: "string",
                id: 3
              },
              newPasswdMd5: {
                type: "string",
                id: 4
              },
              oldPhone: {
                type: "string",
                id: 5
              },
              iosIdfa: {
                type: "string",
                id: 30
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          AuthAuthCodeAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          RegisterInfo: {
            fields: {
              nickname: {
                type: "string",
                id: 1
              },
              icon: {
                type: "string",
                id: 2
              },
              password: {
                type: "string",
                id: 3
              }
            }
          },
          LoginReq: {
            fields: {
              loginInfo: {
                type: "UserPlatformInfo",
                id: 1
              },
              registerInfo: {
                type: "RegisterInfo",
                id: 2
              },
              clientLanguageType: {
                type: "uint32",
                id: 3
              },
              equipmentInformation: {
                type: "EquipmentInformation",
                id: 27
              },
              attachData: {
                type: "bytes",
                id: 32
              },
              loggerId: {
                type: "string",
                id: 100
              }
            }
          },
          LoginAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              loginType: {
                type: "uint32",
                id: 3
              },
              serverTime: {
                type: "uint32",
                id: 4
              },
              userLoginToken: {
                type: "bytes",
                id: 6
              },
              userInfo: {
                type: "Aoelailiao.Common.UserInfo",
                id: 7
              },
              switchSettingInfo: {
                type: "Aoelailiao.Common.SwitchSettingInfo",
                id: 8
              },
              userDetailInfo: {
                type: "Aoelailiao.Common.UserDetailInfo",
                id: 9
              },
              deviceUuid: {
                type: "string",
                id: 30
              },
              distributionChannelId: {
                type: "string",
                id: 31
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          LogOutReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          LogOutAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetFriendsAndGroupsListReq: {
            fields: {
              updateTime: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetFriendsAndGroupsListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              friendInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              groupInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupInfo",
                id: 4
              },
              updateTime: {
                type: "uint32",
                id: 5
              },
              isNeedBindPhone: {
                type: "uint32",
                id: 31
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetUserInfoReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              source: {
                type: "string",
                id: 2
              },
              sourceId: {
                type: "uint32",
                id: 3
              },
              sourceType: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetUserInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userDetailInfo: {
                type: "Aoelailiao.Common.UserDetailInfo",
                id: 3
              },
              fireReadTtl: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ItemSettingInfo: {
            fields: {
              itemNo: {
                type: "uint32",
                id: 1
              },
              itemValue: {
                type: "string",
                id: 2
              }
            }
          },
          UserSetItemReq: {
            fields: {
              itemInfos: {
                rule: "repeated",
                type: "ItemSettingInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSetItemAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              itemInfos: {
                rule: "repeated",
                type: "ItemSettingInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryUserInfoReq: {
            fields: {
              queryString: {
                type: "string",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryUserInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userDetailInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserDetailInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUploadDevicePushTokenReq: {
            fields: {
              operateReason: {
                type: "uint32",
                id: 1
              },
              deviceToken: {
                type: "string",
                id: 2
              },
              pushSdkType: {
                type: "uint32",
                id: 3
              },
              deviceVoipToken: {
                type: "string",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUploadDevicePushTokenAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              operateReason: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUploadBadgeInfoReq: {
            fields: {
              badge: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUploadBadgeInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserChangePassWordReq: {
            fields: {
              passwordType: {
                type: "uint32",
                id: 1
              },
              oldPasswordMd5: {
                type: "string",
                id: 2
              },
              newPasswordMd5: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserChangePassWordAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          DecodeResultInfo: {
            oneofs: {
              jumpContent: {
                oneof: [
                  "defaultValue",
                  "userId",
                  "groupId",
                  "webUrl"
                ]
              }
            },
            fields: {
              jumpType: {
                type: "uint32",
                id: 1
              },
              defaultValue: {
                type: "string",
                id: 2
              },
              userId: {
                type: "uint32",
                id: 3
              },
              groupId: {
                type: "uint32",
                id: 4
              },
              webUrl: {
                type: "string",
                id: 5
              }
            }
          },
          UserDecodeConentReq: {
            fields: {
              encodeString: {
                type: "string",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserDecodeConentAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              decodeResultInfo: {
                type: "DecodeResultInfo",
                id: 3
              },
              longLinkUrl: {
                type: "string",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateFriendShipReq: {
            fields: {
              operateType: {
                type: "uint32",
                id: 1
              },
              queryType: {
                type: "uint32",
                id: 2
              },
              userInfo: {
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              applyDesc: {
                type: "string",
                id: 4
              },
              phone: {
                type: "string",
                id: 5
              },
              remarkName: {
                type: "string",
                id: 6
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateFriendShipAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateGroupInfoReq: {
            fields: {
              operateType: {
                type: "uint32",
                id: 1
              },
              queryGroupInfoType: {
                type: "uint32",
                id: 2
              },
              groupInfo: {
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateGroupInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupInfo: {
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetGroupInfoReq: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetGroupInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupDetailInfo: {
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              fireReadTtl: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateBlackListReq: {
            fields: {
              operateType: {
                type: "uint32",
                id: 1
              },
              operateUid: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateBlackListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userBlacklistInfo: {
                type: "Aoelailiao.Common.UserBlackListInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateSettingItemSwitchReq: {
            fields: {
              objectType: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              settingItemId: {
                type: "uint32",
                id: 3
              },
              switchState: {
                type: "uint32",
                id: 4
              },
              fireReadTtl: {
                type: "uint32",
                id: 5
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateSettingItemSwitchAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserReportAndComplaintsReq: {
            fields: {
              reportType: {
                type: "uint32",
                id: 1
              },
              reportObject: {
                type: "uint32",
                id: 2
              },
              explanation: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserReportAndComplaintsAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              isNeedKickOutUser: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSendScreenShotEventNotifyReq: {
            fields: {
              notifyType: {
                type: "uint32",
                id: 1
              },
              notifyObjectId: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSendScreenShotEventNotifyAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetPhoneContactUserInfoReq: {
            fields: {
              phoneContactUserInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.PhoneContactUserInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetPhoneContactUserInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              phoneContactUserInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.PhoneContactUserInfo",
                id: 3
              },
              userInviteFriendSmsContent: {
                type: "string",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientReloginReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              equipmentInformation: {
                type: "EquipmentInformation",
                id: 27
              }
            }
          },
          ClientReloginAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              }
            }
          },
          ClientGetFileUploadTokenReq: {
            fields: {
              fileSdkType: {
                type: "uint32",
                id: 1
              },
              fileEtag: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetFileUploadTokenAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              fileHaveExist: {
                type: "uint32",
                id: 3
              },
              fileExistUrl: {
                type: "string",
                id: 4
              },
              fileSdkType: {
                type: "uint32",
                id: 5
              },
              fileUploadToke: {
                type: "string",
                id: 6
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          FunctionItemInfo: {
            fields: {
              functionId: {
                type: "uint32",
                id: 1
              },
              functionSwitchState: {
                type: "uint32",
                id: 2
              }
            }
          },
          ServerSendFunctionInfoNotify: {
            fields: {
              functionItemInfos: {
                rule: "repeated",
                type: "FunctionItemInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SWGetAppFunctionInfoReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SWGetAppFunctionInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              functionItemInfos: {
                rule: "repeated",
                type: "FunctionItemInfo",
                id: 3
              },
              userChatWelcomeTips: {
                type: "string",
                id: 4
              },
              groupChatWelcomeTips: {
                type: "string",
                id: 5
              },
              appAboutUsInfo: {
                type: "string",
                id: 6
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SWGetAppUpdateInfoReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SWGetAppUpdateInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              needUpdate: {
                type: "uint32",
                id: 3
              },
              forceUpdate: {
                type: "uint32",
                id: 4
              },
              newVersion: {
                type: "uint32",
                id: 5
              },
              minVersion: {
                type: "uint32",
                id: 6
              },
              updateUrl: {
                type: "string",
                id: 7
              },
              updateDesc: {
                type: "string",
                id: 8
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ServerSendApplyNotDealWithNum: {
            fields: {
              notDealWithNum: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateApplyReq: {
            fields: {
              applyId: {
                type: "uint32",
                id: 1
              },
              applyType: {
                type: "uint32",
                id: 2
              },
              operate: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOperateApplyAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              groupInfo: {
                type: "Aoelailiao.Common.GroupInfo",
                id: 4
              },
              newFriendsApplyNotice: {
                type: "Aoelailiao.Message.NewFriendsApplyNotice",
                id: 5
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryApplyStateReq: {
            fields: {
              applyId: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryApplyStateAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              newFriendsApplyNotice: {
                type: "Aoelailiao.Message.NewFriendsApplyNotice",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetApplyInfoReq: {
            fields: {
              applyType: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetApplyInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              newFriendsApplyNotice: {
                rule: "repeated",
                type: "Aoelailiao.Message.NewFriendsApplyNotice",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetCustomerServicerUidReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetCustomerServicerUidAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              customerServicerUid: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryGroupInfoReq: {
            fields: {
              queryString: {
                type: "string",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserQueryGroupInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetUserInfoListReq: {
            fields: {
              uid: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetUserInfoListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          sendPublicKeyToServserReq: {
            fields: {
              convId: {
                type: "string",
                id: 1
              },
              receiveUid: {
                type: "uint32",
                id: 2
              },
              publicKey: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          sendPublicKeyToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          receivePublicKeyFromServser: {
            fields: {
              convId: {
                type: "string",
                id: 1
              },
              sendUid: {
                type: "uint32",
                id: 2
              },
              publicKey: {
                type: "string",
                id: 3
              },
              deviceCount: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          sendSignatureToServserReq: {
            fields: {
              convId: {
                type: "string",
                id: 1
              },
              receiveUid: {
                type: "uint32",
                id: 2
              },
              sign: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          sendSignatureToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 2
              },
              resultString: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          receiveSignatureFromServser: {
            fields: {
              convId: {
                type: "string",
                id: 1
              },
              sendUid: {
                type: "uint32",
                id: 2
              },
              sign: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          reportCommunicateResultReq: {
            fields: {
              convId: {
                type: "string",
                id: 1
              },
              code: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          reportCommunicateResultAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          pushEncryptedTunnelResult: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              convId: {
                type: "string",
                id: 3
              },
              finalConvId: {
                type: "string",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UploadSessionKeyReq: {
            fields: {
              convId: {
                type: "uint64",
                id: 1
              },
              sessionKey: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UploadSessionKeyAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetTempEncryptedConvIdReq: {
            fields: {
              friendUid: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetTempEncryptedConvIdAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              tempConvId: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCustomMsgTransferReq: {
            fields: {
              recvUids: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              msgData: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCustomMsgTransferAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              failedUids: {
                rule: "repeated",
                type: "uint32",
                id: 3,
                options: {
                  packed: false
                }
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCustomMsgTransferNotify: {
            fields: {
              msgData: {
                type: "string",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetCommonGroupReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetCommonGroupAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              commonGroupInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SearchInfoReq: {
            fields: {
              keyWords: {
                type: "string",
                id: 1
              },
              searchType: {
                type: "uint32",
                id: 2
              },
              receiveIds: {
                rule: "repeated",
                type: "uint64",
                id: 3,
                options: {
                  packed: false
                }
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SearchMessageInfo: {
            fields: {
              isGroup: {
                type: "uint32",
                id: 1
              },
              toId: {
                type: "uint32",
                id: 2
              },
              msgCount: {
                type: "uint32",
                id: 3
              }
            }
          },
          SearchInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              searchType: {
                type: "uint32",
                id: 3
              },
              contracts: {
                rule: "repeated",
                type: "Aoelailiao.Common.UserInfo",
                id: 4
              },
              groups: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupInfo",
                id: 5
              },
              messageInfos: {
                rule: "repeated",
                type: "SearchMessageInfo",
                id: 6
              },
              msgInfos: {
                rule: "repeated",
                type: "Aoelailiao.Message.MsgInfo",
                id: 7
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          DestroyUserAccountReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          DestroyUserAccountAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetGroupNoticeInfoListReq: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              noticeId: {
                type: "uint64",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetGroupNoticeInfoListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupNotices: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupNoticeInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserCommitFeedBackReq: {
            fields: {
              feedbackContent: {
                type: "string",
                id: 1
              },
              feedbackImages: {
                rule: "repeated",
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserCommitFeedBackAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserCheckFunctionPrivilegeReq: {
            fields: {
              functionId: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserCheckFunctionPrivilegeAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              functionId: {
                type: "uint32",
                id: 3
              },
              functionState: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserUpdateClientLanguageReq: {
            fields: {
              clientLanguageType: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserUpdateClientLanguageAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMyManagedGroupListReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMyManagedGroupListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupInfos: {
                rule: "repeated",
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserAddBotToMyManagedGroupReq: {
            fields: {
              botUserId: {
                type: "uint32",
                id: 1
              },
              groupId: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserAddBotToMyManagedGroupAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupInfo: {
                type: "Aoelailiao.Common.GroupInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserChatWithBotFatherReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserChatWithBotFatherAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserShortLinkConvertReq: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              linkUrl: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserShortLinkConvertAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              linkUrl: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          BeforeLoginReq: {
            fields: {
              account: {
                type: "string",
                id: 1
              },
              equipmentInformation: {
                type: "EquipmentInformation",
                id: 3
              },
              loginType: {
                type: "uint32",
                id: 5
              },
              loginNewType: {
                type: "uint32",
                id: 6
              },
              password: {
                type: "string",
                id: 7
              }
            }
          },
          BeforeLoginAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              }
            }
          },
          BeforeLoginNotify: {
            fields: {
              result: {
                type: "uint32",
                id: 1
              }
            }
          },
          AskLoginApprovingNotify: {
            fields: {
              account: {
                type: "string",
                id: 1
              },
              equipmentInformation: {
                type: "EquipmentInformation",
                id: 3
              },
              loginType: {
                type: "uint32",
                id: 5
              },
              askTime: {
                type: "uint64",
                id: 6
              },
              canceled: {
                type: "bool",
                id: 7
              }
            }
          },
          FeedbackLoginApproveReq: {
            fields: {
              state: {
                type: "uint32",
                id: 1
              },
              equipmentInformation: {
                type: "EquipmentInformation",
                id: 2
              }
            }
          },
          FeedbackLoginApproveAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              }
            }
          },
          CancelLoginAskReq: {
            fields: {}
          },
          CancelLoginAskAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              }
            }
          }
        }
      },
      Message: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          MsgInfo: {
            fields: {
              msgId: {
                type: "uint64",
                id: 1
              },
              isGroupMsg: {
                type: "uint32",
                id: 2
              },
              fromId: {
                type: "uint32",
                id: 3
              },
              fromName: {
                type: "string",
                id: 13
              },
              toId: {
                type: "uint32",
                id: 4
              },
              msgTime: {
                type: "uint32",
                id: 5
              },
              msgShowType: {
                type: "uint32",
                id: 6
              },
              msgContent: {
                type: "MsgContentInfo",
                id: 7
              },
              clientMsgUuid: {
                type: "string",
                id: 8
              },
              isEncrypt: {
                type: "uint32",
                id: 9
              },
              attachInfo: {
                type: "MsgAttachInfo",
                id: 10
              },
              replyMsgId: {
                type: "uint64",
                id: 11
              },
              replyToId: {
                type: "uint32",
                id: 12
              }
            }
          },
          MsgContentInfo: {
            oneofs: {
              msgContent: {
                oneof: [
                  "stringContent",
                  "imageMsg",
                  "voiceMsg",
                  "userOperateEventDescInfo",
                  "systemNotifyInfo",
                  "groupAtInfo",
                  "revokeInfo",
                  "videoCallInfo",
                  "gpsMsgInfo",
                  "newFriendsApplyNotice",
                  "forwardMsg",
                  "visitingCard",
                  "groupUserInviteInfo",
                  "fileInfo",
                  "encryptContent",
                  "videoMsgInfo",
                  "cleanInfo",
                  "linkUrlInfo",
                  "fireInfo",
                  "emojiInfo"
                ]
              }
            },
            fields: {
              msgContentType: {
                type: "uint32",
                id: 1
              },
              stringContent: {
                type: "string",
                id: 2
              },
              imageMsg: {
                type: "ImageMsgInfo",
                id: 3
              },
              voiceMsg: {
                type: "VoiceMsgInfo",
                id: 4
              },
              userOperateEventDescInfo: {
                type: "UserOperateEventDescInfo",
                id: 6
              },
              systemNotifyInfo: {
                type: "SystemNotifyInfo",
                id: 7
              },
              groupAtInfo: {
                type: "GroupAtInfo",
                id: 8
              },
              revokeInfo: {
                type: "RevokeInfo",
                id: 9
              },
              videoCallInfo: {
                type: "VideoCallMsgInfo",
                id: 10
              },
              gpsMsgInfo: {
                type: "GpsMsgInfo",
                id: 12
              },
              newFriendsApplyNotice: {
                type: "NewFriendsApplyNotice",
                id: 13
              },
              forwardMsg: {
                type: "ForwardMsgInfo",
                id: 17
              },
              visitingCard: {
                type: "VisitingCard",
                id: 16
              },
              groupUserInviteInfo: {
                type: "GroupUserInviteMsgInfo",
                id: 18
              },
              fileInfo: {
                type: "Aoelailiao.Common.FileInfo",
                id: 19
              },
              encryptContent: {
                type: "string",
                id: 21
              },
              videoMsgInfo: {
                type: "VideoMsgInfo",
                id: 23
              },
              cleanInfo: {
                type: "CleanInfo",
                id: 24
              },
              linkUrlInfo: {
                type: "LinkUrlInfo",
                id: 25
              },
              fireInfo: {
                type: "FireInfo",
                id: 26
              },
              emojiInfo: {
                type: "EmojiInfo",
                id: 27
              }
            }
          },
          EmojiInfo: {
            fields: {
              url: {
                type: "string",
                id: 10
              }
            }
          },
          LinkUrlInfo: {
            fields: {
              url: {
                type: "string",
                id: 1
              },
              title: {
                type: "string",
                id: 2
              },
              content: {
                type: "string",
                id: 3
              },
              icon: {
                type: "string",
                id: 4
              },
              needParse: {
                type: "uint32",
                id: 5
              }
            }
          },
          CleanInfo: {
            fields: {
              maxMsgId: {
                type: "uint64",
                id: 1
              },
              stringContent: {
                type: "string",
                id: 2
              }
            }
          },
          VideoMsgInfo: {
            fields: {
              url: {
                type: "string",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              imageUrl: {
                type: "string",
                id: 3
              },
              duration: {
                type: "uint32",
                id: 4
              },
              format: {
                type: "string",
                id: 5
              },
              weight: {
                type: "uint32",
                id: 6
              },
              height: {
                type: "uint32",
                id: 7
              },
              size: {
                type: "uint32",
                id: 8
              },
              extra: {
                type: "string",
                id: 9
              }
            }
          },
          NewFriendsApplyNotice: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              nickName: {
                type: "string",
                id: 2
              },
              icon: {
                type: "string",
                id: 3
              },
              applyState: {
                type: "uint32",
                id: 4
              },
              applyDesc: {
                type: "string",
                id: 5
              },
              applyType: {
                type: "uint32",
                id: 6
              },
              applyId: {
                type: "uint32",
                id: 7
              },
              endTime: {
                type: "uint32",
                id: 8
              },
              updateTime: {
                type: "uint32",
                id: 9
              },
              adminUids: {
                rule: "repeated",
                type: "uint32",
                id: 10,
                options: {
                  packed: false
                }
              }
            }
          },
          VisitingCard: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              uid: {
                type: "uint32",
                id: 2
              },
              icon: {
                type: "string",
                id: 3
              },
              name: {
                type: "string",
                id: 4
              },
              showContent: {
                type: "string",
                id: 5
              },
              sourceName: {
                type: "string",
                id: 6
              },
              sourceId: {
                type: "uint32",
                id: 7
              },
              sourceTime: {
                type: "uint32",
                id: 8
              }
            }
          },
          GpsMsgInfo: {
            fields: {
              longitude: {
                type: "string",
                id: 1
              },
              latitude: {
                type: "string",
                id: 2
              },
              positionName: {
                type: "string",
                id: 3
              },
              positionDetail: {
                type: "string",
                id: 4
              },
              mapUrl: {
                type: "string",
                id: 5
              }
            }
          },
          VideoCallMsgInfo: {
            fields: {
              videoType: {
                type: "uint32",
                id: 1
              },
              sendShowMsg: {
                rule: "repeated",
                type: "AppointUserTextInfo",
                id: 2
              },
              needShowTime: {
                type: "uint32",
                id: 3
              },
              callTime: {
                type: "uint32",
                id: 4
              }
            }
          },
          AppointUserTextInfo: {
            fields: {
              userIds: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              msgText: {
                type: "string",
                id: 2
              }
            }
          },
          ImageMsgInfo: {
            fields: {
              imageUrl: {
                type: "string",
                id: 1
              },
              imageWidth: {
                type: "uint32",
                id: 2
              },
              imageHeight: {
                type: "uint32",
                id: 3
              }
            }
          },
          VoiceMsgInfo: {
            fields: {
              voiceUrl: {
                type: "string",
                id: 1
              },
              voiceTime: {
                type: "uint32",
                id: 2
              }
            }
          },
          ReplaceMsgItem: {
            fields: {
              showContent: {
                type: "string",
                id: 1
              },
              jumpUrl: {
                type: "string",
                id: 2
              },
              showContentColor: {
                type: "string",
                id: 3
              }
            }
          },
          ReplaceMsgInfo: {
            fields: {
              spileText: {
                type: "string",
                id: 1
              },
              msgText: {
                type: "string",
                id: 2
              },
              replaceMsgItems: {
                rule: "repeated",
                type: "ReplaceMsgItem",
                id: 3
              }
            }
          },
          AppointUserSystemNotifyInfo: {
            fields: {
              userIds: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              appointUserNotifyInfo: {
                type: "ReplaceMsgInfo",
                id: 2
              }
            }
          },
          SystemNotifyInfo: {
            fields: {
              appointUserSystemNotifyInfos: {
                rule: "repeated",
                type: "AppointUserSystemNotifyInfo",
                id: 1
              },
              otherUserNotifyInfo: {
                type: "ReplaceMsgInfo",
                id: 2
              },
              drawableDirection: {
                type: "uint32",
                id: 3
              },
              drawableUrl: {
                type: "string",
                id: 4
              }
            }
          },
          GroupAtInfo: {
            fields: {
              atUsers: {
                rule: "repeated",
                type: "AtInfo",
                id: 1
              },
              stringContent: {
                type: "string",
                id: 2
              }
            }
          },
          AtInfo: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              type: {
                type: "uint32",
                id: 2
              }
            }
          },
          RevokeInfo: {
            fields: {
              revokeMsgId: {
                type: "uint64",
                id: 1
              },
              stringContent: {
                type: "string",
                id: 2
              }
            }
          },
          UserOperateEventDescInfo: {
            fields: {
              operateType: {
                type: "uint32",
                id: 1
              },
              operateUserId: {
                type: "uint32",
                id: 2
              },
              beOperatedUserId: {
                type: "uint32",
                id: 3
              },
              operateDesc: {
                type: "string",
                id: 4
              },
              operateReason: {
                type: "string",
                id: 5
              }
            }
          },
          ForwardMsgInfo: {
            fields: {
              forwardMsgTitle: {
                type: "string",
                id: 1
              },
              forwardMsgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 2
              }
            }
          },
          GroupUserInviteMsgInfo: {
            fields: {
              inviteTitle: {
                type: "string",
                id: 1
              },
              inviteDesc: {
                type: "string",
                id: 2
              },
              inviteGroupId: {
                type: "uint32",
                id: 3
              },
              inviteGroupIconUrl: {
                type: "string",
                id: 4
              }
            }
          },
          FireInfo: {
            fields: {
              fireMsgId: {
                type: "uint64",
                id: 1
              },
              stringContent: {
                type: "string",
                id: 2
              }
            }
          },
          MsgAttachInfo: {
            fields: {
              msgSource: {
                type: "string",
                id: 1
              }
            }
          },
          ClientSendMsgToServerReq: {
            fields: {
              msgInfo: {
                type: "MsgInfo",
                id: 1
              },
              randomNum: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientSendMsgToServerAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgInfo: {
                type: "MsgInfo",
                id: 3
              },
              randomNum: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientPullChatsFromServerReq: {
            fields: {
              msgInfo: {
                type: "MsgInfo",
                id: 1
              },
              randomNum: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientPullChatsFromServerAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgInfo: {
                rule: "repeated",
                type: "MsgInfo",
                id: 3
              },
              randomNum: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ServerSendMsgToClientNotify: {
            fields: {
              msgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientSendMsgAckToServerReq: {
            fields: {
              msgId: {
                type: "uint64",
                id: 1
              },
              isEncrypt: {
                type: "uint32",
                id: 2
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              fromId: {
                type: "uint32",
                id: 4
              },
              toId: {
                type: "uint32",
                id: 5
              },
              isOffLine: {
                type: "uint32",
                id: 6
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientSendMsgAckToServerAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientRevokeMsgReq: {
            fields: {
              msgId: {
                type: "uint64",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientRevokeMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          VideoCallActionUploadReq: {
            fields: {
              actionType: {
                type: "uint32",
                id: 1
              },
              videoType: {
                type: "uint32",
                id: 2
              },
              talkUid: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          VideoCallActionUploadAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetTencentVideoSignReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetTencentVideoSignAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              tencentVideoSign: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SystemNoticeMsg: {
            fields: {
              systemUserId: {
                type: "uint32",
                id: 1
              },
              systemUserImage: {
                type: "string",
                id: 2
              },
              systemUserName: {
                type: "string",
                id: 3
              },
              systemNoticeContent: {
                type: "string",
                id: 4
              }
            }
          },
          UserFeedBackMsg: {
            fields: {
              feedbackContent: {
                type: "string",
                id: 1
              },
              noticeImage: {
                rule: "repeated",
                type: "string",
                id: 2
              },
              feedbackTime: {
                type: "uint32",
                id: 3
              },
              replyContent: {
                type: "string",
                id: 4
              },
              replyTime: {
                type: "uint32",
                id: 5
              }
            }
          },
          NotifyMsgInfo: {
            fields: {
              msgClassId: {
                type: "uint32",
                id: 1
              },
              msgId: {
                type: "uint64",
                id: 2
              },
              msgContentType: {
                type: "uint32",
                id: 3
              },
              systemNoticeMsg: {
                type: "SystemNoticeMsg",
                id: 4
              },
              userFeedbackMsg: {
                type: "UserFeedBackMsg",
                id: 5
              },
              updateTime: {
                type: "uint32",
                id: 6
              }
            }
          },
          NotifyClassMsgListInfo: {
            fields: {
              msgClassId: {
                type: "uint32",
                id: 1
              },
              msgClassIcon: {
                type: "string",
                id: 2
              },
              msgClassTitle: {
                type: "string",
                id: 3
              },
              msgClassHaveNewMsg: {
                type: "uint32",
                id: 4
              },
              msgClassRecentMsgContent: {
                type: "string",
                id: 5
              },
              updateTime: {
                type: "uint32",
                id: 6
              },
              maxMsgId: {
                type: "uint64",
                id: 7
              },
              unreadMsgCount: {
                type: "uint32",
                id: 8
              }
            }
          },
          UsersInfoList: {
            fields: {
              fromId: {
                type: "uint32",
                id: 1
              },
              msgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 2
              },
              iconUrl: {
                type: "string",
                id: 3
              },
              nickName: {
                type: "string",
                id: 4
              },
              strTest: {
                type: "string",
                id: 5
              },
              time: {
                type: "uint32",
                id: 6
              }
            }
          },
          UserGetSystemNoticeMsgClassListReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetSystemNoticeMsgClassListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              classMsgInfo: {
                rule: "repeated",
                type: "NotifyClassMsgListInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetSystemNoticeContentListReq: {
            fields: {
              msgClassId: {
                type: "uint32",
                id: 1
              },
              minHasReadMsgId: {
                type: "uint64",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetSystemNoticeContentListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgContent: {
                rule: "repeated",
                type: "NotifyMsgInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ServerSendSystemNotifyMsg: {
            fields: {
              notifyContent: {
                type: "string",
                id: 1
              },
              updateTime: {
                type: "uint32",
                id: 2
              }
            }
          },
          UserSendSystemNotifyMsgReadedStateReq: {
            fields: {
              msgClassId: {
                type: "uint32",
                id: 1
              },
              hasReadMsgIdMax: {
                type: "uint64",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSendSystemNotifyMsgReadedStateAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientSendBackgroundUrlToServerReq: {
            fields: {
              toId: {
                type: "uint32",
                id: 1
              },
              selectedBackgroundUrl: {
                type: "string",
                id: 2
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientSendBackgroundUrlToServerAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetCurrentBackgroundUrlReq: {
            fields: {
              toId: {
                type: "uint32",
                id: 1
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetCurrentBackgroundUrlAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              backgroundUrl: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SetUpSystemSwitchReq: {
            fields: {
              type: {
                type: "uint32",
                id: 1
              },
              state: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SetUpSystemSwitchAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              switchSettingInfo: {
                type: "Aoelailiao.Common.SwitchSettingInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetSystemSwitchReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetSystemSwitchAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              switchSettingInfo: {
                type: "Aoelailiao.Common.SwitchSettingInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetSectionOfflineMsgReq: {
            fields: {
              lastOfflineMsgIdMax: {
                type: "uint64",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetSectionOfflineMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              offlineMsgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 3
              },
              stopGetOfflineMsg: {
                type: "uint32",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserForwardContent: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              toId: {
                type: "uint32",
                id: 2
              }
            }
          },
          UserForwardMsgInfoReq: {
            fields: {
              forwardType: {
                type: "uint32",
                id: 1
              },
              forwardMsgIds: {
                rule: "repeated",
                type: "uint64",
                id: 2,
                options: {
                  packed: false
                }
              },
              forwardMsg: {
                rule: "repeated",
                type: "UserForwardContent",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserForwardMsgInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMoreMsgInfoReq: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              msgIdMin: {
                type: "uint64",
                id: 3
              },
              msgDirection: {
                type: "uint32",
                id: 4
              },
              msgNum: {
                type: "uint32",
                id: 5
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMoreMsgInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetFileListInfoReq: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              msgIdMin: {
                type: "uint64",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetFileListInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserDeleteFileMsgReq: {
            fields: {
              msgId: {
                type: "uint64",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserDeleteFileMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSearchHistoryMsgReq: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              keyWord: {
                type: "string",
                id: 3
              },
              msgIdMin: {
                type: "uint64",
                id: 4
              },
              searchType: {
                type: "uint32",
                id: 5
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSearchHistoryMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgInfos: {
                rule: "repeated",
                type: "MsgInfo",
                id: 3
              },
              msgId: {
                type: "uint64",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupVideoCallActionUploadReq: {
            fields: {
              actionType: {
                type: "uint32",
                id: 1
              },
              groupId: {
                type: "uint32",
                id: 2
              },
              channelId: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupVideoCallActionUploadAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetGroupNoticeInfoReq: {
            fields: {
              groupId: {
                type: "uint32",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GetGroupNoticeInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupNoticeInfo: {
                type: "Aoelailiao.Common.GroupNoticeInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          WriteStateNotifyToServserReq: {
            fields: {
              userWriteState: {
                type: "Aoelailiao.Common.UserWriteState",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          WriteStateNotifyToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          WriteStateNotifyToClient: {
            fields: {
              userWriteState: {
                type: "Aoelailiao.Common.UserWriteState",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOnlineStateNotifyReq: {
            fields: {
              userOnlineState: {
                type: "Aoelailiao.Common.UserInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOnlineStateNotifyAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              userOnlineState: {
                type: "Aoelailiao.Common.UserInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserOnlineStateNotifyToClient: {
            fields: {
              userOnlineState: {
                type: "Aoelailiao.Common.UserInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCleanMsgReq: {
            fields: {
              toUid: {
                type: "uint32",
                id: 1
              },
              isGroupMsg: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCleanMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          MarkInfo: {
            fields: {
              msgInfo: {
                type: "MsgInfo",
                id: 1
              },
              markTime: {
                type: "uint32",
                id: 2
              }
            }
          },
          OperationMarkInfoReq: {
            fields: {
              operationType: {
                type: "uint32",
                id: 1
              },
              msgId: {
                type: "uint64",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          OperationMarkInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SearchMarkInfoReq: {
            fields: {
              keyWord: {
                type: "string",
                id: 1
              },
              markTimeMin: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          SearchMarkInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              markInfos: {
                rule: "repeated",
                type: "MarkInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMarkInfoListReq: {
            fields: {
              markTimeMin: {
                type: "uint32",
                id: 1
              },
              type: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetMarkInfoListAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              markInfos: {
                rule: "repeated",
                type: "MarkInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          MsgHasReadedInfo: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              fromId: {
                type: "uint32",
                id: 2
              },
              toId: {
                type: "uint32",
                id: 3
              },
              msgIdMax: {
                type: "uint64",
                id: 4
              },
              conversationId: {
                type: "uint64",
                id: 5
              }
            }
          },
          UserGetConversationHasReadedMsgInfoReq: {
            fields: {
              msgHasReadedInfos: {
                rule: "repeated",
                type: "MsgHasReadedInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserGetConversationHasReadedMsgInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              msgHasReadedInfos: {
                rule: "repeated",
                type: "MsgHasReadedInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ServerSendMsgHasReadedInfoToClientNotify: {
            fields: {
              msgHasReadedInfos: {
                rule: "repeated",
                type: "MsgHasReadedInfo",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserUpdateConversationHasReadedMsgInfoReq: {
            fields: {
              msgHasReadedInfo: {
                type: "MsgHasReadedInfo",
                id: 1
              },
              deviceBrand: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserUpdateConversationHasReadedMsgInfoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSendVisitCardToFriendReq: {
            fields: {
              visitingCard: {
                rule: "repeated",
                type: "VisitingCard",
                id: 1
              },
              toUids: {
                rule: "repeated",
                type: "uint32",
                id: 2,
                options: {
                  packed: false
                }
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UserSendVisitCardToFriendAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallStateNotifyToServserReq: {
            fields: {
              groupCallState: {
                type: "Aoelailiao.Common.GroupCallState",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallStateNotifyToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              groupCallState: {
                type: "Aoelailiao.Common.GroupCallState",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallNotifyToClient: {
            fields: {
              groupCallState: {
                type: "Aoelailiao.Common.GroupCallState",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          FireReadFireMessageToServserReq: {
            fields: {
              msgId: {
                type: "uint64",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          FireReadFireMessageToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallApplyJoinToServserReq: {
            fields: {
              groupId: {
                type: "uint64",
                id: 1
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallApplyJoinToServserAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          GroupCallApplyJoinToClient: {
            fields: {
              groupId: {
                type: "uint64",
                id: 1
              },
              userId: {
                type: "uint64",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          HideConversationReq: {
            fields: {
              isGroupMsg: {
                type: "uint32",
                id: 1
              },
              objectId: {
                type: "uint32",
                id: 2
              },
              opt: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          HideConversationAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              isGroupMsg: {
                type: "uint32",
                id: 3
              },
              objectId: {
                type: "uint32",
                id: 4
              },
              opt: {
                type: "uint32",
                id: 5
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UploadReq: {
            fields: {
              ext: {
                type: "string",
                id: 1
              },
              content: {
                type: "bytes",
                id: 2
              },
              type: {
                type: "uint32",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          UploadAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              url: {
                type: "string",
                id: 3
              },
              thumbnail: {
                type: "string",
                id: 4
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          DeleteMsgReq: {
            fields: {
              msgIds: {
                rule: "repeated",
                type: "uint64",
                id: 1,
                options: {
                  packed: false
                }
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          DeleteMsgAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          EchoReq: {
            fields: {
              text: {
                type: "string",
                id: 1
              }
            }
          },
          EchoAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              text: {
                type: "string",
                id: 3
              }
            }
          },
          SessionSyncType: {
            values: {
              UNKNOWN: 0,
              SYSTEM_SWITCH_CHANGE: 10,
              USER_INFO_CHANGE: 11,
              FRIENDS_AND_GROUPS_CHANGE: 20,
              FRIENDS_AND_GROUPS_ADD: 21,
              FRIENDS_AND_GROUPS_DEL: 22,
              MSG_DELETED: 30,
              CONVERSATION_HIDE: 40
            }
          },
          SessionSyncNotify: {
            fields: {
              type: {
                type: "SessionSyncType",
                id: 1
              },
              msgIds: {
                rule: "repeated",
                type: "uint64",
                id: 10,
                options: {
                  packed: false
                }
              },
              objectId: {
                type: "uint32",
                id: 15
              },
              isGroupMsg: {
                type: "uint32",
                id: 16
              },
              hideOpt: {
                type: "uint32",
                id: 20
              }
            }
          },
          Image: {
            fields: {
              id: {
                type: "uint64",
                id: 1
              },
              url: {
                type: "string",
                id: 10
              }
            }
          },
          ImageOperateReq: {
            fields: {
              optype: {
                type: "uint32",
                id: 10
              },
              imageId: {
                type: "uint64",
                id: 15
              },
              url: {
                type: "string",
                id: 20
              }
            }
          },
          ImageOperateAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              images: {
                rule: "repeated",
                type: "Image",
                id: 20
              }
            }
          },
          GetUserStatusReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              }
            }
          },
          GetUserStatusAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              status: {
                type: "uint32",
                id: 3
              }
            }
          }
        }
      },
      Label: {
        options: {
          java_package: "com.aoetech.aoelailiao.protobuf",
          java_multiple_files: true,
          go_package: ".;protocolpb"
        },
        nested: {
          ClientCreateLabelReq: {
            fields: {
              uid: {
                rule: "repeated",
                type: "uint32",
                id: 1,
                options: {
                  packed: false
                }
              },
              labelContent: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientCreateLabelAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUpdateLabelReq: {
            fields: {
              uid: {
                type: "uint32",
                id: 1
              },
              labelInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.LabelInfo",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientUpdateLabelAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientDeleteLabelReq: {
            fields: {
              labelId: {
                type: "uint32",
                id: 1
              },
              uid: {
                type: "uint32",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientDeleteLabelAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientEditLabelReq: {
            fields: {
              labelId: {
                type: "uint32",
                id: 1
              },
              uid: {
                rule: "repeated",
                type: "uint32",
                id: 2,
                options: {
                  packed: false
                }
              },
              labelContent: {
                type: "string",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientEditLabelAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetLabelReq: {
            fields: {
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          },
          ClientGetLabelAns: {
            fields: {
              resultCode: {
                type: "uint32",
                id: 1
              },
              resultString: {
                type: "string",
                id: 2
              },
              labelUserInfo: {
                rule: "repeated",
                type: "Aoelailiao.Common.LabelUserInfo",
                id: 3
              },
              attachData: {
                type: "bytes",
                id: 32
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
