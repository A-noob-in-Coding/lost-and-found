import API from "./api";
export const notificationService = {

  async sendFoundNotification(senderEmail, receiverEmail, itemTitle) {
    return API.post(`/api/notifications/found-item`, {
      senderEmail,
      receiverEmail,
      itemTitle,
    });
  },

  async sendClaimNotification(senderEmail, receiverEmail, itemTitle) {
    return API.post(`/api/notifications/claim-item`, {
      senderEmail,
      receiverEmail,
      itemTitle,
    });
  },
};
