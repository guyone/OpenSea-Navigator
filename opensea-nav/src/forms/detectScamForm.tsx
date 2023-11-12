import { Devvit, FormOnSubmitEvent } from '@devvit/public-api';
import { redditContracts } from '../data/redditContracts.js'

const openseaRegex = /opensea\.io/;
const ethAddressRegex = /0x[a-fA-F0-9]{40}/;

export const detectScamForm = Devvit.createForm(
    {
        fields: [{ name: 'link', label: 'OpenSea link', type: 'string', helpText: 'This is the help text.' }],
        title: 'Submit OpenSea Link',
        acceptLabel: 'Submit Link',
        cancelLabel: 'Cancel',
        description: 'Paste and submit a link to an OpenSea digital collectable to check if it is a scam.'
    },
    detectScamHandler
);

async function detectScamHandler(event: FormOnSubmitEvent, context: Devvit.Context) {
    const scamLink = event.values.link;
    const isOpenseaLink = openseaRegex.test(scamLink);
    const ethAddressMatches = scamLink.match(ethAddressRegex);
    const hasEthAddress = ethAddressMatches !== null;

    if (isOpenseaLink && hasEthAddress) {
        // Extract the Ethereum address
        const ethAddress = ethAddressMatches[0];
        // Check if the Ethereum address is in the redditContracts list
        const isScam = redditContracts.includes(ethAddress);

        if (isScam) {
            console.log("This link is not flagged as a scam.");
        } else {
            console.log(`The link contains a known scam Ethereum address: ${ethAddress}`);
        }
    } else {
        // Log messages for each condition that is not met
        if (!isOpenseaLink) {
            console.log("The submitted link is not an OpenSea link.");
        }
        if (!hasEthAddress) {
            console.log("No Ethereum address found in the link.");
        }
    }
}
