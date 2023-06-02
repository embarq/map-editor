import * as turf from '@turf/turf'
import * as fs from 'fs/promises'
import path from 'path'

(async () => {
  const fileName = 'hotosm_ukr_railways_lines_simplified.json'
  const filePath = path.resolve(
    new URL(`../public/${fileName}`, import.meta.url).pathname
  )

  try {
    const featureCollectionData = await fs.readFile(filePath, 'utf8')
    const featureCollection = JSON.parse(featureCollectionData)

    // Get the bounding box of the feature collection
    const bbox = turf.bbox(featureCollection)

    const xStep = (bbox[2] - bbox[0]) / 4
    const yStep = (bbox[3] - bbox[1]) / 4
    const quadrants = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        quadrants.push([
          bbox[0] + j * xStep,
          bbox[1] + i * yStep,
          bbox[0] + (j + 1) * xStep,
          bbox[1] + (i + 1) * yStep
        ])
      }
    }

    // Create a new feature collection for each quadrant
    const quadrantFeatureCollections = quadrants.map(quadrant => {
      const quadrantPolygon = turf.polygon([[
        [quadrant[0], quadrant[1]],
        [quadrant[2], quadrant[1]],
        [quadrant[2], quadrant[3]],
        [quadrant[0], quadrant[3]],
        [quadrant[0], quadrant[1]]
      ]])

      const quadrantFeatures = featureCollection.features.filter(feature => {
        const point = turf.pointOnFeature(feature)
        return turf.booleanPointInPolygon(point, quadrantPolygon)
      })

      return turf.featureCollection(quadrantFeatures)
    })

    quadrantFeatureCollections.forEach((quadrantFeatureCollection, index) => {
      const quadrantFileName = `${fileName.replace('.json', '')}-quadrant-${index}.json`
      const quadrantFilePath = path.resolve(
        new URL(`../public/${quadrantFileName}`, import.meta.url).pathname
      )
      fs.writeFile(quadrantFilePath, JSON.stringify(quadrantFeatureCollection))
    })
  } catch (error) {
    console.error(error);
  }
})()