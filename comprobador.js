const bcrypt = require('bcrypt');

const password = 'admin123';
const hash = '$2b$10$ZmU44BTJY8Z5cLfJdDjZp.rNG6c28Md2AReT/1VVl/NOfJcX38Y6u';

bcrypt.compare(password, hash).then(result => {
  console.log('¿Contraseña válida?', result);
});
