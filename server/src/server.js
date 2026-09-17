import { createApp } from './app.js';
import { PORT } from './config.js';

createApp().listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
