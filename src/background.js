chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addToTrackList",
      title: "Start Tracking this Item",
      contexts: ["link"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToTrackList") {
      // Logic to add the clicked link to your track list
      const urlToTrack = info.linkUrl;
      // Replace the following line with your actual track list logic
      console.log(`Adding ${urlToTrack} to track list`);
      // Add the URL to your storage and start tracking changes
    }
  });
  