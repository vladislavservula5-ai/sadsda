require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    ChannelType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Бот запущен как ${client.user.tag}`);
});


// =================== КОМАНДА ДЛЯ ОТПРАВКИ ПАНЕЛИ ===================
client.on('messageCreate', async (message) => {

    if (message.content === '!panel') {

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('📄KROTY TICKET')
            .setDescription(
                `🖐️**Вітаємо у нору!**\n\n` +
                `**Ми — пачка кротів. Нам не потрібні клани чи випадкові гравці. Ми шукаємо сильних, надійних та мотивованих тіммейтів. Якщо ти впевнений у своїх             навичках — будемо раді бачити тебе з нами!**:\n\n` +
                `**Подати тікет нижче**:\n\n` +

                `**📕Будь ласка, не витрачай свій і наш час. Ми не приймаємо в команду, якщо ти:**:\n\n` +

                `    •    🟥 тупиш або неадекватно поводишся;:\n\n` +
                `   •    🟥 граєш у соло та не командний гравець;:\n\n` +
                `   •    🟥 молодший за 14 років;:\n\n` +
                `   •    🟥 маєш менше ніж 3000 ігрових годин;:\n\n` +
                `    •    🟥 не чуєш колів або ігноруєш командну комунікацію.:\n\n` +
                `   •    🟥 довго вливаєшся у колектив*:\n\n` +


                `🔴 **TICKET MAIN**\n` +
                `**Заявка в основную пачку**\n` +
                `**Вимоги: 4000 годин, 16+**\n\n` +


                `**у нашій пачці завжди позитив та добро!**\n`+
                `*Powered by radionov*\n`
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('main')
                .setLabel('Подати заявку (MAIN)')
                .setStyle(ButtonStyle.Danger),
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});


// =================== ОБРАБОТКА КНОПОК ===================
client.on('interactionCreate', async (interaction) => {

    if (interaction.isButton()) {

        const modal = new ModalBuilder()
            .setCustomId(`modal_${interaction.customId}`)
            .setTitle('Заповніть форму');

        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel("Ваше ім'я")
            .setStyle(TextInputStyle.Short);

        const ageInput = new TextInputBuilder()
            .setCustomId('age')
            .setLabel("Ваш вік")
            .setStyle(TextInputStyle.Short);

        const hoursInput = new TextInputBuilder()
            .setCustomId('hours')
            .setLabel("Скільки годин у Rust")
            .setStyle(TextInputStyle.Short);

        const aboutInput = new TextInputBuilder()
            .setCustomId('about')
            .setLabel("Додаткова інформація")
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(ageInput),
            new ActionRowBuilder().addComponents(hoursInput),
            new ActionRowBuilder().addComponents(aboutInput)
        );

        await interaction.showModal(modal);
    }


    // =================== ОБРАБОТКА ФОРМЫ ===================
    if (interaction.isModalSubmit()) {

        const name = interaction.fields.getTextInputValue('name');
        const age = interaction.fields.getTextInputValue('age');
        const hours = interaction.fields.getTextInputValue('hours');
        const about = interaction.fields.getTextInputValue('about');

        const categoryName = interaction.customId.replace('modal_', '');

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                }
            ],
        });

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(`Нова заявка (${categoryName.toUpperCase()})`)
            .addFields(
                { name: "👤 Ім'я", value: name },
                { name: "🎂 Вік", value: age },
                { name: "⏱ Години", value: hours },
                { name: "📝 Додатково", value: about }
            )
            .setFooter({ text: `ID користувача: ${interaction.user.id}` });

        await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed] });

        await interaction.reply({
            content: "✅ Ваш тікет створено!",
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);