try {
    console.log('Requiring habitRoutes...');
    require('./routes/habitRoutes');
    console.log('Requiring noteRoutes...');
    require('./routes/noteRoutes');
    console.log('Requiring taskRoutes...');
    require('./routes/taskRoutes');
    console.log('Requiring statsRoutes...');
    require('./routes/statsRoutes');
    console.log('All requires successful');
} catch (e) {
    console.error('Require failed:', e);
}
