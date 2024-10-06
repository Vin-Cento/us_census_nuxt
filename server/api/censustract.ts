import axios from "axios"

export default defineEventHandler(async (event) => {
  const polygons = readBody(event)
  let res = {
    boundary: {
      type: "FeatureCollection",
      features: []
    }
  }
  let features: any[] = []
  for (const [key, value] of Object.entries(polygons)) {
    let featureTemplate = {
      type: "Feature", properties: {}, geometry: {
        coordinates: [],
        type: "Polygon"
      }
    }
    let coordinates: any = []
    // @ts-ignore
    value._latlngs.forEach((coors: any) => {
      coors.forEach((coor: any) => {
        console.log(coor.lng, coor.lat)
        coordinates.push([coor.lng, coor.lat])
      })
    })
    coordinates.push(coordinates[0])
    // @ts-ignore
    featureTemplate.geometry.coordinates = [coordinates]
    features.push(featureTemplate)
  }
  // @ts-ignore
  res.boundary.features = features
  let data = await axios.post('http://localhost:8080/tracts/within-boundary', res, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return data
})
