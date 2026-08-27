// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { DEFAULT_LOCATION } from "@/constants";
// import type { ICoordinate, IPoi } from "@/types/entities/poi.type";
// import type { FeatureCollection, LineString } from "geojson";

// import * as turf from "@turf/turf";

// // =====================
// // GeoJSON utilities
// // =====================
// export const createPointsGeoJSON = (
//   points: IPoi[]
// ): GeoJSON.FeatureCollection => {
//   return {
//     type: "FeatureCollection",
//     features: points.map((point: IPoi, index) => ({
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: [point.position.lng, point.position.lat],
//       },
//       properties: {
//         id: point.id || index,
//         name: point.name || `Point ${index + 1}`,
//         imageUrl: point.banner || "",
//         range: point.range || 300,
//         pointType: "point.type",
//       },
//     })),
//   };
// };
// // export const createOffTrackGeoJSON = (
// //   points: IPoi[]
// // ): GeoJSON.FeatureCollection => {
// //   return {
// //     type: "FeatureCollection",
// //     features: points.map((point: IPoi, index) => ({
// //       type: "Feature",
// //       geometry: {
// //         type: "Point",
// //         coordinates: [point.position.lng, point.position.lat],
// //       },
// //       properties: {
// //         id: point.id || index,
// //         name: point.name || `Point ${index + 1}`,
// //         imageUrl: point.banner || "",
// //         range: point.range || 300,
// //         pointType: point.type,
// //       },
// //     })),
// //   };
// // };
// export const createCirclesGeoJSON = (
//   points: IPoi[],
//   defaultRadiusMeters: number = 300
// ): GeoJSON.FeatureCollection => {
//   return {
//     type: "FeatureCollection",
//     features: points.map((point, index) => {
//       const radiusMeters = point.range || defaultRadiusMeters;
//       return {
//         type: "Feature",
//         geometry: {
//           type: "Polygon",
//           coordinates: [
//             _generateCircleCoordinates(
//               point.position.lng,
//               point.position.lat,
//               radiusMeters
//             ),
//           ],
//         },
//         properties: {
//           id: index,
//           pointId: index,
//           radius: radiusMeters,
//         },
//       };
//     }),
//   };
// };
// export const createLineGeoJSON = (
//   coordinates: ICoordinate[]
// ): FeatureCollection<LineString> => {
//   return {
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         geometry: {
//           type: "LineString",
//           coordinates: coordinates.map((c) => [c[0], c[1]]), // [lng, lat]
//         },
//         properties: {},
//       },
//     ],
//   };
// };

// export const _generateCircleCoordinates = (
//   centerLng: number,
//   centerLat: number,
//   radiusMeters: number = 300,
//   points: number = 64
// ): number[][] => {
//   const coordinates: number[][] = [];
//   const radiusKm = radiusMeters / 1000;

//   for (let i = 0; i < points; i++) {
//     const angle = (i / points) * 2 * Math.PI;
//     const dx = (radiusKm * Math.cos(angle)) / 111.32;
//     const dy = (radiusKm * Math.sin(angle)) / 110.54;
//     coordinates.push([centerLng + dx, centerLat + dy]);
//   }

//   coordinates.push(coordinates[0]);
//   return coordinates;
// };

// export const calculateDistance = (
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ): number => {
//   const R = 6371000;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLng / 2) *
//       Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };
// export const getDirectionFromTurf = (
//   userLat: number,
//   userLng: number,
//   pointLat: number,
//   pointLng: number
// ): "LEFT" | "RIGHT" => {
//   const userPoint = turf.point([userLng, userLat]);
//   const targetPoint = turf.point([pointLng, pointLat]);
//   const poiBearing = turf.bearing(userPoint, targetPoint);
//   const normalizedBearing = (poiBearing + 360) % 360;
//   return normalizedBearing <= 180 ? "RIGHT" : "LEFT";
// };
// export const checkPointsInRadius = (
//   userLng: number,
//   userLat: number,
//   points: IPoi[],
//   defaultRadius: number = 300
// ): Set<string> => {
//   console.log("🚀 ~ checkPointsInRadius ~ points:", points)
//   const data: any[] = [];

//   points.forEach((point) => {
//     const distance = turf.distance(
//       turf.point([userLng, userLat]),
//       turf.point([point.position.lng, point.position.lat]),
//       { units: "meters" }
//     );
//     console.log("🚀 ~ checkPointsInRadius ~ distance:", distance)
//     const radiusThreshold = point.range || defaultRadius;
//     if (distance <= radiusThreshold) {
//       data.push({ id: point.id, distance });
//     }
//   });

//   const pointsIndex = data
//     .sort((a, b) => a.distance - b.distance)
//     .map((e) => e.id);
//   console.log("🚀 ~ checkPointsInRadius ~ pointsIndex:", pointsIndex)
//   return new Set(pointsIndex);
// };

// export const getStartPoint = (coordinates: ICoordinate[]) => {
//   if (!coordinates || coordinates.length < 1) return;
//   return coordinates[0];
// };
// export const getFinishPoint = (coordinates: ICoordinate[]) => {
//   if (!coordinates || coordinates.length < 2) return;
//   return coordinates[coordinates.length - 1];
// };
