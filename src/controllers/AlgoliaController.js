import { pick, identity } from 'lodash';
import algoliasearch from '../config/algoliasearch';
/**
 * @description Algolia Controller class
 */
export default class AlgoliaController {
  /**
   * @author Olivier
   * @param {Object} obj
   * @param {*} next
   * @returns {Object} Returns record's data
   */
  static async createIndex(obj = { title: '', objectID: '', resource: '', keywords: '', image: '' },) {
    const index = pick(obj, identity);
    if (obj.objectID) {
      algoliasearch.addObjects([index]);
    }
  }

  /**
   * @author Olivier
   * @param {Object} obj
   * @param {*} next
   * @returns {Object} Returns record's data
   */
  static async updateIndex(obj = { title: '', objectID: '', resource: '', keywords: '', image: '' },) {
    const index = pick(obj, identity);
    if (obj.objectID) {
      algoliasearch.partialUpdateObject(index);
    }
  }

  /**
   * @author Olivier
   * @param {String} objectID
   * @param {*} next
   * @returns {Object} Returns record's data
   */
  static async deleteIndex(objectID) {
    if (objectID) {
      algoliasearch.deleteObject(objectID);
    }
  }
}
