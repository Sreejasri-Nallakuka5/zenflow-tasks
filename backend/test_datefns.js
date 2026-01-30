try {
    const dateFns = require('date-fns');
    console.log('date-fns loaded:', Object.keys(dateFns).length);
} catch (e) {
    console.error('date-fns failed:', e);
}
