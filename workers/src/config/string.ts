export const String = {
  start:
    "Hey there! My name is KweeksBot. I'm here to help you manage KweeksNews Network sites! Hit /help to find out more about how to use me to my full potential.\n\nAlso please note that I only listen to webmaster's commands.",
  help: {
    self: "Available commands:\n\n/start: Starts me! You've probably already used this.\n/help: Shows this help message.\n/underattack <code>&lt;on|off&gt;</code>: Sets under attack mode.\n/maintenance <code>&lt;on|off&gt;</code>: Sets maintenance mode.",
    none: (args: string) => `No help message affiliated with <code>${args}</code>.`,
    nonPrivate: 'Contact me in PM for help!',
  },
  underattack: {
    self: (status: string) =>
      `Under attack mode is currently <b>${status}</b>.\n\nTo change this setting, try this command again followed by on/off.`,
    alreadySet: (status: string) => `Under attack mode is already <b>${status}</b>.`,
    setFailed: 'Failed to change under attack mode.',
    on: 'Under attack mode is <b>turned on</b>.',
    off: 'Under attack mode is <b>turned off</b>.',
  },
  maintenance: {
    self: (status: string) =>
      `Maintenance mode is currently <b>${status}</b>.\n\nTo change this setting, try this command again followed by on/off.`,
    alreadySet: (status: string) => `Maintenance mode is already <b>${status}</b>.`,
    setFailed: 'Failed to change maintenance mode.',
    on: 'Maintenance mode is <b>turned on</b>.',
    off: 'Maintenance mode is <b>turned off</b>.',
  },
  unknownValue: 'Your input was not recognised as one of: <code>on/off</code>',
};
