// Save this as mongo-init.js in your project root
db = db.getSiblingDB('admin');
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'root',
      db: 'admin',
    },
  ],
});

console.log('Admin user created successfully');