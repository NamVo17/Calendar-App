# LovyTech Server

Server đơn giản sử dụng json-server để chạy database.json

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
npm start
# hoặc
npm run dev
# hoặc
npm run serve
```

Server sẽ chạy tại: http://localhost:3001

## API Endpoints

- **Users**: http://localhost:3001/users
- **Events**: http://localhost:3001/events

## Ví dụ sử dụng

### Lấy tất cả users
```bash
curl http://localhost:3001/users
```

### Lấy user theo ID
```bash
curl http://localhost:3001/users/1
```

### Lấy tất cả events
```bash
curl http://localhost:3001/events
```

### Lấy events theo user_id
```bash
curl http://localhost:3001/events?user_id=1
```

## Cấu hình

- Port: 3001
- Host: 0.0.0.0 (có thể truy cập từ bên ngoài)
- Database file: database.json 