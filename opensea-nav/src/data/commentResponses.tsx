// commentResponses.js
export const notScamText = (subreddit: string) => `This OpenSea listing is from the official Reddit smart contract and thus therefore safe to purchase.  
\n\nIf you believe this post was removed in error please [modmail the mod team](https://www.reddit.com/message/compose?to=%2Fr%2F${subreddit}) to have this decision manually reviewed.`;

export const scamText = (subreddit: string) => `#POTENTIAL SCAM WARNING!!  
\n\nThe link you posted is *not* an official Reddit Collectable Avatar and therefore could be considered to be a scam. Please purchase with caution as there are no official traits to mashup with this avatar on Reddit nor will this appear on RCAX or FirstMate for trading.
\n\nIf you believe this post was removed in error please [modmail the mod team](https://www.reddit.com/message/compose?to=%2Fr%2F${subreddit}) to have this decision manually reviewed.`;

export const notOpenSeaLink = (subreddit: string) => `The link you provided is not from OpenSea and therefore cannot be analyzed. Please submit only links from OpenSea to utilize this tool. Thank you! 
\n\nIf you believe this post was removed in error please [modmail the mod team](https://www.reddit.com/message/compose?to=%2Fr%2F${subreddit}) to have this decision manually reviewed.`;
