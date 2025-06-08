// 건물 및 실 정보
const buildings = [
  {
    id: "left-wing",
    name: "LEFT WING",
    floors: [
      {
        name: "1st FLOOR",
        rooms: [
          { id: "1-1", name: "제1 자주실", type: "study" },
          { id: "1-2", name: "제2 자주실", type: "study" },
          { id: "1-3", name: "제3 자주실", type: "study" },
        ],
      },
      {
        name: "2nd FLOOR",
        rooms: [
          { id: "2-1", name: "제1 자주실", type: "study" },
          { id: "2-2", name: "제2 자주실", type: "study" },
          { id: "2-3", name: "제3 자주실", type: "study" },
        ],
      },
      {
        name: "3rd FLOOR",
        rooms: [
          { id: "3-1", name: "제1 자주실", type: "study" },
          { id: "3-2", name: "제2 자주실", type: "study" },
          { id: "3-3", name: "제3 자주실", type: "study" },
        ],
      },
      {
        name: "4th FLOOR",
        rooms: [
          { id: "4-1", name: "제1 자주실", type: "study" },
          { id: "4-2", name: "제2 자주실", type: "study" },
          { id: "4-3", name: "제3 자주실", type: "study" },
        ],
      },
    ],
  },
  {
    id: "oryang-hall",
    name: "ORYANG HALL",
    floors: [
      {
        name: "2nd FLOOR",
        rooms: [
          {
            id: "oryang-2-1",
            name: "AI 리딩실",
            type: "restricted",
            note: "신청 불가한 교실 입니다.",
          },
        ],
      },
      {
        name: "3rd FLOOR",
        rooms: [
          {
            id: "oryang-3-1",
            name: "진로실",
            type: "restricted",
            note: "신청 불가한 교실 입니다.",
          },
        ],
      },
      {
        name: "MULTI ROOMS",
        rooms: [
          { id: "oryang-multi-1", name: "제1 멀티실", type: "multi" },
          { id: "oryang-multi-2", name: "제2 멀티실", type: "multi" },
          { id: "oryang-multi-3", name: "제3 멀티실", type: "multi" },
          { id: "oryang-multi-4", name: "제4 멀티실", type: "multi" },
        ],
      },
      {
        name: "4th FLOOR",
        rooms: [
          {
            id: "oryang-4-1",
            name: "진로진학상담실",
            type: "restricted",
            note: "신청 불가한 교실 입니다.",
          },
          {
            id: "oryang-4-2",
            name: "제4 자주실",
            type: "study",
            note: "CIP 1차시 이후 예약 불가",
          },
          {
            id: "oryang-4-3",
            name: "제5 자주실",
            type: "study",
            note: "CIP 1차시 이후 예약 불가",
          },
          {
            id: "oryang-4-4",
            name: "제6 자주실",
            type: "study",
            note: "CIP 1차시 이후 예약 불가",
          },
        ],
      },
    ],
  },
  {
    id: "right-wing",
    name: "RIGHT WING",
    floors: [
      {
        name: "STUDY CAFE",
        rooms: [
          { id: "cafe-1", name: "제1 그룹실", type: "group", maxCapacity: 6 },
          { id: "cafe-2", name: "제2 그룹실", type: "group", maxCapacity: 6 },
          { id: "cafe-3", name: "제3 그룹실", type: "group", maxCapacity: 6 },
          {
            id: "cafe-4",
            name: "개인석",
            type: "individual",
            note: "지정좌석이 아닌 선착순 배정입니다",
          },
        ],
      },
      {
        name: "3rd FLOOR LOUNGE",
        rooms: [
          { id: "right-3-1", name: "제1 소그룹실", type: "small-group" },
          { id: "right-3-2", name: "제2 소그룹실", type: "small-group" },
          { id: "right-3-3", name: "제3 소그룹실", type: "small-group" },
        ],
      },
      {
        name: "4th FLOOR LOUNGE",
        rooms: [
          { id: "right-4-1", name: "제1 소그룹실", type: "small-group" },
          { id: "right-4-2", name: "제2 소그룹실", type: "small-group" },
          { id: "right-4-3", name: "제3 소그룹실", type: "small-group" },
        ],
      },
    ],
  },
];

// 실 타입별 설명
const roomTypeDescriptions = {
  study: "자주실",
  multi: "멀티실",
  restricted: "신청 불가",
  group: "그룹실",
  individual: "개인석",
  "small-group": "소그룹실",
};

// 실 타입별 사용 규칙
const roomTypeRules = {
  study:
    "자주실은 정숙 및 분위기 유지를 위해서 CIP 1차시 이후에는 예약이 불가능합니다.",
  multi:
    "멀티실은 제한 없이 예약이 가능하나, 멀티실 3개 이상의 대여가 필요한 행사의 경우 담당 교사 분들에게 미리 연락을 해주시기 바랍니다.",
  group: "그룹실은 최대 6명이 한번에 이용이 가능합니다.",
  individual:
    "개인석의 경우 입장 가능 인원만 제한하며 좌석 배치의 경우 선착순으로 자율적으로 진행하시면 됩니다. 1인 1석 엄수, 정숙 및 분위기 유지 필수!",
  "small-group":
    "소그룹실의 경우 지정석을 제외한 나머지 공간은 신청 없이 자율적으로 이용이 가능합니다. 다만 수용 인원을 과도하게 초과하여 이용하는 경우 담당 교사분들에 의하여 이용이 제한 될 수 있음을 말씀드립니다.",
};

export { buildings, roomTypeDescriptions, roomTypeRules };
