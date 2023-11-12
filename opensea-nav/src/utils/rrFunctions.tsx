import { RedditAPIClient } from '@devvit/public-api';

const thisIsAScam = 'Scam RCA';

export async function createRemovalReason(reddit: RedditAPIClient, subreddit: string) {
  const existingReasons = await reddit.getSubredditRemovalReasons(subreddit);
  
  // Check if the specific reason already exists
  const existingReason = existingReasons.find(reason => reason.title === thisIsAScam);

  if (existingReason) {
      return
  } else {
      // Create a new removal reason if it does not exist
      const newReason = await reddit.addSubredditRemovalReason(
          subreddit,
          {
              title: thisIsAScam,
              message: `#POTIENTAL SCAM WARNING!!  \n\nThe link you posted is *not* an official Reddit Collectable Avatar and therefore could be considered to be a scam. Please purchase with caution as there are no official traits to mashup with this avatar on Reddit nor will this appear on RCAX or FirstMate for trading.\n\nIf you believe this post was removed in error please [modmail the mod team](https://www.reddit.com/message/compose?to=%2Fr%2F${subreddit}) to have this decision manually reviewed.`
          }
      );
  }
}

export async function getRemovalReason(reddit: RedditAPIClient, subreddit: string) {
  const existingReasons = await reddit.getSubredditRemovalReasons(subreddit);
  
  // Check if the specific reason already exists
  const existingReason = existingReasons.find(reason => reason.title === thisIsAScam);
  if (existingReason) {
    let removalReason = existingReason.id;
    return removalReason
  }

}