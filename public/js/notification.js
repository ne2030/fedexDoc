'use strict';



// let applicationServerPublicKey = undefined;
//
// let isSubscribed = false;
//
// function initialiseUI() {
//   subscribeUser();
//   // Set the initial subscription value
//   swRegistration.pushManager.getSubscription()
//   .then(function(subscription) {
//     isSubscribed = !(subscription === null);
//
//     updateSubscriptionOnServer(subscription);
//     if (Notification.permission === 'denined') {
//       alert('please check push permission');
//     }
//   });
// }
//
// function subscribeUser() {
//   const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
//   swRegistration.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: applicationServerKey
//   })
//   .then(function(subscription) {
//     console.log('User is subscribed:', subscription);
//
//     updateSubscriptionOnServer(subscription);
//
//     isSubscribed = true;
//   })
//   .catch(function(err) {
//     console.log('Failed to subscribe the user: ', err);
//     alert(err);
//   });
// }
//
// function updateSubscriptionOnServer(subscription) {
//   // TODO: Send subscription to application server
//
//   const subscriptionJson = document.querySelector('.js-subscription-json');
//   const subscriptionDetails =
//     document.querySelector('.js-subscription-details');
//
//   if (subscription) {
//     subscriptionJson.textContent = JSON.stringify(subscription);
//     subscriptionDetails.classList.remove('is-invisible');
//   } else {
//     subscriptionDetails.classList.add('is-invisible');
//   }
// }
//
// function urlB64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding)
//     .replace(/\-/g, '+')
//     .replace(/_/g, '/');
//
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
