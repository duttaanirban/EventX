export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium'
  }).format(new Date(value));
