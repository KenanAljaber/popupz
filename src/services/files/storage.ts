export default class Storage {
  static get values() {
    return {
      popupImages: {
        id: "popupImages",
        folder: "users/:userId/popups/:popupId/images",
        publicRead: true,
      },
    };
  }
}
