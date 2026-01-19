// Application constants

export const SHEETS_DB_API_URL = 'https://sheetsapi-g56q77hy2a-uc.a.run.app';

export const SERVICE_ACCOUNT_EMAIL = 'sheets-db@sheets-db-438616.iam.gserviceaccount.com';

export const PROJECTS_SHEET_NAME = 'projects';
export const WIKIS_SHEET_NAME = 'wikis';

export const EXPECTED_PROJECT_COLUMNS = [
  'id',
  'projectName',
  'type',
  'status',
  'folderId',
  'primaryTags',
  'readmeDocId',
  'briefDescription',
  'dateCreated',
  'lastUpdated'
];

export const EXPECTED_WIKI_COLUMNS = [
  'id',
  'topic',
  'folderId',
  'primaryTags',
  'readmeDocId',
  'briefDescription',
  'dateCreated',
  'lastUpdated'
];
