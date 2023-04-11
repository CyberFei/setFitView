export type Point = {
  latitude: number;
  longitude: number;
};

export type Props = {
  h: number;
  w: number;
  northeast: Point;
  southwest: Point;
  points: Array<Point>;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

// 根据相关参数正确获得地图缩放坐标点
export function getCorner({
  // 地图高度
  h,
  // 地图宽度
  w,
  // 地图右上角经纬度
  northeast,
  // 地图左下角经纬度
  southwest,
  // 需要缩放点的经纬度数组
  points,
  // 缩放 padding
  padding,
}: Props) {
  // 获取 points 所占据最大区域矩形的左下|右上|中心经纬度
  const lb: Point = {
    latitude: Math.min(...points.map((item) => item.latitude)),
    longitude: Math.min(...points.map((item) => item.longitude)),
  };

  const rt: Point = {
    latitude: Math.max(...points.map((item) => item.latitude)),
    longitude: Math.max(...points.map((item) => item.longitude)),
  };

  const center: Point = {
    latitude: (lb.latitude + rt.latitude) / 2,
    longitude: (lb.longitude + rt.longitude) / 2,
  };

  // 可视区域
  const areaH = h - padding.top - padding.bottom;
  const areaW = w - padding.left - padding.right;

  // 经纬度与像素关系
  const latByPx = (northeast.latitude - southwest.latitude) / h;
  const lngByPx = (northeast.longitude - southwest.longitude) / w;

  // 获取缩放主轴
  const scaleH = (rt.latitude - lb.latitude) / latByPx / areaH;
  const scaleW = (rt.longitude - lb.longitude) / lngByPx / areaW;
  const scale = Math.max(scaleH, scaleW) || 1;

  // 计算缩放左下|右上经纬度
  const cornerLB: Point = {
    latitude: center.latitude - latByPx * (areaH / 2 + padding.bottom) * scale,
    longitude: center.longitude - lngByPx * (areaW / 2 + padding.left) * scale,
  };
  const cornerRT: Point = {
    latitude: center.latitude + latByPx * (areaH / 2 + padding.top) * scale,
    longitude: center.longitude + lngByPx * (areaW / 2 + padding.right) * scale,
  };

  return {
    cornerLB,
    cornerRT,
  };
}
