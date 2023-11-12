import { Devvit } from '@devvit/public-api';
import { createPostFlairs } from './utils/flairFunctions.js';
import { createRemovalReason } from './utils/rrFunctions.js';
import { addWidgetToSubreddit } from './utils/widgetFunctions.js'
import { detectScamForm } from './forms/detectScamForm.js'
import { redditContracts } from './data/redditContracts.js';
import { notScamText, scamText, notOpenSeaLink } from './data/commentResponses.js';
import { setPostFlair, notAScam, scamRCA, notOpenSeaLinkFlair } from './utils/flairFunctions.js';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
})

const openseaRegex = /opensea\.io/;
const ethAddressRegex = /0x[a-fA-F0-9]{40}/;

Devvit.addTrigger({
  event: 'AppUpgrade',
  async onEvent(event, context) {

    const { reddit } = context;

    // Check if the subreddit property exists in the event object
    if (event.subreddit) {
      
      await createRemovalReason(reddit, event.subreddit.name)
      await createPostFlairs(reddit, event.subreddit.name)
      await addWidgetToSubreddit(reddit, event.subreddit.name)

      const flairs = await reddit.getPostFlairTemplates(event.subreddit.name);

      flairs.forEach(flair => {
        context.kvStore.put(flair.text, flair.id);
      });

    }
  }
});

Devvit.addTrigger({
  event: 'PostSubmit',
  async onEvent(event, context) {
    const { reddit, kvStore } = context;
    

    if (event.post && !event.post.selftext) {
      // Check if the URL contains "opensea.io" and an Ethereum address
      const isOpenseaLink = openseaRegex.test(event.post.url);
      const ethAddressMatches = event.post.url.match(ethAddressRegex);
      const hasEthAddress = ethAddressMatches !== null;

      // Check if the linkFlair text is "Is This a Scam RCA?"
      const hasCorrectFlair = event.post.linkFlair?.text === "Is This a Scam RCA?";

      // If all conditions are met
      if (isOpenseaLink && hasEthAddress && hasCorrectFlair) {
        // Extract the Ethereum address
        const ethAddress = ethAddressMatches[0];

        // Check if the Ethereum address is in the redditContracts list
        const isNotScam = redditContracts.includes(ethAddress);

        if (isNotScam) {
          const comment = await reddit.submitComment({
            id: event.post.id,
            text: notScamText(event.subreddit.name)
          });
          const notAScamFlairId = await kvStore.get(notAScam);
          setPostFlair(reddit, event.subreddit.name, event.post.id, notAScamFlairId)
          comment.distinguish(true);
          comment.isStickied();
        } else {
          const comment = await reddit.submitComment({
            id: event.post.id,
            text: scamText(event.subreddit.name)
          });
          const scamFlairId = await kvStore.get(scamRCA);
          setPostFlair(reddit, event.subreddit.name, event.post.id, scamFlairId)
          comment.distinguish(true);
          comment.isStickied();
          reddit.remove(event.post.id, false)

          // Cannot figure out how to add a removal reason. When I do this is where it will happen.

          // if (event.subreddit && event.subreddit.name) {
          //   let removalReason = await getRemovalReason(reddit, event.subreddit.name)
          //   if (typeof removalReason === 'string') {
          //     let result = await reddit.addRemovalNote({
          //       itemIds: [event.post.id],
          //       reasonId: removalReason,
          //       modNote: 'removed as a test',
          //     });
          //     console.log(result);
          //   }
          // }
        }
      } else {
        // Log messages for each condition that is not met
        if (!isOpenseaLink) {
          const comment = await reddit.submitComment({
            id: event.post.id,
            text: notOpenSeaLink(event.subreddit.name)
          });
          const scamFlairId = await kvStore.get(notOpenSeaLinkFlair);
          setPostFlair(reddit, event.subreddit.name, event.post.id, scamFlairId)
          comment.distinguish(true);
          comment.isStickied();
          reddit.remove(event.post.id, false)
        }
        if (!hasEthAddress) {
        }
        if (!hasCorrectFlair) {
        }
      }
    } else {
      console.log("The post is not a link post.");
    }
  }
});

export default Devvit;
