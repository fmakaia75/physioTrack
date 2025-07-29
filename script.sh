cat > start-mongodb-no-auth.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting MongoDB with replica set (no authentication)..."

# Nettoyer
docker-compose down -v 2>/dev/null || true

# Démarrer MongoDB
docker-compose up -d

# Attendre
echo "⏳ Waiting for MongoDB..."
sleep 15

# Initialiser le replica set
echo "🔧 Initializing replica set..."
docker exec mongodb mongosh --eval "
try {
  rs.status();
  print('✅ Replica set already initialized');
} catch (err) {
  print('🔄 Initializing replica set...');
  rs.initiate({
    _id: 'rs0',
    members: [{ _id: 0, host: 'localhost:27017' }]
  });
  print('✅ Replica set initialized');
}
"

# Attendre PRIMARY
echo "⏳ Waiting for PRIMARY state..."
sleep 10

# Tester les transactions
echo "🧪 Testing transactions..."
docker exec mongodb mongosh --eval "
try {
  var session = db.getMongo().startSession();
  session.startTransaction();
  db.test.insertOne({test: 'transaction', timestamp: new Date()});
  session.commitTransaction();
  session.endSession();
  print('✅ Transactions working!');
} catch (err) {
  print('❌ Transaction error: ' + err);
}
"

echo "🎉 MongoDB ready!"
echo "📊 Connection: mongodb://localhost:27017/mydatabase?replicaSet=rs0"
EOF

chmod +x start-mongodb-no-auth.sh
./start-mongodb-no-auth.sh