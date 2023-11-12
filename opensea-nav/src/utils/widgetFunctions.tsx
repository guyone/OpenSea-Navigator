import { RedditAPIClient, Widget } from '@devvit/public-api';
import { AddTextAreaWidgetRequest } from '@devvit/protos';

const widgetText = 'To utilize the bot create a post and use the post flair "Is This a Scam RCA?". The post will be analyzed and determined if the digital collectable is a scam or an official Reddit Collectable Avatar.'

export async function addWidgetToSubreddit(reddit: RedditAPIClient, subreddit: string) {

    const results = await reddit.getWidgets(subreddit)
    // Check if any widget has the same text
    const widgetExists = results.some(widget => widget.text === widgetText);

    if (!widgetExists) {
        const widgetData: AddTextAreaWidgetRequest & { type: "textarea" } = {
            type: "textarea",
            subreddit: subreddit,
            shortName: 'RCA Scam Navigator',
            styles: { backgroundColor: '', headerColor: '' },
            text: widgetText
        };

        try {
            const widget: Widget = await reddit.addWidget(widgetData);
            console.log("Widget added successfully");
        } catch (error) {
            console.error("Error adding widget:", error);
        }
    } else {
        console.log("A widget with the same text already exists, not creating a new one.");
    }
}