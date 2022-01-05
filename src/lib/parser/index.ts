import { BOFMainParser } from './BOFMain';

const parser = [
    BOFMainParser
];

export function parse() {
    const url = new URL(window.location.href);
    const eventId = url.searchParams.get('event');

    if(!eventId) throw new Error('Event ID not found!');

    for(let item of parser) {
        if(item.adaptTo.includes(eventId)) {
            return item.parse();
        }
    }

    throw new Error('cannot parse this event!');
}