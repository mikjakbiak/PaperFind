import { Configuration, OpenAIApi } from 'openai'
import { AnswerDto } from 'src/types'
import { formatChatAnswer } from './formatChatAnswer'

const configuration = new Configuration({
  organization: 'org-bkDNUYjT7ZUfK0bHRwnniVCV',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const systemPrompt = `Your job is to extract valuable information from text. The text you will be provided with is a fragment of an academic paper. You need to extract from it the following things:
- type of the academic paper;
- title;
- author or authors;
- abstract;
- year of the publication;
- month of the publication;
- day of the publication;
- who is the publisher;
- where it was published, was it a book, a journal or something else;
- DOI (Digital Object Identifier) of the paper.

You need to format your answer in a json format. Example:
{
	"type": "Journal Article",
	"title": "Some Title",
	"authors": [
		{
			"fName": "John",
			"lName": "Doe"
		},
		{
			"fName": "Jane",
			"lName": "Doe"
		}
	],
	"abstract": "This is an abstract. It is a short summary of the article.",
	"year": "2015",
	"month": "01",
	"day": "undefined",
	"publisher": "Some Publisher",
	"publication": "Name of a Journal",
	"doi": "undefined"
}

If it is a Journal Article, add two more fields: "volume" and "issue".

You cannot add nothing more. You cannot change any information from the given text. You have to write exactly what is in the text. If you cannot find something, put "undefined" instead.
For authors, it needs to be array of objects which keys are fName and lName. For example: if John Doe and Jane Smith are authors, the array should looks like: [
		{
			"fName": "John",
			"lName": "Doe"
		},
		{
			"fName": "Jane",
			"lName": "Smith"
		}
	]
For abstracts, try to find word "ABSTRACT" and use the text starting immediately after the word "ABSTRACT". Do not create your own summary as the abstract. If you cannot find abstract just put "undefined" instead.
For publication, give only the name of the journal or the book.

IT IS VERY IMPORTANT THAT YOU RETURN ONLY INFORMATION THAT CAN BE FOUND IN THE GIVEN TEXT`

const exampleAnswer: AnswerDto = {
  type: 'Journal Article',
  title: 'Some Title',
  authors: [
    {
      fName: 'John',
      lName: 'Doe',
    },
    {
      fName: 'Jane',
      lName: 'Doe',
    },
  ],
  abstract: 'This is an abstract. It is a short summary of the article.',
  year: 2015,
  month: 1,
  day: undefined,
  publisher: 'Some Publisher',
  publication: 'Name of a Journal',
  doi: undefined,
  volume: 3,
  issue: 12,
  pages: { from: 21, to: 37 },
}

export async function getCompletion(prompt: string) {
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
  })

  const answer = res.data.choices[0].message?.content
  if (!answer) return

  const completion = formatChatAnswer(JSON.parse(answer)) as AnswerDto

  return Object.keys(completion)
    .filter((key) => key in exampleAnswer)
    .reduce<AnswerDto>((obj, key) => {
      obj[key as keyof AnswerDto] = completion[key as keyof AnswerDto] as any
      return obj
    }, {})
}
