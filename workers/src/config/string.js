const STRING = {
  start: 'Hey there! My name is KweeksBot. I\'m here to help you manage KweeksNews Network sites! Hit /help to find out more about how to use me to my full potential.\n\nAlso please note that I only listen to webmaster\'s commands.',
  help: 'Available commands:\n\n /start: Starts me! You\'ve probably already used this.\n /help: Shows this help message.\n /underattack <code>&lt;on|off&gt;</code>: Sets under attack mode.\n /maintenance <code>&lt;on|off&gt;</code>: Sets maintenance mode.\n',
  helpNone: `No help message affiliated with <code>${value}</code>.`,
  helpNonPrivate: 'Contact me in PM for help!',
  underattack: (status) => `Under attack mode is currently <b>${status}</b>.\n\n To change this setting, try this command again followed by on/off.`,
  underattackAlreadySet: (status) => `Under attack mode is already <b>${status}</b>.`,
  underattackSetFailed: 'Failed to change under attack mode.',
  underattackOn: 'Under attack mode is <b>turned on</b>.',
  underattackOff: 'Under attack mode is <b>turned off</b>.',
  maintenance: (status) => `Maintenance mode is currently <b>${status}</b>.\n\n To change this setting, try this command again followed by on/off.`,
  maintenanceAlreadySet: (status) => `Maintenance mode is already <b>${status}</b>.`,
  maintenanceSetFailed: 'Failed to change maintenance mode.',
  maintenanceOn: 'Maintenance mode is <b>turned on</b>.',
  maintenanceOff: 'Maintenance mode is <b>turned off</b>.',
  unknownValue: 'Your input was not recognised as one of: <code>on/off</code>',
};

export default STRING;
