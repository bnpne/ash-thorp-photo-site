export const deskStructure = S =>
  S.list()
    .title('Ash Thorp Photo Website')
    .items([
      S.listItem()
        .title('Main')
        .child(
          S.document().title('Main').schemaType('main').documentId('main'),
        ),
      ...S.documentTypeListItems().filter(
        listItem => !['main', 'photoBase'].includes(listItem.getId()),
      ),
    ])
