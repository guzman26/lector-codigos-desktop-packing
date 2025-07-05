export const classes = {
  widgetCard: 'bg-charcoal-800 border border-charcoal-700 rounded-lg p-6 shadow-md text-white flex flex-col gap-4',
  heading: 'text-2xl font-bold text-white',
  subheading: 'text-xl font-semibold text-gray-200',
  label: 'text-sm uppercase tracking-wider text-gray-400',
  input: 'bg-charcoal-700 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent-600',
  buttonPrimary: 'bg-accent-600 hover:bg-accent-700 text-charcoal-900 font-semibold py-3 px-6 rounded',
  buttonSecondary: 'bg-charcoal-600 hover:bg-charcoal-500 text-white font-medium py-3 px-6 rounded',
  section: 'p-6',
};

type DSKeys = keyof typeof classes;
export type DSClass = typeof classes[DSKeys];

export const cx = (...names: DSKeys[]) => names.map((n) => classes[n]).join(' '); 