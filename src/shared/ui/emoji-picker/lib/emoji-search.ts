import emojiData from '@/constants/emoji-data.json';
import emojiKeywordsRu from '@/constants/emoji-keywords-ru.json';

export interface EmojiItem {
	no: number;
	code: string;
	emoji: string;
	description: string;
	flagged: boolean;
	keywords: string[];
}

const allEmojis = (Object.values(emojiData) as EmojiItem[][]).flat();
const russianKeywords = emojiKeywordsRu as Record<string, string[]>;

const foldSearch = (value: string) => value.toLowerCase().replaceAll('ё', 'е');

const splitSearchWords = (value: string) =>
	foldSearch(value)
		.split(/[^\p{L}\p{N}]+/u)
		.filter(Boolean);

const searchIndex = allEmojis.map(item => ({
	item,
	text: foldSearch(`${item.description} ${item.keywords.join(' ')}`),
	ruWords: [
		...new Set(
			(russianKeywords[item.emoji] ?? []).flatMap(keyword =>
				splitSearchWords(keyword),
			),
		),
	],
}));

export const searchEmojis = (search: string): EmojiItem[] => {
	const queryWords = splitSearchWords(search);

	if (queryWords.length === 0) {
		return allEmojis;
	}

	return searchIndex
		.filter(entry =>
			queryWords.every(
				word =>
					entry.text.includes(word) ||
					entry.ruWords.some(
						ruWord =>
							ruWord === word || (word.length >= 4 && ruWord.startsWith(word)),
					),
			),
		)
		.map(entry => entry.item);
};
