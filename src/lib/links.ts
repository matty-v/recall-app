export function getFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`
}

export function getDocUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}`
}
