chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

async function showErrorNotification() {
  await chrome.notifications.create(
    'errorNotification',
    {
      type: 'basic',
      iconUrl: 'assets/icon-64.png',
      title: 'Opss..',
      message: 'This page cannot use dark theme :('
    }
  );

  setTimeout(async () => {
    await chrome.notifications.clear('errorNotification');
  }, 4000);
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith('http')) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === 'ON') {
      await chrome.scripting.insertCSS({
        files: ['style.css'],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      await chrome.scripting.removeCSS({
        files: ['style.css'],
        target: { tabId: tab.id },
      });
    }
  } else {
    showErrorNotification();
  }
});
