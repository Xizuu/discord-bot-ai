import { Command } from '@sapphire/framework';
import { Replicate, TextGenerationModel } from "@justskydev/replicateai";
import { send } from "@sapphire/plugin-editable-commands";

export class AiCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Ask your question to me!'
		});
	}

	async messageRun(message) {
		const prompt = message.content.split(' ').slice(1).join(' ');
		if (!prompt) {
			return send(message, 'Prompt tidak boleh kosong!');
		}

		send(message, "Pertanyaan di proses, silahkan tunggu...")

		const replicate = new Replicate(TextGenerationModel.Llama3);

		try {
			const result = await replicate.run({ prompt: `system: use Indonesian as default language. ${prompt}` });

			const response = await replicate.getUntilSucceeded(result.generation_id, 100);

			return send(message, response.output.join("") || 'No response generated.');
		} catch (error) {
			console.error('Error generating response:', error);
			return send(message, 'There was an error generating the response.');
		}
	}
}
