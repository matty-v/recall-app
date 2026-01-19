// Data model types for Recall App

export interface Project {
  id: string;
  projectName: string;
  type: string;
  status: string;
  folderId: string;
  primaryTags: string;
  readmeDocId: string;
  briefDescription: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface Wiki {
  id: string;
  topic: string;
  folderId: string;
  primaryTags: string;
  readmeDocId: string;
  briefDescription: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface Settings {
  spreadsheetId: string;
  lastValidated: string;
}

export type ItemType = 'project' | 'wiki';

export interface FilterState {
  search: string;
  tags: string;
  type: ItemType | 'all';
  status: string;
}
