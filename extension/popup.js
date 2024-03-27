// Load the tracking list from Chrome storage
chrome.storage.sync.get("trackingList", function(data) {
  var trackingList = data.trackingList || [];

  // Display the tracking list in the popup
  var listElement = document.getElementById("trackingList");
  trackingList.forEach(function(item) {
    var itemElement = document.createElement("li");
    itemElement.textContent = `${item.name} - ${item.price ? `$${item.price.toFixed(2)}` : 'Price not found'}`;

    // Add a click event listener to remove the item from the tracking list
    itemElement.addEventListener("click", function() {
      var index = trackingList.indexOf(item);
      if (index !== -1) {
        trackingList.splice(index, 1);
        chrome.storage.sync.set({ trackingList: trackingList });
        itemElement.remove();
      }
    });

    listElement.appendChild(itemElement);
  });
});