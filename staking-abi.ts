//New Abi
export const stakingABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bananoshiToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bananaNFT",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "BelowMinimumRewardRate",
    type: "error",
  },
  {
    inputs: [],
    name: "ContractNotFunded",
    type: "error",
  },
  {
    inputs: [],
    name: "CooldownPeriodActive",
    type: "error",
  },
  {
    inputs: [],
    name: "DelayNotPassed",
    type: "error",
  },
  {
    inputs: [],
    name: "DuplicateNFT",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedsMAX_STAKE_PER_NFT",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedsMaxStake",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedsStakedAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedsStakedNFTs",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientInitialFunding",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientReserves",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientRewardPool",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidNFTIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "MinStakeDurationNotMet",
    type: "error",
  },
  {
    inputs: [],
    name: "NFTAlreadyStaked",
    type: "error",
  },
  {
    inputs: [],
    name: "NFTStillStaked",
    type: "error",
  },
  {
    inputs: [],
    name: "NewOwnerIsZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NoHandoverRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "NoPendingUpdate",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRewardsToClaim",
    type: "error",
  },
  {
    inputs: [],
    name: "NotNFTStaker",
    type: "error",
  },
  {
    inputs: [],
    name: "NothingStaked",
    type: "error",
  },
  {
    inputs: [],
    name: "NothingToStake",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "StakingPeriodNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyNFTs",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawAllFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newRewardPool",
        type: "uint256",
      },
    ],
    name: "ContractFunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "EmergencyWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "MAX_STAKE_PER_NFTUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "MinEffectiveStakeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
    ],
    name: "NFTRecovered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "OwnershipHandoverCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "OwnershipHandoverRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "RewardPoolDepleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "remainingPool",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minimumRequired",
        type: "uint256",
      },
    ],
    name: "RewardPoolHealthWarning",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "initialRewardPool",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "initialRate",
        type: "uint256",
      },
    ],
    name: "RewardPoolInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "participationFactor",
        type: "uint256",
      },
    ],
    name: "RewardRateAdjusted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "RewardsPerSecondUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bananoshisAmount",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isFullStaker",
        type: "bool",
      },
    ],
    name: "StakerStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "StakingPeriodEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenRecovered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bananoshisAmount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ACTIONS_DELAY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BANANOSHI_UNIT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BASE_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BASE_RATE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DISTRIBUTION_PERIOD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FULL_STAKER_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_NFTS_PER_TX",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_REWARD_PER_SECOND",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_REWARD_RATE_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STAKE_PER_NFT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STAKE_PER_USER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STAKE_WITHOUT_NFT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_EFFECTIVE_STAKE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_REWARD_POOL_THRESHOLD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_REWARD_RATE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_REWARD_RATE_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MULTIPLIER_DENOMINATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NFT_BASE_SHARE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PARTIAL_STAKER_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRECISION_FACTOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RESERVE_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SAFETY_FACTOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOTAL_REWARD_POOL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "accRewardPerShare",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activeStakers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bananaNFT",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bananoshiToken",
    outputs: [
      {
        internalType: "contract IBananaDN404",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nftCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bananoshisAmount",
        type: "uint256",
      },
    ],
    name: "calculateEffectiveStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "calculateOptimalRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "calculatePendingRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "additionalNFTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "additionalTokens",
        type: "uint256",
      },
    ],
    name: "calculatePotentialEffectiveStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkInitializationValues",
    outputs: [
      {
        internalType: "uint256",
        name: "currentPool",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseRateBeforeSafety",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedInitialRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkRewardPoolHealth",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkRewardPoolStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "completeOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "executeRewardsUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nftCount",
        type: "uint256",
      },
    ],
    name: "getMaxStakeForNFTs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newNFTCount",
        type: "uint256",
      },
    ],
    name: "getMaximumStakeForUser",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getParticipationFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getRemainingStakeCapacity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "staker",
        type: "address",
      },
    ],
    name: "getStakerInfo",
    outputs: [
      {
        internalType: "uint256[]",
        name: "stakedNFTIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bananoshisStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdated",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pendingRewards",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "effectiveStake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastStakeTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastWithdrawTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accumulatedPrecision",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakingStats",
    outputs: [
      {
        internalType: "uint256",
        name: "totalStakers",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalStakedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalEffectiveStakeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentRewardRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingRewards",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalEffectiveStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initializeRewardPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isFullStaker",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastRewardPoolCheckTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdateTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minEffectiveStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nftStakers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "ownershipHandoverExpiresAt",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingRewardsPerSecond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "recoverERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
    ],
    name: "recoverNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refreshRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsPerSecond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsUpdateTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minEffectiveStake",
        type: "uint256",
      },
    ],
    name: "setMinEffectiveStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardsPerSecond",
        type: "uint256",
      },
    ],
    name: "setRewardsPerSecond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bananoshisAmount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakers",
    outputs: [
      {
        internalType: "uint256",
        name: "bananoshisStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pendingRewards",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "effectiveStake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastStakeTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastWithdrawTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accumulatedPrecision",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalEffectiveStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "verifyRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "currentRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedBaseRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingPool",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAllowedRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bananoshisAmount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
