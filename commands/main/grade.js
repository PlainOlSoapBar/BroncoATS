const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grade')
		.setDescription('Grade your resume with an ATS.')
		.addAttachmentOption(option =>
			option.setName('resume')
				.setDescription('Attach the resume you want to grade (.pdf .doc .docx).')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('private')
				.setDescription('Instead of making a thread, the bot will DM you the grade.')),
	async execute(interaction) {
		if (interaction.channel.isThread()) {
			interaction.reply('Can\'t make a thread in a thread!')
				.then(msg => {
					// Deletes message after 5 seconds.
					setTimeout(() => msg.delete(), 5000);
				});
		}
		const attachment = interaction.options.getAttachment('resume');
		// Checks for accepted file format, either .pdf, .doc, or .docx.
		if ((attachment.contentType == 'application/pdf') ||
			(attachment.contentType == 'application/msword') ||
			(attachment.contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
			if (interaction.options.getBoolean('private') ?? true) {
				await interaction.reply(`Received ${attachment.name}, creating thread...`);
			}
		}
		else {
			// Cancels resume grading if file is not in an accepted file format.
			interaction.reply('Invalid file format! (Accepted formats: .pdf .doc .docx)')
				.then(msg => {
					// Deletes message after 5 seconds.
					setTimeout(() => msg.delete(), 5000);
				});
		}
	},
};
