// Create a context menu item
chrome.contextMenus.create({
  id: "addToTrackingList",
  title: "Add to Tracking List",
  contexts: ["selection", "link"]
});

// Listen for the context menu item click
chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId === "addToTrackingList") {
    // Get the link URL
    var itemUrl = info.linkUrl || tab.url;

    try {
      // Fetch the webpage content
      const response = await fetch(itemUrl);
      const html = await response.text();

      // Search for the product title element
      const productTitleMatch = /<span[^>]*?id="productTitle"[^>]*?>(.*?)<\/span>/g.exec(html);
      const itemName = productTitleMatch ? productTitleMatch[1].trim() : itemUrl;

      // Store the item details in Chrome storage
      var item = { name: itemName, url: itemUrl };
      var trackingList = await chrome.storage.sync.get("trackingList");
      trackingList.trackingList = trackingList.trackingList || [];
      trackingList.trackingList.push(item);
      await chrome.storage.sync.set({ trackingList: trackingList.trackingList });
    } catch (error) {
      console.error(`Error adding item to tracking list for ${itemUrl}:`, error);
    }
  }
});

// Periodically check for price changes and send email notifications
setInterval(async function() {
  var trackingList = (await chrome.storage.sync.get("trackingList")).trackingList || [];

  // Loop through the tracking list and check for price changes
  for (const item of trackingList) {
    // Fetch the current price of the item
    const currentPrice = await fetchItemPrice(item.url);

    // Check if the price has changed
    if (currentPrice !== item.price) {
      // Send an email notification
      sendEmailNotification(item.name, item.url, item.price, currentPrice);

      // Update the item's price in the tracking list
      item.price = currentPrice;
      await chrome.storage.sync.set({ trackingList: trackingList });
    }
  }
}, 12 * 60 * 60 * 1000); // 12 hours in milliseconds

async function fetchItemPrice(itemUrl) {
  try {
    const response = await fetch(itemUrl);
    const html = await response.text();

    // Search for a price element
    const priceElement = /<span[^>]*?class="price"[^>]*?>([\d,\.]+)<\/span>/g.exec(html);
    if (priceElement) {
      const price = parseFloat(priceElement[1].replace(/,/g, ''));
      return price;
    }

    // Search for a currency symbol and the number next to it
    const currencyRegex = /(\$|€|£)([\d,\.]+)/g;
    const match = currencyRegex.exec(html);
    if (match) {
      const price = parseFloat(match[2].replace(/,/g, ''));
      return price;
    }

    // If no price is found, return null
    return null;
  } catch (error) {
    console.error(`Error fetching item price for ${itemUrl}:`, error);
    return null;
  }
}

// Function to send an email notification (you'll need to implement this)
function sendEmailNotification(itemName, itemUrl, oldPrice, newPrice) {
  // Send an email notification with the item details and price change
}