import AlgoliaController from '../../controllers/AlgoliaController';
import algoliasearch from '../../config/algoliasearch';

const indexObject = {
  title: 'title',
  objectID: 'title',
  resource: 'resource',
  keywords: 'kewords',
  image: 'image',
};

describe('AlgoliaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not call `createIndex()` without `objectID`', async () => {
    const createIndex = jest.spyOn(AlgoliaController, 'createIndex');
    const addObjects = jest.spyOn(algoliasearch, 'addObjects');

    AlgoliaController.createIndex({ ...indexObject, objectID: undefined });

    expect(createIndex).toHaveBeenCalledTimes(1);
    expect(addObjects).toHaveBeenCalledTimes(0);
  });

  test('should call `createIndex()`', async () => {
    const createIndex = jest.spyOn(AlgoliaController, 'createIndex');
    const addObjects = jest.spyOn(algoliasearch, 'addObjects');
    AlgoliaController.createIndex(indexObject);

    expect(createIndex).toHaveBeenCalledTimes(1);
    expect(addObjects).toHaveBeenCalledTimes(1);
  });

  test('should not call `updateIndex()` without `objectID`', async () => {
    const updateIndex = jest.spyOn(AlgoliaController, 'updateIndex');
    const partialUpdateObject = jest.spyOn(
      algoliasearch,
      'partialUpdateObject',
    );
    AlgoliaController.updateIndex({ ...indexObject, objectID: undefined });

    expect(updateIndex).toHaveBeenCalledTimes(1);
    expect(partialUpdateObject).toHaveBeenCalledTimes(0);
  });

  test('should call `updateIndex()`', async () => {
    const updateIndex = jest.spyOn(AlgoliaController, 'updateIndex');
    const partialUpdateObject = jest.spyOn(
      algoliasearch,
      'partialUpdateObject',
    );

    AlgoliaController.updateIndex(indexObject);

    expect(updateIndex).toHaveBeenCalledTimes(1);
    expect(partialUpdateObject).toHaveBeenCalledTimes(1);
  });

  test('should not call `deleteIndex()` without `objectID`', async () => {
    const deleteIndex = jest.spyOn(AlgoliaController, 'deleteIndex');
    const deleteObject = jest.spyOn(algoliasearch, 'deleteObject');
    AlgoliaController.deleteIndex();

    expect(deleteIndex).toHaveBeenCalledTimes(1);
    expect(deleteObject).toHaveBeenCalledTimes(0);
  });

  test('should not call `deleteIndex()`', async () => {
    const deleteIndex = jest.spyOn(AlgoliaController, 'deleteIndex');
    const deleteObject = jest.spyOn(algoliasearch, 'deleteObject');

    AlgoliaController.deleteIndex('objectID');

    expect(deleteIndex).toHaveBeenCalledTimes(1);
    expect(deleteObject).toHaveBeenCalledTimes(1);
  });
});
