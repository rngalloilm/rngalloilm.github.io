import {instance} from './apiClient';

// Get all the material types from the database
export async function getMaterials() {
  const materials = await instance.get("materials");
  return materials;
}

// Post a new database type to the database given a name and the shorthand abbreviation
export async function addMaterial(materialName, materialShorthand) {
  instance.post("materials", {
    material: materialName,
    shorthand: materialShorthand
  });
}