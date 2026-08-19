import dotenv from 'dotenv';

dotenv.config(); 

import { connectDB } from './config/db';
import app from './expressApp';

const PORT = 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    connectDB(); 
});