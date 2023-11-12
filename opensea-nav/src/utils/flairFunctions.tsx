import { Devvit, RedditAPIClient, FlairTextColor } from '@devvit/public-api';

export const notAScam = 'Not a Scam RCA'
export const scamRCA = '⚠️SCAM DETECTED⚠️'
const isThisAScam = 'Is This a Scam RCA?'
export const notOpenSeaLinkFlair = 'Not an OpenSea Link'
const flairTitlesToCheck = [notAScam, isThisAScam, scamRCA, notOpenSeaLinkFlair];

export async function setPostFlair(reddit: RedditAPIClient, subreddit: string, postId: string, flairTemplateId: string) {
    const SetPostFlairOptions = {
        subredditName: subreddit,
        postId: postId,
        flairTemplateId: flairTemplateId,
    }
    await reddit.setPostFlair(SetPostFlairOptions)
}

// Function to create a post flair template
async function createPostFlair(reddit: RedditAPIClient, subreddit: string, text: string, backgroundColor: string, textColor: FlairTextColor, modOnly: boolean) {
    const flairTemplateOptions = {
        subredditName: subreddit,
        text: text,
        backgroundColor: backgroundColor,
        textColor: textColor,
        modOnly: modOnly,
    };

    await reddit.createPostFlairTemplate(flairTemplateOptions);
}

// Function to create all required post flairs
export async function createPostFlairs(reddit: RedditAPIClient, subreddit: string) {
    const existingFlairs = await reddit.getPostFlairTemplates(subreddit);

    flairTitlesToCheck.forEach(async titleToCheck => {
        // Check if the title does NOT exist in the existingFlairs array
        const titleDoesNotExist = !existingFlairs.some(flair => flair.text === titleToCheck);
      
        if (titleDoesNotExist) {
            switch (titleToCheck) {
                case notAScam:
                    await createPostFlair(reddit, subreddit, notAScam, "#349e48", "light", true);
                    break;
                case isThisAScam:
                    await createPostFlair(reddit, subreddit, isThisAScam, "#cc3600", "light", false);
                    break;
                case scamRCA:
                    await createPostFlair(reddit, subreddit, scamRCA, "#b8001f", "light", true);
                    break;
                case notOpenSeaLinkFlair:
                    await createPostFlair(reddit, subreddit, notOpenSeaLinkFlair, "#0079D3", "light", true);
                    break;
            }
        }
    });
}
