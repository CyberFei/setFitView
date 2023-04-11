import { getCorner, Props } from '.';

// TODO map ref
// like https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html
const mapCtx = {
  current: {
    getRegion: (params) => {},
    includePoints: (params) => {},
  },
};
// TODO 获取地图宽高
const getDomInfo = (selector) => ({ width: 375, height: 667 });

// 动态缩放
const resetIncludePoints = ({
  points = [],
  padding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}: {
  points: Props['points'];
  padding?: Props['padding'];
}) => {
  Promise.all([
    getDomInfo('#mapComp'),
    new Promise<any>((resolve) =>
      mapCtx.current?.getRegion({
        success: resolve,
        fail: () => resolve({}),
      }),
    ),
  ]).then(([domInfo, regionInfo]) => {
    const h = domInfo.height;
    const w = domInfo.width;
    const { northeast, southwest } = regionInfo;

    const { cornerLB, cornerRT } = getCorner({
      h,
      w,
      points,
      northeast,
      southwest,
      padding,
    });

    mapCtx.current?.includePoints({ points: [cornerLB, cornerRT] });
  });
};

const demo = () =>
  resetIncludePoints({
    points: [
      {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      {
        latitude: 23.00229,
        longitude: 113.3345211,
      },
    ],
    padding: {
      top: 60,
      right: 80,
      bottom: 20,
      left: 80,
    },
  });

demo();
