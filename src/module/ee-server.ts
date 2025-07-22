import fs from 'fs';
import path from 'path';
import ee from '@google/earthengine';
import { MapId, VisObject } from './global';

/**
 * Function to authenticate EE using service-account.json
 */
export function authenticate(): Promise<void> {
  const keyPath = path.join(process.cwd(), 'service-account.json'); // Adjust path if needed
  const key = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

  return new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      key,
      () => ee.initialize(null, null, () => resolve(), (error: string) => reject(new Error(error))),
      (error: string) => reject(new Error(error))
    );
  });
}

/**
 * Evaluate ee object to plain JS object
 */
export function evaluate(element: ee.ComputedObject): Promise<any> {
  return new Promise((resolve, reject) => {
    element.evaluate((data: any, error: any) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Get Map ID & tile URL from ee object
 */
export function getMapId(
  data: ee.Image | ee.ImageCollection | ee.FeatureCollection | ee.Geometry,
  vis: VisObject | {}
): Promise<MapId> {
  return new Promise((resolve, reject) => {
    data.getMapId(vis, (object: MapId, error: string) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(object);
      }
    });
  });
}
